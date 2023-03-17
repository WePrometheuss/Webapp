const express = require('express');
const app = express();
const env = require('dotenv').config();
const port = env.parsed.PORT || 3000;
const ejs = require('ejs');
const path = require('path');

// middleware
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => res.render('index.ejs'));

app.listen(port, () => console.log(`app listening on port ${port}!`));