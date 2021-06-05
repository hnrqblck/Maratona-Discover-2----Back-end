const express = require('express'); // express é uma biblioteca pra criar o servidor
const routes = express(); // routes é uma parte do express, uma rota, que vai criar o caminho

const views = __dirname + "/views/";

const Profile = {
    data: {
        name: "Gita",
        avatar: "https://github.com/hnrqblck.png",
        "monthly-budget": 3500, //em nome e avatar não foi necessário escrever entre aspas por serem palavras sós, mas para monthly-budget é importante
        "days-per-week": 5,
        "hours-per-day": 7,
        "vacation-per-year": 4,
        "value-hour": 75
    },
    controllers: {
        index(req, res) {
            return res.render(views + "profile", { profile: Profile.data });
        },

        update(req, res) {
            // req.body para pegar os dados
            const data = req.body;

            // definitir quantas semanas tem num ano: 52
            const weeksPerYear = 52;

            // remover as semanas de férias do ano, para pegar quantas semanas tem 1 mês
            const weeksPerMonth = (weeksPerYear - data["vacation-per-year"] ) / 12;

            // quantas horas por semana estou trabalhando
            const weekTotalHours = data["hours-per-day"] * data["days-per-week"];

            // total de horas trabalhadas no mês
            const monthlyTotalHours = weekTotalHours * weeksPerMonth;

            // qual será o valor da minha hora?
            const valueHour = data["monthly-budget"] / monthlyTotalHours;

            Profile.data = {
                ...Profile.data,
                ...req.body,
                "value-hour": valueHour
            }

            return res.redirect('/profile');
        }
    }
};

const Job = {
    data: [
        {
            id: 1,
            name: "Pizzaria Guloso",
            "daily-hours": 2,
            "total-hours": 1,
            created_at: Date.now(),
        },
        {
            id: 2,
            name: "OneTwo Project",
            "daily-hours": 3,
            "total-hours": 47,
            created_at: Date.now(),
        }
    ],

    controllers: {
        index(req, res) {
            const updatedJobs = Job.data.map(job => {
                // ajustes no job
                const remaining = Job.services.remainingDays(job);
                const status = remaining <= 0 ? 'done' : 'progress'
        
                return {
                    ...job,
                    remaining,
                    status,
                    budget: Job.services.calculateBudget(job, Profile.data["value-hour"])
                };
            });
            
            return res.render(views + "index", { jobs: updatedJobs });
        },

        create(req, res) {
            return res.render(views + "job");
        },

        save(req, res) {
            //req.body = { name: 'henrique', 'daily-hours': '5', 'total-hours': '55' }
            const lastId= Job.data[Job.data.length - 1]?.id || 1; // if [jobs.length - 1] = -1 (error) goes to '1'.

            Job.data.push({
                id: lastId + 1,
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                created_at: Date.now() //atribuindo data de hoje
            });
            return res.redirect('/');
        },

        show(req, res) {

            const jobId = req.params.id;
            const job = Job.data.find(job => Number(job.id) === Number(jobId)); // Quando o find acha um objeto verdadeiro ele pega o objeto do momento e coloca onde quero colocar, nesse caso na constante 'job'

            if(!job) {
                return res.send('Job not found!');
            }

            job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"]);

            return res.render(views + "job-edit", { job });
        }
    },

    services: {
        remainingDays(job) {
            // calculo de tempo restante
            const remainingDays = job["total-hours"] / job['daily-hours'].toFixed();
        
            const createdDate = new Date(job.created_at)
            const dueDay = createdDate.getDate() + Number(remainingDays);
            const dueDateInMs = createdDate.setDate(dueDay);
            
            const timeDiffInMs = dueDateInMs - Date.now();
            // transformar milli em dias
            const dayInMs = 1000 * 60 * 60 * 24;
            const dayDiff = Math.floor(timeDiffInMs / dayInMs)
        
            return dayDiff;
        },

        calculateBudget: (job, valueHour) => valueHour * job["total-hours"],
    }
}

//request, response
routes.get('/', Job.controllers.index);
routes.get('/job', Job.controllers.create);
routes.post('/job', Job.controllers.save);
routes.get('/job/:id', Job.controllers.show);
routes.get('/profile', Profile.controllers.index);
routes.post('/profile', Profile.controllers.update);

module.exports = routes;