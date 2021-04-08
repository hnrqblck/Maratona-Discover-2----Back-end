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

const jobs = [
    {
        id: 1,
        name: "Pizzaria Guloso",
        "daily-hours": 2,
        "total-hours": 60,
        created_at: Date.now()
    },
    {
        id: 2,
        name: "OneTwo Project",
        "daily-hours": 3,
        "total-hours": 47,
        created_at: Date.now()
    }
];

//request, response
routes.get('/', (req, res) => res.render(views + "index", { jobs })); // função curta "arrow function"
routes.get('/job', (req, res) => res.render(views + "job"));
routes.post('/job', (req, res) => {
    //req.body = { name: 'henrique', 'daily-hours': '5', 'total-hours': '55' }
    const lastId= jobs[jobs.length - 1]?.id || 1; // if [jobs.length - 1] = -1 (erro) goes to '1'.

    jobs.push({
        id: lastId + 1,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        created_at: Date.now() //atribuindo data de hoje
    });
    return res.redirect('/');
});
routes.get('/job/edit', (req, res) => res.render(views + "job-edit"));
routes.get('/profile', (req, res) => res.render(views + "profile", { profile }));

module.exports = routes;