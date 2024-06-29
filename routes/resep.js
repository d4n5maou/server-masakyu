const express = require("express");
const {resepController} = require("../controller/resepController");
const authMiddleware = require("../middleware/authMiddleware");
const routeResep = express.Router();

//pakai middleware untuk akses
routeResep.use(authMiddleware.verifyToken);

routeResep.post('/create',resepController.createResep);
routeResep.get('/get',resepController.getAllResep);
routeResep.get('/get/:id',resepController.getResepById);
routeResep.get('/get/uid/:id_user',resepController.getResepByUserId);
routeResep.put('/edit/:id/:uid',resepController.updateResep);
routeResep.delete('/delete/:id/:uid',resepController.deleteResepById);
routeResep.get('/cari',resepController.cariResep);

module.exports = routeResep;