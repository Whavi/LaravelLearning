const http = require("http")
const hostname = '127.0.0.1'
const port = 3000

const server =
    http.createServer((requete, response) => {
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/plain')
    response.end('Coucou les gens, moi je mange la glace !')
})

server.listen(port, hostname, () => {
    console.log(`le serveur tourne sur mon poste: http://${hostname}:${port}/`)
})