const path = require('path')
const should = require('should');
const mongoose = require('mongoose');
const app = require('../app');
const request = require('supertest')

const teamid= '5e87870ace306c528bc03205';
const pending_proposalID = '5e908a7d8cb570764a2de1a7';
const approved_proposalID = '5e7d3579f8f7d40d64f3335d';
const rejected_proposalID = '5e8f695abc3390d707d172b2';

describe('Client: View page test',function () {
    const client = request.agent(app);
    it('Client login',function (done) {
        client
            .post('/signin?role=client')
            .send({email:'myusername01@sheffield.ac.uk', password:'mypassword'})
            .redirects()
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('View my project page',function (done) {
        client
            .get('/client/myproject')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('View my teams page',function (done) {
        client
            .get('/client/myteam')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('View my timetable page',function (done) {
        client
            .get('/client/mytimetable')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('View pending project detail page',function (done) {
        client
            .get('/client/myproject/project_pending?id=' + pending_proposalID)
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('View approved project detail page',function (done) {
        client
            .get('/client/myproject/project_approved?id=' + approved_proposalID)
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('View  rejected project detail page',function (done) {
        client
            .get('/client/myproject/project_rejected?id=' + rejected_proposalID)
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('View  edit project page',function (done) {
        client
            .get('/client/edit_project?id=' + pending_proposalID)
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('View  team details page',function (done) {
        client
            .get('/client/myteam/teampage?id=' + teamid)
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('View  team mark page',function (done) {
        client
            .get('/client/myteam/teammark?id='+teamid)
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('View  edit team mark page',function (done) {
        client
            .get('/client/myteam/edit_teammark?id='+teamid)
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('Client signout',function (done) {
        client
            .get('/signout')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })
})



describe('Client: Stage 0 test',function () {
    const client = request.agent(app);
    const proposalID = mongoose.Types.ObjectId();
    it('Client login',function (done) {
        client
            .post('/signin?role=client')
            .send({email:'myusername01@sheffield.ac.uk', password:'mypassword'})
            .redirects()
            .end(function (err) {
                if(err) {return done(err)}
                else{
                should.not.exist(err)
                done()}
            })
    })

    it('View my project page',function (done) {
        client
            .get('/client/myproject')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('View my teams page',function (done) {
        client
            .get('/client/myteam')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('View my timetable page',function (done) {
        client
            .get('/client/mytimetable')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('View pending project detail page',function (done) {
        client
            .get('/client/myproject/project_pending?id=' + pending_proposalID)
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('View approved project detail page',function (done) {
        client
            .get('/client/myproject/project_approved?id=' + approved_proposalID)
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('View  rejected project detail page',function (done) {
        client
            .get('/client/myproject/project_rejected?id=' + rejected_proposalID)
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('View  team details page',function (done) {
        client
            .get('/client/myteam/teampage?id=' + teamid)
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('Create project',function (done) {
        client
            .post('/client/myproject/create_project')
            .send({topic:'Create_test', content:'Create_test',proposalID:proposalID})
            .redirects('/client/edit_project')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('Edit project',function (done) {
        client
            .post('/client/edit_project')
            .send({proposalID:proposalID,topic:'Edit_test', content:'Edit_test'})
            .redirects()
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('Make comment',function (done) {
        client
            .post('/client/myproject/project_pending')
            .send({proposalID:proposalID,comment:'Comment_test'})
            .redirects()
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('Delete Project',function (done) {
        client
            .post('/client/delete_project')
            .send({proposalID:proposalID})
            .redirects()
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('Client signout',function (done) {
        client
            .get('/signout')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

});

describe('Client: Stage 1 test',function () {
    const client = request.agent(app);
    it('Client login',function (done) {
        client
            .post('/signin?role=client')
            .send({email:'myusername01@sheffield.ac.uk', password:'mypassword'})
            .redirects()
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('Send change meeting request',function (done) {
        client
            .post('/client/mytimetable')
            .send({selection:'5e9319d81cfe49a116440409', reason:'ChangeMeeting_test',time:new Date()})
            .redirects()
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('Client signout',function (done) {
        client
            .get('/signout')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

})

describe('Client: Stage 2 test',function () {
    const client = request.agent(app);
    it('Client login',function (done) {
        client
            .post('/signin?role=client')
            .send({email:'myusername01@sheffield.ac.uk', password:'mypassword'})
            .redirects()
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('Mark for team',function (done) {
        client
            .post('/client/myteam/teammark')
            .send({GroupID:teamid,mark1:3,mark1_reason:'mark_test',mark2:3,mark2_reason:'mark_test',mark3:3,mark3_reason:'mark_test',mark4:3,mark4_reason:'mark_test',mark5:3,mark5_reason:'mark_test',mark6:3,mark6_reason:'mark_test',mark7:3,mark7_reason:'mark_test',mark8:3,mark8_reason:'mark_test'})
            .redirects()
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('Edit team mark',function (done) {
        client
            .post('/client/myteam/teammark')
            .send({GroupID:'5e87870ace306c528bc03205',mark1:3,mark1_reason:'mark_test',mark2:3,mark2_reason:'mark_test',mark3:3,mark3_reason:'mark_test',mark4:3,mark4_reason:'mark_test',mark5:3,mark5_reason:'mark_test',mark6:3,mark6_reason:'mark_test',mark7:3,mark7_reason:'mark_test',mark8:3,mark8_reason:'mark_test'})
            .redirects()
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

    it('Client signout',function (done) {
        client
            .get('/signout')
            .end(function (err) {
                if(err) {return done(err)}
                else{
                    should.not.exist(err)
                    done()}
            })
    })

})
