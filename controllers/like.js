const Sauce = require("../models/Sauce");

exports.userLikeOrDislikeSauce = (req, res) => {
  const sauce = Sauce.findByIdAndUpdate(req.params.id);
  sauce.then((s) => {
    switch (req.body.like) {
      case 1:
        if (!s.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: s.id },
            {
              likes: s.likes + 1,
              $push: { usersLiked: req.body.userId },
            }
          )

            .then(() => res.status(200).json(s))
            .catch((error) => {
              console.log(error);
              return res.status(400).json({ error })
            });
          console.log("J'aime cette sauce!");
        } else {
          Sauce.updateOne()
            .then((sauces) => res.status(200).json(sauces))
            .catch((error) => {
              console.log(error);
              return res.status(400).json({ error })
            });
          console.log("J'ai déjà donné mon avis sur cette sauce, je l'aime.");
        }
        break;

      case -1:
        if (!s.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: s.id },
            {
              dislikes: s.dislikes + 1,
              $push: { usersDisliked: req.body.userId },
            }
          )
            .then((s) => res.status(200).json(s))
            .catch((error) => {
              console.log(error);
              return res.status(400).json({ error })
            });
          console.log("J'aime pas cette sauce");
        } else {
          Sauce.updateOne()
            .then((sauces) => res.status(200).json(sauces))
            .catch((error) => {
              console.log(error);
              return res.status(400).json({ error })
            });
          console.log(
            "J'ai déjà donné mon avis sur cette sauce, je ne l'aime pas."
          );
        }
        break;

      case 0:
        let update = {};
        if (s.usersLiked.includes(req.body.userId)) {
          update = {
            likes: s.likes - 1,
            $pull: { usersLiked: req.body.userId },
          };
        } else {
          update = {
            dislikes: s.dislikes - 1,
            $pull: { usersDisliked: req.body.userId },
          };
        }
        Sauce.updateOne({ _id: s.id }, update)
          .then(() => res.status(200).json(s))
          .catch((error) => {
            console.log(error);
            return res.status(400).json({ error })
          });
        console.log("Neutre");
        break;
    }
  });
};
/* 
- récupérer la sauce qui m'intéresse
- si l'utilisateur a liké
  - vérifier s'il est déjà dans la liste des usersLike
    - si non, l'y ajouter et faire +1 à likes
    - si oui, ne rien faire
  - vérifier s'il est déjà dans la liste des usersDislike
    - si oui, l'y retirer et faire -1 à dislikes
    - si non, ne rien faire
- si l'utilisateur a dislike 
  - vérifier s'il est déjà dans la liste des usersDislike
    - si non, l'y ajouter et faire +1 à dislikes
    - si oui, ne rien faire
  - vérifier s'il est déjà dans la liste des usersLike
    - si oui, l'y retirer et faire -1 à likes
    - si non, ne rien faire
- si l'utilisateur a annulé (0)
  - vérifier s'il est déjà dans la liste des usersLike
    - si oui, l'y retirer et faire -1 à likes
  - vérifier s'il est déjà dans la liste des usersDislike
    - si oui, l'y retirer et faire -1 à dislikes
- sauvegarder la sauce
*/