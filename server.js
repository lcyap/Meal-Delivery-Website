const express = require("express");
const app = express();
const path = require("path");
const ds = require("./fakedata.js");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');
const HTTP_PORT = process.env.PORT || 8080;
var nodemailer = require('nodemailer');

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
};

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
}
})
); 
app.set("view engine", ".hbs");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res)=>{
  var ourData = ds.getData();
  res.render("index", { data : ourData});
});
app.get("/meals", (req,res)=>{
  var ourData = ds.getData1();
  res.render("meals", { data : ourData});

});
app.get("/login", (req,res)=>{
  res.render("login");
})
app.get("/register", (req,res)=>{
  res.render("register");
})
app.get("/dashboard", (req,res)=>{
  res.render("dashboard");
})
app.get("/thankyou", (req,res)=>{
  res.render("thankyou");
})
//form login
app.post("/loginform", (req, res) =>{
  ds.login(req.body).then(()=>{
   res.redirect("dashboard");
}).catch((error,info)=>{
  res.render("login",  {message: error, data:req.body});
})

})
//form register
app.post("/registerform", (req, res) =>{
ds.registerpword(req.body).then((data)=>{

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noodeliveryapp@gmail.com',
        pass: 'Noodles1.'
    }
});
  
  var mailOptions = {
    from: 'noodeliveryapp@gmail.com',
    to: req.body.email,
    subject: 'Welcome to Noodelivery!',
    html: '<h3>Thank you for signing up with Noodelivery!</h3> <p>Click <a href="https://floating-atoll-61832.herokuapp.com/dashboard">here</a> to go to your dashboard page</p>'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

   res.render("thankyou", {data: req.body});

}).catch((error, info)=>{
  res.render("register", {message: error, data:req.body});
})
 

})


app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

app.listen(HTTP_PORT, onHttpStart);

//HEROKU LINK
//https://floating-atoll-61832.herokuapp.com/

//GITHUB LINK
//https://github.com/lcyap/WEB322-A2