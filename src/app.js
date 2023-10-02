const express = require('express')
const expHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const usersRouter = require('./routes/user.router')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const initializePassport = require('./config/passport.config')
const cookieParser = require('cookie-parser')
const app = express()

const PORT = 8080


//conectamos a mogoDB

mongoose.connect('mongodb+srv://carlosraulrp:811563@cluster0.latafpn.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conexión a MongoDB exitosa');
}).catch((err) => {
    console.error('Error en la conexión a MongoDB:', err);
});

app.use(bodyParser.urlencoded({extended:true}))

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://carlosraulrp:811563@cluster0.latafpn.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 600,
    }),
    secret: 'miSecret',
    resave: false,
    saveUninitialized: true,
}))

initializePassport(passport)
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())

//configuramos handlebars como motor de vista predeterminado

app.engine('handlebars', expHandlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(cookieParser('miSecret'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.use('/api/sessions', usersRouter)

app.get('/', (req, res) => {
    res.send('Express Sessions!')
})

/* app.get('/',  (req, res) => {

    let datosPagina = {
        title: "explicando handlebars",
        name: "handlebars",
        estado: "entendiendo"

    }

    res.render('ejemplo', datosPagina)
}) */




app.listen(PORT, () =>{
    console.log(`server is running in port: ${PORT}`)
})