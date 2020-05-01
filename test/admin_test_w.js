const path = require('path')
const should = require('should');
const mongoose = require('mongoose');
const app = require('../app');
const request = require('supertest')

describe('Admin', function () {
    const admin = request.agent(app)
    const Tid = mongoose.Types.ObjectId();

    it('Admin login',function (done) {
        admin
            .post('/signin?role=admin')
            .send({email:'EmmaNoring@sheffield.ac.uk', password:'emma'})
            .redirects()
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })
    it('Admin team_list',function (done) {
        admin
            .get('/admin/team_list')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })
    it('Admin student_list',function (done) {
        admin
            .get('/admin/student_list')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })
    it('Admin new_team',function (done) {
        admin
            .get('/admin/new_team')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })
    it('Admin edit_team',function (done) {
        admin
            .get('/admin/edit_team?id=5ea9540aa4020251502a3ff2')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })
    it('Admin timetable',function (done) {
        admin
            .get('/admin/timetable')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })
    it('Admin timetable_change',function (done) {
        admin
            .get('/admin/timetable_change')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })
    it('Add a new student', function (done) {
        admin
            .post('/admin/add_new_student')
            .send({addStudentName:'newstudent_test', addStudentUserName:'newstudenttest@qq.com'})
            .redirects('/admin/student_list')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })
    it('Add a new staff', function (done) {
        admin
            .post('/admin/add_new_staff')
            .send({addStaffName:'newstaff_test', addStaffUserName:'newstafftest@qq.com'})
            .redirects('/admin/team_list')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })
    it('Submit a new team', function (done) {
        admin
            .post('/admin/submit_newteam')
            .send({staffID:'5ea8871ac8f25a46d01fea2a', studentID:'5ea88d1ddd490b4f0014d662', teamName: '9'})
            .redirects('/admin/student_list')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })
    it('Edit a team by changing students', function (done) {
        admin
            .post('/admin/submit_editteam')
            .send({Tid: '5ea9540aa4020251502a3ff2', staffID:'5ea8871ac8f25a46d01fea2a', studentID:'5ea95014c8f25a46d01fea31'})
            .redirects('/admin/student_list')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })
    // it('Edit a team by changing staffs', function (done) {
    //     admin
    //         .post('/admin/submit_editteam')
    //         .send({Tid: '5ea9540aa4020251502a3ff2', staffID:'5ea951066d2b6051337e7f2a', studentID:'5ea88d1ddd490b4f0014d662'})
    //         .redirects('/admin/student_list')
    //         .end(function (err) {
    //             if(err) {return done(err)}
    //             else{
    //                 should.not.exist(err)
    //                 done()}
    //         })
    // })
    // it('Post staff_request_reject', function (done) {
    //     admin
    //         .post('/admin/staff_request_reject')
    //         .send({reason:'reason_unit', requestID:'5ea96bfb77edeb7ef299ded0',})
    //         .redirects('/admin/timetable_change')
    //         .end(function (err) {
    //             if(err) {return done(err)}
    //             else{
    //                 should.not.exist(err)
    //                 done()}
    //         })
    // })
    // it('Post staff_request_approve', function (done) {
    //     admin
    //         .post('/admin/staff_request_approve')
    //         .send({id:'5ea96ceb77edeb7ef299ded9'})
    //         .redirects('/admin/timetable_change')
    //         .end(function (err) {
    //             if(err) {return done(err)}
    //             else{
    //                 should.not.exist(err)
    //                 done()}
    //         })
    // })
    // it('Post client_request_reject', function (done) {
    //     admin
    //         .post('/admin/client_request_reject')
    //         .send({reason:'reason_unnit', requestID:'5ea9774b77edeb7ef299defd',})
    //         .redirects('/admin/timetable_change')
    //         .end(function (err) {
    //             if(err) {return done(err)}
    //             else{
    //                 should.not.exist(err)
    //                 done()}
    //         })
    // })
    // it('Post client_request_approve', function (done) {
    //     admin
    //         .post('/admin/client_request_approve')
    //         .send({id:'5ea9774b77edeb7ef299defc'})
    //         .redirects('/admin/timetable_change')
    //         .end(function (err) {
    //             if(err) {return done(err)}
    //             else{
    //                 should.not.exist(err)
    //                 done()}
    //         })
    // })
    it('Admin signout',function (done) {
        admin
            .get('/signout')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })
})
