const express = require("express");
const server = express(); // pesquisar o motivo de ter que fazer duas consts
const routes = require("./routes"); // ao se ligar ao module.exports no arquivo "routes.js" o require lança o arquivo para a const routes

server.set('view engine' , 'ejs');

//habilitar arquivos statics
server.use(express.static("public"));

// usar o req.body
server.use(express.urlencoded({ extended: true}))

// routes
server.use(routes);




//request, response
/*server.get('/', (request, response) => {
    return response.sendFile(__dirname + "/views/index.html");
});*/ // quando você fizer um um get /(barra) execute uma função 


server.listen(3000, () => console.log('rodando')); // o primeiro argumento faz abrir na porta 3000 e o segundo faz rodar a função com a linha console.log