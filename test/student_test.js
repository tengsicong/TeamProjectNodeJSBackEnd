var app = require('../app');
var supertest = require('supertest');
var agent = supertest.agent(app);
var should = require('should');


//
describe('student', function () {

    it('student_signin', function (done) {
        agent
            .post('/signin')
            .query({role: 'student'})
            .send({email: 'tengsicong@sheffield.ac.uk', password: 'tengsicong'})
            .redirects()
            .expect(200)
            .end(function (err, res) {
                if (err) {return done(err)}
                else {
                    should.not.exist(err)
                    done();
                }
            })
    })

    it ('all_project_page', function (done) {
        agent
            .get('/student/all_projects')
            .expect(200)
            .end(function (err, res) {
                if (err) {return done(err)}
                else {
                    should.not.exist(err)
                    done();
                }
            })
    })

    it ('homepage_page', function (done) {
        agent
            .get('/student/homepage')
            .expect(200)
            .end(function (err, res) {
                if (err) {return done(err)}
                else {
                    should.not.exist(err)
                    done();
                }
            })
    })

    it ('timetable_page', function (done) {
        agent
            .get('/student/timetable')
            .expect(200)
            .end(function (err, res) {
                if (err) {return done(err)}
                else {
                    should.not.exist(err)
                    done();
                }
            })
    })

    it ('student_qa_page', function (done) {
        agent
            .get('/student/student_qa')
            .expect(200)
            .end(function (err, res) {
                if (err) {return done(err)}
                else {
                    should.not.exist(err)
                    done();
                }
            })
    })

    it ('student_qa_detail_page', function (done) {
        agent
            .get('/student/student_qa_detail')
            .query({id: '5e908960b9f622760a6cf6a8'})
            .expect(200)
            .end(function (err, res) {
                if (err) {return done(err)}
                else {
                    should.not.exist(err)
                    done();
                }
            })
    })

    it ('my_project_page', function (done) {
        agent
            .get('/student/my_project')
            .expect(200)
            .end(function (err, res) {
                if (err) {return done(err)}
                else {
                    should.not.exist(err)
                    done();
                }
            })
    })

    it ('project_detail_page', function (done) {
        agent
            .get('/student/project_detail')
            .query({id: '5e7d3579f8f7d40d64f3335d'})
            .expect(200)
            .end(function (err, res) {
                if (err) {return done(err)}
                else {
                    should.not.exist(err)
                    done();
                }
            })
    })

    it ('person_preference_page', function (done) {
        agent
            .get('/student/person_preference')
            .expect(200)
            .end(function (err, res) {
                if (err) {return done(err)}
                else {
                    should.not.exist(err)
                    done();
                }
            })
    })

    it ('proposal_preference_page', function (done) {
        agent
            .get('/student/proposal_preference')
            .expect(200)
            .end(function (err, res) {
                if (err) {return done(err)}
                else {
                    should.not.exist(err)
                    done();
                }
            })
    })

    it ('mark_teammate_page', function (done) {
        agent
            .get('/student/mark_teammate')
            .expect(200)
            .end(function (err, res) {
                if (err) {return done(err)}
                else {
                    should.not.exist(err)
                    done();
                }
            })
    })

    it ('my_mark_page', function (done) {
        agent
            .get('/student/my_mark')
            .expect(200)
            .end(function (err, res) {
                if (err) {return done(err)}
                else {
                    should.not.exist(err)
                    done();
                }
            })
    })

    it ('post_set_people_preference_only_people_not_like', function (done) {
        agent
            .post('/student/set_people_preference')
            .send({person1: 'None1', person2: '5e7b6b4e4f4ed29e602339b5', person3: 'None3'})
            .redirects()
            .expect(200)
            .end(function (err, res) {
                if (err) {return done(err)}
                else {
                    should.not.exist(err)
                    done();
                }
            })
    })

    it ('post_set_people_preference_only_people_like', function (done) {
        agent
            .post('/student/set_people_preference')
            .send({person1: '5e7b6b4e4f4ed29e602339b5', person2: 'None2', person3: 'None3'})
            .redirects()
            .expect(200)
            .end(function (err, res) {
                if (err) {return done(err)}
                else {
                    should.not.exist(err)
                    done();
                }
            })
    })

    it ('post_set_people_preference_all', function (done) {
        agent
            .post('/student/set_people_preference')
            .send({person1: '5e7b6b4e4f4ed29e602339b5', person2: '5e7b6b9b4f4ed29e602339c0', person3: '5e7b6bc94f4ed29e602339cb'})
            .redirects()
            .expect(200)
            .end(function (err, res) {
                if (err) {return done(err)}
                else {
                    should.not.exist(err)
                    done();
                }
            })
    })

    it ('post_set_new_representer', function (done) {
        agent
            .post('/student/set_new_representer')
            .send({representerID: '5e7b6ace4f4ed29e60233999'})
            .redirects()
            .expect(200)
            .end(function (err, res) {
                if (err) {return done(err)}
                else {
                    should.not.exist(err)
                    done();
                }
            })
    })

    it ('post_set_project_preference', function (done) {
        agent
            .post('/student/set_project_preference')
            .send({projectList: '5e7d34d0f8f7d40d64f3335a,5e7d3579f8f7d40d64f3335d'})
            .redirects()
            .expect(200)
            .end(function (err, res) {
                if (err) {return done(err)}
                else {
                    should.not.exist(err)
                    done();
                }
            })
    })

    it ('post_post_qa', function (done) {
        agent
            .post('/student/post_qa')
            .send({topic: 'unit_test_topic', content: 'unit_test_content'})
            .redirects()
            .expect(200)
            .end(function (err, res) {
                if (err) {return done(err)}
                else {
                    should.not.exist(err)
                    done();
                }
            })
    })

    it ('post_marking_teammate', function (done) {
        agent
            .post('/student/marking_teammate')
            .send({mark: '5,4,3,2,1,0'})
            .redirects()
            .expect(200)
            .end(function (err, res) {
                if (err) {return done(err)}
                else {
                    should.not.exist(err)
                    done();
                }
            })
    })

    it ('post_post_reply', function (done) {
        agent
            .post('/student/post_reply')
            .query({id: '5e908960b9f622760a6cf6a8'})
            .send({reply: 'unit_test_reply', name: 'unit_test_name'})
            .redirects()
            .expect(200)
            .end(function (err, res) {
                if (err) {return done(err)}
                else {
                    should.not.exist(err)
                    done();
                }
            })
    })

})




