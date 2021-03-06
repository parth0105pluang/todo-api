var express = require("express");
var _= require("underscore"); 
var app = express();
var port = process.env.PORT||3000;
var db = require("./db.js");
var middleware = require("./middleware")(db);
var bcrypt = require("bcrypt");
class todoMaker{
       constructor(body) {
         this.id = body.id;
         this.description = body.description;
         this.completed = body.completed;
       }
     }
var todos=[]; 
var todoNextId = 0;
var bodyParser = require("body-parser");
const { type } = require("express/lib/response");
const { token } = require("./db.js");
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
app.get("/todos",middleware.requireAuthentication,function(req,res){
       /*querParams = req.query;
       var filteredTodos=[];
       //console.log(querParams);
       if(querParams.completed){
              console.log('inside')
              for(var i=0;i<todos.length;i++){
                     console.log(todos[i].completed);
                      if(todos[i].completed == true){
                            console.log("true instance found");
                            filteredTodos.push(todos[i]);
                      }
              }
              res.json(filteredTodos);
       }
       
       else
       res.json(todos);
       //res.end("ended");*/
       var query = req.query;
       var where = {
              userId: req.user.get("id")
       };
       if(query.hasOwnProperty("completed") && query.completed=="true" ){
              where.completed = true;
       } else if(query.hasOwnProperty("completed")&& query.completed=="false"){
              where.completed = fasle;
       }
       if(query.hasOwnProperty("q")&&query.q.length>0){
                 where.description = {
                      $like: '%' + query.q + '%'
                 };
       }
       db.todo.findAll({where:where}).then(function(todos){
              res.json(todos);
       },function(e){
               res.status(500).send();
       })
});
app.get("/todos/:id",middleware.requireAuthentication,function(req,res){
       /*
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
       */
        var todoId = parseInt(req.params.id,10);
        db.todo.findOne({
               where:{
                    id:todoId,
                    userId: req.user.get("id")  
               }
        }).then(function(todo){
          if(!!todo){
                res.json(todo.toJSON()); 
          }else{
                 res.status(404).send();
          }
        },function(e){
                 res.status(500).send();
        });
});
app.post("/todos",middleware.requireAuthentication,function(req,res){
       /*var todoNext = new todoMaker(req.body);
       todos[todoNextId]= todoNext;
       console.log(req.body);
       todoNextId++;
       res.send(req.body);*/
       var body = _.pick(req.body,"description","completed");
       db.todo.create(body).then(function(todo){
             //res.json(todo.toJSON());
             console.log(req.user);
             req.user.addTodo(todo).then(function(){
                 return todo.reload();
             }).then(function(){
              res.json(todo.toJSON());
             });
       },function(e){
               res.status(400).json(e);
       });
});
app.delete("/todos/:id",middleware.requireAuthentication,function(req,res){
       var todoId = parseInt(req.params.id,10);
       db.todo.destroy({
              where:{
                     id: todoId,
                     userId: req.user.get("id")
              }
       }).then(function(rowsDeleted){

              if(rowsDeleted==0){
                     res.status(404).json({
                           error:"No todo"
                     });
              }
              else{
                     res.status(204).send();
              }
       },function(){
            res.status(500).send();
       });
       /*var found_id = false;
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
       res.send(todos);*/

});
app.put("/todos/:id",middleware.requireAuthentication,function(req,res){
       var todoId = parseInt(req.params.id,10);
       var body = _.pick(req.body,"description","completed");
       var attributes = {};
       if (body.hasOwnProperty("completed")){
              attributes.completed = body.completed;
       }
       if(body.hasOwnProperty("description")){
              attributes.description = body.description;
       }
       db.todo.findOne({
              where:{
                   id:todoId,
                   userId: req.user.get("id")
              }
       }).then(function(todo){
              if(todo){
                  return todo.update(attributes);  
              }
              else{
                  res.status(404).send();   
              }
       },function(){
             res.status(500).send(); 
       }).then(function(todo){
             res.json(todo.toJSON());
       },function(e){
              res.status(400).json(e);
       });
      /* var found_id = false;
       console.log(req.params.id);
       var req_id = req.params.id;
       for(var i=0;i<todos.length;i++){
              if(todos[i].id==req_id){
                     found_id = true;    
                     if(req.body.description){
                            todos[i].description = req.body.description;
                     }
                     if(req.body.completed){
                            todos[i].completed = req.body.completed;
                     }
                     
              }
       }
       if(found_id==false){
              res.status(404).send("Not exists");
       }
       res.send(todos);*/
});
app.post("/users",function(req,res){
       var body = _.pick(req.body,"email","password");
       db.user.create(body).then(function(user){
             res.json(user.toPublicJSON());
       },function(e){
               res.status(400).json(e);
       });
});
app.post("/users/login",function(req,res){
       var body = _.pick(req.body,'email','password');
       var userInstance;
       db.user.authenticate(body).then(function(user){
              //console.log(user.generateToken("authentication"))
              var token = user.generateToken("authentication");
              userInstance = user;
              return db.token.create({
                    token:token

              });
              /*if(token){
                     res.header("Auth",user.generateToken("authentication")).json(user.toPublicJSON());

              }else{
                     res.status(401).send();
              }*/
              
       }).then(function(tokenInstance){
              res.header("Auth",tokenInstance.get('token')).json(userInstance.toPublicJSON());
              //res.header("Auth",user.generateToken("authentication")).json(user.toPublicJSON());
       }).catch(function(){
           res.status(401).send();
       });
       //res.json(body);
});
app.delete("/users/login",middleware.requireAuthentication,function(req,res){
     req.token.destroy().then(function(){
            res.status(200).send();
     }).catch(function(){
            res.status(500).send();
     });
});










db.sequelize.sync({force:true}).then(function(){
       app.listen(port);
})

