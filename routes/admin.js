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
// const Tid = mongoose.Types.ObjectId('5e8bb4392366cc3ae6242fb5');
const staffID = mongoose.Types.ObjectId('5e7a97ab66135760069ca372');
const clientID = mongoose.Types.ObjectId('5e7d2198f8f7d40d64f332d5');
const Temp = '5e7b6f794f4ed29e60233aa2';
// teamModel.getAllTeam().then(function (result) {
//     console.log(result[0])
// })
// changeStaffMeetingRequestModel.getChangeStaffMeetingRequest().then(function (result) {
//     console.log(result[0])
// });
// changeClientMeetingRequestModel.getChangeClientMeetingRequest().then(function (result) {
//     console.log(result[0])
// })
//

/* GET edit team page. */
router.get('/edit_team', function (req, res) {
    const Tid = mongoose.Types.ObjectId(req.query.id);
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
// router.post('/editTeam',function (req,res,next) {
//     const groupID = mongoose.Types.ObjectId(req.query.id);
//
//     let team = {
//         _id:groupID,
//
//     }
//
//     teamModel.editTeam(team)
//         .then(function () {
//             res.redirect('/admin/team_list')
//         })
//         .catch(next)
// });
/* GET new team page. */
router.get('/new_team', function (req, res) {
    const Tid = mongoose.Types.ObjectId(req.query.id);

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
/*Create a new team*/
//
// router.post('/new_team', function (req, res, next) {
//     const teamName = req.body.TeamName;
//     const staffName = req.body.Name;
//     const student = req.body.StudentID;
//     // const studentUserName = req.body.UserName;
//     let team = {
//         _id: mongoose.Types.ObjectId(),
//         TeamName: teamName,
//         StaffName: staffName,
//         StudentID: student,
//     }
//     adminModel.getAdminByID(adminID),
//     teamModel.createTeam(),
//     proposalModel.getAllProposals(),
//     staffModel.getAllStaff(),
//     studentModel.getAllStudent(),
//     teamModel.getAllTeam(),
//     teamModel.createTeam()
// })

/*submit*/
router.post('/submit_newteam', function (req, res) {
    // const selector1 = req.body.selector1;
// let team = {
//     _id:mongoose.Types.ObjectId(),
//     selector1: selector1,
// }
//     teamModel.createTeam(team)
//         .then(function () {
//             res.redirect('/team_list')
//         })
//     let selector1 = req.body.selector1;
//     let selector2 = req.body.selector2;
//     let selector3 = req.body.selector3;
//

    // if (selector1 != 'None') {
        const selector1 = mongoose.Types.ObjectId(selector1);
        Promise.all([
            teamModel.postTeam(TeamName, selector1),
        ])
            .then(function () {
                res.redirect('/team_list')

            });
    // } else {
    //     Promise.all([
    //     //     ])
    //     //         .then(function () {
    //     //             res.redirect('/team_list')
    //     //         });
    // }
    // console.log('then')
    // res.redirect('/team_list')
})


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
        staffMeetingModel.getAllStaffMeetings(),
        staffModel.getStaffByStaffID((staffID)),
        clientModel.getClientByClientID(clientID),
        clientMeetingModel.getAllClientMeetings(),

    ])
        .then(function (result) {
            const admin = result[0];
            const allStaffMeetings = result[1];
            const staff = result[2];
            const client = result[3];
            const allClientMeetings = result[4];

            res.render('admin/timetable', {
                pageTitle: 'Timetable',
                admin: admin,
                allStaffMeetings: allStaffMeetings,
                staff: staff,
                client: client,
                allClientMeetings: allClientMeetings,
            });
        });
});

router.get('/timetable_change', function (req, res) {
    Promise.all([
        adminModel.getAdminByID(adminID),
        staffModel.getAllStaff((staffID)),
        changeStaffMeetingRequestModel.getChangeStaffMeetingRequest(),
        changeClientMeetingRequestModel.getChangeClientMeetingRequest(),
        teamModel.getAllTeam(),
    ])
        .then(function (result) {
            const admin = result[0];
            const allStaff = result[1];
            const changeStaffMeetingRequest = result[2];
            const changeClientMeetingRequest = result[3];
            const allTeam = result[4];


            res.render('admin/timetable_change', {
                pageTitle: 'Change Timetable',
                admin: admin,
                allStaff: allStaff,
                allTeam: allTeam,
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

router.get('/student_detail', function (req, res, next) {
    const studentID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        adminModel.getAdminByID(adminID),
        studentModel.getStudentByStudentID(studentID),
        teamModel.getTeamByStudentID(studentID),
        proposalModel.getProposalByStudentID(studentID),
    ])
        .then(function (result) {
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

//edit project
router.post('/edit_project',function (req,res,next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    const topic = req.body.topic;
    const content = req.body.content;
    newDate = new Date();
    let proposal = {
        _id:proposalID,
        Topic: topic,
        Content: content,
        Date:newDate,
    }

    proposalModel.adminEditProposal(proposal)
        .then(function () {
            res.redirect('/admin/project_list')
        })
        .catch(next)
})

router.get('/pending_approved',function (req,res,next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    newDate = new Date();
    let proposal = {
        _id:proposalID,
        Date:newDate,
        Status:'approved'
    }

    proposalModel.adminEditPendingStatusProposal(proposal)
        .then(function () {
            res.redirect('/admin/project_approved?id='+req.query.id)
        })
        .catch(next)
})

router.get('/pending_rejected',function (req,res,next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    newDate = new Date();
    let proposal = {
        _id:proposalID,
        Date:newDate,
        Status:'rejected'
    }

    proposalModel.adminEditPendingStatusProposal(proposal)
        .then(function () {
            res.redirect('/admin/project_rejected?id='+req.query.id)
        })
        .catch(next)
})

router.get('/rejected_pending',function (req,res,next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    newDate = new Date();
    let proposal = {
        _id:proposalID,
        Date:newDate,
        Status:'pending'
    }

    proposalModel.adminEditPendingStatusProposal(proposal)
        .then(function () {
            res.redirect('/admin/project_pending?id='+req.query.id)
        })
        .catch(next)
})

router.get('/approved_pending',function (req,res,next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    newDate = new Date();
    let proposal = {
        _id:proposalID,
        Date:newDate,
        Status:'pending'
    }

    proposalModel.adminEditPendingStatusProposal(proposal)
        .then(function () {
            res.redirect('/admin/project_pending?id='+req.query.id)
        })
        .catch(next)
})

router.post('/project_pending',function(req,res,next){
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    const comment = req.body.comment;
    replyDate = new Date();
    Promise.all([
        adminModel.getAdminByID(adminID),
        proposalModel.getProposalByProposalID(proposalID),
    ])
        .then(function (result) {
            console.log(result[1])
            let reply = result[1].Reply;
            reply.push({
                Author:result[0].Name,
                Comment:comment,
                ReplyDate:replyDate,
            });
            const addComment = proposalModel.addProposalComment(result[1]._id, reply);
            addComment.then(function () {
                res.redirect('/admin/project_pending?id='+req.query.id)
            })
        })
        .catch(next)
})

router.post('/project_rejected',function(req,res,next){
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    const comment = req.body.comment;
    replyDate = new Date();
    Promise.all([
        adminModel.getAdminByID(adminID),
        proposalModel.getProposalByProposalID(proposalID),
    ])
        .then(function (result) {
            console.log(result[1])
            let reply = result[1].Reply;
            reply.push({
                Author:result[0].Name,
                Comment:comment,
                ReplyDate:replyDate,
            });
            const addComment = proposalModel.addProposalComment(result[1]._id, reply);
            addComment.then(function () {
                res.redirect('/admin/project_rejected?id='+req.query.id)
            })
        })
        .catch(next)
})
//delete team
router.get('/delete_team',function(req,res,next){
    const groupID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        proposalModel.getProposalBygroupID(groupID),
        ])

    newDate = new Date();
    proposalModel.deleteTeam(groupID)
    teamModel.deleteProposalIDByProposalID(groupID,proposalID)
        .then(function (result) {
            res.redirect('/admin/project_list')
        })
        .catch(next)
})
//delete project
router.get('/delete_project',function(req,res,next){
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    newDate = new Date();
    Promise.all([
        clientModel.deleteProposalFromClientListByProposalID(clientID,proposalID),
        proposalModel.deleteProposal(proposalID)
    ])
        .then(function (result) {
            res.redirect('/admin/project_list')
        })
        .catch(next)
})

module.exports = router;
