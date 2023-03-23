const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); //mongoose
const _ =require("lodash"); //Lodash

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); 





//mongoose start
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB") //mongoose.connect("mongodb+srv://admin-manula:test123@cluster0.xvpso1b.mongodb.net/todolistDB")

//defines a schema for mongoose called itemsSchema
const itemsSchema = new mongoose.Schema({
    name:String
});

//creates a Mongoose model called "Item" using the previously defined "itemsSchema"
const Item = mongoose.model("Item", itemsSchema);

//creating new instance of the Mongoose model "Item" and assigns it to a variable called "Item1, Item2, Item3"
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



//defines a schema for mongoose called listSchema
const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

//creates a Mongoose model called "List" using the previously defined "listSchema"
const List = mongoose.model("List", listSchema);



app.get('/', (req, res) => {
    Item.find()
      .then((results) => {
        if(results.length===0){
          Item.insertMany(defaultItems)
            .then(() => {
              console.log("Successfully inserted");
            })
            .catch((err) => {
              console.log("Error inserting");
            });
          res.redirect("/");
        } else {
          res.render("list", {listTitle: "Today", newListItems: results});
        } 
      })
      .catch((err) => {
        console.log(err);
      });
  });
  

app.post('/', (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    
//creating new instance of the Mongoose model "Item" and assigns it to a constant called "Item"
    const item = new Item({
        name:itemName
    });

    if (listName==="Today"){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name:listName})
        .then((lists) => {
            lists.items.push(item);
            lists.save();
            res.redirect("/"+ listName);
        })
        .catch((err) => {
            console.error(err);
        });
    }

    // item.save();
    // res.redirect("/");
    // if(req.body.list === "Work"){
    //     workItems.push(item);
    //     res.redirect("/work");
    // }else{
    //     // items.push(item);
    //     res.redirect("/");
    // }
});

app.post('/delete', function(req, res){
    const checkedItemId = req.body.checkBox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemId)
    .then((removedItem) => {
        if (!removedItem) {
        console.log("No item was removed.");
        } else {
        console.log(`Removed item: ${removedItem}`);
        }
    })
    .catch((error) => {
        console.error(`Error removing item: ${error}`);
    });
    res.redirect("/");
    }else{
        List.findOneAndUpdate({ name: listName },{ $pull: { items: { _id: checkedItemId } } },{ new: true, useFindAndModify: false })
            .then(foundList => {
                console.log(foundList);
            })
            .catch(err => {
              console.log(err);
            });
            res.redirect("/"+ listName);
        
    }

    

});

// app.get('/work', (req, res) => {
//     res.render("list",{listTitle:"Work List", newListItems: workItems});
// });

app.get('/:customListName', (req, res) => {
    const customListName = _.capitalize(req.params.customListName); //Use lodash to use first letter to capital

    List.findOne({ name: customListName })
        .then((lists) => {
            //console.log(lists);
            if(!lists){
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            }else{
                res.render("list",{listTitle: lists.name, newListItems: lists.items});
            }
        })
        .catch((err) => {
            console.error(err);
        });
    
    
});

// app.post('/work', (req, res) => { 
//     let item = req.body.newItem;
//     workItems.push(item);
//     res.redirect("/work");
// });

app.listen(3000, function () {
    console.log("Server started on port 3000");
});