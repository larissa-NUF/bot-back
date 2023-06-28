const app = require('express')()
const cors = require('cors')
app.use(cors())
const server = require('http').createServer(app)
const io = require('socket.io')(server, {cors: {origin: '*'}})
require('./ouvinte')(io);
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => console.log('ok'))




const express = require ('express');
const routes = require('./routes'); // import the routes

app.use(express.json());

app.use('/', routes);


