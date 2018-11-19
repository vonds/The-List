var express = require('express')
var app = express()

var expressMongoDb = require('express-mongo-db');
var config = require('./config')
app.use(expressMongoDb(config.database.url));


app.set('view engine', 'ejs')


var index = require('./routes/index')
var users = require('./routes/users')


var expressValidator = require('express-validator')
app.use(expressValidator())


var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



var methodOverride = require('method-override')


app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {

    var method = req.body._method
    delete req.body._method
    return method
  }
}))


var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser('Milk Boi'))
app.use(session({
  secret: 'Milk Boi',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))
app.use(flash())

app.use('/', index)
app.use('/users', users)

app.listen(3000, function () {
  console.log(`Server running at port 3000`)
})
