
// EXPRESS
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// KNEX
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.NODE_PORT || 3000);
app.use(bodyParser.json());
app.use(express.static('public'));

// HOUSE endpoints
app.get('/api/v1/houses', (request, response) => {
  database('houses').select()
    .then((houses) => {
      response.status(200).json(houses);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/houses/:id', (request, response) => {
  const houseID = request.params.id;

  database('houses').select()
    .then((houses) => {
      response.status(200).json(houses);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/houses', (request, response) => {
  const house = request.body;

  for (let requiredParameter of ['address', 'built']) {
      if (!house[requiredParameter]) {
        return response
          .status(422)
          .send({ error: `Expected format: { address: <String>, built: <Number> }. You're missing a "${requiredParameter}" property.` });
      }
    }

    database('houses').insert(house, 'id')
      .then(house => {
        response.status(201).json({ id: house[0] })
      })
      .catch(error => {
        response.status(500).json({ error });
      });
})

// GHOST endpoints
app.get('/api/v1/ghosts', (request, response) => {
  database('ghosts').select()
    .then((ghosts) => {
      response.status(200).json(ghosts);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/ghosts/:house_id', (request, response) => {
  const houseID = request.params.house_id;

  database('ghosts').where('house_id', houseID).select()
    .then(ghosts => {
      if (ghosts.length) {
        return response.status(200).json(ghosts);
      } else {
        return response.status(404).send({ error: `Unable to find any ghosts with a house_id of ${houseID}.` })
      }
    })
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

app.post('/api/v1/ghosts', (request, response) => {
  const ghost = request.body;

  for (let requiredParameter of ['name', 'type', 'house_id']) {
      if (!ghost[requiredParameter]) {
        return response
          .status(422)
          .send({ error: `Expected format: { name: <String>, type: <String>, house_id: <Number> }. You're missing a "${requiredParameter}" property.` });
      }
    }

    database('ghosts').insert(ghost, 'id')
      .then(ghost => {
        response.status(201).json({ id: ghost[0] })
      })
      .catch(error => {
        response.status(500).json({ error });
      });
})

app.listen(app.get('port'), () => console.log(`You are listening on ${app.get('port')}`));

module.exports = app;
