const express = require('express')
const router = express.Router()
const usuario = require('../models/User')
const passport = require('passport')
const initializePassport = require('../config/passport.config')
const {createHash, isValidatePassword} = require('../../utils')


router.get("/login", async(req, res) =>{
    res.render("login")
})

router.get("/register", async (req, res) => {
    res.render("register")
})

router.get("/profile", async (req, res) => {
    if (!req.session.user) {
        return res.redirect("login")
    }

    const { first_name, last_name, email, age } = req.session.user
    

    res.render("profile", { first_name, last_name, age, email })
})


router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;


    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).send('Faltan datos.');
    }

    //const hashedPassword = createHash(password);

    const user = await usuario.create({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password)
    });

    res.send({ status: "success", payload: user })
    console.log('Usuario registrado con éxito.' + user)
    //res.redirect('/login');
})

router.get("/failregister", async (req, res) => {
    console.log("Falla en autenticacion")
    res.send({ error: "Falla" })
})

// Ruta para procesar el formulario de login utilizando Passport
router.post("/login", passport.authenticate('local', {
    successRedirect: '/profile', // Redirige al perfil si la autenticación es exitosa
    failureRedirect: '/login',   // Redirige de nuevo al formulario de login si la autenticación falla
}));

// Ruta para mostrar el perfil del usuario (protegida)
router.get("/profile", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login"); // Redirige al formulario de login si el usuario no está autenticado
    }

    const { first_name, last_name, email, age } = req.user; // Usa req.user para acceder al usuario autenticado

    res.render("profile", { first_name, last_name, age, email });
});



module.exports = router;