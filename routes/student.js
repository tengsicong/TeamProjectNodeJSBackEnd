const express = require('express');
const router = express.Router();
const studentModel = require('../models/student');
const proposalModel = require('../models/proposal');
const studentStaffQAModel = require('../models/student_staff_qa')
const teamModel = require('../models/team');
const stageModel = require('../models/stage');
const mongoose = require('mongoose');
const studentID = mongoose.Types.ObjectId('5e88d43f2366cc3ae6242f4f');

router.get('/homepage', function(req, res) {
    Promise.all([
        studentModel.getStudentByStudentID(studentID),
        teamModel.getTeamByStudentID(studentID),
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

router.get('/all_projects', function(req, res) {
    Promise.all([
        studentModel.getStudentByStudentID(studentID),
        proposalModel.getAllProposals('approved'),
        proposalModel.getProposalByStudentID(studentID),
    ])
        .then(function(result) {
            const student = result[0];
            const allProposals = result[1];
            const myProposal = result[2];
            // console.log('1' + student);
            console.log('2' + allProposals);
            // console.log('3' + myProposal.GroupID)
            res.render('student/all_projects', {
                pageTitle: 'All Projects',
                student: student,
                myProposal: myProposal,
                allProposals: allProposals,
            });
        });
});

router.get('/timetable', function(req, res) {
    Promise.all([
        studentModel.getStudentByStudentID(studentID),
    ])
        .then(function(result) {
            const student = result[0];
            res.render('student/timetable', {
                pageTitle: 'Student Q&A',
                student: student,
            });
        });
})

router.get('/student_qa', function(req, res) {
    Promise.all([
        studentModel.getStudentByStudentID(studentID),
        studentStaffQAModel.getQAByStudentID(studentID),
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
})

router.get('/student_qa_detail', function(req, res) {
    const questionID = parseInt(req.query.id);
    Promise.all([
        studentModel.getStudentByStudentID(studentID),
        studentStaffQAModel.getQAByStudentID(studentID),
    ])
        .then(function(result) {
            const student = result[0];
            const qa = result[1][questionID];
            res.render('student/student_qa_detail', {
                pageTitle: 'Question Detail',
                student: student,
                qa: qa,
            });
        });
})

router.get('/my_project', function(req, res) {
    Promise.all([
        studentModel.getStudentByStudentID(studentID),
        proposalModel.getProposalByStudentID(studentID),
        teamModel.getTeamByStudentID(studentID),
    ])
        .then(function(result) {
            const student = result[0];
            const proposal = result[1];
            const team = result[2];
            console.log(team)
            res.render('student/my_project', {
                pageTitle: 'My Project',
                student: student,
                proposal: proposal,
                team: team,
            });
        });
})

router.get('/project_detail', function(req, res) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        studentModel.getStudentByStudentID(studentID),
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
})

router.get('/person_preference', function(req, res) {
    Promise.all([
        studentModel.getStudentByStudentID(studentID),
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
})

router.get('/proposal_preference', function(req, res) {
    Promise.all([
        studentModel.getStudentByStudentID(studentID),
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
})

router.get('/mark_teammate', function(req, res) {
    Promise.all([
        studentModel.getStudentByStudentID(studentID),
        teamModel.getTeamByStudentID(studentID),
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
})

router.get('/my_mark', function(req, res) {
    Promise.all([
        studentModel.getStudentByStudentID(studentID),
        teamModel.getTeamByStudentID(studentID),
        stageModel.getStage(),
    ])
        .then(function(result) {
            const student = result[0];
            const team = result[1];
            const stage = result[2][0];
            console.log(team)
            res.render('student/my_mark', {
                pageTitle: 'My Mark',
                student: student,
                team: team,
                stage: stage,
            })
        })
})

router.post('/set_new_representer', function(req, res) {
    const representerID = mongoose.Types.ObjectId(req.body.representerID);
    Promise.all([

    ])
})


module.exports = router;
