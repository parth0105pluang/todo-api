module.exports = function(db){
 return{
      requireAuthentication: function(req,res,next){
           var token = req.get("Auth");
           console.log(token);
           db.user.findByToken(token).then(function(user){
                  console.log("got inside");
                  req.user = user;
                  next();
           },function(){
                 console.log("sent 401 from here");
                 res.status(401).send();
           });
      } 
 };
};