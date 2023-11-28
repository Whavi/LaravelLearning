import {verifPassword} from "../sources/verifPassword.mjs"
import assert from "assert";

it('Mot de passe (chiffre + majuscule + minuscule +  longueur >= 12)',()=> {
    assert.equal(verifPassword("Quoicoubeh12"),6,"Pas bon résultat")
})

it('Mot de passe (chiffre + minuscule + longueur >= 12)',()=> {
    assert.equal(verifPassword("quoicoubeh12"),4,"Pas bon résultat")
})

it('Mot de passe (chiffre + minuscule + longueur >= 12 + capac spé)',()=> {
    assert.equal(verifPassword("quoicoubeh12@"),8,"Pas bon résultat")
})

it('Mot de passe (chiffre + majuscule + minuscule +  longueur >= 12 + capac spé)',()=> {
    assert.equal(verifPassword("Quoicoubeh12@"),10,"Pas bon résultat")
})

it('Mot de passe (majuscule + minuscule + longueur >= 8)',()=> {
    assert.equal(verifPassword("Quoicoubeh"),0,"Pas bon résultat")
})

it('Mot de passe (majuscule + minuscule + longueur < 8)',()=> {
    assert.equal(verifPassword("Quoico1"),0,"Pas bon résultat")
})
