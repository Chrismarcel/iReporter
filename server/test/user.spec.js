import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import testDb from '../models';

chai.use(chaiHttp);

const { expect } = chai;

describe('Handle incoming requests on routes', () => {
  it('should return 200 and success message for the / route', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Welcome to iReporter');
        done(err);
      });
  });

  it('should return a 200 and success message for the /api/v1 route', (done) => {
    chai
      .request(app)
      .get('/api/v1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.equal('Welcome to iReporter API V1');
        done(err);
      });
  });

  it('should return a 404 for all invalid routes', (done) => {
    chai
      .request(app)
      .post('/api/v1')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.be.equal(
          'Wrong endpoint. Such endpoint does not exist',
        );
        done(err);
      });
  });
});

/**
 * @todo Complete the test suite for the User endpoints
 */

// describe('POST Sign Up Authentication', () => {
//   it('should register a new user if details are correct', (done) => {
//     chai
//       .request(app)
//       .get('/api/v1/auth/register')
//       .send(testDb[0])
//       .end((err, res) => {
//         expect(res).to.have.status(201);
//         expect(res.body.message).to.equal('Registration Successful');
//         expect(res.body).to.be.an('object');
//         done(err);
//       });
//   });

//   it('should return an error when user tries signing up with empty details', (done) => {
//     chai
//       .request(app)
//       .post('/api/v1/auth/register')
//       .send({})
//       .end((err, res) => {
//         expect(res).to.have.status(404);
//         expect(res.body).to.be.an('object');
//         done(err);
//       });
//   });
// });
