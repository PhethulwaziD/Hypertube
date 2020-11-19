const router = require('express').Router();
let Movie = require('../models/movieModel');

router.post('/about', async (req, res) => {
    try { 
       const title = req.body.title;
       const movieData = await Movie.findOne({title: title});
       if (movieData) {
            res.json(movieData);
       }
    } catch (error) {
        res.json({err: error.message})
        console.log(error.message); 
    }
});


router.post('/likes', async (req, res) => {
    try {
        const {title, email} = req.body
        console.log("Request to like: "+ title);
        await Movie.findOne({title: title}, (err, movie) => {
            if (err) throw err;
            let likes = movie.likes;
            if (likes.includes(email)) {
                likes.splice(email);
            } else {
                likes.push(email);
            }
            Movie.updateOne({title: title}, {likes: likes} ,(err, movie) => {
                if (err) throw err;
                console.log(likes)
                if (movie)
                    res.json({likes: likes});    
            })
        });
    } catch (error) {
        res.json({err: error.message})
        console.log(error.message);
    }
});

router.post('/comments', async (req, res) => {
    try {
        const {title, name, comment} = req.body
        const err = validateComment(comment)
        if (err)
            return res.json({error: err}); 
        Movie.findOne({title: title}, (err, movie) => {
            if (err) throw err;
            let comments = movie.comments;
            var date = new Date()
            date = date.toDateString()
            comments.push({name: name, comment: comment, date: date});
            Movie.updateOne({title: title}, {comments: comments},  (err, movie) => {
                if (err) throw err;

                if (movie)
                    res.json({comments: comments});    
            })
        }); 
    } catch (error) {
        res.json({err: error.message})
        console.log(error.message);
    }
 
});

router.post('/views', async (req, res) => {
    try {
        const {title, email} = req.body
        await Movie.findOne({title: title}, (err, movie) => {
            if (err) throw err;
            let views = movie.views;
            views.push(email);
            Movie.updateOne({title: title}, {views: views} ,(err, movie) => {
                if (err) throw err;
                if (movie)
                    res.json({views: views});    
            })
        });
    } catch (error) {
        res.json({err: error.message})
        console.log(error.message);
    }
});

router.get('/update', async (req, res) => {
    try {
        Movie.find((err, data) => {
            if (err) throw err;
            const date = new Date()
            if (data.length > 0) {
                data.forEach( movie => {
                    let diff = Math.floor((date - movie.date)/(60*60*1000))
                    if (diff > 8) {
                        Movie.findOneAndDelete({title: movie.title}, (err, res) => {
                            if (err) throw err
                            console.log("Database Updated")
                        })
                    }
                })
            }
            return res.send(true);
        })
    } catch (error) {
        res.json({err: error.message})
    }
}) 
const  validateComment = (comment) => {
    if (!comment || comment.trim().length === 0)
        return ("Please entet your comment");
    return (null);
}
module.exports = router;