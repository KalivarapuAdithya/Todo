const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require('connect-flash');
const session = require('cookie-session');

require('dotenv').config();

const app = express();
app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

const Todo = require('./models/todo');
const mongourl = process.env.MONGO_URL;

mongoose.connect( mongourl ,{ useNewUrlParser:true ,useUnifiedTopology:true });

let db = mongoose.connection;

db.once('open' , ()=>{
    console.log("database connected");
});

db.on('err' , (err)=>{
    console.log(err);
});



app.get('/' , (req , res)=>{
    let message = "";
    Todo.find({} , (err , todos)=>{
        if(err)
        console.log(err);
        else{
            res.render('./index' , {todo:todos , success : req.flash('success') , error : req.flash('error')});
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
                req.flash('success' , `${task} is added`);
                res.redirect('/');
            }
        });
    
    
});


app.get('/edit/:id' , (req , res)=>{
    Todo.findOne({_id:req.params.id} , (err , todos)=>{
        if(err)
        console.log(err);
        else{
            
            res.render('./edit' , {todo:todos });
        }
        
    });
});

app.post('/edit/:id' , (req , res)=>{
    let task = String(req.body.task).trim() ;

    Todo.findOne({_id:req.params.id} , (err , todo)=>{
        if(err)
        console.log(err);
        else{
            todo.task = task;
            todo.save( (err)=>{
                if(err)
                console.log(err);
                else{
                    req.flash('success' , `A task has been modified to ${task}` );
                    res.redirect('/');
                }
            });
        }
    })
        
    
})



app.get('/delete/:id' , (req,res)=>{
    Todo.findOne({_id:req.params.id} , (err , todo)=>{
        if(err)
        console.log(err);
        else{
            let task = todo.task;
            Todo.deleteOne({_id:req.params.id} , (err)=>{
                if(err)
                console.log(err);
                else{
                    req.flash('error' , `${task} Deleted `);
                    res.redirect('/');
                }
            });
        }
    })
    
});


app.listen(process.env.PORT || 3000 , (err)=>{
    if(err)
    console.log(err);
    else
    console.log("3000 running");
});


