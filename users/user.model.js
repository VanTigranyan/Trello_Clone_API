const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    boards: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'Board'
        }
     ]
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);