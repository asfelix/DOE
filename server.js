// configurando o servidor.
const express = require("express")
const server = express()

// configurar o servidor para apresentar arquivos estáticos
server.use(express.static("public"))

// habilitar body do formulário
server.use(express.urlencoded({ extended: true }))

// configurar conexão com banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: '',
    password: '!',
    host: '',
    port: 5432,
    database: ''
})

// configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

// configurar apresentação da página
server.get("/", function (req, res) {
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro de banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })
    
})

server.post("/", function (req, res) {
    // pegar dados do formulário
    const name = req.body.name
    const mail = req.body.mail
    const blood = req.body.blood

    if(name == "" || mail == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios")
    }

    // adicona vetores dentro do banco de dados
    const query = `
        INSERT INTO donors ("name", "mail", "blood")
        VALUES($1, $2, $3)`

    const values = [name, mail, blood]

    db.query(query, values, function(err){
        if (err) return res.send("erro no banco de dados.")

        return res.redirect("/")
    })
})

// ligar o servidor e permitir o acesso à porta 3000
server.listen(3000, function () {
    console.log("Iniciei o servidor")
})