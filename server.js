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
    connection: {
      host : '127.0.0.1', //localhost
      user : 'postgres', //add your user name for the database here
      port: 5432, // add your port number here
      password : 'P0stgr3s!', //add your correct password in here
      database : 'smart-brain' //add your database name you created here
    }
});

const app = express();

// db.select('*').from('users').then(data => {
//     console.log(data);
// });

// const database = {
//     users: [
//         {
//             id: '123',
//             name: 'John',
//             email: 'john@gmail.com',
//             password: 'apples',
//             entries: 0,
//             joined: new Date(),
//         },
//         {
//             id: '124',
//             name: 'Sally',
//             email: 'sally@gmail.com',
//             password: 'bananas',
//             entries: 0,
//             joined: new Date(),
//         },
//     ]
// }

app.use(cors())
app.use(bodyParser.json());

app.get('/', (_req, res) => res.send('Success'));
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', register.handleRegister(db, bcrypt))
app.get('/profile/:id', profile.handleProfileGet(db))
app.put('/image', image.handleImage(db))
app.post('/imageurl', image.handleApiCall);

app.listen(3001, () => {console.log('App is running on Port 3001');});

/*
	/ (root) --> res = this is working
	/signin --> POST = success/fail
	/register --> POST = user
	/profile/:userId --> GET = user
    /image --> PUT --> user
*/
