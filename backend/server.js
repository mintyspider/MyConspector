import express from 'express';
import mongoose from 'mongoose';

const server = express();

const PORT = process.env.PORT || 3000;

mongoose.connect();

server.use(express.json());

server.listen(PORT, () => {
    console.log('listening on port => ' + PORT);
});