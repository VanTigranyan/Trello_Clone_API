const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    cardName: { type: String, required: true },
    description: { type: String, required: false},
    participants: [ { type: String, required: false } ],
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    board: { type: Schema.Types.ObjectId, ref: 'Board' },
    list: {type: Schema.Types.ObjectId, ref: 'List'}
})

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model( 'Card' , schema);