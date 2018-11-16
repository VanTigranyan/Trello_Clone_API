const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    boardName : {type: String, required: true},
    createdDate: { type: Date, default: Date.now },
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    lists: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'List'
        }
     ]
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Board', schema);