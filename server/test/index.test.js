import chai from 'chai';
import chaiHttp from 'chai-http';
import './incidents.spec';
import './users.spec';
import app from '../app';

chai.use(chaiHttp);

const { expect } = chai;

describe('Handle incoming requests on routes', () => {
  it('should return 200 and success message for the / route', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
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
        expect(res.body.message).to.be.equal('Welcome to iReporter API v1');
        done(err);
      });
  });

  it('should return a 404 for all invalid  routes', (done) => {
    chai
      .request(app)
      .post('/api/v1')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.be.equal(
          'Sorry, such endpoint does not exist',
        );
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
          'Sorry, such endpoint does not exist',
        );
        done(err);
      });
  });
});
