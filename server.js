require('dotenv').config();

const express = require('express');
const app = express();
const bcrypt = require("bcrypt");
var mongoose = require("mongoose");
const User = require('./modules/User');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

mongoose.connect("mongodb://localhost:27017/shopping_db", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function() {
  console.log("Connection Successful!");
});


app.listen(3000);

app.use('/img', express.static('img'))
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));
app.set('view-engine', 'ejs')

//routes

app.get('/', (req,res) => {
    res.render('index.ejs')
})

app.post('/register', async (req, res) => {
    const hashPass = await bcrypt.hash(req.body.password,10);
       var user = new User({
           email: req.body.email,
           password: hashPass
       })
       user.save().then(item => {
        res.redirect('/login');
      })
      .catch(err => {
        res.send(err);
        res.redirect('register');
    });
})

app.get('/login', (req,res) => {
    res.render('login.ejs')
})


app.post('/login', async (req,res) => {
    const user = await User.findOne({email:req.body.email});
    const token = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET);

    if(user && bcrypt.compareSync(req.body.password, user.password)){
        res
        .status(201)
        .cookie('access_token', 'Bearer ' + token, {
         expires: new Date(Date.now() + 8 * 3600000) // cookie will be removed after 8 hours
         })
        .cookie('test', 'test')
        .redirect(301, '/welcome')
    }
    else{
        res.redirect('/login')
    }
    //res.send("email " + email + "  pass " + pass
})

app.get('/welcome', authToken, (req,res) => {
    res.render('welcome.ejs')
})

app.post('/create_list', authToken, (req,res) => {
    res.send(req.body);
})

app.get('/create_product',authToken, (req,res) => {
    res.render('create_product.ejs')
})
app.post('/create_product',authToken, (req,res) => {
    res.send(req.body);
})

app.get('/profile', authToken, (req, res) =>{

})

function authToken(req, res, next){
    const authHeader = req.cookies['access_token'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);
    if(token == null) return res.sendStatus(401);
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);

        req.user = user;
        next();
    })

}

module.exports = app;