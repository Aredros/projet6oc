const Sauce = require("../models/Sauce");
const fs = require("fs");

// Permet de créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${
			req.file.filename
		}`,
		likes: 0,
		dislikes: 0,
		usersLiked: [],
		usersDisliked: [],
	});
	// Sauvegarde de la sauce dans la base de données
	sauce
		.save()
		.then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => {
      console.log(error);
      return res.status(400).json({ error })
    });
};

//  Modification de la sauce.
exports.modifySauce = (req, res) => {
  let sauceObject;
  if (req.file) {
    sauceObject = {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    };
  } else {
    sauceObject = { ...req.body };
  }
  // On peut mettre à jour une sauce si les éléments de la réponse locals.userId sont strictement identique à la valeur de la requete sur l'userId également.
  Sauce.updateOne(
    { _id: req.params.id, userId: sauceObject.userId },
    { ...sauceObject }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => {
      console.log(error);
      return res.status(400).json({ error })
    });
  console.log("ça passe");
};

// Suppression de la sauce.
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) // on identifie la sauce
    .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1]; // on récupère l'adresse de l'image
    fs.unlink(`images/${filename}`, () => { /// on la supprime du serveur
    Sauce.deleteOne({_id: req.params.id}) // on supprime la sauce de la bdd
    .then(()=> res.status(200).json({ message: 'Sauce deleted'}))
    .catch(error => res.status(400).json({ error}))
    });
})
};

// Afficher le détail d'une sauce.
exports.getOneSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) =>
    res.status(200).json(sauce)
  );
};

// Afficher toutes les sauces.
// Permet de récuperer toutes les sauces de la base MongoDB
exports.getAllSauces = (req, res, next) => {
	 Sauce.find()
		.then((sauces) => res.status(200).json(sauces))
		.catch((error) => res.status(400).json({ error }));
};

// Permet de "liker"ou "disliker" une sauce
exports.likeDislike = (req, res, next) => {
	let like = req.body.like;
	let userId = req.body.userId;
	let sauceId = req.params.id;

	if (like === 1) {
		Sauce.updateOne(
			{
				_id: sauceId,
			},
			{
				$push: {
					usersLiked: userId,
				},
				$inc: {
					likes: +1,
				},
			}
		)
			.then(() =>
				res.status(200).json({
					message: "j'aime ajouté !",
				})
			)
			.catch((error) =>
				res.status(400).json({
					error,
				})
			);
	}
	if (like === -1) {
		Sauce.updateOne(
			{
				_id: sauceId,
			},
			{
				$push: {
					usersDisliked: userId,
				},
				$inc: {
					dislikes: +1,
				},
			}
		)
			.then(() => {
				res.status(200).json({
					message: "Dislike ajouté !",
				});
			})
			.catch((error) =>
				res.status(400).json({
					error,
				})
			);
	}
	if (like === 0) {
		Sauce.findOne({
			_id: sauceId,
		})
			.then((sauce) => {
				if (sauce.usersLiked.includes(userId)) {
					Sauce.updateOne(
						{
							_id: sauceId,
						},
						{
							$pull: {
								usersLiked: userId,
							},
							$inc: {
								likes: -1,
							},
						}
					)
						.then(() =>
							res.status(200).json({
								message: "Like retiré !",
							})
						)
						.catch((error) =>
							res.status(400).json({
								error,
							})
						);
				}
				if (sauce.usersDisliked.includes(userId)) {
					Sauce.updateOne(
						{
							_id: sauceId,
						},
						{
							$pull: {
								usersDisliked: userId,
							},
							$inc: {
								dislikes: -1,
							},
						}
					)
						.then(() =>
							res.status(200).json({
								message: "Dislike retiré !",
							})
						)
						.catch((error) =>
							res.status(400).json({
								error,
							})
						);
				}
			})
			.catch((error) =>
				res.status(404).json({
					error,
				})
			);
	}
};