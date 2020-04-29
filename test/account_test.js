const should = require('should');
const mongoose = require('mongoose');
const app = require('../app');
const request = require('supertest')


const staffID = '5e95b7a191b306cd2ebc527e';

describe('Staff account test',function () {
    const  staff= request.agent(app);

    it('Staff login',function (done) {
        staff
            .post('/signin?role=staff')
            .send({email:'astratton@sheffield.ac.uk', password:'123456'})
            .redirects()
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    

    it('Staff signout',function (done) {
        staff
            .get('/signout')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })
});