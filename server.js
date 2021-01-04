

//HEROKU LINK
//https://floating-atoll-61832.herokuapp.com/

//GITHUB LINK
//https://github.com/lcyap/WEB322--Final-Assignment


//all images are taken from unsplash.com

const express = require("express");
const app = express();
const path = require("path");
const ds = require("./fakedata.js");
const exphbs = require("express-handlebars");
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const bodyParser = require('body-parser');
const HTTP_PORT = process.env.PORT || 8080;
var nodemailer = require('nodemailer');
const clientSessions = require("client-sessions");
const multer = require("multer");
//A3
const db = require("./db.js");
//A5
const mongoose = require("mongoose");

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
};
//A3
app.use(clientSessions({
  cookieName: "session",
  secret: "Noo_dacrunch", 
  duration: 2 * 60 * 1000, 
  activeDuration: 1000 * 60 
}));

//A4 Multer storage for image
const storage = multer.diskStorage({
  destination: "./public",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

//code from prof
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    return cb(null, true);
  } else {
    return cb(new Error('Not an image! Please upload an image.', 400), false);
  }
};

const upload = multer({ storage: storage, fileFilter: imageFilter });

app.set("views", "./views");
app.engine(".hbs", exphbs({ extname: ".hbs",
helpers: {
    strong: function(options){
      return '<strong>' + options.fn(this) + '</strong>';
    },
    grouped_each: function(every, context, options) {
      var out = "", subcontext = [], i;
      if (context && context.length > 0) {
          for (i = 0; i < context.length; i++) {
              if (i > 0 && i % every === 0) {
                  out += options.fn(subcontext);
                  subcontext = [];
              }
              subcontext.push(context[i]);
          }
          out += options.fn(subcontext);
      }
      return out;
  },
  hide: function(context, options){
    if (!context){
      return '<p style="display:none; ">' + options.fn(this) + '</p>';
    }
    else{
      return '<p style="display:block; color: red;">' + options.fn(this) + '</p>'
    }

  } 
}, handlebars: allowInsecurePrototypeAccess(Handlebars)
})
); 
app.set("view engine", ".hbs");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

//A3
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } 
  else {
    next();
  }
}
function ensureAdmin(req, res, next) {
  if (!req.session.user || req.session.user.email!=dataManager.email) {
    res.redirect("/login");
  } else {
    next();
  }
}

app.get("/", (req, res)=>{
  db.displayMeals().then((data1)=>{
    res.render("index",{data: (data1.length!=0)?data1:undefined , session:req.session.user });
  }).catch((err)=>{
    res.render("index"); 
  });
});

//A4 display from MongoDB
app.get("/meals", (req,res)=>{
  db.displayMeals().then((data1)=>{
    res.render("meals",{data: data1, session:req.session.user, layout: false});
  }).catch((err)=>{
    res.render("meals"); 
  });

});
app.get("/login", (req,res)=>{
  res.render("login");
})
app.get("/register", (req,res)=>{
  res.render("register");
})

//A3
//user dashboard
app.get("/dashboard",ensureLogin, (req,res)=>{
  res.render("dashboard", {data: req.session.user, session:req.session.user});
})
//admin dashboard
app.get("/admindashboard",ensureAdmin, (req,res)=>{
    res.render("admindashboard", {session: req.session.user});
})


//A3 ADMIN DETAILS
const dataManager = {
  email: "noodeliveryapp@gmail.com",
  password: 12345
}
//form login
app.post("/loginform", (req, res) =>{
  ds.login(req.body)//regex checks
  .then((data)=>{
    db.validateUser(req.body) //password match checks
    .then((indata)=>{
      if(req.body.email == dataManager.email){ //admin dashboard
        req.session.user = indata[0];
        console.log(req.session.user);
        res.render("admindashboard", {data: req.session.user, session: req.session.user});
      }
      else{
        
        req.session.user = indata[0]; //customer dashboard
        res.render("dashboard", {data: req.session.user, session: req.session.user});
      }
    }).catch((error)=>{
        console.log(error);
        res.render("login", {message: error});
      });
  }).catch((error,data)=>{
      console.log(error);
      res.render("login",  {message: error, data:req.body});
});

});

//Logout Session
app.get("/logout",(req,res)=>{
  req.session.reset();
  res.redirect("/login");
});

//form register
app.post("/registerform", (req, res) =>{ 
  ds.registerpword(req.body)//regexchecks
  .then((data)=>{
    db.registerUser(req.body) //validates new user and hashes pword
    .then((indata)=>{
      req.session.user = indata;
      //send email
      console.log(req.session.user);
      const transporter = nodemailer.createTransport({ // send email confirmation
        service: 'gmail',
        auth: {
            user: 'noodeliveryapp@gmail.com',
            pass: ''
        }
      });
      
      var mailOptions = {
        from: 'noodeliveryapp@gmail.com',
        to: req.body.email,
        subject: 'Welcome to Noodelivery!',
        html: '<h3>Thank you for signing up with Noodelivery!</h3> <p>Click <a href="http://localhost:8080/dashboard">here</a> to go to your dashboard page</p>'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      
      res.render("dashboard", {data: req.session.user, session: req.session.user});

    }).catch((error)=>{
      console.log(error);
    });
  }).catch((error,data)=>{
    res.render("register", {message: error, data:req.body});
  });
});

  
//A4 ADD MEAL
app.post("/newmealpackage", upload.single("photo"), (req, res)=>{
  req.body.img = req.file.filename;
  db.createMeal(req.body).then(()=>{
    res.redirect("/admindashboard");
  }).catch((err)=>{
    console.log("Error adding meal: "+ err);
    res.redirect("/admindashboard"); //passing an error message or the student object
  }); 
});
//A4 EDIT MEAL
app.get("/adminlist", ensureAdmin, (req,res)=>{
  db.displayMeals().then((data1)=>{
    res.render("adminlist",{data: (data1.length!=0)?data1:undefined, session:req.session.user});
  }).catch((err)=>{
    res.render("adminlist"); 
  });

})
app.get("/edit",ensureAdmin, (req,res)=>{
  if (req.query.mealname){ 
    db.getMealbyName(req.query.mealname).then((meal)=>{
      res.render("editmeals", {data:meal[0], session:req.session.user}); //using [0] because students is an array
    }).catch(()=>{
      console.log("couldn't find meal");
      res.redirect("/");
    });
  }
  else
    res.redirect("/adminlist");
});
app.post("/editmeal",(req,res)=>{
  db.editMeal(req.body).then(()=>{
    console.log("Successfully edited")
    res.redirect("/adminlist");
  }).catch((err)=>{
    console.log("error editing " + err);
    res.redirect("/editmeals");
  })
});

//A5////////////////////
app.use(bodyParser.json());

//AJAX ADD PRODUCT from meals.hbs page
app.post("/addProduct", (req,res)=>{
  console.log("Adding meal with name: "+req.body.mealname);
  db.getMealItem(req.body.mealname)
  .then((item)=>{
      db.addtoCart(item)
      .then((mealsincart)=>{
          res.json({data: mealsincart});
      }).catch(()=>{
          res.json({message:"error adding"});
      })
  }).catch(()=>{
      res.json({message: "No Items found"})
  })
});

//CART
app.get("/cart",ensureLogin, (req,res)=>{
  var cartData = {
      cart:[],
      sum:0,
      
  } ;
  db.getCart().then((items)=>{
      cartData.cart = items;
      db.placeorder().then((sum)=>{
          cartData.sum = sum;
          cartData.cart.map(item=>item.toObject());
          res.render("mealcart", {data:cartData, session: req.session.user});
      }).catch((err)=>{
          res.send("Error getting sum of meals" +err);
      });
  })
  .catch((err)=>{
      res.send("There was an error: " + err );
  });
});

//Place Order
app.get("/placeorder", ensureLogin, (req,res)=>{
  db.getCart().then((cart)=>{
    console.log("Placing order: " + cart);
    //send email here
    const transporter = nodemailer.createTransport({ // send order confirmation
      service: 'gmail',
      auth: {
          user: 'noodeliveryapp@gmail.com',
          pass: 'Noodles1.'
      }
     });
     var sum= 0;
     cart.forEach(x => {
      sum += x.mealprice;
      });
     var content = cart.reduce(function(a, b) {
      return a + '<tr><td>' + b.mealname + '</a></td><td>$' + b.mealprice + '</td></tr>';
    }, '');
      
     var mailOptions = {
      from: 'noodeliveryapp@gmail.com',
      to: req.session.user.email,
      subject: 'Welcome to Noodelivery!',
      html: '<h3>Thank you for ordering with Noodelivery!</h3> <div><table><thead><tr><th>Meal Name</th><th>Meal Price</th></tr></thead><tbody>' + content + '</tbody></table><p>Total Price: $' + sum + '</div>'
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    //clear cart here
     db.clearCart();
    res.render("placeorder", {session: req.session.user});
  }).catch((err)=>{
    console.log("error placing order" + err);
  });
  
 

});


app.use((req, res) => {    
  res.status(404).send("Page Not Found");
});

db.initialize().then(ds.initialize)
.then(()=>{
  console.log("Data read successfully");
  app.listen(HTTP_PORT, onHttpStart);
  
})
.catch((data)=>{
  console.log(data);
});

