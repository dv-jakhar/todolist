//jshint esversion:6
//currently My app is not capable of adding a new item except
//default items, so I am gonna make it capable
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://dvjakhar:helloworld@cluster0-vztbb.mongodb.net/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});
const itemsSchema = {
  name: String
};

let Item = mongoose.model("Item", itemsSchema);

const Eat = new Item({ name: "Eat"});
const Sleep = new Item({ name: "Sleep"});
const Code = new Item({ name: "Code"});
const Repeat = new Item({ name: "Repeat"});

const defaultItems = [Eat, Sleep, Code, Repeat];


app.get("/", function(req, res) {

const day = date.getDate();

Item.find({}, function(err, items){
  if(items.length===0)
    {
      Item.insertMany(defaultItems, function(err){
        if(err)
          console.log(err);
        else
          console.log("you are amazing");
      });
      res.redirect("/");
    }
  else
  {
    res.render("list", {listTitle: day, newListItems: items});
  }
  
});
  

});

app.post("/", function(req, res){

  const getItem = req.body.newItem;


  const item = new Item({ name: getItem});

  // Item.findOne({}, function(err, items){
  //   Item.create(item, function(err){
  //     if(err)
  //       console.log(err);
  //     else
  //       console.log("added");
  //   });

  // });

  //another way of doing this

  item.save();

  res.redirect("/");
  
});

app.post("/del", function(req, res){
  let itemToDeleteId = req.body.delItem;

  Item.findByIdAndRemove(itemToDeleteId, function(err){

    if(err)
      console.log(err);
    else
    {
      console.log("you are amazing");
      res.redirect("/");
    }
      
  });

});

app.get("/buymeacofee", function(req, res){
  res.render("buymeacofee", {});
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000 || process.env.PORT, function() {
  console.log("Server started on port 3000");
});
