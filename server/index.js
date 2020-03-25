require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const {CONNECTION_STRING, SESSION_SECRET, SERVER_PORT} = process.env;
const app = express();
const port = SERVER_PORT;
const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware')

massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false }
}).then(db => {
    app.set('db', db)
    console.log('db connected')
})

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {maxAge: 100 * 60 * 60}
}))

app.use(express.json());

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)

app.listen(port, () => console.log(`server is listening on port ${port}`))
