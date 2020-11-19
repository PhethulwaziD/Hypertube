const router = require('express').Router();
const User = require('../models/userModel');
const fs = require('fs');
const getPeers = require('../torrent/getPeers');
const {downloadTorrent} = require('../torrent/download')
const parseTorrent = require('parse-torrent');
let Movie = require('../models/movieModel');

router.get('/stream', async (req, res) => {
    try {
        const movieData = await Movie.findOne({title: req.query.movie})
        if (movieData.complete) {
            console.log("Now Streaming "+movieData.title)
            if (!fs.existsSync(movieData.dest)) {
                res.json({file: false})
                res.end
            }
            streamMovie(req, res, movieData.dest);
        } else {
            res.send(false);
        }
    } catch (error) {
        res.json({err: error.message})
        console.log(error.message);
    }
});

const streamMovie = (req, res, dest) => {
    const stat = fs.statSync(dest);
    const fileSize = stat.size;
    console.log(fileSize);
    const range = req.headers.range;
    console.log("range"+range)
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize-1;
        const chunksize = (end-start) + 1;
        const file = fs.createReadStream(dest, {start, end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(dest).pipe(res);
    }
}
module.exports = router;