const router = require('express').Router();
const fs = require('fs');
const getPeers = require('../torrent/getPeers');
const {downloadTorrent} = require('../torrent/download')
const parseTorrent = require('parse-torrent');
let Movie = require('../models/movieModel');
let peers = [];
let downloadCount = 0
router.get('/', async (req, res) => {
    try {
        const name = req.query.movie; 
        const movieData = await Movie.findOne({title: name})
        if (movieData.complete) {
           return res.json({status: 'done'});
        } else if (!movieData.complete) {
            let movie = './torrent/torrents/' + name + '.torrent';
            var torrent = fs.readFileSync(movie);
            torrent = parseTorrent(torrent);
            const dest = './torrent/movies/' + torrent.name;
            console.log("Downloading "+name);
            const path = fs.openSync(dest, 'w');
            console.log("Getting Peers For: "+ name);
            if (peers.length == 0) getPeers(torrent, async(peerlist) => {;  
                peers = peerlist;
                if (peers.length > 0) {
                    //communicate with peers and start downloading the torrent
                    console.log("Downloading starting For: "+ name);
                    downloadCount++;
                    console.log(downloadCount);
                    downloadTorrent(peers, name, path, () => {
                        Movie.findOneAndUpdate({title: name}, {dest: dest}, (err, movie) => {
                            res.json({status: 'done'});   
                        }) 
                    }) 
                }
            })
        }
    
    } catch (error) {
        res.json({err: error.message})
        console.log(error.message);
    }
});

module.exports = router;