const { db } = require('./conexao');
const video = db.collection('video');


module.exports = {
  addVideo: async function (videoRequest) {
    console.log("passou")
    try {
      
      let response = { video: null, existe: false, limite: false };
      const snapshot = await video.doc(videoRequest.id).get();
      console.log(snapshot)
      if (snapshot.exists) {
        response.existe = true
      } else {
        await video.doc(videoRequest.id).set(videoRequest);
      }
      response.video = videoRequest
      return response;
    } catch (err) {
      console.log(err.stack);
    }


  },
  listarVideos: async function () {
    try {
      const snapshot = await video.where('tocando', '==', false).orderBy('dataPromote', 'desc').orderBy('dataRequisicao', 'asc').get();
      let response = snapshot.docs.map(doc => doc.data());
      return response;
    } catch (err) {
      console.log(err.stack);
    }


  },
  deletarVideo: async function (id) {
    try {
      await video.doc(id).delete();

    } catch (err) {
      console.log(err.stack);
    }
  },
  existePosicao: async function (n) {
    try {
      const snapshot = await video.where('tocando', '==', false).orderBy('dataPromote', 'desc').orderBy('dataRequisicao', 'asc').limit(n).get();
      let response = snapshot.docs.map(doc => doc.data());
      console.log(response)
      if (response) return response[n-1];
      return;
    } catch (err) {
      console.log(err.stack);
    }


  },
  obterTocando: async function () {
    try {
      let response
      const snapshot = await video.where('tocando', '==', true).get();
      snapshot.forEach(doc => {
        response = doc.data();
      });

      return response
    } catch (err) {
      console.log(err.stack);
    }
  },
  obterByIdUsuario: async function (usuario) {
    try {
      let response = []
      const snapshot = await video.where('usuario', '==', usuario).get();
      snapshot.forEach(doc => {
        response.push(doc.data());
      });

      return response
    } catch (err) {
      console.log(err.stack);
    }
  },
  updateTocando: async function (data) {
    try {

      await video.doc(data.id).update({ tocando: data.tocando });
    } catch (err) {
      console.log(err.stack);
    }
  },
  updatePromote: async function (data) {
    try {
      await video.doc(data.id).update({ dataPromote: data.data });
    } catch (err) {
      console.log(err.stack);
    }
  },

};
