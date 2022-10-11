const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const toobusy = require('toobusy-js')

// Fonction pour créer un utilisateur avec un mot de passe chiffré|Hashé à l'aide de bcrypt.
exports.signup = (req, res, next) => {
  if (toobusy()) {
    res.send(503, "I'm busy right now, sorry.");
  } else {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => {
          console.log(error);
          return res.status(400).json({ error })
        })
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ error })
    });
  }
};

// Fonction qui permet la connexion sur notre application, elle verifie en premier si l'utilisateur existe.
exports.login = (req, res, next) => {
  if (toobusy()) {
    res.send(503, "I'm busy right now, sorry.");
  } else {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt 
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).json({ error })
        });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ error })
    });
  }
};