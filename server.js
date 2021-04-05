const express = require('express');
const app = express();
const bcrypt = require("bcrypt");
var mongoose = require("mongoose");
const User = require('./modules/User');

mongoose.connect("mongodb://localhost:27017/shopping_db", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function() {
  console.log("Connection Successful!");
});

var users = [];

app.listen(3000);

app.use('/img', express.static('img'))

app.use(express.urlencoded({ extended: false }));
app.set('view-engine', 'ejs')

//routes

app.get('/', (req,res) => {
    res.render('index.ejs')
})

app.get('/register', (req,res) => {
    res.render('register.ejs')
})

app.post('/register', async (req, res) => {
    const hashPass = await bcrypt.hash(req.body.password,10);
       var user = new User({
           email: req.body.email,
           password: hashPass
       })
       user.save().then(item => {
        res.send("Success!!")
        res.redirect('/login');
      })
      .catch(err => {
        res.send("Email taken!!")
        res.redirect('/register');
    });
})

app.get('/login', (req,res) => {
    res.render('login.ejs')
})


app.post('/login', async (req,res) => {
    const user = await User.findOne({email:req.body.email});

    if(user && bcrypt.compareSync(req.body.password, user.password)){
        res.redirect('/welcome')
    }
    else{
        res.redirect('/login')
    }
    //res.send("email " + email + "  pass " + pass)
})

app.get('/welcome', (req,res) => {
    res.render('welcome.ejs')
})

app.get('/ajax', (req,res) => {
    res.render('ajax.ejs')
})


module.exports = app;