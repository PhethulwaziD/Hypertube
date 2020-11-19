const util = require('./util').utilities;

module.exports.request = {
    handshakeData : torrent => {
        const buff = Buffer.alloc(68);
    
        buff.writeUInt8(19, 0);
        buff.write('BitTorrent protocol', 1);
        buff.writeUInt32BE(0, 20);
        buff.writeUInt32BE(0, 24);
        util.hashInfo(torrent).copy(buff, 28);
        util.generateId().copy(buff, 48);
        return (buff);
    },

    alive : () => Buffer.alloc(4),

    choke : () => {
        const buff = Buffer.alloc(5);

        buff.writeUInt32BE(1, 0);
        buff.writeUInt8(0, 4);
        return (buff);
    },

    unChoke : () => {
        const buff = Buffer.alloc(5);

        buff.writeUInt32BE(1, 0);
        buff.writeUInt8(1, 4);
        return (buff);
    },

    interest : () => {
        const buff = Buffer.alloc(5);

        buff.writeUInt32BE(1, 0);
        buff.writeUInt8(2, 4);
        return (buff);
    },

    unInterest : () => {
        const buff = Buffer.alloc(5);

        buff.writeUInt32BE(1, 0);
        buff.writeUInt8(3, 4);
        return (buff);
    },

    have : (payload) => {
        const buff = Buffer.alloc(9);

        buff.writeUInt32BE(5, 0);
        buff.writeUInt8(4, 4);
        buff.writeUInt32BE(payload, 5);
        return (buff);
    },


    bitifield : (field, payload) => {
        const buff = Buffer.alloc(14);

        buff.writeUInt32BE(payload.length + 1, 0);
        buff.writeUInt8(5, 4);
        field.copy(buff, 5);
        return (buff);
    },

    piece : payload => {
        const buff = Buffer.alloc(payload.block.length + 13);

        buff.writeUInt32BE(payload.block.length + 9, 0);
        buff.writeUInt8(7, 4);
        buff.writeUInt32BE(payload.index, 5);
        buff.writeUInt32BE(payload.begin, 9);
        payload.block.copy(buff, 13)
        return (buff);
    },

    requestData : payload => {
        const buff = Buffer.alloc(17);

        buff.writeUInt32BE(13, 0);
        buff.writeUInt8(6, 4);
        buff.writeUInt32BE(payload.index, 5);
        buff.writeUInt32BE(payload.begin, 9);
        buff.writeUInt32BE(payload.length, 13);
        return (buff);
    },
    requestPiece : (socket, requested, queue) => {
        if (this.requested[queue[0]]) {
            queue.shift();
        } else {
            socket.write(requestData(index))
        }
    },

    cancel : payload => {
        const buff = Buffer.alloc(17);

        buff.writeUInt32BE(13, 0);
        buff.writeUInt8(8, 4);
        buff.writeUInt32BE(payload.index, 5);
        buff.writeUInt32BE(payload.begin, 9);
        buff.writeUInt32BE(payload.length, 13);
        return (buff);
    },

    dataPort : payload => {
        const buff = Buffer.alloc(7);
        buff.writeUInt32BE(3, 0);
        buff.writeInt8(9, 4);
        buff.writeUInt16BE(payload, 5);
        return (buff);
    }
}
