import { createRequire } from "module";
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const path = require('path');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res)=> {
    res.send('Bonjour les SIO2 SLAM')
})

app.get('/accueil', (req, res)=> {
    res.send('Vous êtes arrivés sur la page d’accueil du site')
})

app.get('/bienvenue', (req, res)=> {
    res.sendFile(path.join(__dirname+ "public/bienvenue.html"))
})

app.get('/panorama', (req, res)=> {
    res.sendFile(path.join(__dirname+ "public/panorama.html"))
})

app.get('/exempleParam', (req, res)=> {
 const nomEtudiant = req.query.nomDuParamDansURL
 res.send('Bonjour mr ou mme '+nomEtudiant)
})

app.get('/exempleParam/:jesuisUnParam', (req, res)=> {
    const nomEtudiant = req.params.jesuisUnParam
    res.send('Bonjour mr ou mme '+nomEtudiant)
})

app.get('/nombre/:idNombre', (req, res)=> {
    const nombre = req.params.idNombre
    if (isNaN(nombre) ) {
    res.send('Bonjour mr ou mme votre nombre est erroné')
    }else{
        res.send('Bonjour mr ou mme votre nombre est : '+nombre)
}
})




app.post('/testPost'), (req, res)=>{
    let donneeRec = req.body;
    res.send('Donnée reçu '+ JSON.stringify(donneeRec));
}

app.get('/login', (req, res)=> {
    res.sendFile(path.join(__dirname + "/public/login.html"))
})

app.post('/login',( req, res)=>{
    const identification = req.body.pseudo;
    const motDePasse = req.body.motDePasse;
    const nomEleve = req.body.nom;
    const prenomEleve = req.body.prenom;
    if(identification === 'admin' && motDePasse ==='admin'){
        res.send("Bonjour l'administrateur");
    }else{
        res.send("Bonjour "+ nomEleve + " " + prenomEleve + " " + "votre identifiant est " +identification);
    }
})


    app.listen(3002, () => {
        console.log('Le server est en écoute sur http://localhost:3002/')
    });
