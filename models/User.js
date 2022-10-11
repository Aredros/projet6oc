const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  // On rend l'email sensible à l'écriture afin d'exclure des doublons avec une même adresse en majuscule et minuscle.
  password: { type: String, required: true },
});

// Plugin qui assure que l'utilisateur est unique au sein de la base de données.
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);