const passwordValidator = require("password-validator");

const passwordSchema = new passwordValidator();

//Contraintes du mot de passe
passwordSchema
        .is().min(8) //Max lenght
        .has().uppercase()                              // Must have uppercase lette
        .has().lowercase()                              // Must have lowercase letter
        .has().digits(2)                                // Must have at least 2 digits
        .has().not().spaces()                           // Should not have spaces
        .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

module.exports = passwordSchema;