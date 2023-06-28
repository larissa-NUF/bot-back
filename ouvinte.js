const modService = require('./service/comandoService');
const tmi = require('tmi.js');
const dotenv = require('dotenv');
dotenv.config();

module.exports = function (io) {

    const client = new tmi.Client({
        options: { debug: true },
        identity: {
            username: 'aumcebot',
            password: process.env.TWITCH_KEY
        },
        channels: [process.env.CHANNEL]
    });

    client.connect();

    client.on('message', async (channel, tags, message, self) => {
        try {
            if (self || !message.startsWith('!')) return;

            let mensagemItens = message.split(' ');
            if (mensagemItens.length == 2) {
                let mensagemChat
                let socketOk
                let dadosSocket
                let response

                //comando para mod com param
                if (tags.mod) {
                    switch (mensagemItens[0]) {
                        case '!delvideo':
                            response = await modService.deletarVideo(mensagemItens[1]);
                            socketOk = "delete";
                            dadosSocket = mensagemItens[1];
                            mensagemChat = "O vídeo na posição #" + mensagemItens[1] + " foi removido da lista de reprodução";

                            break;
                    }
                }

                //comando para user normal com param
                switch (mensagemItens[0]) {
                    case '!addvideo':
                        response = await modService.adicionarVideo(mensagemItens[1], tags['display-name']);
                        socketOk = "add";
                        dadosSocket = response;
                        mensagemChat = response.titulo + " - " + response.criador + ' foi adicionado na lista de reprodução';

                        break;
                }
                if (socketOk) io.sockets.emit(socketOk, dadosSocket);
                if (mensagemChat) client.say(channel, mensagemChat)
            }

            //comando para mod sem param
            if (tags.mod) {
                switch (mensagemItens[0]) {
                    case '!skipvideo':
                        io.sockets.emit("skip");
                        break;
                }
            }

            //comando para user normal sem param
            switch (mensagemItens[0]) {
                case '!videolist':
                    client.say(channel, 'Confira a lista de requisição de vídeos aqui ' + process.env.URL_FRONT)
                    break;
                case '!tutorial':
                    client.say(channel, '!addvideo <URL> - adiciona o vídeo da url na lista de reprodução / !delvideo <n> - exclui o vídeo na posição n da lista de reprodução / !videolist - link da página de reprodução de vídeos / !skipvideo - pula o vídeo atual')
                    break;
            }

        } catch (ex) {
            console.error(ex)
        }

    });

    io.on("connection", (socket) => {
        socket.on('skipOk', function (data) {
            client.say(process.env.CHANNEL, 'Vídeo atual pulado')
        })
    });
    

}


