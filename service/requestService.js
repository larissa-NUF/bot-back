const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    obterDetalhesVideo: async function (url) {
        try {
            let id = ""
            switch (true) {
                case url.includes("watch?v="):
                    id = url.substr(url.indexOf("watch?v=") + 8)
                    break;
                case url.includes("youtu.be"):
                    id = url.substr(url.indexOf("youtu.be/") + 9)
                    break;

                default:
                    break;
            }
            if(id.includes('&')){
                console.log("passou")
                let limpar = id.split('&')
                id = limpar[0]
            }
            return await axios.get(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&part=contentDetails&id=${id}&key=${process.env.GOOGLE_KEY}`)
        } catch (error) {
            console.error(error)
        }
    }
}
