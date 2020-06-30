const express = require("express");
const app = express();
const path = require("path");
const ds = require("./fakedata.js");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');
const HTTP_PORT = process.env.PORT || 8080;


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
  } 
}
})
); 
app.set("view engine", ".hbs");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

//for fakedata.js
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
//form
app.post("/testform", (req, res) =>{
  // ds.validator(req.body).then(()=>{
  //   ds.storePerson(req.body).then(()=>{
  //     res.redirect("/profile");
  //   })
  // }).catch((errmessage)=>{
  //   //var resObj={data:req.body};
  //   //resObj = {append a message here}
  //   res.render("/registration", {message:errmessage}); 
 //})
 
ds.login(req.body).then(()=>{
   res.redirect("/");
}).catch((error)=>{
  res.render("login", {message: error});
})
 //console.log(`we received ${req.body.email}`);

})
//{message: req.body} // dont clear form
//if validoatpr rejects anything in the 
//("error with user name") gets passed into message
//errmessage is what is passed from rejects
//message gets passed into hbs

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

app.listen(HTTP_PORT, onHttpStart);

//BLOG POST
//https://noodelivery.wordpress.com/