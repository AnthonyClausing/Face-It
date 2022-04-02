const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const socketio = require('socket.io');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const bodyParser = require('body-parser');
const db = require('./db');
const { ConsoleReporter } = require('jasmine');

const sessionStore = new SequelizeStore({ model: db.models.Session, db })

const port = process.env.PORT || 3000;
const app = express();

const sslSever = https.createServer({
  key: '',
  cert: ''
}, app)

passport.serializeUser((user, done) => { return done(null, user.id)})
passport.deserializeUser((id, done) =>
    db.models.user.findByPk(id)
    .then(user => { return done(null, user)})
    .catch(done));

app.use(morgan('dev'));
// app.use((req,res, next) => {
//   res.set("Feature-Policy", "camera '*'")
//   next()
// })
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.use(session({
  secret: process.env.SESSION_SECRET || 'my best friend is Cody',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


app.use('/auth', require('./auth'))   
app.use('/api', require('./routes'));

app.use(express.static(path.join(__dirname, '..', '/public')))


 // sends index.html
 app.use('*', (req, res, ) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'))
  })

  'grinsgs'
const server = app.listen(port, () => {
  console.log('Facing It')
  db.sync({force:false})
});
const io = socketio(server);

require('./serverSocket.js')(io);