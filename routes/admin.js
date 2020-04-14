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
    // 定义获得的staff的id
    // 定义获得的student id
    // 定义teamname
    //
    // teams库
    // students库
    // staffs库
    // strecord
    // staffmeeting库


    const staffID = mongoose.Types.ObjectId(req.body.staffID);
    const studentID = req.body.studentID;
    const studentArray = studentID.split(',');
    const studentIDArray = [];
    studentArray.forEach(function (result) {
        studentIDArray.push(mongoose.Types.ObjectId(result));
    })
    const representer = mongoose.Types.ObjectId(studentArray[0]);
    teamModel.getAllTeam().then(function (result) {
        const teamName = result.length + 1;
        teamModel.createTeam(studentIDArray, staffID, representer, teamName).then(function (result) {
            const groupID = result._id;
            for (let i = 0; i < studentIDArray.length; i++) {
                studentModel.postStudentTeamByStudentID(studentIDArray[i], groupID).then();
            }
            staffModel.postGroupIDByStaffID(staffID, groupID).then();
            const date = new Date();
            const place = "classroom n";
            Promise.all([
                staffMeetingModel.createStaffMeeting(groupID, staffID, date, place, Number(1)),
                staffMeetingModel.createStaffMeeting(groupID, staffID, date, place, Number(2)),
                staffMeetingModel.createStaffMeeting(groupID, staffID, date, place, Number(3)),
                staffMeetingModel.createStaffMeeting(groupID, staffID, date, place, Number(4)),
                staffMeetingModel.createStaffMeeting(groupID, staffID, date, place, Number(5)),
            ])
                .then(function (result) {
                    const staffMeetingList = result;
                    for (let i = 0; i < staffMeetingList.length; i++) {
                        teamModel.addStaffMeetingID(groupID, staffMeetingList[i]._id).then();
                    }
                    res.redirect('/admin/team_list');
                })
        });

    })
});
/*edit_team*/
router.post('/submit_editteam', function (req, res) {
    // 定义获得的staff的id
    // 定义获得的student id
    // 定义teamname
    //edit team
    //获取当前groupID
    //获取新staffID
    //获取新studentlist
    //studentlist（string）---array【id】
    //(1)根据我已有groupID和stafffID新生成5new staffmeeting--返回值（5个meeting对象）
    //根据上一步的返回值------array【id】
    // (2)teams 根据groupid来findOneAndUpdate---覆盖staffID，studentIDlist，staffmeetingIDlist，RepresenterID-------返回值（旧的team的信息)
    // (3)获取旧的staffID,旧的studentID------->查找到的对应对象的GROUPid信息删掉, ,旧的staffmettingID--->对应的staffmeeting对象完全删除
    // (4)新staffID, studengID[]------>添加GroupID
    //---redirect
    // 1--2---3，4,redirect
    //只改200010-wkxtest (team库-studentid[]元素  students库-200010， wkxde groupID，  team库--representer， staffmeeting
    const staffID = mongoose.Types.ObjectId(req.body.staffID);
    const studentID = req.body.studentID;
    const studentArray = studentID.split(',');
    const studentIDArray = [];
    studentArray.forEach(function (result) {
        studentIDArray.push(mongoose.Types.ObjectId(result));
    })
    const representer = mongoose.Types.ObjectId(studentArray[0])

    const Tid = mongoose.Types.ObjectId(req.body.Tid);
    const date = new Date();
    const place = "classroom m";

    Promise.all([

        staffMeetingModel.createStaffMeeting(staffID, Tid, date, place, Number(1)),
        staffMeetingModel.createStaffMeeting(staffID, Tid, date, place, Number(2)),
        staffMeetingModel.createStaffMeeting(staffID, Tid, date, place, Number(3)),
        staffMeetingModel.createStaffMeeting(staffID, Tid, date, place, Number(4)),
        staffMeetingModel.createStaffMeeting(staffID, Tid, date, place, Number(5)),

    ]).then(function (result) {
        const staffMeetingList = [];

        result.forEach(function (list) {
            staffMeetingList.push(list)
        })
        const staffMeetingIDList = [];
        for (let i = 0; i < staffMeetingList.length; i++) {
            staffMeetingIDList.push(staffMeetingList[i]._id)
        }
        console.log(staffMeetingIDList);
        teamModel.editTeam(Tid, staffID, studentIDArray, staffMeetingIDList, representer)
            .then(function (result) {
                // console.log(result)
                const preStaffID = result.StaffID;
                const preStudentID = result.StudentID;
                const prestaffmeetingID = result.StaffMeetingID;
                staffModel.deletePreGroupID(preStaffID)
                for (let j = 0; j < preStudentID.length; j++) {
                    studentModel.deletePreStudentGroupID((preStudentID[j])).then()
                }
                for (let j = 0; j < prestaffmeetingID.length; j++) {
                    staffMeetingModel.deletePreStaffMeeting(prestaffmeetingID[j]).then();
                }
                    staffModel.addNewStaffGroupID(staffID, Tid)
                for (let j = 0; j < studentIDArray.length; j++) {
                    studentModel.addNewStudentGroupID((studentIDArray[j]),Tid )
                }
                    res.redirect('/admin/team_list')
            })

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

router.get('/staff_request_reject', function (req, res) {
    const changeStaffMeetingRequestID = mongoose.Types.ObjectId(req.query.id);
    const rejectreason = req.query.rejectreason;
    const nowDate = new Date();

    let command = {
        id: changeStaffMeetingRequestID,
        Status: 'rejected',
        AdminReply: {
            AdminName: "Emma Norling",
            Date: nowDate,
            Content: rejectreason,
        }
    }
    console.log(rejectreason)
    changeStaffMeetingRequestModel.adminRejectRequest(command)
        .then(function () {
            res.redirect('/admin/timetable_change')
        })
})

router.get('/staff_request_approve', function (req, res) {
    const changeStaffMeetingRequestID = mongoose.Types.ObjectId(req.query.id);
    changeStaffMeetingRequestModel.adminApproveRequest(changeStaffMeetingRequestID)
        .then(function (result) {
            const meetingtime = result.NewMeetingTime;
            const newstaff = result.NewStaffID;
            const staffmeetingID = result.MeetingID
            staffMeetingModel.editStaffMeetingByChangeMeeting(staffmeetingID, meetingtime, newstaff).then(function () {
                res.redirect('/admin/timetable_change')
            })
        })
    //[!!shao hao duo dong xistaff meeting  de new time / new supervisor]
})

router.get('/client_request_approve', function (req, res, next) {
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
router.post('/mytimetable', function (req, res, next) {
    const selectMeetingid = mongoose.Types.ObjectId(req.body.selectmeeting);
    const group = mongoose.Types.ObjectId(req.body.group);
    let role = req.body.role;
    role = mongoose.Types.ObjectId(role);
    const place = req.body.place;
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
                Status: 'pending',
                NewMeetingTime: time,
                RequestComment: {
                    RequestName: result[0].ClientID.Name,
                    Date: nowDate,
                    Content: reason
                }
            }
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
            //console.log(proposal.ClientID);
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
            //console.log(proposal.ClientID);
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
            //console.log(proposal.Reply)
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
        //console.log('id= ' + proposalID)
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
    });
});

router.get('/pending_approved', function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    const newDate = new Date();
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
});

router.get('/pending_rejected', function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    const newDate = new Date();
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
});

router.get('/rejected_pending', function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    const newDate = new Date();
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
});

router.get('/approved_pending', function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([teamModel.getGroupByProposalID(proposalID)]).then(function (result) {
        const teams = result[0];
        for(let i=0;i<teams.length;i++){
            proposalModel.deleteProposalTeamByGroupID(proposalID, teams[i]._id);
            teamModel.deleteTeamProposalByGroupID(teams[i]._id);
            Promise.all([
                clientModel.getClientByProposalID(proposalID),
                clientMeetingModel.getClientMeetingByGroupID(teams[i]._id),
            ])
                .then(function (result) {
                    const clientID = result[0]._id;
                    clientModel.deleteGroupFromClientListByGroupID(clientID, teams[i]._id);
                    const meetings = result[1]
                    for (let j = 0; j < meetings.length; j++) {
                        const meetingid = meetings[j]._id;
                        changeClientMeetingRequestModel.deleteChangeClientMeetingRequestByMeetingID(meetingid);
                    }
                    clientMeetingModel.deleteClientMeetingByGroupID(teams[i]._id);
                    ;
                })
        }})
    const newDate = new Date();
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
});


router.post('/project_rejected', function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.body.proposalID);
    const comment = req.body.comment;
    const replyDate = new Date();
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
});

//delete team
router.post('/delete_team', function (req, res, next) {
    const teamID = mongoose.Types.ObjectId(req.body.teamID);
    const proposalId = mongoose.Types.ObjectId(req.body.proposalID);
    proposalModel.deleteProposalTeamByGroupID(proposalId, teamID);
    teamModel.deleteTeamProposalByGroupID(teamID);
    Promise.all([
        clientModel.getClientByProposalID(proposalId),
        clientMeetingModel.getClientMeetingByGroupID(teamID),
    ])
        .then(function (result) {
            const clientID = result[0]._id;
            clientModel.deleteGroupFromClientListByGroupID(clientID, teamID);
            const meetings = result[1];
            for (let i = 0; i < meetings.length; i++) {
                const meetingid = meetings[i]._id;
                changeClientMeetingRequestModel.deleteChangeClientMeetingRequestByMeetingID(meetingid);
            }
            clientMeetingModel.deleteClientMeetingByGroupID(teamID);
            ;
            res.redirect('/admin/project_approved?id=' + proposalId)
        })
        .catch(next);
});


//delete project
router.post('/delete_project', function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.body.proposalID);
    Promise.all([
        clientModel.deleteProposalFromClientListByProposalID(clientID, proposalID),
        proposalModel.deleteProposal(proposalID)
    ])
        .then(function (result) {
            res.redirect('/admin/project_list')
        })
        .catch(next)
});

router.post('/allocate_team', function (req, res) {
    const teamID = mongoose.Types.ObjectId(req.body.teamID);
    const proposalId = mongoose.Types.ObjectId(req.body.proposalID);
    proposalModel.updateGroupOfProposalListByGroupID(proposalId, teamID);
    const newDate = new Date();
    for (let i = 0; i < 5; i++) {
        Promise.all([
            clientModel.getClientByProposalID(proposalId),
            clientMeetingModel.getClientMeetingByGroupID(teamID),
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
                };
                clientMeetingModel.addClientMeeting(clientmeeting).then(function (result) {
                        teamModel.addClientMeetingByGroupID(teamID, result._id)
                    }
                );
            });
    }
    ;
    Promise.all([clientModel.getClientByProposalID(proposalId),])
        .then(function (result) {
            clientModel.updateGroupOfClientListByGroupID(result[0]._id, teamID);
            Promise.all([
                clientMeetingModel.getClientMeetingByGroupID(teamID)
            ]).then(function (result) {
                teamModel.allocateProposal(teamID, proposalId);
            });
            res.redirect('/admin/project_approved?id=' + proposalId);
        });
});
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
                    };
                    clientMeetingModel.addClientMeeting(clientmeeting).then(function (result) {
                        teamModel.addMeeting(meetingID)
                    });//成功
                });
        };
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
                });
                res.redirect('/admin/project_approved?id=' + proposalId);
            });
    });

module.exports = router;
