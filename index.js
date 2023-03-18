const express = require('express');
const app = express();
const env = require('dotenv').config();
// get port from env
const port = process.env.PORT || 3000;
const ejs = require('ejs');
const path = require('path');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');


// middleware
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const Post = require('./models/user');


// mongoose
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));



app.get('/', (req, res) => res.render('index.ejs'));

app.get('/login', (req, res) => res.render('login.ejs'));

app.get('/register', (req, res) => res.render('register.ejs'));

app.get('/Explore', (req, res) => res.render('Explore.ejs'));

app.post('/register', async (req, res) => {
    const post = new Post({
        name: req.body.name,
        number: req.body.number,
        pass: req.body.password,
        enrollment: req.body.enrollment,
        email: req.body.email
    });
    post.pass = await bcrypt.hash(post.pass, 8);

    try {
        const savedPost = await post.save();
        res.redirect('/login');
    } catch (err) {
        res.json({ message: err });
    }

});

        

app.post('/login',async (req, res) => {
    // mock user

    try{
        const post = await Post.findOne({ 'email': req.body.email});
            var id = post._id;
            var hash = post.pass;
        }
        catch(err){
            console.log(err);
        }

        var pass = req.body.password;
    
        bcrypt.compare(pass , hash, function(err, result) {
            
            if (result == true){
                const cookie = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                res.cookie('jwt', cookie, {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    )
                });
                
                res.redirect('/');
            
            } else {
                res.redirect('/login');
                id = "0"; 
            }
    });

});
    // mock user


app.listen(port, () => console.log(`app listening on port ${port}!`));