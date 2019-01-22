const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const DB_TASKS_LIST = './data/db.json';

const app = express();

app.use( express.static('./public/front') );
app.use( bodyParser.json() );       // To co bedzie w req.body jest juz rozkodowane z json. Wyslanie zakodowanego json automatycznie odbywa sie przez res.json()

//---
app.get('/test', (req, res) => {

    fs.readFile(DB_TASKS_LIST, (err, data) => {

        if (!err) {
            res.send(JSON.parse(data));
        } else {
            res.send(err);
        }

    });

});

app.get('/list', (req, res) => {

    fs.readFile(DB_TASKS_LIST, 'utf8', (err, data) => {     // Bez utf8 - Przesyla buffer do fronta

        if (!err) {
            res.json(data);                                 // Ciekawe roznice w .send() a .json()
        } else {
            res.send(err);
        }

    });

});

app.post('/add', (req, res) => {

    const { name, complete } = req.body;

    fs.readFile(DB_TASKS_LIST, 'utf8', (err, data) => {

        if (!err) {
            let fromJson = JSON.parse(data);
            fromJson.push({ name, complete });
            let toJson = JSON.stringify(fromJson);

            fs.writeFile(DB_TASKS_LIST, toJson, (err, data) => {

                if (!err) {
                    res.json(toJson);
                } else {
                    console.log('Blad zapisu do pliku db.json', err);
                    res.send(err);
                }
            });

        } else {
            console.log('Blad odczytu pliku db.json', err);
            res.send(err);
        }
    });

});

app.get('/list/:id', (req, res) => {

    fs.readFile(DB_TASKS_LIST, (err, data) => {

        if (!err) {
            res.send(JSON.parse(data)[req.params.id]);
        } else {
            res.send(err);
        }

    });

});

//---
app.listen(3000, () => {
    console.log(`Serwer uruchomiony na porcie 3000`);
});

