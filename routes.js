const express = require('express'); //import express
const videoService = require('./service/videoService');

const router  = express.Router(); 

router.get('/listar-tocando', async function (req, res, next) {
    let response = await videoService.obterVideoAtual();
    res.json(response);
}); 

router.get('/listar-playlist', async function (req, res, next) {
    let response = await videoService.obterPlaylist();
    res.json(response);
}); 

router.post('/skip', async function (req, res, next) {
    console.log('?')
    await videoService.proximoVideo();
    res.json(); 
});

router.delete('/listar/:id', async function (req, res, next) {
    await db.deletarVideo(req.params.id);
    res.send(req.params) 
}); 

router.put('/tocando', async function (req, res, next) {
    await db.updateTocando(req.body);
    res.json(); 
});
module.exports = router;