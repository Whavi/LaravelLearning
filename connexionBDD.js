import { createRequire } from "module";
import { fileURLToPath } from 'url';
import {sha512} from "./grain_de_sel.mjs";
import {genereChaineAleatoire} from "./grain_de_sel.mjs";


const require = createRequire(import.meta.url);
const path = require('path');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bodyParser = require('body-parser');
const mysql = require("mysql2/promise");
const express = require('express');
const app = express();
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const cookieParser = require('cookie-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'static')));


const connection = await mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'nodemysql'
})

let fileStoreOptions = {};
app.use(session({
    store: new FileStore(fileStoreOptions),
    name:'CookiePerout',
    secret:'Les SIO font toujours dodo',
    resave: false,
    saveUninitialized:false
}));

app.get('/compteur', (req, res)=> {
    let cpt = typeof  req.session.cpt==='undefined' ? req.session.cpt = 1 : req.session.cpt+=1;
    let logOrNot = req.session.loggedin===undefined ? false: req.session.loggedin;
    let sessionId = req.sessionID;
    let username = req.session.Login;
    res.send(`<h1> Bonjour les rigolos vous etes venus ${cpt} ${logOrNot}</h1>
              <br>
              <h1>Salut ${username} ton ID de Session Unique : ${sessionId}</h1>
              <h1><a href="/destroyLog">Quitter la session et aller en login</a></h1>
              <br><h1><a href="/destroy">Quitter la session et rester dans le compteur</a></h1>`)
    console.log(req.session.cookie)
})

app.get('/destroy', (req, res, err)=> {
    req.session.destroy((err) => {
        res.redirect('/compteur') // will always fire after session is destroyed
    })
})

app.get('/destroyLog', (req, res, err)=> {
    req.session.destroy((err) => {
        res.redirect('/login') // will always fire after session is destroyed
    })
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
            console.log('Nom d\'utilisateur non trouvé')
            res.status(401).send('Login ou mdp invalide');
            return;
        }

        const grain = user[0].GrainDeSel;
        const sha = sha512(password, grain);

        if (sha.motDePasseHash === user[0].MotDePasse) {
            console.log("Ca marche, redirection...")
            req.session.loggedin = true;
            req.session.Login = username;
            res.redirect('/compteur');
        } else {
            console.log("MDP Invalide...")
            //res.redirect('/login');
            res.status(401).send('Login ou mdp invalide');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Login ou mdp invalide');
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
    console.log('http://localhost:3000/form');
});
