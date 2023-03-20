const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); //mongoose
//const date=require(__dirname +'/date.js');


const app = express();

// const items = ["Buy food", "Cook food", "Eat food"];
// const workItems = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); 

//mongoose start

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB")

const itemsSchema = new mongoose.Schema({
    name:String
});

const Item = mongoose.model("Item", itemsSchema);

const Item1 = new Item({
    name:"Welcome to your todolist!"
})
const Item2 = new Item({
    name:"Hit the + button to add a new item"
})
const Item3 = new Item({
    name:"<-- Hit this to delete an item"
})

const defaultItems = [Item1, Item2, Item3];

Item.insertMany(defaultItems)
.then(() => {
    console.log("Successfully inserted");
})
.catch((err) => {
    console.log("Error inserting");
});

app.get('/', (req, res) => {
    //let day = date.getDay();
    res.render("list", {listTitle: "Today", newListItems: items});
});

app.post('/', (req, res) => {
    let item = req.body.newItem;
    if(req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work");
    }else{
        items.push(item);
        res.redirect("/");
    }
});

app.get('/work', (req, res) => {
    res.render("list",{listTitle:"Work List", newListItems: workItems});
});

app.post('/work', (req, res) => { 
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});