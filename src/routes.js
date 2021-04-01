const express = require('express'); // express é uma biblioteca pra criar o servidor
const routes = express(); // routes é uma parte do express, uma rota, que vai criar o caminho

const views = __dirname + "/views/";

const profile = {
    name: "Gita",
    avatar: "https://github.com/hnrqblck.png",
    "monthly-budget": 3000, //em nome e avatar não foi necessário escrever entre aspas por serem palavras sós, mas para monthly-budget é importante
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4
};

//request, response
routes.get('/', (req, res) => res.render(views + "index")); // função curta "arrow function"
routes.get('/job', (req, res) => res.render(views + "job"));
routes.get('/job/edit', (req, res) => res.render(views + "job-edit"));
routes.get('/profile', (req, res) => res.render(views + "profile", { profile }));

module.exports = routes;