const { udpTracker } = require("./tracker");
const urlParser = require('url').parse;


const getPeers = async (torrent, cb) => {
    try { 
        let peers = [];
        let count = 0;
        torrent.announce.forEach(tracker => {
            const url = urlParser(tracker);
            if (url.protocol === 'udp:') {
                udpTracker( torrent ,url, (peerlist, socket) => {
                    if (peerlist.peers) peerlist.peers.map( peer => {
                        peers.push(peer);
                    });
                    setTimeout(() => {
                        count++;
                        if (peers.length > 30 && count === 1)
                            cb(peers);
                    }, 6000)
                                        
                })
                cb(peers);
            }
        }); 
        cb(peers)
    } catch (error) {
        console.log("error: "+ error)
    }
}

module.exports  = getPeers;