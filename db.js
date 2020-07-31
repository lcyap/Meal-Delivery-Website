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
//data manager








let User;
module.exports.initialize = function(){
    return new Promise((resolve, reject)=>{
    let db = mongoose.createConnection("mongodb+srv://dbUser:Spaceplasma1@senecaweb.p6usa.mongodb.net/Noodelivery?retryWrites=true&w=majority", {useNewUrlParser:true, useUnifiedTopology:true });  
    db.on('error', (err)=>{
        console.log("db error!");
      });
      
      db.once('open', ()=>{
          //create a collection called "newusers"'
        User = db.model("newusers", userSchema);
        //console.log("db success!");
        resolve();
      });
    })
}

module.exports.registerUser = function(data){
    return new Promise((resolve, reject)=>{
        //check UNIQUE email! ?????????

        var newUser = new User(data);
        //hash pword
        bcrypt.genSalt(10)  // Generate a "salt" using 10 rounds
        .then(salt=>bcrypt.hash(newUser.password,salt)) // use the generated "salt" to encrypt the password: "myPassword123"
        .then(hash=>{ //returns encrypted password
            // TODO: Store the resulting "hash" value in the DB
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
                //console.log("Saved user: " + data.firstname);
            }
        });
    })
    .catch(err=>{
        console.log(err); // Show any errors that occurred during the process
        reject("Hashing Error");
    });

    
    });
}
//MAYBE DELETE THIS
module.exports.LoginUser = function(){
    return new Promise((resolve,reject)=>{
        User.find() //gets all and returns an array. Even if 1 or less entries
        .exec() //tells mongoose that we should run this find as a promise.
        .then((returnedUser)=>{
            //resolve(filteredMongoose(returnedStudents));
            resolve(returnedUser.map(item=>item.toObject()));
        }).catch((err)=>{
                console.log("Error Retriving User:"+err);
                reject(err);
        });
    });
}
module.exports.LoginUserEmail = function(inEmail){
    return new Promise((resolve,reject)=>{
        //email has to be spelled the same as in the data base
        User.find({email: inEmail}) //gets all and returns an array. Even if 1 or less entries
        .exec() //tells mongoose that we should run this find as a promise.
        .then((returnedUser)=>{
            if(returnedUser.length !=0 )
            //resolve(filteredMongoose(returnedStudents));
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
            //get the data and check if passwords match hash
                // first is non-hashed pw, vs 2nd which is a hashed pw
                bcrypt.compare(data.password, retUser[0].password).then((result) => {
                    if (result){
                        //for added security is return a student object w/o password
                        resolve(retUser);
                        //resolve and pass the user back
                    }
                    else{
                        reject("mali password");
                        return;
                        //reject pass error
                    }
                    // result === true
                });
        }).catch((err)=>{
            reject(err);
            return;
        });
    }
    });
}
