import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import postDb from '../models/posts';

chai.use(chaiHttp);
const { expect } = chai;

let currentToken;

describe('POST red-flags requests', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'demouser@email.com', password: 12345678 })
      .end((err, res) => {
        currentToken = res.body.data[0].token;
        done(err);
      });
  });

  it('should add a new record if details are correct', (done) => {
    const incident = {
      type: 'red-flag',
      latitude: '6.5951139',
      longitude: '3.3429975',
      comment: 'Extortion at the embassy',
    };
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .set('authorization', `Bearer ${currentToken}`)
      .send(incident)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.status).to.be.equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.deep.equal([
          {
            id: res.body.data[0].id,
            message: 'Created red-flag record',
            incident,
          },
        ]);
        done(err);
      });
  });

  it('should return an error if no authorization token was specified', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .set('authorization', '')
      .send({
        type: 'red-flag',
        latitude: '6.5951139',
        longitude: '3.3429975',
        comment: 'Extortion at the embassy',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.be.equal(401);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal(
          'No authorization header was specified',
        );
        done(err);
      });
  });

  it('should return an error if the token cannot be authenticated', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
      .send({
        type: 'red-flag',
        latitude: '6.5951139',
        longitude: '3.3429975',
        comment: 'Extortion at the embassy',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.be.equal(401);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal(
          'The provided token cannot be authenticated.',
        );
        done(err);
      });
  });

  it('should return an error if record type is empty', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .set('authorization', `Bearer ${currentToken}`)
      .send({
        type: '',
        latitude: '6.5951139',
        longitude: '3.3429975',
        comment: 'Extortion at the embassy',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal(
          'A record type of either red-flag or intervention must be specified',
        );
        done(err);
      });
  });

  it('should return an error if record type is not red-flag or intervention', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .set('authorization', `Bearer ${currentToken}`)
      .send({
        type: 'gyhyr',
        latitude: '6.5951139',
        longitude: '3.3429975',
        comment: 'Extortion at the embassy',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal(
          'A valid record type of either red-flag or intervention must be specified',
        );
        done(err);
      });
  });

  it('should return an error if latitude is empty', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .set('authorization', `Bearer ${currentToken}`)
      .send({
        type: 'red-flag',
        latitude: '',
        longitude: '3.3429975',
        comment: 'Extortion at the embassy',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal(
          'Latitude of the incident location must be specified',
        );
        done(err);
      });
  });

  it('should return an error if latitude is invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .set('authorization', `Bearer ${currentToken}`)
      .send({
        type: 'red-flag',
        latitude: 'ghyshh',
        longitude: 'invalid',
        comment: 'Extortion at the embassy',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal('Latitude must be in a valid format');
        done(err);
      });
  });

  it('should return an error if longitude is empty', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .set('authorization', `Bearer ${currentToken}`)
      .send({
        type: 'red-flag',
        latitude: '6.5951139',
        longitude: '',
        comment: 'Extortion at the embassy',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal(
          'Longitude of the incident location must be specified',
        );
        done(err);
      });
  });

  it('should return an error if longitude is invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .set('authorization', `Bearer ${currentToken}`)
      .send({
        type: 'red-flag',
        latitude: '6.5951139',
        longitude: 'ghjjs',
        comment: 'Extortion at the embassy',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal('Longitude must be in a valid format');
        done(err);
      });
  });

  it('should return an error if comment is less than 20 characters', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .set('authorization', `Bearer ${currentToken}`)
      .send({
        type: 'red-flag',
        latitude: '6.5951139',
        longitude: '3.3429975',
        comment: 'A short comment',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal(
          'Your comment/narration should be from 20 characters above',
        );
        done(err);
      });
  });

  it('should return an error if comment is empty', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .set('authorization', `Bearer ${currentToken}`)
      .send({
        type: 'red-flag',
        latitude: '6.5951139',
        longitude: '3.3429975',
        comment: '',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal(
          'A comment narrating the incident must be specified',
        );
        done(err);
      });
  });
});

describe('GET red-flag requests', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'demouser@email.com', password: 12345678 })
      .end((err, res) => {
        currentToken = res.body.data[0].token;
        done(err);
      });
  });

  it('should return an error if no authorization token was specified', (done) => {
    chai
      .request(app)
      .get('/api/v1/red-flags')
      .set('authorization', '')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.be.equal(401);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal(
          'No authorization header was specified',
        );
        done(err);
      });
  });

  it('should return an error if the token cannot be authenticated', (done) => {
    chai
      .request(app)
      .get('/api/v1/red-flags')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.be.equal(401);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal(
          'The provided token cannot be authenticated.',
        );
        done(err);
      });
  });

  it('should retrieve the list of all the red-flags', (done) => {
    chai
      .request(app)
      .get('/api/v1/red-flags')
      .set('authorization', `Bearer ${currentToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal(200);
        expect(res.body).to.be.an('object');
        done(err);
      });
  });

  it('should retrieve the specific red-flag with given id', (done) => {
    chai
      .request(app)
      .get('/api/v1/red-flags/1')
      .set('authorization', `Bearer ${currentToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.eql([postDb[0]]);
        done(err);
      });
  });

  it('should return an error if red-flag does not exist', (done) => {
    chai
      .request(app)
      .get('/api/v1/red-flags/10')
      .set('authorization', `Bearer ${currentToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.status).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal('Sorry, no record with such id exists');
        done(err);
      });
  });

  it('should return an error if red-flag id is invalid', (done) => {
    chai
      .request(app)
      .get('/api/v1/red-flags/ty')
      .set('authorization', `Bearer ${currentToken}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal('The id parameter must be a number');
        done(err);
      });
  });
});

describe('PATCH red-flag requests', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'demouser@email.com', password: 12345678 })
      .end((err, res) => {
        currentToken = res.body.data[0].token;
        done(err);
      });
  });

  it('should return an error if no authorization token was specified', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/3/location')
      .set('authorization', '')
      .send({ latitude: '6.5922139', longitude: '3.3427375' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.be.equal(401);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal(
          'No authorization header was specified',
        );
        done(err);
      });
  });

  it('should return an error if the token cannot be authenticated', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/3/location')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.')
      .send({ latitude: '6.5922139', longitude: '3.3427375' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.be.equal(401);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal(
          'The provided token cannot be authenticated.',
        );
        done(err);
      });
  });

  it('should update the location of the red flag resource with the given id', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/3/location')
      .set('authorization', `Bearer ${currentToken}`)
      .send({ latitude: '6.5922139', longitude: '3.3427375' })
      .end((err, res) => {
        expect(res).to.has.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.data).to.eql([
          {
            id: 3,
            message: "Updated red-flag record's location",
          },
        ]);
        expect(res.body.data[0].id).to.be.equal(3);
        done(err);
      });
  });

  it('should return an error if the id format of the red flag resource is invalid', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/fghsys/location')
      .set('authorization', `Bearer ${currentToken}`)
      .send({ latitude: '6.5922139', longitude: '3.3427375' })
      .end((err, res) => {
        expect(res).to.has.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal('The id parameter must be a number');
        done(err);
      });
  });

  it('should return an error if the id of the red flag resource does not exist', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/10/location')
      .set('authorization', `Bearer ${currentToken}`)
      .send({ latitude: '6.5922139', longitude: '3.3427375' })
      .end((err, res) => {
        expect(res).to.has.status(404);
        expect(res.body.status).to.be.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal(
          'Sorry, no record with such id exists',
        );
        done(err);
      });
  });

  it('should return an error if the longitude of the red flag resource is empty', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/3/location')
      .set('authorization', `Bearer ${currentToken}`)
      .send({ latitude: '6.5922139', longitude: '' })
      .end((err, res) => {
        expect(res).to.has.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal(
          'Longitude of the incident location must be specified',
        );
        done(err);
      });
  });

  it('should return an error if the longitude of the red flag resource is invalid', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/3/location')
      .set('authorization', `Bearer ${currentToken}`)
      .send({ latitude: '6.5922139', longitude: 'gt6wgw' })
      .end((err, res) => {
        expect(res).to.has.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal(
          'Longitude must be in a valid format',
        );
        done(err);
      });
  });

  it('should return an error if the latitude of the red flag resource is empty', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/3/location')
      .set('authorization', `Bearer ${currentToken}`)
      .send({ latitude: '', longitude: '3.3427375' })
      .end((err, res) => {
        expect(res).to.has.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal(
          'Latitude of the incident location must be specified',
        );
        done(err);
      });
  });

  it('should return an error if the latitude of the red flag resource is invalid', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/3/location')
      .set('authorization', `Bearer ${currentToken}`)
      .send({ latitude: 'gushs', longitude: '3.3427375' })
      .end((err, res) => {
        expect(res).to.has.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal(
          'Latitude must be in a valid format',
        );
        done(err);
      });
  });

  it('should update the comment of the red flag resource with the given id', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/3/comment')
      .set('authorization', `Bearer ${currentToken}`)
      .send({ comment: 'Modifying the existing comment with a longer comment' })
      .end((err, res) => {
        expect(res).to.has.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.data).to.eql([
          {
            id: 3,
            message: 'Red-flag record comment has been updated succesfully',
          },
        ]);
        expect(res.body.data[0].id).to.be.equal(3);
        done(err);
      });
  });

  it('should return an error if the comment of the red flag resource is empty', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/3/comment')
      .set('authorization', `Bearer ${currentToken}`)
      .send({ comment: '' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal(
          'A comment narrating the incident must be specified',
        );
        done(err);
      });
  });

  it('should return an error if comment is less than 20 characters', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/3/comment')
      .set('authorization', `Bearer ${currentToken}`)
      .send({ comment: 'A short comment' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal(
          'Your comment/narration should be from 20 characters above',
        );
        done(err);
      });
  });
});

describe('DELETE red-flags request', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'demouser@email.com', password: 12345678 })
      .end((err, res) => {
        currentToken = res.body.data[0].token;
        done(err);
      });
  });

  it('should return an error if no authorization token was specified', (done) => {
    chai
      .request(app)
      .delete('/api/v1/red-flags/3')
      .set('authorization', '')
      .send({ latitude: '6.5922139', longitude: '3.3427375' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.be.equal(401);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal(
          'No authorization header was specified',
        );
        done(err);
      });
  });

  it('should return an error if the token cannot tbe authenticated', (done) => {
    chai
      .request(app)
      .delete('/api/v1/red-flags/3/')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.Q')
      .send({ latitude: '6.5922139', longitude: '3.3427375' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.be.equal(401);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal(
          'The provided token cannot be authenticated.',
        );
        done(err);
      });
  });

  it('should delete a red-flag resource with the specified id', (done) => {
    chai
      .request(app)
      .delete('/api/v1/red-flags/3')
      .set('authorization', `Bearer ${currentToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.deep.equal([
          {
            id: 3,
            message: 'red-flag record has been deleted',
          },
        ]);
        expect(res.body.data[0].id).to.be.equal(3);
        done(err);
      });
  });

  it('should return an error if the id of the red flag resource is invalid', (done) => {
    chai
      .request(app)
      .delete('/api/v1/red-flags/fgtre')
      .set('authorization', `Bearer ${currentToken}`)
      .end((err, res) => {
        expect(res).to.has.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal('The id parameter must be a number');
        done(err);
      });
  });

  it('should return an error if the id of the red flag resource does not exist', (done) => {
    chai
      .request(app)
      .delete('/api/v1/red-flags/10')
      .set('authorization', `Bearer ${currentToken}`)
      .end((err, res) => {
        expect(res).to.has.status(404);
        expect(res.body.status).to.be.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal(
          'Sorry, no record with such id exists',
        );
        done(err);
      });
  });
});
