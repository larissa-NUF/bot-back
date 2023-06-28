const express = require('express'); //import express
const db = require('./repository/db');

const router  = express.Router(); 

router.post('/listar', async function (req, res, next) {
    var listar = await db.listarVideos();
    res.json(listar); // dummy function for now
}); 

router.delete('/listar/:id', async function (req, res, next) {
    await db.deletarVideo(req.params.id);
    res.send(req.params)
}); 

module.exports = router;