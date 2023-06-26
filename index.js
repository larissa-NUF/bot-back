const app = require('express')()
const cors = require('cors')
app.use(cors())
const server = require('http').createServer(app)
const io = require('socket.io')(server, {cors: {origin: '*'}})
const db = require('./db');
const validacao = require('./validacao');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => console.log('ok'))


const tmi = require('tmi.js');

const express = require ('express');
const routes = require('./routes'); // import the routes

app.use(express.json());

app.use('/', routes);


const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: 'aumcebot',
		password: process.env.TWITCH_KEY
	},
	channels: [ process.env.CHANNEL ]
});

client.connect();

client.on('message', async (channel, tags, message, self) => {
	if(self || !message.startsWith('!')) return;
	
	let mensagemItens = message.split(' ');
	if(mensagemItens.length == 2 && validacao.validateYouTubeUrl(mensagemItens[1])){
		switch (mensagemItens[0]) {
			case '!addvideo':
				let video = await db.addVideo(mensagemItens[1], tags['display-name']);
				console.log(video)
				io.sockets.emit("video", video);
				client.say(channel, 'adicionado')
				break;
			case '!delvideo':
				await db.deletarVideoPosicao(mensagemItens[1])
				io.sockets.emit("delete", mensagemItens[1]);
				client.say(channel, 'deletado')
				break;
			default:
				console.log(`Sorry, we are out of ${message}.`);
		}
	}

	

});

io.on("connection", (socket) => {
	console.log('oi')
	
	socket.on("add", (data) =>{
		console.log(data)
	})
  });