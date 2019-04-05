const {describe} = require("mocha");
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
const app = require('../app');
const User = require('../models/user');


chai.use(chaiHttp);

describe('Test JWT authentication', function () {
  let backup;
  let token;

  before(function (done) {
    User.find({})
      .then(users => {
        backup = users;
        User.deleteMany({})
          .then(() => done());
      })
  });

  it('should make a new user', function (done) {
    chai.request(app)
      .post('/api/auth/register')
      .send({
        username: 'username',
        password: '1234',
      })
      .end(((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.username.should.be.equals('username');
        res.body.password.should.not.be.equals('1234');

        done();
      }));
  });

  it('should login with the new user', function (done) {
    chai.request(app)
      .post('/api/auth/login')
      .send({
        username: 'username',
        password: '1234',
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.success.should.be.equals(true);
        res.body.token.should.be.a('string');
        token = res.body.token;

        done();
      });
  });

  it('should authenticate using token', function (done) {
    chai.request(app)
      .get('/api/auth/user')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);

        done();
      });
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        User.insertMany(backup)
          .then(users => {
            console.log(`${users.length} users backed up`);
            done();
          });
      });
  });
});
