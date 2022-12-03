const express = require("express")
const path = require("path")
const app = express()
const mongoose = require('mongoose');
const Subscriber = require("./models/subscriber");
const session = require('express-session')
const flash = require('connect-flash')
const MongoStore = require('connect-mongo')
const ExpressError = require('./utils/expressError')
const { validSub } = require('./middelwares')
const mongoSanitize = require('express-mongo-sanitize')
if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}


//'mongodb://localhost:27017/Calculi'
//process.env.ATLAS_URL
const dbURL = process.env.ATLAS_URL
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbURL);
}
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(mongoSanitize({
    replaceWith: ' ',
}))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


//session and flash config

const sessionConfig = {
    store: MongoStore.create({
        mongoUrl: dbURL,
        touchAfter: 24 * 3600
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}
app.use(session(sessionConfig))
app.use(flash())

//locals

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


app.get('/', (req, res) => {
    res.render('main')
})

app.post('/', validSub, async (req, res) => {
    try {
        const sub = new Subscriber(req.body)
        await sub.save()
        req.flash('success', 'Mercie pour Inscriver à notre newsletter')
    } catch (e) {
        if (e.message.includes('E11000 duplicate key error collection')) e.message = 'Cet e-mail est déjà enregistré'
        req.flash('error', e.message)
    }
    res.redirect('/')
})

//Error's midellwares

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page not found 404'))
})

app.use((err, req, res, next) => {
    const { status = 500, message = 'somthing went whrong' } = err
    if (!err.message) err.message = 'somthing went whrong'
    res.status(status).render('error', { err })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log("server connecter")
})