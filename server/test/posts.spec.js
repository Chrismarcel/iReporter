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
        location: '6.5951139, 3.3429975',
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
        location: '6.5951139, 3.3429975',
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

  it('should return an error if location is empty', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .send({
        type: 'red-flag',
        location: '',
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

  it('should return an error if comment is empty', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .send({
        type: 'red-flag',
        location: '6.5951139, 3.3429975',
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
      .patch('/api/v1/red-flags/3')
      .send({ location: '6.5922139, 3.3427375' })
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

  it('should return an error if the location of the red flag resource is empty', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/3')
      .send({ location: '' })
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
      .patch('/api/v1/red-flags/3')
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
      .patch('/api/v1/red-flags/3')
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

  it('should return an error if the red flag id is invalid', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/ty')
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
});

describe('DELETE red-flags request', () => {
  it('should delete a red-flag resource with the specified id', (done) => {
    chai
      .request(app)
      .delete('/api/v1/red-flags/3')
      .end((err, res) => {
        expect(res).to.have.status(204);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0].id).to.be.equal(3);
        done(err);
      });
  });
});
