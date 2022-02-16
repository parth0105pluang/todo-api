var express = require("express");
var _= require("underscore"); 
var app = express();
var port = process.env.PORT||3000;
class todoMaker{
       constructor(body) {
         this.id = body.id;
         this.description = body.description;
         this.completed = body.description;
       }
     }
var todos=[]; 
var todoNextId = 0;
var bodyParser = require("body-parser");
app.use(bodyParser.json());
/*var todos = [{
       id: 101,
       description: "First Task",
       completed: false
},
{
       id: 2,
       description: "Second Task",
       completed: false
}];*/
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
       
});
app.post("/todos",function(req,res){
       var todoNext = new todoMaker(req.body);
       todos[todoNextId]= todoNext;
       console.log(req.body);
       todoNextId++;
       res.send(req.body);
});
app.delete("/todos/:id",function(req,res){
       var found_id = false;
       console.log(req.params.id);
       var req_id = req.params.id;
       for(var i=0;i<todos.length;i++){
              if(todos[i].id==req_id){
                     todos.splice(i,1); 
                     found_id = true;    
              }
       }
       if(found_id==false){
              res.status(404).send("Not exists");
       }
       res.send(todos);
});

app.listen(port);
