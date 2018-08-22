const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const configuration = require('../knexfile')['test'];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage', done => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.html;
      done();
    });
  });
});

describe('API Routes', () => {

  beforeEach(done => {
    database.migrate.rollback()
      .then(() => {
        database.migrate.latest()
          .then(() => {
            return database.seed.run()
              .then(() => {
                done();
              })
          })
      })
  });

  afterEach(done => {
    database.migrate.rollback()
      .then(() => {
        done();
      })
  });

  it('should GET the houses', done => {
    chai.request(server)
    .get('/api/v1/houses')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(3);
      response.body[0].should.have.property('address');
      response.body[0].address.should.equal('1975 Hacienda Pl, Stevensville, MI 49127');
      response.body[0].should.have.property('built');
      response.body[0].built.should.equal(1923);
      done();
    })
  });

  it('should GET the ghosts', done => {
    chai.request(server)
    .get('/api/v1/ghosts')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(7);
      response.body[0].should.have.property('name');
      response.body[0].name.should.equal('Old Mank');
      response.body[0].should.have.property('type');
      response.body[0].type.should.equal('ghost');
      response.body[0].should.have.property('house_id');
      response.body[0].house_id.should.equal(1);
      done();
    })
  });

  it('should GET the ghosts for a specific house', done => {
    chai.request(server)
    .get('/api/v1/ghosts/2')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(2);
      response.body[0].should.have.property('name');
      response.body[0].name.should.equal('Eliza');
      response.body[0].should.have.property('type');
      response.body[0].type.should.equal('ghost');
      response.body[0].should.have.property('house_id');
      response.body[0].house_id.should.equal(2);
      done();
    })
  });

  it('should fail to GET the ghosts for a house that does not exist', done => {
    chai.request(server)
    .get('/api/v1/ghosts/13')
    .end((err, response) => {
      response.should.have.status(404);
      response.should.be.json;
      response.body.should.have.property('error');
      response.body.error.should.equal('Unable to find any ghosts with a house_id of 13.');
      done();
    })
  });

  it('should POST a new house', done => {
    chai.request(server)
    .post('/api/v1/houses') // Notice the change in the verb
    .send({                   // Here is the information sent in the body or the request
      address: '1331 17th St, Denver, CO 80202',
      built: 1894
    })
    .end((err, response) => {
      response.should.have.status(201);
      response.body.should.be.a('object');
      response.body.should.have.property('id');
      response.body.id.should.equal(4);
      done();
    });
  });

  it('should fail to POST a new house', done => {
    chai.request(server)
    .post('/api/v1/houses') // Notice the change in the verb
    .send({                   // Here is the information sent in the body or the request
      address: '1331 17th St, Denver, CO 80202'
    })
    .end((err, response) => {
      response.should.have.status(422);
      response.body.should.be.a('object');
      response.body.should.have.property('error');
      response.body.error.should.equal('Expected format: { address: <String>, built: <Number> }. You\'re missing a "built" property.');
      done();
    });
  });

  it('should POST a new ghost', done => {
    chai.request(server)
    .post('/api/v1/ghosts') // Notice the change in the verb
    .send({                   // Here is the information sent in the body or the request
      name: 'Teddy',
      type: 'shadow',
      house_id: 1
    })
    .end((err, response) => {
      response.should.have.status(201);
      response.body.should.be.a('object');
      response.body.should.have.property('id');
      response.body.id.should.equal(8);
      done();
    });
  });

  it('should fail to POST a new ghost', done => {
    chai.request(server)
    .post('/api/v1/ghosts') // Notice the change in the verb
    .send({                   // Here is the information sent in the body or the request
      type: 'poltergeist',
      house_id: 1
    })
    .end((err, response) => {
      response.should.have.status(422);
      response.body.should.be.a('object');
      response.body.should.have.property('error');
      response.body.error.should.equal('Expected format: { name: <String>, type: <String>, house_id: <Number> }. You\'re missing a "name" property.');
      done();
    });
  });
});
