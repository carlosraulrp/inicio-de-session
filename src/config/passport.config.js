const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const User = require('../models/User')
const userService = require('../models/User')
const {createHash, isValidatePassword} = require('../../utils')


const initializePassport = () =>{

    passport.use(
        'register',
        new localStrategy(
            {
                usernameField: 'email', // Campo de entrada de correo electrónico en el formulario
                passReqToCallback: true, // Permite pasar la solicitud al callback
            },
            async (req, username, password, done) => {
                try {
                    const { first_name, last_name, email, age } = req.body;
                    
                    // Verificar si el usuario ya existe en la base de datos
                    const existingUser = await userService.findOne({ email });
                    if (existingUser) {
                        console.log('El usuario ya existe');
                        return done(null, false, { message: 'El usuario ya existe' });
                    }
    
                    // Verificar si se proporcionaron todos los campos obligatorios
                    if (!first_name || !last_name || !email || !age || !password) {
                        console.log('Faltan campos obligatorios');
                        return done(null, false, { message: 'Faltan campos obligatorios' });
                    }
    
                    // Crear un nuevo usuario
                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password), 
                    };
    
                    const result = await userService.create(newUser);
                    console.log('Usuario registrado con éxito:', result);
                    return done(null, result);
                } catch (error) {
                    console.error('Error al obtener el usuario:', error);
                    return done(error);
                }
            }
        )
    )
}





module.exports = initializePassport;