import crypto from "crypto";

const genereChaineAleatoire = (longueur => {
    return crypto.randomBytes(Math.ceil(longueur/2))
        .toString('hex')
        .slice(0,longueur);
});


const sha512 = (motDePasse, salt) =>{
    const hash = crypto.createHmac('sha512', salt);
    hash.update(motDePasse);
    var valeurHashee = hash.digest('hex');
    return {
        Grain:salt,
        motDePasseHash:valeurHashee
    };
};

console.log(genereChaineAleatoire(128))
export {genereChaineAleatoire}
export {sha512}