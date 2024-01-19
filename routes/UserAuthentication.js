const express= require('express')
const router =express.Router()
const path = require("path"); 
const User = require('../db/UserModel');
router.get('/login',async(req,res)=>{
    console.log("It is in login")
    res.render(path.join(__dirname , "../view/login"));
})

router.get('/registration',async(req,res)=>{
    console.log("It is in registration")
    res.render(path.join(__dirname , "../view/registration"));
})

router.post('/registration', async (req, res) => {
    try {
        // Process the registration logic and send a response
        const newUser = await User.create(req.body);
        console.log('Registration successful!');
        res.render(path.join(__dirname, '../view/login'), { registrationResponse: 'Registration successful!' });
    } catch (error) {
        console.error('Registration failed:', error.message);
        res.render(path.join(__dirname, '../view/registration'), { registrationResponse: 'Registration failed. Please check your inputs.' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        if (user.password === password) {
            // Log the user in (e.g., create a session, issue a token, etc.)
            return res.status(200).json({ message: 'Login successful!' });
        } else {
            return res.status(401).json({ message: 'Authentication failed. Incorrect password.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports =router