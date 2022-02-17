var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";
var sequelize;
if(env === 'production' ){

    sequelize = new Sequelize(process.env.DATABASE_URL,{
          "dialect": "postgres"

    });
    const sequelize = new Sequelize({
        database: process.env.POSTGRES_DB,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
         },
    });
}else{
     sequelize = new Sequelize(undefined,undefined,undefined,{
        "dialect": "sqlite",
        "storage":__dirname+"/data/dev-todo-api.sqlite"
    });
}
var db ={};
db.todo = sequelize.import(__dirname+"/models/todo.js");
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
/*var sequelize = new Sequelize(undefined,undefined,undefined,{
    "dialect": "sqlite",
    "storage":__dirname+"/data/dev-todo-api.sqlite"
});*/
