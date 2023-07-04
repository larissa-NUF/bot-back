const comandoRepository = require('../repository/comandoRepository');

module.exports = {
    obterTudo: async function () {
        try {
            let response = await comandoRepository.obterTudo();
            let mensagem = ""
            response.forEach(element => {
                mensagem += element.comando + " - " + element.descricao + " / "
            });
            return mensagem
        } catch (ex) {
            console.error(ex)
        }
    }
}