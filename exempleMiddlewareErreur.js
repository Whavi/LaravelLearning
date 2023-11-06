import { createRequire } from "module";             // Nécessaire pour import ES6 versus require (CommonJS)
const require = createRequire(import.meta.url);    // Nécessaire pour import ES6 versus require (CommonJS)

const express = require('express')
const axios = require("axios")

const app = express()
const PORT = 3000

// Fonction de middleware d'erreur pour envoyer un message
const erreurLogging = (erreur, requete, reponse, suivant) => {
    console.log( `Erreur: ${erreur.message}`)
    suivant(erreur) // on appelle le middleware d'erreur suivant
}

// Fonction de middleware d'erreur qui récupère le message
// et le renvoie vers le navigateur au format JSON
const erreurReponse = (erreur, requete, reponse, suivant) => {
    reponse.header("Content-Type", 'application/json')

    // Si le status de l'erreur est défini on le récupère
    // Sinon on le valorise à 400
    const status = erreur.status || 400
    reponse.status(status).send(erreur.message)
    suivant(erreur)
}

// Middleware function qui renvoie
// une erreur 404 lorsqu'une URL demandée ne correspond à aucune route définie
const invalidPathHandler = (requete, reponse, suivant) => {
    reponse.status(404)
    reponse.send('URL demandée invalide')
}

// Route de test qui renvoie une Error
// construite dans la fonction
app.get('/eleveserreur', (requete, reponse) => {
    let error = new Error(`Traitement d'une erreur dans la requete a l'adresse ${requete.url}`)
    error.statusCode = 400
    throw error
})

// Dans cette application exempleMiddlewareErreur nous construisons une route
// qui va  aller chercher des données dans une API, en l'occurence celle que nous avons définie
app.get('/eleves', async (requete, reponse, next) => {
    try{
        const apiResponse = await axios.get("http://localhost:3003/api/leseleves")
        const jsonResponse = apiResponse.data

        reponse.send(jsonResponse)
    }catch(error){
        next(error) // On appelle le middleware de gestion des erreurs suivant
    }

})

// On attache le premier middleware d'erreur
// celui qui logge des messages et les envoie
app.use(erreurLogging)

// On attache le second middleware d'erreur
// la fonction qui récupère le message et l'envoie
// au format JSON
app.use(erreurReponse)

// On attache le middleware par défaut
// qui va intervenir pour les mauvaises URL qui ne
// correspondent à aucune route définie
app.use(invalidPathHandler)

app.listen(PORT, () => {
    console.log(`L'application d'exemple de Middleware tourne sur http://localhost:${PORT}`)
})