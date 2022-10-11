const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");
const path = require("path");
var hpp = require('hpp');



// utilisation du module 'helmet' pour la sécurité en protégeant l'application de certaines vulnérabilités
// il sécurise nos requêtes HTTP, sécurise les en-têtes, contrôle la prélecture DNS du navigateur, empêche le détournement de clics
// et ajoute une protection XSS mineure et protège contre le reniflement de TYPE MIME
// cross-site scripting, sniffing et clickjacking
const helmet = require("helmet");
require('dotenv').config();


// Middleware qui gère des autorisations sur notre app.
const auth = require("./middleware/auth");

  //CORS
//? CORS signifie « Cross Origin Resource Sharing »
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//mongoose connect
mongoose
.connect(
  process.env.MOONGOSE_VALEUR,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


// Middleware qui permet de parser les requêtes envoyées par le client, on peut y accéder grâce à req.body
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

app.use(hpp());

// Transforme les données arrivant de la requête POST en un objet JSON facilement exploitable
app.use(bodyParser.json());



// On utilise helmet pour plusieurs raisons notamment la mise en place du X-XSS-Protection afin d'activer le filtre de script intersites(XSS) dans les navigateurs web
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

  app.use("/images", express.static(path.join(__dirname, "images")));
  app.use("/api/auth", userRoutes);
  app.use("/api/sauces", sauceRoutes); // Ajout de auth afin de ne pas l'écrire 10 fois dans la route sauce
/*pour l'accés aux images
app.use("/images", express.static(path.join(__dirname, "images")));

//l'authentification
app.use("/api/auth", userRoutes);

//les sauces
app.use("/api/sauces", sauceRoutes); */

module.exports = app; // export de l'appli