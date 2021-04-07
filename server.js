require('dotenv').config();

const express = require('express');
const app = express();
const bcrypt = require("bcrypt");
var mongoose = require("mongoose");
const User = require('./modules/User');
const ShoppingList = require('./modules/ShoppingList');
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
          res.json({message : "email already taken"})
    });
})

app.get('/login', (req,res) => {
    res.render('login.ejs')
})


app.post('/login', async (req,res) => {
    const user = await User.findOne({email:req.body.email});
    const token = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    if(user && bcrypt.compareSync(req.body.password, user.password)){
        res
        .status(201)
        .cookie('access_token', 'Bearer ' + token, {
         expires: new Date(Date.now() + 1 * 3600000) // cookie will be removed after 1 hours
         })
        .cookie('test', 'test')
        .redirect(301, '/welcome')
    }
    else{
        res.redirect('/login')
    }
    //res.send("email " + email + "  pass " + pass
})

app.get('/welcome', authToken, async (req,res) => {
    var shoppingMap = [];
    const list = await ShoppingList.find({});

    list.forEach((shop) => {
        if(shop.user_id === req.user.user._id)
         shoppingMap.push(shop);
    })
    res.render('welcome.ejs', {shoppingMap})
})

app.get('/create_list', authToken, (req,res)=>{
    res.render('createlist.ejs')
})
app.post('/create_list', authToken, (req,res) => {
    var user = req.user.user
    
    var list = new ShoppingList({
        name: req.body.list,
        user_id: user._id,
        date: req.body.date,
        product_list: [{
            product_name: req.body.product,
            quantity: req.body.quantity
        }]
     })
     
    list.save().then(item => {
         res.redirect('/welcome')
       })
       .catch(err => {
        res.send("List name must be unique")
     });
})

app.get('/profile', authToken, (req, res) =>{
    console.log("change pass");
    var message = req.body.email;
    res.render('profile.ejs', {message});
})

app.post('/profile', authToken, async (req, res) =>{
    var mail = req.user.user.email;
    var user = await User.findOne({email: mail})
    var password = req.body.password, 
        new_password = req.body.new_password,
        confirm = req.body.confirm;
    //console.log(user);

    if(user != null && bcrypt.compareSync(password, user.password)){
       if(new_password == confirm){
        const hashPass =  new_password//await bcrypt.hash(new_password,10);
        var myquery = { email: mail };
        var newvalues = {$set: {password: new_password} };
        db.collection("user").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          console.log("1 document updated");
        });       
        res.redirect('welcome');  
       }
       else{
           res.sendStatus(400);
       }
    }
})

app.post('/logut', authToken, (req, res) => {

})

app.get('/delete', authToken, (req, res) => {
    console.log(req.query.id)
    ShoppingList.findOneAndRemove({
        _id: req.query.id
    }, function(err, shop) {

        if (err) throw err;

        console.log("Success");

    });

    res.redirect('/welcome');
})

function authToken(req, res, next){
    const authHeader = req.cookies['access_token'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401);
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })

}

module.exports = app;