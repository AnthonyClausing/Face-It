var assert = require('assert');
var expect = require('chai').expect;
var request = require('request');

describe('server', function() {
    it('server status', function(done){
        request('http://localhost:3000', function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        })
    })
})


