import {listEleve} from "./sources/eleve.mjs";
import {createRequire} from "module";

const require = createRequire(import.meta.url);
const express = require('express');
const app = express();

app.get('/api/listeleves', (req, res)=> {
    const listeParcielle = listEleve.map(eleve=>{
        return{Eleve: eleve.nom, Prenom: eleve.prenom, Age: eleve.age}
    })
    res.json(listeParcielle)
})

app.get('/api/listeleves/:findEleve', (req, res) => {
    const found = req.params.findEleve;
    console.log(found)
    const eleve = listEleve.find((elementTableau) => elementTableau.nom === found)

    if (eleve) {
        res.send("Bonjour " + eleve.nom + " vous avez " + eleve.age + " ans")
    } else {
        res.send("Bonjour mr ou mme votre recherche n'existe pas")
    }
    console.log(eleve);
});

app.get('/api/listeleves/:nomEleve/:prenomEleve', (req, res) => {
    const nom = req.params.nomEleve;
    const prenom = req.params.prenomEleve;
    console.log(nom, prenom)
    const eleve = listEleve.find((elementTableau) => elementTableau.nom === nom &&  elementTableau.prenom === prenom)

    if (eleve) {
        res.send("Bonjour " + eleve.nom + " " + eleve.prenom + " vous avez " + eleve.age + " ans")
    } else {
        res.send("ERROR 404")
    }
    console.log(eleve);
});

app.listen(3001, () => {
    console.log('Le server est en écoute sur http://localhost:3001/')
});