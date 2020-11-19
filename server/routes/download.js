const router = require('express').Router();
let Movie = require('../models/movieModel');
const fs = require('fs');
const download = require('download');
let dest = "./torrent/torrents/";

router.get('/', (req, res) => {
    res.send("Request to watch a movie");
});

router.post('/', async (req, res) => {
    try {
        const title = req.body.title
        console.log("Requested to watch: "+ title)
        //find If exists in Database
        dest = dest+title+'.torrent';
        
        const url = req.body.torrents[0].url;
        const file = await download(url);
        fs.writeFileSync(dest, file)
       
        Movie.findOne({title : title}, (err, movie) => {
            if (err) throw err;
            if (!movie) {
                const newMovie = new Movie({title: title,
                                            likes: [], 
                                            views: [], 
                                            comments: [], 
                                            complete: false,
                                            movie: req.body, 
                                            dest: '', 
                                            date: Date()});
                newMovie.save((err, movie) => {
                    if (err) throw err;
                    return res.json(true);
                })
            } else {
                return res.json(true);
            }
        })
    } catch (error) {
        return res.json({err: error.message})
        console.log(error.message);
    }
});

module.exports = router;