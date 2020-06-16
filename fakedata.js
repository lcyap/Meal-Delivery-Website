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
  price: "24.99",
  category: "Vegetarian",
  amount: "3",
  synopsis: "Meals designed for pescatarians with the same amount of protein as the rest of our package",
  toppackage: true
},
{
  title : "Meat Lovers",
  price: "29.99",
  category: "Meat",
  amount: "3",
  synopsis: "Our signature Grilled Pork and Spicy Beef Noodles packs a punch",
  toppackage: true
},
{
  title : "Katsudon Package",
  price: "29.99",
  category: "Meat",
  amount: "3",
  synopsis: "Our special Chicken & Pork Tonkatsu Ramen is the star of this package",
  toppackage: true
},
{
  title : "Vegetarian Package",
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

