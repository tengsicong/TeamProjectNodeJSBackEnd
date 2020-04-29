const path = require('path');
const should = require('should');
const mongoose = require('mongoose');
const app = require('../app');
const request = require('supertest')


describe('admin',function () {
    const admin = request.agent(app);
    const proposalID = mongoose.Types.ObjectId();
    const teamID = mongoose.Types.ObjectId();
    it('admin_login',function (done) {
        admin
            .post('/signin?role=admin')
            .send({email:'EmmaNoring@sheffield.ac.uk', password:'emma'})
            .redirects()
            .end(function (err,res) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('project_list',function (done) {
        admin
            .get('/admin/project_list')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('edit_project',function (done) {
        admin
            .get('/admin/edit_project')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('approved_project',function (done) {
        admin
            .get('/admin/project_approved')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('pending_project',function (done) {
        admin
            .get('/admin/project_pending')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('rejected_project',function (done) {
        admin
            .get('/admin/project_rejected')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('student_detail',function (done) {
        admin
            .get('/admin/student_detail')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('change_stage',function (done) {
        admin
            .get('/admin/change_stage')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })



    it('post_edit_project',function (done) {
        admin
            .post('/admin/project_list/edit_project')
            .send({proposalID:proposalID, topic:'test1', content:'test1'})
            .redirects()
            .end(function (err,res) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('post_comment_in_pending_project',function (done) {
        admin
            .post('/admin/project_list/project_pending')
            .send({proposalID:proposalID,comment:'Comment_test1'})
            .redirects()
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('post_comment_in_rejected_project',function (done) {
        admin
            .post('/admin/project_list/project_rejected')
            .send({proposalID:proposalID,comment:'Comment_test1'})
            .redirects()
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('post_delete_project',function (done) {
        admin
            .post('/admin/delete_project')
            .send({proposalID: proposalID})
            .redirects()
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('change_status_from_pending_to_approved',function (done) {
        admin
            .post('/admin/pending_approved')
            .send({proposalID:proposalID,Status:"approved"})
            .redirects()
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('change_status_from_pending_to_rejected',function (done) {
        admin
            .post('/admin/pending_rejected')
            .send({proposalID:proposalID,Status:"rejected"})
            .redirects()
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('change_status_from_rejected_to_pending',function (done) {
        admin
            .post('/admin/rejected_pending')
            .send({proposalID:proposalID,Status:"pending"})
            .redirects()
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('change_status_from_approved_to_pending',function (done) {
        admin
            .post('/admin/approved_pending')
            .send({proposalID:proposalID,Status:"rejected"})
            .redirects()
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('post_delete_team',function (done) {
        admin
            .post('/admin/delete_team')
            .send({teamID:teamID,proposalID:proposalID})
            .redirects()
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('post_allocate_team',function (done) {
        admin
            .post('/admin/allocate_team')
            .send({teamID:"teamID",proposalID:proposalID})
            .redirects()
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('post_change_stage',function (done) {
        admin
            .post('/admin/change_stage')
            .send({stage:2})
            .redirects()
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('admin signout',function (done) {
        admin
            .get('/signout')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })


});

