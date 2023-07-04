const { db } = require('./conexao');
const configuracoes = db.collection('configuracoes');

module.exports = {
    obterLimiteTempoVideo: async function(){
        const snapshot = await configuracoes.doc('limiteTempoVideo').get()
        return snapshot.data();
    },
    obterLimiteVideoUsuario: async function(){
        const snapshot = await configuracoes.doc('limiteVideoUsuario').get()
        return snapshot.data();
    }
}