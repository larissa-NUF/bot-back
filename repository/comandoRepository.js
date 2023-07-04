const { db } = require('./conexao');
const comando = db.collection('comando');

module.exports = {
    obterTudo: async function(){
        try {
            const snapshot = await comando.get();
            let response = snapshot.docs.map(doc => doc.data());
            return response;
          } catch (err) {
            console.log(err.stack);
          }
    }
}