// import exppress from 'express';

const exppress = require('express');

const app = exppress();

app.use(() => {
    console.log("Hello Server...");
    console.log("Hello Server 2 ");
})

app.listen(4000);