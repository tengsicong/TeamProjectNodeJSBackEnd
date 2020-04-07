const express = require('express');
const router = express.Router();
const studentModel = require('../models/student');
const proposalModel = require('../models/proposal');
const studentStaffQAModel = require('../models/student_staff_qa')
const teamModel = require('../models/team');
const mongoose = require('mongoose');
const studentID = mongoose.Types.ObjectId('5e7b6ace4f4ed29e60233999');

router.get('/homepage', function(req, res) {
    Promise.all([
        studentModel.getStudentByStudentID(studentID),
        teamModel.getTeamByStudentID(studentID),
    ])
        .then(function(result) {
            const student = result[0];
            const myTeam = result[1];
            res.render('student/homepage', {
                pageTitle: 'Homepage',
                student: student,
                myTeam: myTeam,
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
        studentStaffQAModel.getQAByGroupID(studentID),
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
        studentStaffQAModel.getQAByGroupID(studentID),
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
    ])
        .then(function(result) {
            const student = result[0];
            const proposal = result[1];
            console.log(proposal);
            res.render('student/my_project', {
                pageTitle: 'My Project',
                student: student,
                proposal: proposal,
            });
        });
})




module.exports = router;
