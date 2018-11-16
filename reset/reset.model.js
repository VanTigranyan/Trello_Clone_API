const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    email: {type: 'string', required: true, unique: true},
    confirmtoken: {type: 'string', required: true, unique: true}
})

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model( 'Reset' , schema );