const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL || {
      host : '127.0.0.1', //localhost
      user : 'postgres', //add your user name for the database here
      port: 5432, // add your port number here
      password : 'P0stgr3s!', //add your correct password in here
      database : 'smart-brain' //add your database name you created here
    },
     ...(process.env.DATABASE_URL ? { ssl: { rejectUnauthorized: false } } : {})
});

const app = express();


app.use(cors())
app.use(cors({
  origin: 'https://carmer95.github.io' // or '*' for testing
}));
app.use(bodyParser.json());

app.get('/', (_req, res) => res.send('Success'));
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', register.handleRegister(db, bcrypt))
app.get('/profile/:id', profile.handleProfileGet(db))
app.put('/image', image.handleImage(db))
app.post('/imageurl', image.handleApiCall);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {console.log(`App is running on Port ${PORT}`);});

