var express = require("express");
var app = express();
var port = process.env.PORT||3000;
var todos = [{
       id: 101,
       description: "First Task",
       completed: false
},
{
       id: 2,
       description: "Second Task",
       completed: false
}];
app.get("/",function(req,res){
       res.send("TODO API ROOT");
       //res.end("ended");
});
app.get("/todos",function(req,res){
       res.json(todos);
       //res.end("ended");
});
app.get("/todos/:id",function(req,res){
       //res.send(todos[req.params.id-1]);
       var found_id = false;
       for(var i=0;i<todos.length;i++){
              console.log(i);
              if(todos[i].id==req.params.id){
                     console.log("inside");
                     found_id=true;
                     res.json(todos[i]);
                     //res.end();
              }
       }
       if(found_id==false){
              res.status(404).send("Not found");
             
       }
       //res.end("ended");
});

app.listen(port);
