var meal = [{
  first : "Crab Yakisoba",
  second: "Grilled Pork",
  third: "Spicy Beef",
  fourth: "Vegetarian",
  available: true
},
{
  first : "7.99",
  second: "9.99",
  third: "9.99",
  fourth: "7.99",
  available: true
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
        //console.log( `${body.email}`);
        resolve();
        return;
      }
      
  });
  
}