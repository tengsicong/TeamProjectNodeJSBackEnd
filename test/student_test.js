const request = require('supertest');
const express = require('express');
const app = express();

const studentUserName = 'tengsicong@sheffield.ac.uk';
const studentPassWord = 'tengsicong';

describe('student', function () {

    // let server;
    // before(function() {//执行测试用例前开启服务器
    //     // runs before all tests in this block
    //     server=app.listen(9999);
    // });

    it('signin', function (done) {
        request(app)
            .post('/index')
            // .send({email: studentUserName, password: studentPassWord})
            .expect(200)
            .then(console.log)

    })

    // it('test_people_preference', function(done) {
    //     agent
    //         .post('/set_people_preference')
    //         .type('form')
    //         .field({person1: mongoose.Types.ObjectId('5e7b6b4e4f4ed29e602339b5')})
    //         .redirects()
    //         .end(function (err, done) {
    //             console.log("enter")
    //             done()
    //         })
    // })
})


