var cryptojs = require("crypto-js");

module.exports = function(db){
 return{
      requireAuthentication: function(req,res,next){
           var token = req.get("Auth") || '';
           db.token.findOne({
                where:{
                     tokenHash: cryptojs.MD5(token).toString()
                }
           }).then(function(tokenInstance){
                    if(!tokenInstance){
                         throw new Error();
                    }
                    req.token = tokenInstance;
                    return db.user.findByToken(token);

           }).then(function(user){
                req.user = user;
                next();
           }).catch(function(){
                res.status(401).send();
           });
           /*console.log(token);
           db.user.findByToken(token).then(function(user){
                  console.log("got inside");
                  req.user = user;
                  next();
           },function(){
                 console.log("sent 401 from here");
                 res.status(401).send();
           });*/
      } 
 };
};