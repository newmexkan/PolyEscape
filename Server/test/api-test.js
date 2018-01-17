/**
 * Created by Julien on 17/01/2018.
 */

var chai = require('chai');
var expect = chai.expect;
const apiAdress= 'http://localhost:8080';

var assert = require('assert'),
    http = require('http');

describe('getAllScenarios', function () {

    it('should return 200', function (done) {
        http.get(apiAdress+'/getAllScenarios', function (res) {
            assert.equal(200, res.statusCode);
            done();
        });
    });

    it('should return an array of scenarios', function (done) {
        http.get(apiAdress+'/getAllScenarios', function (res) {
            var data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {

                obj = JSON.parse(data);
                expect(obj).to.have.property('scenarios');

                for(let i=0;i<obj["scenarios"].length;i++)
                    expect(obj["scenarios"][i]).to.have.all.keys('id', 'name', 'nbPlayers', 'timeInMinuts', 'summary', 'missions', 'questions');

                done();
            });

        });
    });
});