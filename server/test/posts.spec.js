import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;

describe('POST red-flags requests', () => {
  it('should add a new red flag record if details are correct', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .send({
        type: 'red-flag',
        latitude: '6.5951139',
        longitude: '3.3429975',
        comment: 'Extortion at the embassy',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.be.equal(201);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('array');
        done(err);
      });
  });

  it('should return an error if no input is supplied', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal(406);
        done(err);
      });
  });

  it('should return an error if record type is empty', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .send({
        type: '',
        latitude: '6.5951139',
        longitude: '3.3429975',
        comment: 'Extortion at the embassy',
      })
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal(406);
        done(err);
      });
  });

  it('should return an error if record type is not red-flag or intervention', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .send({
        type: 'gyhyr',
        latitude: '6.5951139',
        longitude: '3.3429975',
        comment: 'Extortion at the embassy',
      })
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal(406);
        done(err);
      });
  });

  it('should return an error if latitude is empty', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .send({
        type: 'red-flag',
        latitude: '',
        longitude: '3.3429975',
        comment: 'Extortion at the embassy',
      })
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal(406);
        done(err);
      });
  });

  it('should return an error if latitude is invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .send({
        type: 'red-flag',
        latitude: 'ghyshh',
        longitude: 'invalid',
        comment: 'Extortion at the embassy',
      })
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal(406);
        done(err);
      });
  });

  it('should return an error if longitude is empty', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .send({
        type: 'red-flag',
        latitude: '6.5951139',
        longitude: '',
        comment: 'Extortion at the embassy',
      })
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal(406);
        done(err);
      });
  });

  it('should return an error if longitude is invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .send({
        type: 'red-flag',
        latitude: '6.5951139',
        longitude: 'ghjjs',
        comment: 'Extortion at the embassy',
      })
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal(406);
        done(err);
      });
  });

  it('should return an error if comment is less than 20 characters', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .send({
        type: 'red-flag',
        latitude: '6.5951139',
        longitude: '3.3429975',
        comment: 'A short comment',
      })
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal(406);
        done(err);
      });
  });

  it('should return an error if comment is empty', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .send({
        type: 'red-flag',
        latitude: '6.5951139',
        longitude: '3.3429975',
        comment: '',
      })
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal(406);
        done(err);
      });
  });
});

describe('GET red-flag requests', () => {
  it('should retrieve the list of all the red-flags', (done) => {
    chai
      .request(app)
      .get('/api/v1/red-flags')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('array');
        done(err);
      });
  });

  it('should retrieve the specific red-flag with given id', (done) => {
    chai
      .request(app)
      .get('/api/v1/red-flags/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('array');
        done(err);
      });
  });

  it('should return an error if red-flag does not exist', (done) => {
    chai
      .request(app)
      .get('/api/v1/red-flags/10')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(404);
        done(err);
      });
  });

  it('should return an error if red-flag id is invalid', (done) => {
    chai
      .request(app)
      .get('/api/v1/red-flags/ty')
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal(406);
        done(err);
      });
  });
});

describe('PATCH red-flag requests', () => {
  it('should update the location of the red flag resource with the given id', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/3/location')
      .send({ latitude: '6.5922139', longitude: '3.3427375' })
      .end((err, res) => {
        expect(res).to.has.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0].id).to.be.equal(3);
        done(err);
      });
  });

  it('should return an error if the id format of the red flag resource is invalid', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/fghsys/location')
      .send({ latitude: '6.5922139', longitude: '3.3427375' })
      .end((err, res) => {
        expect(res).to.has.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.be.equal(406);
        done(err);
      });
  });

  it('should return an error if the id of the red flag resource does not exist', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/10/location')
      .send({ latitude: '6.5922139', longitude: '3.3427375' })
      .end((err, res) => {
        expect(res).to.has.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.be.equal(404);
        done(err);
      });
  });

  it('should return an error if the request body is empty', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/3/location')
      .send({})
      .end((err, res) => {
        expect(res).to.has.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.be.equal(406);
        done(err);
      });
  });

  it('should return an error if the longitude of the red flag resource is empty', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/3/location')
      .send({ latitude: '6.5922139', longitude: '' })
      .end((err, res) => {
        expect(res).to.has.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.be.equal(406);
        done(err);
      });
  });

  it('should return an error if the longitude of the red flag resource is invalid', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/3/location')
      .send({ latitude: '6.5922139', longitude: 'gt6wgw' })
      .end((err, res) => {
        expect(res).to.has.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.be.equal(406);
        done(err);
      });
  });

  it('should return an error if the latitude of the red flag resource is empty', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/3/location')
      .send({ latitude: '', longitude: '3.3427375' })
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal(406);
        done(err);
      });
  });

  it('should return an error if the latitude of the red flag resource is invalid', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/3/location')
      .send({ latitide: 'gushs', longitude: '3.3427375' })
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal(406);
        done(err);
      });
  });

  it('should update the comment of the red flag resource with the given id', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/3/comment')
      .send({ comment: 'Bribery and extortion by the NPF' })
      .end((err, res) => {
        expect(res).to.has.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0].id).to.be.equal(3);
        done(err);
      });
  });

  it('should return an error if the comment of the red flag resource is empty', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/3/comment')
      .send({ comment: '' })
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal(406);
        done(err);
      });
  });

  it('should return an error if comment is less than 20 characters', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .send({
        type: 'red-flag',
        latitude: '6.5951139',
        longitude: '3.3429975',
        comment: 'A short comment',
      })
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal(406);
        done(err);
      });
  });
});

describe('DELETE red-flags request', () => {
  it('should delete a red-flag resource with the specified id', (done) => {
    chai
      .request(app)
      .delete('/api/v1/red-flags/3')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0].id).to.be.equal(3);
        done(err);
      });
  });

  it('should return an error if the id of the red flag resource is invalid', (done) => {
    chai
      .request(app)
      .delete('/api/v1/red-flags/fgtre')
      .end((err, res) => {
        expect(res).to.has.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.be.equal(406);
        done(err);
      });
  });

  it('should return an error if the id of the red flag resource does not exist', (done) => {
    chai
      .request(app)
      .delete('/api/v1/red-flags/10')
      .end((err, res) => {
        expect(res).to.has.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.be.equal(404);
        done(err);
      });
  });
});
