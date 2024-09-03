import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// schema below
import User from './Schema/User.js';

const server = express();
server.use(express.json());
const PORT = process.env.PORT || 3000;

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true,
});

// formating the data to be sent to the database
const formatData = (user) => {

    const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY);
    return {
        accessToken,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    }
}

// generating username
const generateUsername = async (email) => {
    let baseUsername = email.split('@')[0];
    let username = baseUsername;
    let count = 0;

    let nickExists = await User.exists({ "personal_info.username": username });

    while (nickExists) {
        count++;
        username = baseUsername + count;
        nickExists = await User.exists({ "personal_info.username": username });
    }

    return username;
}

// signing up
server.post("/signup", async (req, res) => {
    try {
        let { fullname, email, password } = req.body;

        // validation

        if (fullname.length < 3) {
            return res.status(403).json({ 'error': 'Fullname must be at least 3 characters long' });
        }

        if (!email.length) {
            return res.status(403).json({ 'error': 'Email is required' });
        }

        if (!emailRegex.test(email)) {
            return res.status(403).json({ 'error': 'Invalid email format' });
        }

        if (!password.length) {
            return res.status(403).json({ 'error': 'Password is required' });
        }

        if (!passwordRegex.test(password)) {
            return res.status(403).json({
                'error': 'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
            });
        }

        // Generate username
        let username = await generateUsername(email);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        let user = new User({
            personal_info: {
                fullname,
                email,
                password: hashedPassword,
                username
            }
        });

        // Save the user
        await user.save();

        return res.status(200).json({ "user" : formatData(user) });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(500).json({ 'error': 'Email already exists' });
        }
        return res.status(500).json({ 'error': 'Internal Server Error' });
    }
});

// signing in
server.post("/signin", async (req, res) => {
        let { email, password } = req.body;

        // validation
        if (!email.length) {
            return res.status(403).json({ 'error': 'Email is required' });
        }

        if (!password.length) {
            return res.status(403).json({ 'error': 'Password is required' });
        }

        User.findOne({ "personal_info.email" : email }).then((user) => {
            if(!user){
                return res.status(403).json({"error":"Email not found"})
            }

            bcrypt.compare(password, user.personal_info.password, (err, result) => {
                if(err){
                    return res.status(403).json({"error":"Error occured while signing in"})
                }

                if(!result){
                    return res.status(403).json({"error":"Password is wrong =( Try again"})
                } else{
                    return res.status(200).json(formatData(user))
                }
            })
            console.log(user)
        }).catch(err => {
            console.log(err);
            return res.status(500).json({"error":"Internal Server Error"})
        })
});

server.listen(PORT, () => {
    console.log('listening on port => ' + PORT);
    console.log('mongodb database is connected');
});
