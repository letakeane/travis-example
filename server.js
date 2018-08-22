const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('port', process.env.NODE_PORT || 3000);
app.use(bodyParser);
app.use('public');

app.get('/api/v1/ghosts', () => {
  
})

app.listen(app.get('port'), () => console.log(`You are listening on ${app.get('port')}`))
