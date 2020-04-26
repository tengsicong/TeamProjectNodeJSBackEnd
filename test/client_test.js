const path = require('path')
const should = require('should');
// const proposalModel = require('../models/proposal');
// const mongoose = require('mongoose');
const app = require('../app');
const request = require('supertest')

// const clientID = '5e7d2198f8f7d40d64f332d5';

// let proposal = {
//     _id: mongoose.Types.ObjectId(),
//     ClientID: clientID,
//     Topic: 'Mocha_test_1',
//     Content: 'Mocha_test_1_Content',
//     Date: new Date(),
//     Status: 'pending'
// }

describe('test create proposal',function () {
    const client = request.agent(app);
    it('login client',function (done) {
        client
            .post('/signin?role=client')
            .send({email:'myusername01@sheffield.ac.uk', password:'mypassword'})
            .redirects()
            .end(function (err,res) {
                if(err) {return done(err)}
                else{
                should.not.exist(err)
                done()}
            })
    })

    it('login client',function (done) {
        client
            .post('/client/myproject/create_project')
            .send({topic:'test', content:'test'})
            .redirects()
            .end(function (err,res) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })



});
