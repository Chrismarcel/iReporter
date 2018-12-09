import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);

const { expect } = chai;

describe('POST Sign Up Authentication', () => {
  it('should register a new user if details are correct', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send({
        firstname: 'Marcel',
        lastname: 'James',
        othername: '',
        email: 'senisulyman@gmail.com',
        phonenumber: '07038589706',
        username: 'MarcelJames',
        password: '12345678',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.status).to.be.equal(201);
        expect(res.body.data[0].message).to.equal('Registration Successful!');
        expect(res.body).to.be.an('object');
        done(err);
      });
  });

  it('should return an error when user tries signing up with empty first name', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send({
        firstname: '',
        lastname: 'Sulyman',
        othername: '',
        email: 'senisulyman@gmail.com',
        phonenumber: '07038890874',
        username: 'SeniSulyman',
        password: '12345678',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal('You need to include a valid first name');
        done(err);
      });
  });

  it('should return an error when user tries signing up with empty last name', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send({
        firstname: 'Seni',
        lastname: '',
        othername: '',
        email: 'senisulyman@gmail.com',
        phonenumber: '07038890874',
        username: 'SeniSulyman',
        password: '12345678',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal('You need to include a valid last name');
        done(err);
      });
  });

  it('should return an error when user tries signing up with empty email', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send({
        firstname: 'Seni',
        lastname: 'Sulyman',
        othername: '',
        email: '',
        phonenumber: '07038890874',
        username: 'SeniSulyman',
        password: '12345678',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal('The email you provided is invalid');
        done(err);
      });
  });

  it('should return an error when user tries signing up with empty phone number', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send({
        firstname: 'Seni',
        lastname: 'Sulyman',
        othername: '',
        email: 'senisulyman@gmail.com',
        phonenumber: '',
        username: 'SeniSulyman',
        password: '12345678',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal('You need to include a valid phone number');
        done(err);
      });
  });

  it('should return an error when user tries signing up with empty username', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send({
        firstname: 'Seni',
        lastname: 'Sulyman',
        othername: '',
        email: 'senisulyman@gmail.com',
        phonenumber: '07038890874',
        username: '',
        password: '12345678',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal('You need to include a valid username');
        done(err);
      });
  });

  it('should return an error when user tries signing up with empty password', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send({
        firstname: 'Seni',
        lastname: 'Sulyman',
        othername: '',
        email: 'senisulyman@gmail.com',
        phonenumber: '07038890874',
        username: 'SeniSulyman',
        password: '',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal('You need to provide a password');
        done(err);
      });
  });

  it('should return an error when user signs up with password less than 8', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send({
        firstname: 'Seni',
        lastname: 'Sulyman',
        othername: '',
        email: 'senisulyman@gmail.com',
        phonenumber: '07038890874',
        username: 'SeniSulyman',
        password: '12345',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal('Password length must be 8 characters and above');
        done(err);
      });
  });

  it('should return an error if first name is invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send({
        firstname: 'Seni#$2352',
        lastname: 'Sulyman',
        othername: '',
        email: 'senisulyman@gmail.com',
        phonenumber: '07038890874',
        username: 'SeniSulyman',
        password: '12345678',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal('You need to include a valid first name');
        done(err);
      });
  });

  it('should return an error if last name is invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send({
        firstname: 'Seni',
        lastname: 'Suly123di45./man',
        othername: '',
        email: 'senisulyman@gmail.com',
        phonenumber: '07038890874',
        username: 'SeniSulyman',
        password: '12345678',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal('You need to include a valid last name');
        done(err);
      });
  });

  it('should return an error if other name is invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send({
        firstname: 'Seni',
        lastname: 'Sulyman',
        othername: '123etuyie45',
        email: 'senisulyman@gmail.com',
        phonenumber: '07038890874',
        username: 'SeniSulyman',
        password: '12345678',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal('The other name you provided is invalid');
        done(err);
      });
  });

  it('should return an error if email is invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send({
        firstname: 'Seni',
        lastname: 'Sulyman',
        othername: '',
        email: 'senisulyman1#$^gmail',
        phonenumber: '07038890874',
        username: 'SeniSulyman',
        password: '12345678',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal('The email you provided is invalid');
        done(err);
      });
  });

  it('should return an error if phone number is invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send({
        firstname: 'Seni',
        lastname: 'Sulyman',
        othername: '',
        email: 'senisulyman@gmail.com',
        phonenumber: '07038s$5%890874',
        username: 'SeniSulyman',
        password: '12345678',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal('You need to include a valid phone number');
        done(err);
      });
  });

  it('should return an error if username is invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send({
        firstname: 'Seni',
        lastname: 'Sulyman',
        othername: '',
        email: 'senisulyman@gmail.com',
        phonenumber: '07038890874',
        username: 'SeniSu*()^&#lyman',
        password: '12345678',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal('You need to include a valid username');
        done(err);
      });
  });
});

describe('POST Login Authentication', () => {
  it('should log user in when details are correct', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'senisulyman@gmail.com', password: '#123456#' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data[0].message).to.be.equal('Login Successful!');
        done(err);
      });
  });

  it('should return an error if email is not provided', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({ email: '', password: '#123456#' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal('The email you provided is invalid');
        done(err);
      });
  });

  it('should return an error if password is not provided', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'senisulyman@gmail.com', password: '' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal('You need to provide a password');
        done(err);
      });
  });

  it('should return an error if email is invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'senisulyman@@#!##.com', password: '#123456#' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal('The email you provided is invalid');
        done(err);
      });
  });

  it('should return an error if user does not exist', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'randomuser@gmail.com', password: '#123456778#' })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.status).to.be.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal('Sorry, such account does not exist');
        done(err);
      });
  });

  it('should return an error when user logs in with password less than 8', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'senisulyman@gmail.com', password: '#1234' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.equal('Password length must be 8 characters and above');
        done(err);
      });
  });
});
