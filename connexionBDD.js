import { createRequire } from "module";
import { fileURLToPath } from 'url';
import {sha512} from "./grain_de_sel.mjs";
import {genereChaineAleatoire} from "./grain_de_sel.mjs";


const require = createRequire(import.meta.url);
const argon2 = require('argon2');
const path = require('path');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bodyParser = require('body-parser');
const mysql = require("mysql2/promise");
const express = require('express');
const app = express();


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


const connection = await mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'nodemysql'
})


app.get('/', (req, res)=> {
    res.send('Accueil du site')
})

app.get("/formulaire",(req,res) =>{
    res.sendFile(path.join(__dirname+ "/public/form.html"))
})

app.get("/form",(req,res) =>{
    res.sendFile(path.join(__dirname+ "/public/formbdd.html"))
})

app.get("/login",async (req,res) =>{
    res.sendFile(path.join(__dirname+ "/public/loginbdd.html"))
})


app.post("/login", async ( req, res)=>{
    const username = req.body.Login;
    const password = req.body.motDePasse;


    try {
        const [user] = await connection.query('SELECT * FROM inscription WHERE login = ?', [username]);
        if (user.length === 0) {
            res.status(401).send('Nom d\'utilisateur non trouvé');
            return;
        }

        const grain = user[0].GrainDeSel;
        const sha = sha512(password, grain);

        if (sha.motDePasseHash === user[0].MotDePasse) {
            console.log("Ca marche, redirection...")
            res.redirect('/');
        } else {
            console.log("MDP Invalide...")
            res.redirect('/login');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur.');
    }
});



app.post('/save', async ( req, res)=>{
    //insertion d'une donnée
    let grain=genereChaineAleatoire(200);
    let sha = sha512(req.body.motDePasse, grain);

    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();


    const data={
        email: req.body.email,
        Login: req.body.Login,
        Telephone: req.body.Tel,
        motDePasse: sha.motDePasseHash,
        GrainDeSel: sha.Grain,
        created_at: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds

    };

   // var sql=`INSERT INTO inscription (email, Login, Tel, motDePasse) VALUES (?, ?, ?, ?)`;
    let sql=`INSERT INTO inscription SET ? `;

    let query = await connection.query(sql, data, err => {
        if (err) {
            console.error('Échec de l\'enregistrement dans la base de données :', err);
            res.status(500).send('Erreur lors de l\'enregistrement dans la base de données');
        }})
    console.log('Enregistrement effectué avec succès');
    res.redirect('/login');
});


app.listen(3000,()=>{
    console.log('http://localhost:3000/login');
});
