var Sequelize = require("sequelize");
var sequelize = new Sequelize(undefined,undefined,undefined,{
    "dialect": "sqlite",
    "storage":__dirname+"/basic-sqlite-database.sqlite"
});
var Todo = sequelize.define("todo",{
    description: {
            type: Sequelize.STRING,
            allowNull:false,
            validate:{
                len: [1,250]
            }
    },
    completed:{
            type: Sequelize.BOOLEAN,
            allowNull:false,
            defaultValue: false
    }
});
/*
sequelize.sync().then(()=>{
     console.log("everything is synced");
     Todo.create({
         description:"Walk the dog",
         completed: false
     }).then(function(todo){
           console.log("Finished");
           console.log(todo);
     });
});
*/
var User = sequelize.define("user",{
    email: Sequelize.STRING
});
Todo.belongsTo(User);
User.hasMany(Todo);
sequelize.sync({
         //force: true
}).then(function(){console.log("every thing is synced");

   User.findById(1).then(function(user){
       console.log(user);
        user.getTodos({
            where: {
                completed : true
            }
        }).then(function(todos){
            todos.forEach(function(todo){
            console.log(todo.toJson());
            });
        });
   });
   //console.log(User.findById(1));
   
    User.create({
        email: "sample-man@gmail.com"
    }).then(function(){
        return Todo.create({
        description: "clean home"
        });
    }).then(function(todo){
        User.findById(1).then(function(user){
              user.addTodo(todo);
        });
    })
});
