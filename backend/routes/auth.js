//gestioneaza autentificarea(register,login)
//import librarii
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//array temporar pt users

const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
//cand cream un token il 'semnam' cu secret

router.post('/register', async (req, res) => {//post api/auth/register
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'Email,password si name sunt obligatorii'
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Parola trebuia sa aiba minim 6 caractere'
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({//409-confilct
                success: false,
                message: 'Emailul este deja inregistrat'
            });
        }

        //Hash uirea parolei
        const salt = await bcrypt.genSalt(10);//nr runde hash uite
        const hashedPassword = await bcrypt.hash(password, salt);

        //creare user nou
        const newUser = await User.create({
            email, password: hashedPassword,
            name
        });

        //payload ul tokenului(ce info punem in token)
        const payload = {
            userId: newUser._id,
            email: newUser.email
        };
        const token = jwt.sign(
            payload, JWT_SECRET, { expiresIn: '7d' }//expira in 7 zile
        );
        res.status(201).json({
            success: true,
            message: 'User inregistrat cu succes',
            data: {
                token,
                user: {
                    id: newUser._id,
                    email: newUser.email,
                    name: newUser.name
                }
            }
        });


    } catch (error) {
        console.error('Register error: ', error);
        res.status(500).json({
            success: false,
            message: 'Eroare la inregistrare',
            error: error.message
        });
    }

});
//post /api/auth/login user existent

router.post('/login', async (req, res) => {
    //primeste email+password
    //verifica daca user exista
    //verifica daca parola e corecta
    //genereaza jwt token
    //trimite token inapoi
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email si password sunt obligatorii'
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email sau parola incorecta'
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email sau parola incorecta'
            });
        }
        const payload = {
            userId: user._id,
            email: user.email
        };
        const token = jwt.sign(
            payload, JWT_SECRET, {
            expiresIn: '7d'
        }
        );
        res.json({
            success: true,
            message: 'Login reusit',
            data: {
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name
                }
            }
        });

    } catch (error) {
        console.error('Login error: ', error);
        res.status(500).json({
            success: false,
            message: 'eroare la login',
            error: error.message
        });
    }



});

const authenticateToken = (req, res, next) => {
    try {
        // Extragem token-ul din header
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token lipseste. Autentificare necesara.'
            });
        }

        // Extragem doar token-ul 
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Autentificare necesara.'
            });
        }

        // Verificam token-ul
        const decoded = jwt.verify(token, JWT_SECRET);

        // Salvăm datele user-ului în request
        req.user = {
            userId: decoded.userId,
            email: decoded.email
        };
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token-ul a expirat. Loghează-te din nou.'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Token invalid. Autentificare necesară.',
            error: error.message
        });
    }
};
module.exports = { router, authenticateToken };