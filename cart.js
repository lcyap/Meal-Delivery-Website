var userCart = [];

//adds a item from systems to the cart
module.exports.addItem = (inItem)=>{
    console.log("Adding cart " + inItem.mealname);
    return new Promise((resolve,reject)=>{
        userCart.push(inItem);
        resolve(userCart.length);
    });
}



//returns the cart array and all items
module.exports.getCart = ()=>{
    return new Promise((resolve, reject)=>{
            resolve(userCart);
    });
}

//calculates the price of all items in the cart
module.exports.checkout = ()=>{
    return new Promise((resolve, reject)=>{
        var price=0;//if check if car is empty
        if(userCart){
            userCart.forEach(x => {
                price += x.mealprice;
            });
        }
        resolve(price);
    });
}