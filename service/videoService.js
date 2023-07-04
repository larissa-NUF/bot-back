const videoRepository = require('../repository/videoRepository');
const configuracoesRepository = require('../repository/configuracoesRepository');
const requestService = require('./requestService');
const dayjs = require("dayjs");

module.exports = {
    obterVideoAtual: async function () {
        try {
            return await videoRepository.obterTocando();
        } catch (ex) {
            console.error(ex)
        }
    },
    obterPlaylist: async function () {
        try {
            return await videoRepository.listarVideos();
        } catch (ex) {
            console.error(ex)
        }
    },
    adicionarVideo: async function (urlVideo, user) {
        try {
            if (validateYouTubeUrl(urlVideo)) {
                let limiteTempoVideo = await configuracoesRepository.obterLimiteTempoVideo();
                let limiteVideoUsuario = await configuracoesRepository.obterLimiteVideoUsuario();
                let detalhesVideo = await requestService.obterDetalhesVideo(urlVideo);
                let videos = await videoRepository.obterByIdUsuario(user);
                let videoTocando = await videoRepository.obterTocando();

                let videoRequest = {
                    "id": detalhesVideo.data.items[0].id,
                    "url": 'https://youtu.be/' + detalhesVideo.data.items[0].id,
                    "usuario": user,
                    "titulo": detalhesVideo.data.items[0].snippet.title,
                    "criador": detalhesVideo.data.items[0].snippet.channelTitle,
                    "dataRequisicao": new Date(new Date().toISOString()),
                    "dataPromote": null,
                    "tocando": videoTocando ? false : true
                }
                //TODO arrumar retorno tempo
                //erro retorno, depois case
                let validacao = validarTempo({
                    dataVideo: detalhesVideo.data.items[0].contentDetails.duration,
                    limiteTempoVideo: limiteTempoVideo
                })
                if (validacao && videos?.length == limiteVideoUsuario.maximo) {
                    let response = { limite: true }
                    return response
                }
                console.log(validacao)
                if (validacao && videos?.length <= limiteVideoUsuario.maximo &&
                    detalhesVideo.data.items[0].snippet.liveBroadcastContent != "live") {
                    console.log("ok")
                    let response = await videoRepository.addVideo(videoRequest);
                    return response;
                }
                return;

            }
        } catch (ex) {
            console.error(ex)
        }
    },
    proximoVideo: async function () {
        try {
            let videoAtual = await videoRepository.obterTocando();
            if (videoAtual) {
                await videoRepository.deletarVideo(videoAtual.id)
                let proximoVideo = await videoRepository.existePosicao(1);
                if (proximoVideo) {
                    await videoRepository.updateTocando({ id: proximoVideo.id, tocando: true });
                    proximoVideo.tocando = true;
                    return proximoVideo;
                }
            }

            return;
        } catch (ex) {
            console.error(ex)
        }
    },
    deletarVideo: async function (p) {
        let posicao = Number(p)
        if (posicao != 0) {
            let existe = await videoRepository.existePosicao(posicao)
            if (existe) {
                await videoRepository.deletarVideo(existe.id)
                return true;
            }
        }
        return false;


    },
    promoteVideo: async function (p) {
        let posicao = Number(p)
        if (posicao != 0 && posicao != 1) {
            let existe = await videoRepository.existePosicao(posicao)
            if (existe) {
                let request = { id: existe.id, data: new Date(new Date().toISOString()) }
                await videoRepository.updatePromote(request)
                return existe;
            }
        }
        return;


    },

}

function validateYouTubeUrl(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (url.match(p)) {
        return url.match(p)[1];
    }
    return false;
}

function validarTempo(request) {
    try {
        console.log(request)
        if (request.dataVideo.includes('H')) return false;
        let sp = request.dataVideo.substr(2).split('M')

        tempoVideo = dayjs("2000-01-01 00:" + sp[0] + ":" + sp[1].substring(0, sp[1].length - 1)).format('HH:mm:ss')
        tempoMaximo = dayjs(request.limiteTempoVideo.maximo._seconds * 1000).format('HH:mm:ss')
        tempoMinimo = dayjs(request.limiteTempoVideo.minimo._seconds * 1000).format('HH:mm:ss')
        console.log(tempoVideo, tempoMaximo, tempoMinimo)
        if ((tempoVideo <= tempoMaximo) && (tempoVideo >= tempoMinimo)) return true;
        return false;
    } catch (ex) {
        console.error(ex)
    }

}