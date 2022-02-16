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
})
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
sequelize.sync({
         force: true
}).then(function(){console.log("every thing is synced");
Todo.create({
    description:"Take trash out"
}).then(function(todo){
       return Todo.create({
             description: "clean office"
       });
}).then(function(){
    return Todo.findById(1)
}).then(function(todo){
       if(todo){
           console.log(todo.toJSON());
       }else{
           console.log("no todo found");
       }
})
.catch(function(e){
        console.log(e);
});
})