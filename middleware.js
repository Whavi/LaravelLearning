import { createRequire } from "module";             // Nécessaire pour import ES6 versus require (CommonJS)
const require = createRequire(import.meta.url);    // Nécessaire pour import ES6 versus require (CommonJS)

const express = require('express')
const app = express()
let compteur = 0;



app.use ((req, res, next) => {
    console.log('Time', Date.now())
    console.log("J’en ai marre d’être sollicité pour tout et pour rien pour la "+ compteur +" ème fois")
    next();
})

app.get('/accueil',    (requete, resultat,suivant) => {
        resultat.write('Accueil et on voudrait passer au suivant');
        resultat.end()
        suivant()
    }

)

app.get('/login',    (requete, resultat, suivant) => {
        resultat.write('Login et on voudrait passer au suivant');
        resultat.end()
    suivant()
    }
)

app.get('/bonjour',    (requete, resultat, suivant) => {
        resultat.write("Bonjour et on voudrait passer au suivant");
       // resultat.end()
        suivant()


})

app.get('/init',    (requete, resultat, suivant) => {
    compteur = 0
    resultat.write("compteur réinitialisé !")
    resultat.end()
    suivant()
})

app.get('/',    (requete, resultat, suivant) => {
    resultat.write("Ici c'est la racine et on voudrait passer au suivant");
    resultat.end()
    suivant()
})

app.get('/bonjour',    (requete, resultat, suivant) => {
    console.log("On dit bonjour dans la console en plus")
    resultat.write("\nEncore bonjour vraiment j'insiste et on veut passer au suivant")
    resultat.end()
    suivant()

})


app.use ((req, res, next) => {
    compteur++;
    next();
})


app.listen(3000, () => {
    console.log('Le server est en écoute sur http://localhost:3000/')
});

