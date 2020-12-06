const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const Todo = require('F:/crud_mongo/models/todo');
const e = require("express");

mongoose.connect('mongodb://localhost/todo' ,{ useNewUrlParser:true ,useUnifiedTopology:true });

let db = mongoose.connection;

db.once('open' , ()=>{
    console.log("database connected");
});

// Todo.insertMany([{task : 'hi'} , {task : 'math'}]);



db.on('err' , (err)=>{
    console.log(err);
});



app.get('/' , (req , res)=>{
    let message = "";
    Todo.find({} , (err , todos)=>{
        if(err)
        console.log(err);
        else{
            res.render('F:/crud_mongo/views/index' , {todo:todos , message:message});
        }
    });

});

app.post('/' , (req , res) => {
    let task = String(req.body.task).trim() ;

    let todo = new Todo();
        todo.task = String(req.body.task);
    
        todo.save((err)=>{
            if(err)
            console.log(err);
            else{
                res.redirect('/');
            }
        });
    
    
});


app.get('/edit/:id' , (req , res)=>{
    Todo.findOne({_id:req.params.id} , (err , todos)=>{
        if(err)
        console.log(err);
        else{
            let message = ""
            res.render('F:/crud_mongo/views/edit' , {todo:todos , message:message});
        }
        
    });
});

app.post('/edit/:id' , (req , res)=>{
    let task = String(req.body.task).trim() ;

    if(task.length > 0)
    {
        let todo = new Todo();
        todo = {task : task};

        Todo.updateOne({_id:req.params.id} , todo , (err)=>{
            if(err)
            console.log(err);
            else{
                res.redirect('/');
            }
        });
    }
    else{
        let message = "task should not be empty";
        let id = req.params.id;
        Todo.findOne({_id:id} , (err , todos)=>{
            if(err)
            console.log(err);
            else{
                res.render('edit' , {todo:todos , message:message});
            }
        });
    }
    
})



app.get('/delete/:id' , (req,res)=>{
    Todo.deleteOne({_id:req.params.id} , (err)=>{
        if(err)
        console.log(err);
        else{
            res.redirect('/');
        }
    });
});


app.listen(3000 , (err)=>{
    if(err)
    console.log(err);
    else
    console.log("3000 running");
});


