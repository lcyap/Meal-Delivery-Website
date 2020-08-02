const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
let Schema = mongoose.Schema;

//A4
let mealSchema = new Schema({
    mealname: String,
    mealprice: String,
    mealdescription: String,
    mealcategory: String,
    mealnumber: String,
    topmeal : Boolean,
    img: String
});


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
let Meal;
module.exports.initialize = function(){
    return new Promise((resolve, reject)=>{
    let db = mongoose.createConnection("mongodb+srv://dbUser:Spaceplasma1@senecaweb.p6usa.mongodb.net/Noodelivery?retryWrites=true&w=majority", {useNewUrlParser:true, useUnifiedTopology:true });  
    db.on('error', (err)=>{
        console.log("db error!");
      });
      
      db.once('open', ()=>{
        User = db.model("newusers", userSchema);    
        Meal = db.model("newmeal", mealSchema);//A4
        
        resolve();
      });
    })
}

//A4 create mealpacks save()
module.exports.createMeal = function(data){
    return new Promise((resolve, reject)=>{
        var newMeal = new Meal(data); 
        newMeal.save((err)=>{
            if(err){
                
                reject("error creating meal" + err)
                
            }
            else{
                console.log("Successfully created new meal: " + newMeal.mealname)
                resolve();
               
            };
    })
    
})};

//A4 display meal packs find()
module.exports.displayMeals = function(){
    return new Promise((resolve,reject)=>{
        Meal.find() 
        .exec()
        .then((returnedMeal)=>{
            resolve(returnedMeal.map(item=>item.toObject()));
        }).catch((err)=>{
                console.log("Error getting Meals:"+err);
                reject(err);
        });
    });
}
module.exports.getMealbyName = function(inmealname){
    return new Promise((resolve,reject)=>{
        Meal.find({mealname: inmealname}) 
        .exec() 
        .then((returnedMeal)=>{
            if(returnedMeal.length !=0 )
                resolve(returnedMeal.map(item=>item.toObject()));
            else
                reject("No Meal found");
        }).catch((err)=>{
                console.log("Error Retriving Meal:"+err);
                reject(err);
        });
    });
}



module.exports.registerUser = function(data){
    return new Promise((resolve, reject)=>{
        var newUser = new User(data);
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
module.exports.editMeal = (editMeal)=>{
    return new Promise((resolve, reject)=>{
        Meal.updateOne(
            {mealname : editMeal.mealname}, 
            {$set: {  
                mealname: editMeal.mealname,
                mealprice: editMeal.mealprice,
                mealdescription: editMeal.mealdescription,
                mealcategory: editMeal.mealcategory,
                mealnumber: editMeal.mealnumber,
                topmeal : editMeal.topmeal,
                
            }})
            .exec() 
            .then(()=>{
                console.log(`Meal ${editMeal.mealname} has been updated`);
                resolve();
            }).catch((err)=>{
                reject(err);
            });
        
    });
}