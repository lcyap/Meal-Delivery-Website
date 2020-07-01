var meal = [{
  title : "Crab Yakisoba",
  price: "6.99",
  image: "crab1.jpg"
  
},
{
  title: "Grilled Pork",
  price: "7.99",
  image: "pork1.jpg"
},
{
  title: "Spicy Beef",
  price: "7.99",
  image: "spicypork.jpg"
},
{
  title: "Vegetarian",
  price: "5.99",
  image: "vegetarian.jpg"
}];

var mealpackage = [{
 
  title : "Seafood Package",
  image: "seaf.jpg",
  price: "24.99",
  category: "Vegetarian",
  amount: "3",
  synopsis: "Meals designed for pescatarians with the same amount of protein as the rest of our package",
  toppackage: true
},
{
  title : "Meat Lovers",
  image: "meat.jpg",
  price: "29.99",
  category: "Meat",
  amount: "3",
  synopsis: "Our signature Grilled Pork and Spicy Beef Noodles packs a punch",
  toppackage: true
},
{
  title : "Katsudon Package",
  image: "katsu.jpg",
  price: "29.99",
  category: "Meat",
  amount: "3",
  synopsis: "Our special Chicken & Pork Tonkatsu Ramen is the star of this package",
  toppackage: true
},
{
  title : "Vegetarian Package",
  image: "veg.jpg",
  price: "24.99",
  category: "Vegetarian",
  amount: "3",
  synopsis: "Low-calorie and nutritious. Our Vegetarian noodles are flavourful too",
  toppackage: true
}];
module.exports.getData = function(){ 
  return meal;
};
module.exports.getData1 = function(){ 
  return mealpackage;
};

module.exports.login = (body)=>{
  return new Promise((resolve, reject)=>{
    if(body.email == "" ){
        console.log("error: enter an email");
        reject("no email");
        return;
    }
    else if(body.password == ""){
      console.log("error: enter a password");
      reject("no password");
      return;
    }
    else{
        resolve();
        return;
      }
      
  });
  
};


module.exports.registerpword = (body)=>{ 
  var regexpword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  return new Promise((resolve, reject)=>{   
    if(body.password == ""){
        //console.log("error: enter an email");   
        reject("Field required");       
        return;
    }
    else if(body.email == ""){
      reject("Field required");
      return;
    }
    else if(body.firstname == ""){
      reject("Field required");
      return;
    }
    else if(body.lastname == ""){
      reject("Field required");
      return;
    }
    else if(body.password.length <6 || body.password.length >12){
        reject("Password must be 6-12 characters in length");
        return;
    }
    else if(!body.password.match(regexpword) ){
      reject("Password must have at least at least one numeric digit, one uppercase and one lowercase letter");
    }
    else{
      resolve();
    }
  });
}