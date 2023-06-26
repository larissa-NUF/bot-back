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
	if(mensagemItens.length == 2){
		switch (mensagemItens[0]) {
			case '!addvideo':
				if(validacao.validateYouTubeUrl(mensagemItens[1])){
					let video = await db.addVideo(mensagemItens[1], tags['display-name']);
					io.sockets.emit("video", video);
					client.say(channel, video.titulo + " - " + video.criador + ' foi adicionado na lista de reprodução')
				}
				break;
			case '!delvideo':
				await db.deletarVideoPosicao(mensagemItens[1])
				io.sockets.emit("delete", mensagemItens[1]);
				client.say(channel, "O vídeo na posição #" + mensagemItens[1] + " foi removido da lista de reprodução")
				break;
		}
	}
	switch (mensagemItens[0]) {
		case '!videolist':
			client.say(channel, 'Confira a lista de requisição de vídeos aqui ' + process.env.URL_FRONT)
			break;
		case '!tutorial':
			client.say(channel, '!addvideo <URL> - adiciona o vídeo da url na lista de reprodução / !delvideo <n> - exclui o vídeo na posição n da lista de reprodução / !videolist - link da página de repradução de vídeos')
			break;
	}

	

});

io.on("connection", (socket) => {
	
	socket.on("add", (data) =>{
	})
  });