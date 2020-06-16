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
    list: function(context, options ){
      var ret ="<ol>";
      for (var i =0; i < context.length; i++){
        ret += "<li> " + options.fn(context[i]) +"</li>";
      } 
      return ret+="</ol>";
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

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

app.listen(HTTP_PORT, onHttpStart);