const express = require("express");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash')

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static("public"));
app.use(flash());

app.use(session({
  secret: 'feh3dlhs9lkd0ks7dlsh2jlsdosi8',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

mongoose.connect("mongodb+srv://dvjakhar:helloworld@cluster0-vztbb.mongodb.net/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});
const itemsSchema = {
  name: String
};

const day = date.getDate();
let Item = mongoose.model("Item", itemsSchema);

require('./config/passport')(passport);
require('./routes/auth')(app, passport, Item, day);

const Eat = new Item({ name: "Eat"});
const Sleep = new Item({ name: "Sleep"});
const Code = new Item({ name: "Code"});
const Repeat = new Item({ name: "Repeat"});

const defaultItems = [Eat, Sleep, Code, Repeat];


app.get("/todo", function(req, res) {
  if(!req.isAuthenticated()){
    res.redirect('/')
  }

Item.find({}, function(err, items){

  if(items.length===0)
    {
      Item.insertMany(defaultItems, function(err){
        if(err)
          console.log(err);
        else
          console.log("you are amazing");
      });
      res.redirect("/todo");
    }
  else
  {
    res.render("list", {listTitle: day, newListItems: items});
  }
  
});
  

});

app.post("/todo", function(req, res){

  const getItem = req.body.newItem;


  const item = new Item({ name: getItem});

  item.save();

  res.redirect("/todo");
  
});

app.post("/del", function(req, res){
  let itemToDeleteId = req.body.delItem;

  Item.findByIdAndRemove(itemToDeleteId, function(err){

    if(err)
      console.log(err);
    else
    {
      console.log("you are amazing");
      res.redirect("/todo");
    }
      
  });

});


app.get('/', function(req, res){
  res.render('home');
})

let port = process.env.PORT;
if(port == "" || port==null)
{
  port=7700;
}

app.get('/pagenotfound', function(req, res){
  res.render('pagenotfound')
})

app.get('*', function(req, res){
  res.redirect('/pagenotfound')
})

app.listen(port, function() {
  console.log("Server started on port "+ port);
});
