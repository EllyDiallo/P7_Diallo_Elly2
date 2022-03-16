const express = require('express');
const server = express();

server.use(express.json());

const PORT = 8080;

server.get('/', function(req, res){
    res.setHeader('content-type', 'text/html');
    res.status(200).send('<h1>Bonjour server bus</h1>');
});

server.listen(PORT, function(){
    console.log('server lisening ' + PORT);
})