const fs = require("fs");

const bencode = require('bencode');

const tracker = require('./tracker');

const download = require('./download')

const parseTorrent = require('parse-torrent');

var torrent = fs.readFileSync('Dragon Ball Super Broly.torrent');

torrent = parseTorrent(torrent);

const file = fs.openSync(torrent.name, 'w');

//console.log(torrent);

tracker.udpTracker(torrent, peers => {
    download.downloadTorrent(peers, torrent, file);
});
