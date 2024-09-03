import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';

const server = express();
server.use(express.json());
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true,
});

server.post("/signup", (req, res) => {
    
    let {fullname, email, password} = req.body;

    if(fullname.length < 3){
        return res.status(403).json({'error': 'Fullname must be at least 3 characters long'});
    }

    if (!email.length) {
        return res.status(403).json({'error': 'Email is required'});
    }

    res.status(200).json({'fullname': fullname, 'email': email, 'password': password});

})

server.listen(PORT, () => {
    console.log('listening on port => ' + PORT);
    console.log('mongodb database is connected');
});