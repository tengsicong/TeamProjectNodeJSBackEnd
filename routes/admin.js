const express = require('express');
const router = express.Router();
const proposalModel = require('../models/proposal');
const teamModel = require('../models/team');
const adminModel = require('../models/admin');
const staffModel = require('../models/staff');
const studentModel = require('../models/student');

const mongoose = require('mongoose');
const adminID = mongoose.Types.ObjectId('5e7ce2e2ad9b3de5109cb8eb');
const Tid = mongoose.Types.ObjectId('5e7b6f794f4ed29e60233aa2');
const Temp = '5e7b6f794f4ed29e60233aa2';
// adminModel.getAdminByID(adminID).then(console.log);
// studentModel.getAllStudent().then(console.log);
// teamModel.getTeamByTeamID(Tid).then(function(result) {
//     console.log(result.StaffID);
//     if (result.StaffID == undefined) {
//         console.log('true');
//     }
// });

/* GET edit team page. */
router.get('/edit_team', function(req, res) {
    // const teamID = req.params.TeamId;
    // console.log(teamID);
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
router.get('/new_team', function(req, res, next) {
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

module.exports = router;
