const path = require('path')
const should = require('should');
const mongoose = require('mongoose');
const app = require('../app');
const request = require('supertest')


const staffID = '5e95b7a191b306cd2ebc527e';

describe('Staff: Stage 0 test',function () {
    const  staff= request.agent(app);
    const meetingID = '5e7aaa02c35155e53fe5c97e';
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

    it('Staff discussion',function (done) {
        staff
            .get('/staff/discussion')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('Staff discussion detail',function (done) {
        staff
            .get('/staff/discussion_detail')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('Staff marking',function (done) {
        staff
            .get('/staff/marking')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('Staff meeting detail post',function (done) {
        staff
            .get('/staff/meeting_detail_post')
            .query({seq:meetingID})
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('Staff meeting detail pre',function (done) {
        staff
            .get('/staff/meeting_detail_pre')
            .query({seq:meetingID})
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('Staff project',function (done) {
        staff
            .get('/staff/my_project')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('Staff my timetable',function (done) {
        staff
            .get('/staff/my_timetable')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('Staff project detail',function (done) {
        staff
            .get('/staff/project_detail')
            .query({seq:0})
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

describe('Staff: Stage 1 test mytimetable post',function () {
    const staff = request.agent(app);
    const staffID = mongoose.Types.ObjectId('5e95b7a191b306cd2ebc527e');
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

    it('Send change meeting request',function (done) {
        staff
            .post('/staff/my_timetable')
            .send({timechange:new Date(), changestaff:staffID, meetingID:'123-5e7aaa02c35155e53fe5c97e',t1:'test_test'})
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


})

describe('Staff:  test meeting detail pre',function () {

    const staff = request.agent(app);
    const staffID = '5e95b7a191b306cd2ebc527e';
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

    it('Send change meeting request',function (done) {
        staff
            .post('/staff/meeting_detail_pre?seq=5e7aaa02c35155e53fe5c97e')
            .send({timechange:new Date(), staffchange:staffID,changereason:'test_test'})
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
})

describe('Staff:  test meeting detail post',function () {
    const staff = request.agent(app);
    const staffID = '5e95b7a191b306cd2ebc527e';
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

    it('Send change meeting record',function (done) {
        staff
            .post('/staff/meeting_detail_post?seq=5e7aaa02c35155e53fe5c97e')
            .send({present:[1,0,1,1,1,0], t1:['test_act','test_plan','',80,'test_notes'], storycard:'0',progress: '0', timesheets: '1', clearPlan: '0', dynamics: '1'})
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
})

describe('Staff:  test marking',function () {
    const staff = request.agent(app);
    const staffID = '5e95b7a191b306cd2ebc527e';
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

    it('marking',function (done) {
        staff
            .post('/staff/marking?seq=0&id=5e7b6f794f4ed29e60233aa2')
            .send({
                selector1: [
                    '1', '5', '5',
                    '5', '5', '1',
                    '5'
                ],
                t1: [
                    '124123123',
                    'not bad',
                    'not bad',
                    'not bad',
                    'not bad',
                    'not bad',
                    'not bad'
                ],
                selector2: [
                    '10', '5', '10', '5',
                    '10', '5', '10', '5',
                    '10', '5', '5',  '5'
                ],
                t2: [
                    'Goodjob', 'Goodjob',
                    'Goodjob', 'Goodjob',
                    'Goodjob', 'Goodjob',
                    'Goodjob', 'Goodjob',
                    'Goodjob', 'Goodjob',
                    'Goodjob', 'Goodjob'
                ]
            })
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
})


describe('Staff:  test discussion detail',function () {
    const staff = request.agent(app);
    const staffID = '5e95b7a191b306cd2ebc527e';
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

    it('Send discussion reply',function (done) {
        staff
            .post('/staff/discussion_detail?id=5e908960b9f622760a6cf6a8')
            .send({reply:'unit_test'})
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
})