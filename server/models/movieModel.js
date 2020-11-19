const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const movieSchema = new Schema(
    {
        title: { type: String, required: true, unique: false, trim: true, minlength: 4 },
        likes: { type: Array},
        views: { type: Array},
        comments: { type: Array},
        complete: {type: Boolean},
        movie: {type: Object},
        dest:{type: String},
        date: { type: Date, required: true }
    }
);

const Movies = mongoose.model('Movies', movieSchema);

module.exports = Movies;

