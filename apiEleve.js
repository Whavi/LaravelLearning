import { createRequire } from "module";
import {listEleve} from "./sources/eleve.mjs";

const require = createRequire(import.meta.url);
const express = require('express');
const app = express();


app.get("/api/:eleve",(req,res) => {
    res.send("")
})



app.listen(3003, () => {
    console.log('Le server est en écoute sur http://localhost:3003/')
});

