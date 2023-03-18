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
app.use(cookieParser());
const Post = require('./models/user');
const Comment = require('./models/comments');


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
                res.redirect('/feed');
            
            } else {
                res.redirect('/login');
                id = "0"; 
            }
    });

});
    // mock user
app.get('/feed', async(req, res) => {
    // fetch all records from comments
    const comments = await Comment.find().sort({ timeStamp: -1 });
    console.log(comments);
    // for element in comments
    var i = 0;
    var comm = '';
    while (i < comments.length) {
        // fetch user from user
        const user = await Post.findOne({ '_id': comments[i].uid });
        // add user to comments
        if (comments[i].isPosting == true) {
            var invis = '';
        } else {
            var invis = 'style="display:none"';
        }
        var tagList = '';
        for (var j = 0; j < comments[i].tags.length; j++) {
            var element = `
            <li class="tag"><div>${comments[i].tags[j]}</div></li>
            `;
            tagList = tagList + element;
        }

        var element = `
        <div class="content">
        <div class="owner">
          <img
            src="./feed_files/placeholder.60f9b1840c.svg"
            loading="lazy"
            alt=""
            class="pfp"
          />
          <div>
            <div>${user.name}</div>
            <div class="text-block-2">${user.email}</div>
          </div>
        </div>
        <div class="ppp">
          <div class="tagged">
            ${comments[i].body}
          </div>
        </div>
        <div class="apply" ${invis}>
          <ul role="list" class="tagss w-list-unstyled">
            ${tagList}
          </ul>
        </div>
      </div>
  
        `;
        comm = comm + element;
        i++;
    }

    res.render('feed.ejs', { comments: comm });
});

app.post('/feed', async (req, res) => {
    const cookie = req.cookies.jwt;
    var uid = "0";
    const unixTimestamp = Math.round(new Date().getTime() / 1000);
    if (cookie) {
        jwt.verify(cookie, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                uid = decoded.id;
            }
        });
    } else {
        res.redirect('/login');
    }
    console.log(req.body);
    if (req.body.Radio == "job") {
        var isPostings = true;
    } else {
        var isPostings = false;
    }
    var tags = ['UI','Figma']
    const post = new Comment({
        body: req.body.input,
        uid: uid,
        tags: tags,
        isPosting: isPostings,
        timeStamp: unixTimestamp
    });
    // console.log(post);
    try {
        const savedPost = await post.save();
        res.redirect('/feed');
    } catch (err) {
        res.json({ message: err });
    }
});

app.listen(port, () => console.log(`app listening on port ${port}!`));