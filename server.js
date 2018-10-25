var express = require('express');
var lyleController = require('./controllers/lyle-controller');

var app = express();
app.use(express.static('uploads/images'));

lyleController(app);

app.listen(3000);

console.log('Server is running');



