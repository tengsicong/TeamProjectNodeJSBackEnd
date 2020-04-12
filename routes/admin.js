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
// staffMeetingModel.getAllStaffMeetings().then(function (result) {
//     console.log(result[4])
// })
// teamModel.getAllTeam().then(function (result) {
//     console.log(result.length+1)
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
/*submit*/
/*Create a new team*/
router.post('/submit_newteam', function (req, res) {
    const team = teamModel.getAllTeam();
    const teamName = team.length + 1;
    teamModel.createTeam(teamName)

    let selector2 = req.body.selector2;
    let selector3 = req.body.selector3;
    let selector4 = req.body.selector4;
    let selector5 = req.body.selector5;
    let selector6 = req.body.selector6;
    let selector7 = req.body.selector7;
    let selector8 = req.body.selector8;

    const array = []
    if (selector3 != 'None3') {
        selector3 = mongoose.Types.ObjectId(selector3);
        array.push(selector3)
    }
    if (selector4 != 'None4') {
        selector4 = mongoose.Types.ObjectId(selector4);
        array.push(selector4)
    }
    if (selector5 != 'None5') {
        selector5 = mongoose.Types.ObjectId(selector5);

        array.push(selector5)
    }
    if (selector6 != 'None6') {
        selector6 = mongoose.Types.ObjectId(selector6);

        array.push(selector6)
    }
    if (selector7 != 'None7') {
        selector7 = mongoose.Types.ObjectId(selector7);
        array.push(selector7)
    }
    if (selector8 != 'None8') {
        selector8 = mongoose.Types.ObjectId(selector8);
        array.push(selector8)
    }
    if (selector2 != 'None2') {
        selector2 = mongoose.Types.ObjectId(selector2);
            Promise.all([
            teamModel.updateTeamStaff(teamName, selector2),
        ]).then();
    } else {
        Promise.all([
            teamModel.deleteTeamStaff(teamName),
        ]).then();
    }
    if (array.length != 0) {
        teamModel.deleteTeamStudent(teamName).then();
        array.forEach(function (element) {
            teamModel.updateTeamStudent(teamName, element)
        })
    } else {
        teamModel.deleteTeamStudent(teamName).then();
    }

    res.redirect('/admin/new_team');

});
/*edit_team*/
router.post('/submit_editteam', function (req, res) {
    const selector2 = mongoose.Types.ObjectId(req.body.selector2);
    // const selector3 = mongoose.Types.ObjectId(req.body.selector3);
    // const selector4 = mongoose.Types.ObjectId(req.body.selector4);
    // const selector5 = mongoose.Types.ObjectId(req.body.selector5);
    // const selector6 = mongoose.Types.ObjectId(req.body.selector6);
    // const selector7 = mongoose.Types.ObjectId(req.body.selector7);
    // const selector8 = mongoose.Types.ObjectId(req.body.selector8);
    Promise.all([
        teamModel.editTeamStaff(staffID, selector2),
    ])
        .then(function() {
            res.redirect('/admin/team_list');
        })

    //
    // const array = []
    //
    // if (selector3 != 'None3') {
    //     array.push(selector3)
    // }
    // if (selector4 != 'None4') {
    //     array.push(selector4)
    // }
    // if (selector5 != 'None5') {
    //     array.push(selector5)
    // }
    // if (selector6 != 'None6') {
    //     array.push(selector6)
    // }
    // if (selector7 != 'None7') {
    //     array.push(selector7)
    // }
    // if (selector8 != 'None8') {
    //     array.push(selector8)
    // }
    // if (selector2 != 'None2') {
    //     Promise.all([
    //         teamModel.editTeamStaff(selector2),
    //     ]).then();
    // }
    // if (array.length != 0) {
    //     array.forEach(function (element) {
    //         teamModel.editTeamStudent(element)
    //     })
    // }


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
router.post('/add_new_student', function (req, res) {
    const addStudentName = req.body.addStudentName;
    const addStudentUserName = req.body.addStudentUserName;
    studentModel.addNewStudent(addStudentName, addStudentUserName)
    res.redirect('/admin/student_list');

});
router.post('/add_new_staff', function (req, res) {
    const addStaffName = req.body.addStaffName;
    const addStaffUserName = req.body.addStaffUserName;
    const addStaffID = mongoose.Types.ObjectId(req.body._id);
    staffModel.addNewStaff(addStaffName, addStaffUserName)
    staffMeetingModel.addStaffMeeting1(addStaffID)
    staffMeetingModel.addStaffMeeting2(addStaffID)
    staffMeetingModel.addStaffMeeting3(addStaffID)
    staffMeetingModel.addStaffMeeting4(addStaffID)
    staffMeetingModel.addStaffMeeting5(addStaffID)

    res.redirect('/admin/team_list');

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
router.get('/reject_timetable_change_staff', function (req, res, next) {
    const changeStaffMeetingRequestID = mongoose.Types.ObjectId(req.query.id);
    const rejectreason = req.query.rejectreason;
    nowDate = new Date();

    let request = {
        _id: changeStaffMeetingRequestID,
        Status: 'rejected',
        AdminReply:{
            AdminName:"Emma Norling",
            Date:nowDate,
            Content:rejectreason
        }
    }
    changeStaffMeetingRequestModel.createRequestReason(rejectreason)
    changeStaffMeetingRequestModel.adminRejectPendingStatusTimetable(request)
        .then(function () {
            res.redirect('/admin/timetable_change')
        })
        .catch(next)

})
router.get('/staff_timetable_pending', function (req, res, next) {
    const changeStaffMeetingRequestID = mongoose.Types.ObjectId(req.query.id);
    let changestaffmeetingrequest = {
        _id: changeStaffMeetingRequestID,
        Status: 'approved'
    }

    changeStaffMeetingRequestModel.adminEditPendingStatusTimetable(changestaffmeetingrequest)
        .then(function () {
            res.redirect('/admin/timetable_change')
        })
        .catch(next)

})
router.get('/client_timetable_pending', function (req, res, next) {
    const changeClientMeetingRequestID = mongoose.Types.ObjectId(req.query.id);
    let changeclientmeetingrequest = {
        _id: changeClientMeetingRequestID,
        Status: 'approved'
    }

    changeClientMeetingRequestModel.adminEditCPendingStatusTimetable(changeclientmeetingrequest)
        .then(function () {
            res.redirect('/admin/timetable_change')
        })
        .catch(next)

})
/* edit meeting request*/
router.post('/mytimetable', function(req, res,next) {
    const selectMeetingid = mongoose.Types.ObjectId(req.body.selectmeeting);
    const group = mongoose.Types.ObjectId(req.body.group);
    let role = req.body.role;
    role = mongoose.Types.ObjectId(role);
    const place =req.body.place;
    const supervisor = mongoose.Types.ObjectId(req.body.supervisor);
    const client_changetime = req.body.client_changetime;

    nowDate = new Date();
    Promise.all([
        clientMeetingModel.getClientMeetingByMeetingID(selectMeetingid),
       // staffMeetingModel.getStaffMeetingByMeetingID(selectMeetingid)
    ])
        .then(function (result) {
            const meetings = result[1];
            let request = {
                MeetingID: result[0]._id,
                ClientID: clientID,
                Status:'pending',
                NewMeetingTime:time,
                RequestComment:{
                    RequestName:result[0].ClientID.Name,
                    Date:nowDate,
                    Content:reason
                }}
            changeClientMeetingRequestModel.createChangeClientMeetingRequest(request);
            res.redirect('/admin/timetable')
        });
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
router.post('/edit_project', function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    router.post('/edit_project', function (req, res, next) {
        const proposalID = mongoose.Types.ObjectId(req.body.proposalID);
        console.log('id= ' + proposalID)
        const topic = req.body.topic;
        const content = req.body.content;
        newDate = new Date();
        let proposal = {
            _id: proposalID,
            Topic: topic,
            Content: content,
            Date: newDate,
        }

        proposalModel.adminEditProposal(proposal)
            .then(function () {
                res.redirect('/admin/project_list')
            })
            .catch(next)
    })

    router.get('/pending_approved', function (req, res, next) {
        const proposalID = mongoose.Types.ObjectId(req.query.id);
        newDate = new Date();
        let proposal = {
            _id: proposalID,
            Date: newDate,
            Status: 'approved'
        }

        proposalModel.adminEditPendingStatusProposal(proposal)
            .then(function () {
                res.redirect('/admin/project_approved?id=' + req.query.id)
            })
            .catch(next)
    })

    router.get('/pending_rejected', function (req, res, next) {
        const proposalID = mongoose.Types.ObjectId(req.query.id);
        newDate = new Date();
        let proposal = {
            _id: proposalID,
            Date: newDate,
            Status: 'rejected'
        }

        proposalModel.adminEditPendingStatusProposal(proposal)
            .then(function () {
                res.redirect('/admin/project_rejected?id=' + req.query.id)
            })
            .catch(next)
    })

    router.get('/rejected_pending', function (req, res, next) {
        const proposalID = mongoose.Types.ObjectId(req.query.id);
        newDate = new Date();
        let proposal = {
            _id: proposalID,
            Date: newDate,
            Status: 'pending'
        }

        proposalModel.adminEditPendingStatusProposal(proposal)
            .then(function () {
                res.redirect('/admin/project_pending?id=' + req.query.id)
            })
            .catch(next)
    })

    router.get('/approved_pending', function (req, res, next) {
        const proposalID = mongoose.Types.ObjectId(req.query.id);
        newDate = new Date();
        let proposal = {
            _id: proposalID,
            Date: newDate,
            Status: 'pending'
        }

        proposalModel.adminEditPendingStatusProposal(proposal)
            .then(function () {
                res.redirect('/admin/project_pending?id=' + req.query.id)
            })
            .catch(next)
    })

    router.post('/project_pending', function (req, res, next) {
        const proposalID = mongoose.Types.ObjectId(req.body.proposalID);
        const comment = req.body.comment;
        replyDate = new Date();
        Promise.all([
            adminModel.getAdminByID(adminID),
            proposalModel.getProposalByProposalID(proposalID),
        ])
            .then(function (result) {
                // console.log(result[1])
                let reply = result[1].Reply;
                reply.push({
                    Author: result[0].Name,
                    Comment: comment,
                    ReplyDate: replyDate,
                });
                const addComment = proposalModel.addProposalComment(result[1]._id, reply);
                addComment.then(function () {
                    res.redirect('/admin/project_pending?id=' + proposalID)
                })
            })
            .catch(next)
    })

    router.post('/project_rejected', function (req, res, next) {
        const proposalID = mongoose.Types.ObjectId(req.body.proposalID);
        const comment = req.body.comment;
        replyDate = new Date();
        Promise.all([
            adminModel.getAdminByID(adminID),
            proposalModel.getProposalByProposalID(proposalID),
        ])
            .then(function (result) {
                // console.log(result[1])
                let reply = result[1].Reply;
                reply.push({
                    Author: result[0].Name,
                    Comment: comment,
                    ReplyDate: replyDate,
                });
                const addComment = proposalModel.addProposalComment(result[1]._id, reply);
                addComment.then(function () {
                    res.redirect('/admin/project_rejected?id=' + proposalID)
                })
            })
            .catch(next)
    })
//delete team
    router.post('/delete_team', function (req, res, next) {
        const teamID = mongoose.Types.ObjectId(req.body.teamID);
        const proposalId = mongoose.Types.ObjectId(req.body.proposalID);
        proposalModel.deleteProposalTeamByGroupID(proposalId, teamID);//success
        clientMeetingModel.deleteClientMeetingByGroupID(teamID);
        teamModel.deleteTeamProposalByGroupID(teamID);//un
        Promise.all([
            clientModel.getClientByProposalID(proposalId),
            clientMeetingModel.getClientMeetingByGroupID(teamID),
        ])
            .then(function (result) {
                const clientID = result[0]._id;
                clientModel.deleteGroupFromClientListByGroupID(clientID, teamID);//un
                const meetings = result[1]
                let meetingid = [];
                for (let i = 0; i < meetings.length; i++) {
                    meetingid.push(meetings[i]._id);
                    changeClientMeetingRequestModel.deleteChangeClientMeetingRequestByMeetingID(meetingid[i]);
                }
                ;
                res.redirect('/admin/project_approved?id=' + proposalId)
            })
            .catch(next);
    })


//delete project
    router.get('/delete_project', function (req, res, next) {
        const proposalID = mongoose.Types.ObjectId(req.query.id);
        newDate = new Date();
        Promise.all([
            clientModel.deleteProposalFromClientListByProposalID(clientID, proposalID),
            proposalModel.deleteProposal(proposalID)
        ])
            .then(function (result) {
                res.redirect('/admin/project_list')
            })
            .catch(next)
    })

    router.post('/allocate_team', function (req, res) {
        const teamID = mongoose.Types.ObjectId(req.body.teamID);
        const proposalId = mongoose.Types.ObjectId(req.body.proposalID);
        proposalModel.updateGroupOfProposalListByGroupID(proposalId, teamID);
        newDate = new Date();
        for (let i = 0; i < 5; i++) {
            Promise.all([
                clientModel.getClientByProposalID(proposalId),
                clientMeetingModel.getAllClientMeetings(),
            ])
                .then(function (result) {
                    const meetingnumber = result[1].length + 1;
                    let clientmeeting = {
                        _id: mongoose.Types.ObjectId(),
                        GroupID: teamID,
                        Date: newDate,
                        Place: 'ClassRoom 2',
                        ClientID: result[0]._id,
                        MeetingNumber: meetingnumber + i,
                    }
                    clientMeetingModel.addClientMeeting(clientmeeting);//成功
                })
        }
        ;
        Promise.all([clientModel.getClientByProposalID(proposalId),])
            .then(function (result) {
                clientModel.updateGroupOfClientListByGroupID(result[0]._id, teamID);
                Promise.all([clientMeetingModel.getClientMeetingByGroupID(teamID)]).then(function (result) {
                    const meetings = result[0];
                    console.log(meetings)
                    let meetingid = [];
                    for (let i = 0; i < meetings.length; i++) {
                        meetingid.push(meetings[i]._id);
                    }
                    ;
                    console.log(meetingid)
                    teamModel.allocateProposal(teamID, proposalId, meetingid);//unsuccessful
                })
                res.redirect('/admin/project_approved?id=' + proposalId);
            })
    })
});

module.exports = router;
