const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    listName : {type: String, required: true},
    createdDate: { type: Date, default: Date.now },
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    board: {type: Schema.Types.ObjectId, ref: 'Board'},
    cards: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'Card'
        }
     ]
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('List', schema);