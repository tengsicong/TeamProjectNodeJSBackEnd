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
            .get('/admin/edit_project?id=5e90544dc07d0450081a1195')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('approved_project',function (done) {
        admin
            .get('/admin/project_approved?id=5e7d369ff8f7d40d64f33383')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('pending_project',function (done) {
        admin
            .get('/admin/project_pending?id=5e7d34d0f8f7d40d64f3335a')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('rejected_project',function (done) {
        admin
            .get('/admin/project_rejected?id=5e7d3b2df8f7d40d64f33395')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('student_detail',function (done) {
        admin
            .get('/admin/student_detail?id=5e7b6ace4f4ed29e60233999')
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
            .post('/admin/edit_project')
            .send({proposalID:"5ea97a1d60dd0e21a0e31a4b", topic:'test_edit_project', content:'test_edit_project'})
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
            .post('/admin/project_pending')
            .send({proposalID:"5e90544dc07d0450081a1195",comment:'test_comment_in_pending_project'})
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
            .post('/admin/project_rejected')
            .send({proposalID:"5e8f695abc3390d707d172b2",comment:'Comment_test_in_rejected_project'})
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
            .send({proposalID: "5ea982ef60dd0e21a0e31a56"})
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
            .get('/admin/pending_approved?id=5ea961012e01d73d605a3c5b')
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
            .get('/admin/pending_rejected?id=5ea95ec560dd0e21a0e31a45')
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
            .get('/admin/rejected_pending?id=5e7d3adcf8f7d40d64f33392')
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
            .get('/admin/approved_pending?id=5e90544dc07d0450081a1195')
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
            .send({teamID:"5e87086fce306c528bc03145",proposalID:"5e95b6b691b306cd2ebc527b"})
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
            .send({teamID:"5e9577e2e2eaa6539faf7c16",proposalID:"5e7d3579f8f7d40d64f3335d"})
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

