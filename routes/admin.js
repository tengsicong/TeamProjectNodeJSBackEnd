const express = require('express');
const router = express.Router();
const proposalModel = require('../models/proposal');
const teamModel = require('../models/team');
const adminModel = require('../models/admin');
const staffModel = require('../models/staff');
const clientModel = require('../models/client');
const studentModel = require('../models/student');
const clientMeetingModel = require('../models/clientmeetings');
const staffMeetingModel = require('../models/staffmeetings');
const changeStaffMeetingRequestModel = require('../models/changestaffmeetingrequest');
const changeClientMeetingRequestModel = require('../models/changeclientmeetingrequest');


const mongoose = require('mongoose');
const adminID = mongoose.Types.ObjectId('5e7ce2e2ad9b3de5109cb8eb');
const Tid = mongoose.Types.ObjectId('5e8bb4392366cc3ae6242fb5');
const staffID = mongoose.Types.ObjectId('5e7aa6c6446d0305c8e28c6d');
const clientID = mongoose.Types.ObjectId('5e7d2198f8f7d40d64f332d5');

const Temp = '5e7b6f794f4ed29e60233aa2';
// clientMeetingModel.getClientMeetingByClientID(clientID).then(function(result) {
//     console.log(result[0]);
// });
// studentModel.getAllStudent().then(function (result) {
//     console.log('----\n'+result[0])
//
// });
// changeStaffMeetingRequestModel.getChangeStaffMeetingRequest().then(function (result) {
//     console.log(result)
// })
//



/* GET edit team page. */
router.get('/edit_team', function (req, res) {

    Promise.all([
        adminModel.getAdminByID(adminID),
        teamModel.getTeamByTeamID(Tid),
        proposalModel.getAllProposals(),
        staffModel.getAllStaff(),
        studentModel.getAllStudent(),
    ])
        .then(function (result) {
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
router.get('/new_team', function (req, res) {
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
        .then(function (result) {
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
router.get('/team_list', function (req, res) {

    Promise.all([
        adminModel.getAdminByID(adminID),
        teamModel.getAllTeam(),
    ])
        .then(function (result) {
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
router.get('/student_list', function (req, res) {

    Promise.all([
        adminModel.getAdminByID(adminID),
        studentModel.getAllStudent(),
    ])
        .then(function (result) {
            const admin = result[0];
            const allStudent = result[1];
            console.log(allStudent[0].GroupID.ProposalID);

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
        .then(function (result) {
            const admin = result[0];
            res.render('admin/timetable', {
                pageTitle: 'Timetable',
                admin: admin,
            });
        });
});

router.get('/timetable_change', function (req, res) {
    Promise.all([
        adminModel.getAdminByID(adminID),
        staffMeetingModel.getStaffMeetingByStaffID(staffID),
        clientMeetingModel.getClientMeetingByClientID(clientID),
        staffModel.getStaffByStaffID((staffID)),
        clientModel.getClientByClientID(clientID),
        changeStaffMeetingRequestModel.getChangeStaffMeetingRequest(),
        changeClientMeetingRequestModel.getChangeClientMeetingRequest(),
    ])
        .then(function (result) {
            const admin = result[0];
            const staffMeetings = result[1];
            const clientMeetings = result[2];
            const staff = result[3];
            const client = result[4];
            const changeStaffMeetingRequest = result[5];
            const changeClientMeetingRequest = result[6];

            res.render('admin/timetable_change', {
                pageTitle: 'Change Timetable',
                admin: admin,
                staffMeetings: staffMeetings,
                clientMeetings: clientMeetings,
                staff: staff,
                client: client,
                changeStaffMeetingRequest: changeStaffMeetingRequest,
                changeClientMeetingRequest: changeClientMeetingRequest,
            });
        })
});

router.get('/project_list', function (req, res, next) {
    Promise.all([
        adminModel.getAdminByID(adminID),
        proposalModel.getAllProposals(),
    ])
        .then(function (result) {
            const admin = result[0];

            res.render('admin/project_list', {
                proposal: result[1],
                pageTitle: 'Project List',
                admin: admin,
            });
        });
});

router.get('/edit_project', function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        adminModel.getAdminByID(adminID),
        proposalModel.getProposalByProposalID(proposalID),
    ])
        .then(function (result) {
            const admin = result[0];
            res.render('admin/edit_project', {
                proposal: result[1],
                pageTitle: 'Edit project',
                admin: admin,
            });
        })
        .catch(next);
});

router.get('/project_approved', function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        adminModel.getAdminByID(adminID),
        proposalModel.getProposalByProposalID(proposalID),
        teamModel.getGroupByProposalID(proposalID),
        teamModel.getAllTeam(),
    ])
        .then(function (result) {
            const admin = result[0];
            const proposal = result[1];
            const teams = result[2];
            const allTeam = result[3];
            console.log(proposal.ClientID);
            res.render('admin/project_approved', {
                proposal: proposal,
                teams: teams,
                pageTitle: proposal.Topic,
                admin: admin,
                allTeam: allTeam,
            });
        })
        .catch(next);
});

router.get('/project_pending', function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        adminModel.getAdminByID(adminID),
        proposalModel.getProposalByProposalID(proposalID),
    ])
        .then(function (result) {
            const admin = result[0];
            const proposal = result[1];
            console.log(proposal.ClientID);
            res.render('admin/project_pending', {
                proposal: proposal,
                pageTitle: proposal.Topic,
                admin: admin,
            });
        })
        .catch(next);
});

router.get('/project_rejected', function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        adminModel.getAdminByID(adminID),
        proposalModel.getProposalByProposalID(proposalID),
    ])
        .then(function (result) {
            const admin = result[0];
            const proposal = result[1];
            console.log(proposal.Reply)
            res.render('admin/project_rejected', {
                proposal: proposal,
                pageTitle: proposal.Topic,
                admin: admin,
            });
        })
        .catch(next);
});

router.get('/student_detail', function(req, res, next) {
    const studentID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        adminModel.getAdminByID(adminID),
        studentModel.getStudentByStudentID(studentID),
        teamModel.getTeamByStudentID(studentID),
        proposalModel.getProposalByStudentID(studentID),
    ])
        .then(function(result) {
            const admin = result[0];
            const student = result[1];
            const team = result[2];
            const proposal = result[3];
            //console.log(team.StaffMark);
            res.render('admin/student_detail', {
                pageTitle: 'Student Detail',
                admin: admin,
                student: student,
                team: team,
                proposal: proposal,
            });
        });
});

module.exports = router;
