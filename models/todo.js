const mongoose = require('mongoose');

let todoSchema = mongoose.Schema({
    task:{
        type : String,
        required : true
    }
});

let Todo = module.exports = mongoose.model('todo' , todoSchema);