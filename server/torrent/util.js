const bencode = require('bencode');

const crypto = require('crypto');

module.exports.utilities = {

    generateId : () => {
        var id = null;
        if (!id) {
            id = crypto.randomBytes(20);
            Buffer.from("-PT0001-").copy(id, 0);
        }
        return (id);
    },

    hashInfo : (torrent) => {
        const info = bencode.encode(torrent.info);
        return (crypto.createHash('sha1').update(info).digest());
    }
}
