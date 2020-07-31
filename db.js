const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
let Schema = mongoose.Schema;
let userSchema = new Schema({
    firstname: String,
    lastname: String,
    email: {
        type: String,
        unique:true
    },
    password: String
});



let User;
module.exports.initialize = function(){
    return new Promise((resolve, reject)=>{
    let db = mongoose.createConnection("mongodb+srv://dbUser:Spaceplasma1@senecaweb.p6usa.mongodb.net/Noodelivery?retryWrites=true&w=majority", {useNewUrlParser:true, useUnifiedTopology:true });  
    db.on('error', (err)=>{
        console.log("db error!");
      });
      
      db.once('open', ()=>{
        User = db.model("newusers", userSchema);
        resolve();
      });
    })
}

module.exports.registerUser = function(data){
    return new Promise((resolve, reject)=>{
        var newUser = new User(data);
        //hash pword
        bcrypt.genSalt(10)  
        .then(salt=>bcrypt.hash(newUser.password,salt)) 
        .then(hash=>{ 
            newUser.password=hash;
        newUser.save((err)=>{
            if(err){
                if(err.code == 11000){
                    reject("Email address already in use");
                }
                reject("There was an error creating your profile.")
                
            }
            else{
                resolve();
               
            }
        });
    })
    .catch(err=>{
        console.log(err); 
        reject("Hashing Error");
    });

    
    });
}
//MAYBE DELETE THIS
module.exports.LoginUser = function(){
    return new Promise((resolve,reject)=>{
        User.find() 
        .exec() 
        .then((returnedUser)=>{
            resolve(returnedUser.map(item=>item.toObject()));
        }).catch((err)=>{
                console.log("Error Retriving User:"+err);
                reject(err);
        });
    });
}
module.exports.LoginUserEmail = function(inEmail){
    return new Promise((resolve,reject)=>{
        
        User.find({email: inEmail}) 
        .exec()
        .then((returnedUser)=>{
            if(returnedUser.length !=0 )
                resolve(returnedUser.map(item=>item.toObject()));
            else
                reject("User does not exist");
        }).catch((err)=>{
                console.log("Error getting user:"+err);
                reject(err);
        });
    });
}
module.exports.validateUser = (data)=>{
    return new Promise((resolve,reject)=>{
    if (data){
        this.LoginUserEmail(data.email).then((retUser)=>{
                bcrypt.compare(data.password, retUser[0].password).then((result) => {
                    if (result){
                      resolve(retUser);
                    }
                    else{
                        reject("Wrong password");
                        return;
                        
                    }
                   
                });
        }).catch((err)=>{
            reject(err);
            return;
        });
    }
    });
}
