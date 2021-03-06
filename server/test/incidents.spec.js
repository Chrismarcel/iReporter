import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;

let userToken;
let adminToken;

describe('POST red-flags requests', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'demouser@email.com', password: 12345678 })
      .end((err, res) => {
        userToken = res.body.data[0].token;
        done(err);
      });
  });

  it('should add a new record if details are correct', (done) => {
    const incident = {
      type: 'red-flag',
      latitude: '6.5951139',
      longitude: '3.3429975',
      comment: 'Extortion at the embassy',
      images: [
        'cjrmc1llraa9hpwk16lr.jpg',
        'attdkzknpxnmumgptmyt.jpg',
      ],
    };
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .set('authorization', `Bearer ${userToken}`)
      .send(incident)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.status).to.be.equal(201);
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
        expect(res.body.error).to.equal(
          'The provided token cannot be authenticated.',
        );
        done(err);
      });
  });

  it('should return an error if latitude is empty', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        type: 'red-flag',
        latitude: '',
        longitude: '3.3429975',
        comment: 'Extortion at the embassy',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
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
      .set('authorization', `Bearer ${userToken}`)
      .send({
        type: 'red-flag',
        latitude: 'ghyshh',
        longitude: 'invalid',
        comment: 'Extortion at the embassy',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.error).to.equal('Latitude must be in a valid format');
        done(err);
      });
  });

  it('should return an error if longitude is empty', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        type: 'red-flag',
        latitude: '6.5951139',
        longitude: '',
        comment: 'Extortion at the embassy',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
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
      .set('authorization', `Bearer ${userToken}`)
      .send({
        type: 'red-flag',
        latitude: '6.5951139',
        longitude: 'ghjjs',
        comment: 'Extortion at the embassy',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.error).to.equal('Longitude must be in a valid format');
        done(err);
      });
  });

  it('should return an error if comment is less than 20 characters', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        type: 'red-flag',
        latitude: '6.5951139',
        longitude: '3.3429975',
        comment: 'A short comment',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
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
      .set('authorization', `Bearer ${userToken}`)
      .send({
        type: 'red-flag',
        latitude: '6.5951139',
        longitude: '3.3429975',
        comment: '',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.error).to.equal(
          'A comment narrating the incident must be specified',
        );
        done(err);
      });
  });

  it('should return an error if an image format is invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        type: 'red-flag',
        latitude: '6.5951139',
        longitude: '3.3429975',
        comment: 'Extortion at the embassy',
        images: ['a-file-name.shji', 'yada-yada.kjgh'],
      })
      .end((err, res) => {
        expect(res).to.have.status(415);
        expect(res.body.status).to.equal(415);
        expect(res.body.error).to.equal(
          'Sorry, the format you specified is incorrect. Only .jpeg, .jpg, .png formats are accepted',
        );
        done(err);
      });
  });

  it('should return an error if there are more than 3 attachments', (done) => {
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        type: 'red-flag',
        latitude: '6.5951139',
        longitude: '3.3429975',
        comment: 'Extortion at the embassy',
        images: [
          'a-file-name.png',
          'yada-yada.jpg',
          'cjrmc1llraa9hpwk16lr.jpg',
          'attdkzknpxnmumgptmyt.jpg',
          'vfumizsoepdpqvyrwel2.jpg',
        ],
      })
      .end((err, res) => {
        expect(res).to.have.status(413);
        expect(res.body.status).to.equal(413);
        expect(res.body.error).to.equal(
          'You can only upload a maximum of 3 images',
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
        userToken = res.body.data[0].token;
        done(err);
      });
  });

  it('should return an error if incident type is wrong', (done) => {
    chai
      .request(app)
      .get('/api/v1/sjoiois')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error).to.be.equal('Sorry, such endpoint does not exist');
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
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal(200);
        done(err);
      });
  });

  it('should retrieve the specific red-flag with given id', (done) => {
    chai
      .request(app)
      .get('/api/v1/red-flags/1')
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal(200);
        done(err);
      });
  });

  it('should return an error if red-flag does not exist', (done) => {
    chai
      .request(app)
      .get('/api/v1/red-flags/10')
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.status).to.equal(404);
        expect(res.body.error).to.equal('Sorry, no record with such id exists');
        done(err);
      });
  });

  it('should return an error if red-flag id is invalid', (done) => {
    chai
      .request(app)
      .get('/api/v1/red-flags/ty')
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.error).to.equal('The id parameter must be a number');
        done(err);
      });
  });
});

describe('PATCH red-flag requests', () => {
  before(() => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'demouser@email.com', password: 12345678 })
      .end((err, res) => {
        userToken = res.body.data[0].token;
      });

    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admindemo@email.com', password: 12345678 })
      .end((err, res) => {
        adminToken = res.body.data[0].token;
      });
  });

  it('should return an error if no authorization token was specified', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/location')
      .set('authorization', '')
      .send({ latitude: '6.5922139', longitude: '3.3427375' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.be.equal(401);
        expect(res.body.error).to.equal(
          'No authorization header was specified',
        );
        done(err);
      });
  });

  it('should return an error if the token cannot be authenticated', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/location')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.')
      .send({ latitude: '6.5922139', longitude: '3.3427375' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.be.equal(401);
        expect(res.body.error).to.equal(
          'The provided token cannot be authenticated.',
        );
        done(err);
      });
  });

  it('should update the location of the red flag resource with the given id', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/location')
      .set('authorization', `Bearer ${userToken}`)
      .send({ latitude: '6.5922139', longitude: '3.3427375' })
      .end((err, res) => {
        expect(res).to.has.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body).to.have.property('status');
        expect(res.body.data[0].id).to.be.equal(1);
        done(err);
      });
  });

  it('should return an error if the id format of the red flag resource is invalid', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/fghsys/location')
      .set('authorization', `Bearer ${userToken}`)
      .send({ latitude: '6.5922139', longitude: '3.3427375' })
      .end((err, res) => {
        expect(res).to.has.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('The id parameter must be a number');
        done(err);
      });
  });

  it('should return an error if the id of the red flag resource does not exist', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/10/location')
      .set('authorization', `Bearer ${userToken}`)
      .send({ latitude: '6.5922139', longitude: '3.3427375' })
      .end((err, res) => {
        expect(res).to.has.status(404);
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.be.equal(
          'Sorry, no record with such id exists',
        );
        done(err);
      });
  });

  it('should return an error if the longitude of the red flag resource is empty', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/location')
      .set('authorization', `Bearer ${userToken}`)
      .send({ latitude: '6.5922139', longitude: '' })
      .end((err, res) => {
        expect(res).to.has.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal(
          'Longitude of the incident location must be specified',
        );
        done(err);
      });
  });

  it('should return an error if the longitude of the red flag resource is invalid', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/location')
      .set('authorization', `Bearer ${userToken}`)
      .send({ latitude: '6.5922139', longitude: 'gt6wgw' })
      .end((err, res) => {
        expect(res).to.has.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal(
          'Longitude must be in a valid format',
        );
        done(err);
      });
  });

  it('should return an error if the latitude of the red flag resource is empty', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/location')
      .set('authorization', `Bearer ${userToken}`)
      .send({ latitude: '', longitude: '3.3427375' })
      .end((err, res) => {
        expect(res).to.has.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal(
          'Latitude of the incident location must be specified',
        );
        done(err);
      });
  });

  it('should return an error if the latitude of the red flag resource is invalid', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/location')
      .set('authorization', `Bearer ${userToken}`)
      .send({ latitude: 'gushs', longitude: '3.3427375' })
      .end((err, res) => {
        expect(res).to.has.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal(
          'Latitude must be in a valid format',
        );
        done(err);
      });
  });

  it('should update the comment of the red flag resource with the given id', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/comment')
      .set('authorization', `Bearer ${userToken}`)
      .send({ comment: 'Modifying the existing comment with a longer comment' })
      .end((err, res) => {
        expect(res).to.has.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body).to.have.property('status');
        expect(res.body.data[0].id).to.be.equal(1);
        done(err);
      });
  });

  it('should return an error if a non-admin is trying to access the status route', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/status')
      .set('authorization', `Bearer ${userToken}`)
      .send({ status: 'rejected' })
      .end((err, res) => {
        expect(res).to.has.status(401);
        expect(res.body.status).to.be.equal(401);
        expect(res.body).to.have.property('status');
        expect(res.body.error).to.be.equal('You are not authorized to access this endpoint.');
        done(err);
      });
  });

  it('should update the status of the red flag resource with the given id', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/status')
      .set('authorization', `Bearer ${adminToken}`)
      .send({ status: 'rejected' })
      .end((err, res) => {
        expect(res).to.has.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body).to.have.property('status');
        expect(res.body.data[0].id).to.be.equal(1);
        done(err);
      });
  });

  it('should return an error if incorrect status was specified', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/status')
      .set('authorization', `Bearer ${adminToken}`)
      .send({ status: 'rejected%^&' })
      .end((err, res) => {
        expect(res).to.has.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.have.property('status');
        expect(res.body.error).to.be.equal('You need to specify a correct status type');
        done(err);
      });
  });

  it('should return an error if report is trying to be edited after is has been updated', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/comment')
      .set('authorization', `Bearer ${userToken}`)
      .send({ comment: 'Modifying the existing comment with a longer comment' })
      .end((err, res) => {
        expect(res).to.has.status(409);
        expect(res.body.status).to.be.equal(409);
        expect(res.body).to.have.property('status');
        expect(res.body.error).to.be.equal('You cannot modify this report after its status has been updated');
        done(err);
      });
  });

  it('should return an error if the comment of the red flag resource is empty', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/comment')
      .set('authorization', `Bearer ${userToken}`)
      .send({ comment: '' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.error).to.equal(
          'A comment narrating the incident must be specified',
        );
        done(err);
      });
  });

  it('should return an error if comment is less than 20 characters', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/comment')
      .set('authorization', `Bearer ${userToken}`)
      .send({ comment: 'A short comment' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
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
        userToken = res.body.data[0].token;
        done(err);
      });
  });

  it('should return an error if no authorization token was specified', (done) => {
    chai
      .request(app)
      .delete('/api/v1/red-flags/1')
      .set('authorization', '')
      .send({ latitude: '6.5922139', longitude: '3.3427375' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.be.equal(401);
        expect(res.body.error).to.equal(
          'No authorization header was specified',
        );
        done(err);
      });
  });

  it('should return an error if the token cannot the authenticated', (done) => {
    chai
      .request(app)
      .delete('/api/v1/red-flags/1/')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.Q')
      .send({ latitude: '6.5922139', longitude: '3.3427375' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.be.equal(401);
        expect(res.body.error).to.equal(
          'The provided token cannot be authenticated.',
        );
        done(err);
      });
  });

  it('should delete a red-flag resource with the specified id', (done) => {
    chai
      .request(app)
      .delete('/api/v1/red-flags/1')
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body.data).to.deep.equal([
          {
            id: 1,
            message: 'red-flag record has been deleted',
          },
        ]);
        expect(res.body.data[0].id).to.be.equal(1);
        done(err);
      });
  });

  it('should return an error if the id of the red flag resource is invalid', (done) => {
    chai
      .request(app)
      .delete('/api/v1/red-flags/fgtre')
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.has.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('The id parameter must be a number');
        done(err);
      });
  });

  it('should return an error if the id of the red flag resource does not exist', (done) => {
    chai
      .request(app)
      .delete('/api/v1/red-flags/10')
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.has.status(404);
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.be.equal(
          'Sorry, no record with such id exists',
        );
        done(err);
      });
  });
});
