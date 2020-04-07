const express = require('express');
const router = express.Router();
const proposalModel = require('../models/proposal');
const teamModel = require('../models/team');
const adminModel = require('../models/admin');
const staffModel = require('../models/staff');
const studentModel = require('../models/student');

const mongoose = require('mongoose');
const adminID = mongoose.Types.ObjectId('5e7ce2e2ad9b3de5109cb8eb');
const Tid = mongoose.Types.ObjectId('5e87086fce306c528bc03145');
const Temp = '5e7b6f794f4ed29e60233aa2';
// teamModel.getAllTeam().then(function(result) {
//     console.log(result[0]);
// });
studentModel.getAllStudent().then(function (result) {
    console.log('111'+result[1])

});
/* GET edit team page. */
router.get('/edit_team', function(req, res) {

    Promise.all([
        adminModel.getAdminByID(adminID),
        teamModel.getTeamByTeamID(Tid),
        proposalModel.getAllProposals(),
        staffModel.getAllStaff(),
        studentModel.getAllStudent(),
    ])
        .then(function(result) {
            const admin = result[0];
            const team = result[1];
            const allProposal = result[2];
            const allStaff = result[3];
            // console.log(allStaff);
            const allStudent = result [4];
            res.render('admin/edit_team', {
                pageTitle: 'Edit Team',
                admin: admin,
                team: team,
                allProposal: allProposal,
                allStaff: allStaff,
                allStudent: allStudent,
            });
        });
});
/* GET new team page. */
router.get('/new_team', function(req, res) {
    // const teamID = req.params.TeamId;
    // console.log(teamID);
    Promise.all([
        adminModel.getAdminByID(adminID),
        teamModel.getTeamByTeamID(Tid),
        proposalModel.getAllProposals(),
        staffModel.getAllStaff(),
        studentModel.getAllStudent(),
        teamModel.getAllTeam(),
    ])
        .then(function(result) {
            const admin = result[0];
            const team = result [1];
            const allProposal = result[2];
            const allStaff = result[3];
            const allStudent = result [4];
            const allTeam = result [5];

            res.render('admin/new_team', {
                pageTitle: 'New Team',
                admin: admin,
                team: team,
                allTeam: allTeam,
                allProposal: allProposal,
                allStaff: allStaff,
                allStudent: allStudent,
            });
        });
});
router.get('/team_list', function(req, res) {

    Promise.all([
        adminModel.getAdminByID(adminID),
        teamModel.getAllTeam(),
    ])
        .then(function(result) {
            const admin = result[0];
            const allTeam = result[1];
            // console.log(allTeam)
            res.render('admin/team_list', {
                pageTitle: 'Team List',
                admin: admin,
                allTeam: allTeam,
            });
        });
});
router.get('/student_list', function(req, res) {

    Promise.all([
        adminModel.getAdminByID(adminID),
        studentModel.getAllStudent(),
    ])
        .then(function(result) {
            const admin = result[0];
            const allStudent = result[1];
            console.log(allStudent)
            res.render('admin/student_list', {
                pageTitle: 'Student List',
                admin: admin,
                allStudent: allStudent,
            });
        });
});
router.get('/timetable', function (req, res) {
    Promise.all([
        adminModel.getAdminByID(adminID),
    ])
        .then(function(result) {
            const admin = result[0];
            // console.log(allTeam)
            res.render('admin/timetable', {
                pageTitle: 'Timetable',
                admin: admin,
            });
        });
});
router.get('/timetable_change', function (req, res) {
    Promise.all([
        adminModel.getAdminByID(adminID),
    ])
        .then(function (result) {
            const admin = result[0];
            // console.log(allTeam)
            res.render('admin/timetable_change', {
                pageTitle: 'Change Timetable',
                admin: admin,
            });
        });
});

router.get('/project_list', function(req, res, next) {
    Promise.all([
        adminModel.getAdminByID(adminID),
        proposalModel.getAllProposals(),

    ])
        .then(function(result) {
            const admin = result[0];

            res.render('admin/project_list', {
                proposal: result[1],
                pageTitle: 'Project List',
                admin: admin,
            });
        });
});

router.get('/project_list/edit_project', function(req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        adminModel.getAdminByID(adminID),
        proposalModel.getProposalByProposalID(proposalID),
    ])
        .then(function(result) {
            const admin = result[0];
            res.render('admin/edit_project', {
                proposal: result[1],
                pageTitle: 'Edit project',
                admin: admin,
            });
        })
        .catch(next);
});

router.get('/project_list/project_approved', function(req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        adminModel.getAdminByID(adminID),
        proposalModel.getProposalByProposalID(proposalID),
        teamModel.getAllTeam(),
    ])
        .then(function(result) {
            const admin = result[0];
            res.render('admin/project_approved', {
                proposal: result[1],
                team: result[2],
                pageTitle: result[1].Topic,
                admin: admin,
            });
        })
        .catch(next);
});

router.get('/project_list/project_pending', function(req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        adminModel.getAdminByID(adminID),
        proposalModel.getProposalByProposalID(proposalID),
    ])
        .then(function(result) {
            const admin = result[0];
            res.render('admin/project_pending', {
                proposal: result[1],
                pageTitle: result[1].Topic,
                admin: admin,
            });
        })
        .catch(next);
});

router.get('/project_list/project_rejected', function(req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        adminModel.getAdminByID(adminID),
        proposalModel.getProposalByProposalID(proposalID),
    ])
        .then(function(result) {
            const admin = result[0];
            res.render('admin/project_rejected', {
                proposal: result[1],
                pageTitle: result[1].Topic,
                admin: admin,
            });
        })
        .catch(next);
});
module.exports = router;
