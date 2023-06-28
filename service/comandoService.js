const db = require('../repository/db');
const requestService = require('../service/requestService');
const { ObjectId } = require('mongodb');

module.exports = {
    adicionarVideo: async function (urlVideo, user) {
        if (validateYouTubeUrl(urlVideo)) {
            let detalhesVideo = await requestService.obterDetalhesVideo(urlVideo);
            if(detalhesVideo.data.items[0].snippet.liveBroadcastContent != "live"){
                let videoRequest = {
                    "_id": new ObjectId,
                    "url": urlVideo,
                    "usuario": user,
                    "titulo": detalhesVideo.data.items[0].snippet.title,
                    "criador": detalhesVideo.data.items[0].snippet.channelTitle
                  }
                let video = await db.addVideo(videoRequest);
                return video;
            }
            
        }
    },
    deletarVideo: async function (p) {
        let posicao = Number(p)
        if(posicao != 0){
            let existe = await db.existePosicao(posicao)
            if(existe.length == posicao + 1){
                await db.deletarVideo(existe[posicao + 1]._id)
                return true;
            }
        }
        return false;
        
        
    }
}

function validateYouTubeUrl (url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (url.match(p)) {
        return url.match(p)[1];
    }
    return false;
}