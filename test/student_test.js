var app = require('../app');
var supertest = require('supertest');
var agent = supertest.agent(app);
var should = require('should');


//
describe('student', function () {

    // let server;
    // before(function() {//执行测试用例前开启服务器
    //     // runs before all tests in this block
    //     server=app.listen(3000);
    // });

    // it('signin', function (done) {
    //     request
    //         .get('/index')
    //         .timeout({
    //                 response: 5000,
    //                 deadline: 60000,
    //
    //         })
    //         .then(res => {
    //             console.log(res.status)
    //         })
    //         .catch(err => {
    //             console.log(err.message)
    //         });
    // })

    it('signin', function (done) {
        agent
            .post('/signin')
            .query({role: 'student'})
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) {return done(err)}
                else {
                    // should.not.exist(err)
                    done();
                }
            })
    })

//     it('test_people_preference', function(done) {
//         agent
//             .post('/set_people_preference')
//             .type('form')
//             .field({person1: mongoose.Types.ObjectId('5e7b6b4e4f4ed29e602339b5')})
//             .redirects()
//             .end(function (err, done) {
//                 console.log("enter")
//                 done()
//             })
//     })
})





// const request = require('supertest');
// const express = require('express');
//
// const app = express();
//
// // app.get('/user', function(req, res) {
// //     res.status(200).json({ name: 'john' });
// // });
// describe('student', function () {
//     it('signin', function (done) {
//         request(app)
//             .get('index')
//             // .query({role: 'student'})
//             .expect(200)
//             .end(function(err, res) {
//                 if (err) throw err;
//             });
//     })
// })



