//manual server create
// const {createServer} = require('node:http');
// const hostname = '127.0.0.1';
// const port = 8000;

// const server = createServer((req,res)=>{
// console.log(req.url);
// res.statusCode =200;
// res.setHeader('Content-Type', 'text-plain');
// res.end('HelloWorld\n');
// })

// server.listen(port, hostname, ()=>{
//     console.log(`Server Running at http://${hostname}:${port}/`)
// })

//using library express

const express = require('express')
const connectDB = require('./db')
const config = require('./config')

const app = express()


const port= config.PORT
connectDB()
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/status', (req,res)=>{
    res.send('Test!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})