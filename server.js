const express = require('express');
const app = express();

app.listen(3000);

//routes
var index      = require('./routes/index');


app.use('/', index);

app.on('error', function(err)
{
    console.log(err);
});

app.use((err, req, res, next) => {  
    log.error(err.stack);
    res.status(500).send('Error');  
});
  
app.use((req, res) => {
    res.status(404).send('Not Found');
});

module.exports = app;