//Import
const express = require('express');
const server = express();
const apiRouter = require('./apiRouter').router;

//replace body-parser
server.use(express.urlencoded({
    extended: true
}));

const PORT = 8080;

server.get('/', function(req, res){
    res.setHeader('content-type', 'text/html');
    res.status(200).send('<h1>Bonjour server bus</h1>');
});

server.use('/api/',apiRouter);
server.listen(PORT, function(){
    console.log('server lisening ' + PORT);
})

