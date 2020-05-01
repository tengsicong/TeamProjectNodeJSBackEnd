const express = require('express');
const router = express.Router();
const studentModel = require('../models/student');
const proposalModel = require('../models/proposal');
const studentStaffQAModel = require('../models/student_staff_qa')
const teamModel = require('../models/team');
const stageModel = require('../models/stage');
const checkStudentLogin = require('../middlewares/check').checkStudentLogin;
const nodemailer  = require('nodemailer');
const mongoose = require('mongoose');

const config = require('config-lite')(__dirname);
let transporter = nodemailer.createTransport(config.transporter);

router.get('/homepage', checkStudentLogin, function(req, res) {
    Promise.all([
        studentModel.getStudentByStudentID(req.session.userinfo),
        teamModel.getTeamByStudentID(req.session.userinfo),
        stageModel.getStage(),
    ])
        .then(function(result) {
            const student = result[0];
            const myTeam = result[1];
            const stage = result[2][0];
            res.render('student/homepage', {
                pageTitle: 'Homepage',
                student: student,
                myTeam: myTeam,
                stage: stage,
            });
        });
});

router.get('/all_projects', checkStudentLogin, function(req, res) {
    Promise.all([
        studentModel.getStudentByStudentID(req.session.userinfo),
        proposalModel.getAllProposals('approved'),
        proposalModel.getProposalByStudentID(req.session.userinfo),
    ])
        .then(function(result) {
            const student = result[0];
            const allProposals = result[1];
            const myProposal = result[2];
            res.render('student/all_projects', {
                pageTitle: 'All Projects',
                student: student,
                myProposal: myProposal,
                allProposals: allProposals,
            });
        });
});

router.get('/timetable', checkStudentLogin, function(req, res) {
    Promise.all([
        studentModel.getStudentByStudentID(req.session.userinfo),
    ])
        .then(function(result) {
            const student = result[0];
            res.render('student/timetable', {
                pageTitle: 'Student Q&A',
                student: student,
            });
        });
});

router.get('/student_qa', checkStudentLogin, function(req, res) {
    Promise.all([
        studentModel.getStudentByStudentID(req.session.userinfo),
        studentStaffQAModel.getQAByStudentID(req.session.userinfo),
    ])
        .then(function(result) {
            const student = result[0];
            const qa = result[1];
            res.render('student/student_qa', {
                pageTitle: 'Student Q&A',
                student: student,
                qa: qa,
            });
        });
});

router.get('/student_qa_detail', checkStudentLogin, function(req, res) {
    const qaID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        studentModel.getStudentByStudentID(req.session.userinfo),
        studentStaffQAModel.getQAByQAID(qaID),
    ])
        .then(function(result) {
            const student = result[0];
            const qa = result[1];
            res.render('student/student_qa_detail', {
                pageTitle: 'Question Detail',
                student: student,
                qa: qa,
            });
        });
});

router.get('/my_project', checkStudentLogin, function(req, res) {
    Promise.all([
        studentModel.getStudentByStudentID(req.session.userinfo),
        proposalModel.getProposalByStudentID(req.session.userinfo),
        teamModel.getTeamByStudentID(req.session.userinfo),
    ])
        .then(function(result) {
            const student = result[0];
            const proposal = result[1];
            const team = result[2];
            res.render('student/my_project', {
                pageTitle: 'My Project',
                student: student,
                proposal: proposal,
                team: team,
            });
        });
});

router.get('/project_detail', checkStudentLogin, function(req, res) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        studentModel.getStudentByStudentID(req.session.userinfo),
        proposalModel.getProposalByProposalID(proposalID),
    ])
        .then(function(result) {
            const student = result[0];
            const proposal = result[1];
            res.render('student/project_detail', {
                pageTitle: 'Project Detail',
                student: student,
                proposal: proposal,
            });
        });
});

router.get('/person_preference', checkStudentLogin, function(req, res) {
    Promise.all([
        studentModel.getStudentByStudentID(req.session.userinfo),
        studentModel.getAllStudent(),
    ])
        .then(function(result) {
            const student = result[0];
            const allStudent = result[1];
            res.render('student/person_preference', {
                pageTitle: 'Person Preference',
                student: student,
                allStudent: allStudent,
            })
        })
});

router.get('/proposal_preference', checkStudentLogin, function(req, res) {
    Promise.all([
        studentModel.getStudentByStudentID(req.session.userinfo),
        proposalModel.getAllProposals('approved'),
    ])
        .then(function(result) {
            const student = result[0];
            const allApprovedProposal = result[1];
            res.render('student/proposal_preference', {
                pageTitle: 'Proposal Preference',
                student: student,
                allApprovedProposal: allApprovedProposal,
            })
        })
});

router.get('/mark_teammate', checkStudentLogin, function(req, res) {
    Promise.all([
        studentModel.getStudentByStudentID(req.session.userinfo),
        teamModel.getTeamByStudentID(req.session.userinfo),
    ])
        .then(function(result) {
            const student = result[0];
            const team = result[1];
            res.render('student/mark_teammate', {
                pageTitle: 'Mark Teammate',
                student: student,
                team: team,
            })
        })
});

router.get('/my_mark', checkStudentLogin, function(req, res) {
    Promise.all([
        studentModel.getStudentByStudentID(req.session.userinfo),
        teamModel.getTeamByStudentID(req.session.userinfo),
        stageModel.getStage(),
    ])
        .then(function(result) {
            const student = result[0];
            const team = result[1];
            const stage = result[2][0];
            res.render('student/my_mark', {
                pageTitle: 'My Mark',
                student: student,
                team: team,
                stage: stage,
            })
        })
});

router.post('/set_people_preference', checkStudentLogin, function (req, res) {
    let person1 = req.body.person1;
    let person2 = req.body.person2;
    let person3 = req.body.person3;
    const array = []
    if (person2 != 'None2') {
        person2 = mongoose.Types.ObjectId(person2);
        array.push(person2)
    }
    if (person3 != 'None3') {
        person3 = mongoose.Types.ObjectId(person3);
        array.push(person3)
    }
    //edit database
    if (person1 != 'None1') {
        person1 = mongoose.Types.ObjectId(person1);
        Promise.all([
            studentModel.postPeopleLikeByStudentID(req.session.userinfo, person1),
        ]).then();
    } else {
        Promise.all([
            studentModel.deletePeopleLikeByStudentID((req.session.userinfo)),
        ]).then();
    }
    if(array.length != 0) {
        studentModel.deletePeopleDontLikeByStudentID(req.session.userinfo).then();
        array.forEach(function (element) {
            studentModel.postPeopleDontLikeByStudentID(req.session.userinfo, element);
        })
    } else {
        studentModel.deletePeopleDontLikeByStudentID(req.session.userinfo).then();
    }
    res.redirect('/student/homepage');
});

router.post('/set_new_representer', checkStudentLogin, function(req, res) {
    const representerID = mongoose.Types.ObjectId(req.body.representerID);
    Promise.all([
        teamModel.postTeamNewRepresenter(req.session.userinfo, representerID),
    ])
        .then(function() {
            res.redirect('/student/homepage');
        })
});

router.post('/set_project_preference', checkStudentLogin, function(req, res) {
    const projectList = req.body.projectList;
    teamModel.deleteProjectPreferenceByStudentID(req.session.userinfo).then();
    if (projectList != '') {
        let array = projectList.split(',');
        array.pop();
        array.forEach(function(element) {
            teamModel.postProjectPreferenceByStudentID(req.session.userinfo, mongoose.Types.ObjectId(element));
        })
    }
    res.redirect('/student/homepage');
});

router.post('/post_qa', checkStudentLogin, function(req, res) {
    const topic = req.body.topic;
    const content = req.body.content;
    studentModel.getStudentByStudentID(req.session.userinfo).then(function (result) {
        studentStaffQAModel.createNewQA(result, topic, content);
    });
    teamModel.getTeamByStudentID(req.session.userinfo).then(function (result) {
        transporter.sendMail({
            from: 'ssit_group3@outlook.com',
            to: result.StaffID.UserName,
            subject: "SSIT Team Project: a new student question",
            text: "You have a new student question from SSIT Team " + result.TeamName + " .",
        });
    })
    res.redirect('/student/student_qa');
});

router.post('/marking_teammate', checkStudentLogin, function(req, res) {
    const markString = req.body.mark;
    const markArray = markString.split(',');
    for (let i = 0; i < markArray.length; i++) {
        markArray[i] = parseInt(markArray[i]);
    }
    teamModel.getTeamByStudentID(req.session.userinfo).then(function(result) {
        const studentIDArray = [];
        let j = 0;
        for (let i = 0; i < result.StudentID.length; i++) {
            if (! result.StudentID[i]._id.equals(req.session.userinfo)) {
                studentModel.postTeamMateMarkByStudentID(result.StudentID[i]._id, markArray[j]).then();
                j++;
            }
        }
        studentModel.postMarkedForTeamMate(req.session.userinfo).then();
    })
    res.redirect('/student/homepage');

});

router.post('/post_reply', checkStudentLogin, function(req, res) {
    const reply = req.body.reply;
    const name = req.body.name;
    const id = mongoose.Types.ObjectId(req.query.id);
    studentStaffQAModel.postReplyByQAID(id, name, reply).then();
    res.redirect('/student/student_qa_detail?id=' + id);

});


module.exports = router;
