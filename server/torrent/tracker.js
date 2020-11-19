const dgram = require('dgram');
const Buffer = require('buffer').Buffer;
const urlParser = require('url').parse;
const crypto = require('crypto');
const bencode = require('bencode');
const bignum = require('bignum')

module.exports.udpTracker = async(torrent, url, cb) => {
    url = urlParser(url)
    const socket = dgram.createSocket('udp4');
    var reqMessage = trackerRequest();

            socket.send(reqMessage, 0, reqMessage.length, url.port, url.hostname, (err) => {
                if (err) console.log(err);
            });
            socket.on('message', res => {
                const action = res.readUInt32BE(0);
        
                if (action === 0){
                    console.log("connection request succesful");
                    //parse respon
                    const connRes = parseResp(res);
                    //Announce request 
                    const reqMessage = announceReq(connRes.connId, torrent);
                    //send announce request
                    socket.send(reqMessage, 0, reqMessage.length, url.port, url.hostname, (err) => {
                        if (err)
                            throw err;
                    });
                } else if (action === 1) {
                    console.log("announce request succesful");
                    const announceRes = parseAnnounceRes(res);
                    cb(announceRes, socket);
                }
            });
}   

//Request handling Functions
//Create a connection request
function trackerRequest() {
    const buff = Buffer.alloc(16);
    buff.writeUInt32BE(0x417, 0);
    buff.writeUInt32BE(0x27101980, 4);
    buff.writeUInt32BE(0, 8);
    crypto.randomBytes(4).copy(buff, 12);
    return (buff);
}

//Parse connection response Function
function parseResp(res) {
    const parsedResp = {
        action: res.readUInt32BE(0),
        transactionId: res.readUInt32BE(4),
        connId: res.slice(8)
    };
    return (parsedResp);
}

//Announce request
announceReq = (connId, torrent, port=6881) => {
    const buff = Buffer.allocUnsafe(98);

    connId.copy(buff, 0);
    buff.writeInt32BE(1, 8);
    crypto.randomBytes(4).copy(buff, 12);
    hashInfo(torrent).copy(buff, 16);
    generateId().copy(buff, 36);
    Buffer.alloc(8).copy(buff, 56);
    torrentSize(torrent).copy(buff, 64);
    Buffer.alloc(8).copy(buff, 72);
    buff.writeInt32BE(0, 80);
    buff.writeInt32BE(0, 80);
    crypto.randomBytes(4).copy(buff, 88);
    buff.writeInt32BE(-1, 92);
    buff.writeInt16BE(port, 96);
    return (buff);
}

//parse announce respnce
parseAnnounceRes = (res) => {
    const parsedResp =  {
        action: res.readUInt32BE(0),
        transactionId: res.readUInt32BE(4),
        leechers: res.readUInt32BE(8),
        seeders: res.readUInt32BE(12),
        peers: peerGroups(res.slice(20), 6).map(address => {
            return {
                ip: address.slice(0, 4).join('.'),
                port: address.readUInt16BE(4)
            }
        })
    }
    return (parsedResp);
}

peerGroups = (iterable, groupSize) => {
    var groups = [];
    for (let i = 0; i < iterable.length; i += groupSize) {
        groups.push(iterable.slice(i, i + groupSize));
    }
    return (groups);
}

/////////////////////////////////////////////////////
generateId = () => {
    var id = null;
    if (!id) {
        id = crypto.randomBytes(20);
        Buffer.from("-PT0001-").copy(id, 0);
    }
    return (id);
}

hashInfo = (torrent) => {
    const info = bencode.encode(torrent.info);
    return (crypto.createHash('sha1').update(info).digest());
}

torrentSize = (torrent) => {
    if (typeof(torrent.info) !== 'undefined'){
        if (typeof(torrent.info.files) !== 'undefined')
            var size = torrent.info.files.map(file => file.length).reduce((a, b) => a + b);
        else 
            var size = torrent.info.length;
        return (bignum.toBuffer(size, {size: 8}));
    }
    
}