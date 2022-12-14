const path = require('path')
const express = require('express') //1:14:39
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs  = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')

//load config
dotenv.config({path: './config/config.env'})

//passport config
require('./config/passport')(passport)
 
connectDB()

const app = express()

//Body Parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

//loggind
if(process.env.NODE_ENV = 'development'){
    app.use(morgan('dev'))
}

//Helpers for handlebars
const {formatDate, stripTags, truncate, editIcon, select} = require('./helpers/hbs')

//Handlebars
app.engine(
    '.hbs',
    exphbs.engine({
      helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select,
      },
      defaultLayout: 'main',
      extname: '.hbs',
    })
  )

//Sessions
app.use(session({
  secret: 'hello',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({mongoUrl: process.env.MONGO_URI,}),
}))

  //passport middlewre
app.use(passport.initialize())
app.use(passport.session())

//set global variable
app.use(function(req, res, next) {
  res.locals.user = req.user || null
  next()
})

//Static folder
app.use(express.static(path.join(__dirname, "public")))

//Router
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

app.set('view engine', 'hbs')

const PORT = process.env.PORT || 5002

app.listen(PORT, console.log(`Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`) )

//auth in 1:3:44