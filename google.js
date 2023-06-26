const axios = require('axios')
module.exports = {
    obterDetalhesVideo: async function (url) {
        try {
            let id = ""
            switch (true) {
                case url.includes("watch?v="):
                    id = url.substr(url.indexOf("watch?v=") + 8)
                    console.log(id)
                    break;
                case url.includes("youtu.be"):
                    id = url.substr(url.indexOf("youtu.be/") + 9)
                    break;

                default:
                    break;
            }
            return await axios.get(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=AIzaSyAsZRk_-lTVEglRv6wZoOUEHWowTrHZblQ`)
        } catch (error) {
            console.error(error)
        }
    }
}
