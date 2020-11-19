const net = require('net');
const fs = require('fs');
const Buffer = require('buffer').Buffer;
const response = require('./response').response;
const request = require('./request').request;
const Queue = require('./Queue');
const Pieces = require('./Pieces');
const util = require('./util').utilities
const parseTorrent = require('parse-torrent');
let count = 0;

module.exports.downloadTorrent = (peers, name ,file, cb) => {
    let torrent = './torrent/torrents/' + name + '.torrent';
    torrent = fs.readFileSync(torrent);
    torrent = parseTorrent(torrent);
    const pieces = new Pieces(torrent);
    let connections = 100;
    if (peers.length < 100)
        connections = peers.length
    for (let i = 0; i < connections; i++ ) {
        const socket = new net.Socket();
        socket.on('error', err => {
            if (err.syscall === "connect")
                console.log("Failed "+ err.syscall+ " request to: " + err.address);
            else if (err.syscall === "read")
                console.log(err);
            else
                console.log(err);
        });

        socket.connect(peers[i].port, peers[i].ip, () => {
            console.log("connection request sent to: " + peers[i].ip);
  
            socket.write(handshakeData(torrent), (err) => {
              console.log("Handshake sent");
              if (err)
                    console.log(err);
            });
        });
        const queue = new Queue(torrent);
        completeMessage(socket, data => {
            //console.log(data);
            resHandler(data, socket, pieces, queue, file, torrent, cb);

        });

        socket.on('close', () => {
            console.log('Connection closed');
        });
    };
}

completeMessage = (socket, cb) => {
    let savedBuff = Buffer.alloc(0);
    let handshake = true;

    socket.on('data', recievedBuff => {

        const mesLen = () => handshake ? savedBuff.readUInt8(0) + 49 : savedBuff.readInt32BE(0) + 4;
        savedBuff = Buffer.concat([savedBuff, recievedBuff]);
        while (savedBuff.length >= 4 && savedBuff.length >= mesLen()) {
            cb(savedBuff.slice(0, mesLen()));
            savedBuff = savedBuff.slice(mesLen());
            handshake = false;
        }
    })
}

/////////////////////////////////////////////////////////////////
resHandler = (res, socket, pieces, queue, file, torrent, cb) => {
    if (isHandshake(res)) {
        console.log("handshake established");
        socket.write(request.interest());
    } else {
        const  parsedRes = resParser(res);
        if (parsedRes.id === 0) 
            handleChoke(socket);
        if (parsedRes.id === 1) 
            handleUnChoke(socket, pieces, queue);
        if (parsedRes.id === 4) 
            handleHave (socket, pieces, queue, parsedRes.payload);
        if (parsedRes.id === 5) 
            handleBitfield(socket, pieces, queue, parsedRes.payload);
        if (parsedRes.id === 7) 
            handlePiece(socket, pieces, queue, parsedRes.payload, torrent,file, cb); 
    }
}

isHandshake = res => {
    return (res.length === res.readUInt8(0) + 49 &&
        res.toString('utf8', 1, 20) === 'BitTorrent protocol');
}

resParser = res => {
    const id = res.length > 4 ? res.readUInt8(4) : null;
    let payload = res.length > 5 ? res.slice(5) : null;
    
    if (id === 6 || id === 7 || id === 8) {
        const rest = payload.slice(8);
        payload = {
            index: payload.readInt32BE(0),
            begin: payload.readInt32BE(4)
        };
        payload[id === 7 ? 'block' : 'length'] = rest;
    }
    return ({
        size:res.readInt32BE(0),
        id : id,
        payload : payload
    });
}

handleChoke = (socket) => {
    socket.end();
}

handleUnChoke = (socket, pieces, queue) => {
    queue.choked = false;
    requestPiece(socket, pieces, queue);
}

handleHave = (socket, pieces, queue, payload) => {
    const index  = payload.readUInt32BE(0);
    const empty = queue.length === 0;
    queue.addQueue(index);
    if (empty) {
        requestPiece(socket, pieces, queue);
    }
}

handleBitfield = (socket, pieces, queue, payload) => {
    const empty = queue.length === 0;
    payload.forEach((byte, i) => {
        for (let j = 0; j < 8; j++) {
            if (byte % 2)
                queue.addQueue(i * 8 + 7 - j);
            byte = Math.floor(byte / 2);
        }
    });
    if (empty)
        requestPiece(socket, pieces, queue);
}

handlePiece = (socket, pieces, queue, pieceRes, torrent, file, cb) => {
    io.on("connection", sock => {
        sock.emit("loading", {percent: pieces.howFar(), block: pieceRes.index+'/'+queue._queue.length});
    });
    pieces.addPiece(pieceRes);
    console.log("Downloading Block: " +pieceRes.index+'/'+queue._queue.length);   
    const offset = pieceRes.index * torrent.pieceLength + pieceRes.begin;
    fs.write(file, pieceRes.block, 0, pieceRes.block.length, offset, (err) => {
        if (err)
            console.log(err);
    })
    if (pieces.complete()){
        socket.end();
        console.log("Download Complete");
        try {
            fs.closeSync(file);
        } catch (err) {
            console.log(err);
        }
        cb();
    } else {
        requestPiece(socket, pieces, queue)
    }   
}

requestPiece = (socket, pieces, queue) => {
    if (queue.choked) {
        return (null);
    }
    while (queue.len()) {
        const block = queue.deQue();
        if (pieces.wanted(block)) {
            socket.write(requestData(block));
            pieces.addReq(block);
            break ;
        }
    }
}

//////////////////////////////////////////////////////
requestData = payload => {
    const buff = Buffer.alloc(17);

    buff.writeUInt32BE(13, 0);
    buff.writeUInt8(6, 4);
    buff.writeUInt32BE(payload.index, 5);
    buff.writeUInt32BE(payload.begin, 9);
    buff.writeUInt32BE(payload.length, 13);
    return (buff);
}

handshakeData = torrent => {
    const buff = Buffer.alloc(68);

    buff.writeUInt8(19, 0);
    buff.write('BitTorrent protocol', 1);
    buff.writeUInt32BE(0, 20);
    buff.writeUInt32BE(0, 24);
    util.hashInfo(torrent).copy(buff, 28);
    util.generateId().copy(buff, 48);
    return (buff);
}

cancel = payload => {
    const buff = Buffer.alloc(17);

    buff.writeUInt32BE(13, 0);
    buff.writeUInt8(8, 4);
    buff.writeUInt32BE(payload.index, 5);
    buff.writeUInt32BE(payload.begin, 9);
    buff.writeUInt32BE(payload.length, 13);
    return (buff);
}

dataPort = payload => {
    const buff = Buffer.alloc(7);
    buff.writeUInt32BE(3, 0);
    buff.writeInt8(9, 4);
    buff.writeUInt16BE(payload, 5);
    return (buff);
}

