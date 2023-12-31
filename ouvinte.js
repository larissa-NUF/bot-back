const videoService = require('./service/videoService');
const comandoService = require('./service/comandoService');
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
            let mensagemChat
            let socketOk
            let dadosSocket
            let response
            let mensagemItens = message.split(' ');
            if (mensagemItens.length == 2) {


                //comando para mod com param
                if (validacaoMod(tags)) {
                    switch (mensagemItens[0]) {
                        case '!delvideo':
                            response = await videoService.deletarVideo(mensagemItens[1]);
                            socketOk = "delete";
                            dadosSocket = mensagemItens[1];
                            mensagemChat = "O vídeo na posição #" + mensagemItens[1] + " foi removido da lista de reprodução";

                            break;
                        case '!promotevideo':
                            response = await videoService.promoteVideo(mensagemItens[1]);
                            socketOk = "promote";
                            dadosSocket = mensagemItens[1];
                            mensagemChat = "O vídeo na posição #" + mensagemItens[1] + " foi movido para a posição #1 da fila";
                            break;
                    }
                }

                //comando para user normal com param
                switch (mensagemItens[0]) {
                    //TODO ? caso nulo, validação tipo mensagem
                    case '!addvideo':
                        console.log("s")
                        response = await videoService.adicionarVideo(mensagemItens[1], tags['display-name']);
                        if (response?.erroLimite) {
                            mensagemChat = 'Limite por vídeos na lista é 2 por usuário';
                        } else if (response?.erroTempo) {
                            mensagemChat = 'O vídeo pode ter no máximo 20 minutos e no mínimo 1 minuto';
                        } else if (response?.existe) {
                            mensagemChat = response.video.titulo + " - " + response.video.criador + ' já está na playlist';
                        } else if (response && !response?.existe) {
                            socketOk = response.video.tocando ? "refreshVideoAtual" : "refreshPlaylist";
                            mensagemChat = response.video.titulo + " - " + response.video.criador + ' foi adicionado na lista de reprodução';
                        }
                        console.log("ss", response)

                        break;
                }

            }
            //comando para mod sem param
            if (validacaoMod(tags)) {
                switch (mensagemItens[0]) {
                    case '!skipvideo':
                        response = 'ok';
                        socketOk = "skip";
                        mensagemChat = "O vídeo reproduzindo atualmente foi pulado"
                        break;
                    case '!cleanlist':
                        response = await videoService.deletarTudo();
                        socketOk = "cleanlist";
                        mensagemChat = "A lista de reprodução foi limpa"
                        break;
                }
            }

            //comando para user normal sem param
            switch (mensagemItens[0]) {
                case '!videolist':
                    response = 'ok';
                    mensagemChat = 'Confira a lista de requisição de vídeos aqui ' + process.env.URL_FRONT
                    break;
                case '!tutorial':
                    //TODO listar todos os comandos
                    //response = await comandoService.obterTudo();
                    //mensagemChat = response
                    response = 'ok';
                    mensagemChat = 'Entenda como usar o bot ' + process.env.URL_FRONT + '/documentacao'
                    break;

                case '!currentvideo':
                    response = await videoService.obterVideoAtual();
                    mensagemChat = 'Reproduzindo agora ' + response.titulo + " - " + response.criador;
                    break;
            }
            if (response && socketOk) io.sockets.emit(socketOk, dadosSocket);
            if (response && mensagemChat) client.say(channel, '@' + tags['display-name'] + " → " + mensagemChat)
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

function validacaoMod(tags) {
    if (tags.mod || tags['display-name'] == process.env.CHANNEL) return true;
    return false;
}
