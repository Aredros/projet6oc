const express = require("express");
const router = express.Router();

// Middleware qui gère des autorisations sur notre app.
const multer = require("../middleware/multer-config");

// Import du controller pour faire le lien avec l'appel de route.
const sauceCtrl = require("../controllers/sauce");
const likeCtrl = require("../controllers/like");
const auth = require('../middleware/auth');
//* const modifySauceCtrl = require("../controllers/modifySauce");

// Route qui permet de créer "une sauce"
router.post("/", auth, multer, sauceCtrl.createSauce);
// Route qui permet de modifier "une sauce"
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
// Route qui permet de supprimer "une sauce"
router.delete("/:id", auth, sauceCtrl.deleteSauce);
// Renvoie la sauce avec l'ID fourni
router.get("/:id", auth, sauceCtrl.getOneSauce);
// Route qui permet de récupérer toutes les sauces
router.get('/', auth, sauceCtrl.getAllSauces);
// Route qui permet de gérer les likes des sauces
router.post("/:id/like", auth, sauceCtrl.likeDislike);


// Permet d'utiliser sauce.js du répertoire routes.dans app.js à la base du projet.
module.exports = router;