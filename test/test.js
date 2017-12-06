let chai = require('chai');
let expect = require('chai').expect;
let chaiHttp = require('chai-http');
process.env.NODE_ENV = 'test';

chai.use(chaiHttp);

describe('server', function() {
    it('server status', function(done){
        chai.request('http://localhost:3000')
            .get('/')
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                done();
            })
    })
})

describe('CRUD user operations', function() {
    it('deny if not admin', function(done){
        chai.request('http://localhost:3000')
            .get('/api/users')
            .end(function (err, res) {
                expect(res.status).to.equal(500);
                done();
            })
    })
})

