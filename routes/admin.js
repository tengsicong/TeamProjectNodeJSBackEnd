const express = require('express');
const router = express.Router();
const checkAdminLogin = require('../middlewares/check').checkAdminLogin;

const proposalModel = require('../models/proposal');
const teamModel = require('../models/team');
const adminModel = require('../models/admin');
const stageModel = require('../models/stage');
const staffModel = require('../models/staff');
const clientModel = require('../models/client');
const studentModel = require('../models/student');
const clientMeetingModel = require('../models/clientmeetings');
const staffMeetingModel = require('../models/staffmeetings');
const changeStaffMeetingRequestModel = require('../models/changestaffmeetingrequest');
const changeClientMeetingRequestModel = require('../models/changeclientmeetingrequest');
const mongoose = require('mongoose');
const nodemailer  = require('nodemailer');
const config = require('config-lite')(__dirname);

let transporter = nodemailer.createTransport(config.transporter);

/* GET edit team page. */
router.get('/edit_team', checkAdminLogin,function (req, res) {
    const Tid = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        adminModel.getAdminByID(req.session.userinfo),
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
router.get('/new_team', checkAdminLogin,function (req, res) {
    const Tid = mongoose.Types.ObjectId(req.query.id);

    Promise.all([
        adminModel.getAdminByID(req.session.userinfo),
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
router.post('/submit_newteam',checkAdminLogin, function (req, res) {
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
router.post('/submit_editteam',checkAdminLogin, function (req, res) {
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
        teamModel.editTeam(Tid, staffID, studentIDArray, staffMeetingIDList, representer)
            .then(function (result) {
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

router.get('/team_list', checkAdminLogin,function (req, res) {
    Promise.all([
        adminModel.getAdminByID(req.session.userinfo),
        teamModel.getAllTeam(),
    ])
        .then(function (result) {
            const admin = result[0];
            const allTeam = result[1];
            res.render('admin/team_list', {
                pageTitle: 'Team List',
                admin: admin,
                allTeam: allTeam,
            });
        });
});
router.get('/student_list', checkAdminLogin,function (req, res) {

    Promise.all([
        adminModel.getAdminByID(req.session.userinfo),
        studentModel.getAllStudent(),
    ])
        .then(function (result) {
            const admin = result[0];
            const allStudent = result[1];
            res.render('admin/student_list', {
                pageTitle: 'Student List',
                admin: admin,
                allStudent: allStudent,
            });
        });
});
router.post('/add_new_student',checkAdminLogin, function (req, res) {
    const addStudentName = req.body.addStudentName;
    const addStudentUserName = req.body.addStudentUserName;
    studentModel.addNewStudent(addStudentName, addStudentUserName)
    res.redirect('/admin/student_list');

});
router.post('/add_new_staff',checkAdminLogin, function (req, res) {
    const addStaffName = req.body.addStaffName;
    const addStaffUserName = req.body.addStaffUserName;
    const addStaffID = mongoose.Types.ObjectId(req.body._id);
    staffModel.addNewStaff(addStaffName, addStaffUserName)

    res.redirect('/admin/team_list');

});
router.get('/timetable', checkAdminLogin,function (req, res) {
    Promise.all([
        adminModel.getAdminByID(req.session.userinfo),
        staffMeetingModel.getAllStaffMeetings(),
        clientMeetingModel.getAllClientMeetings(),
        changeStaffMeetingRequestModel.getAllChangeStaffMeetingRequest(),
        changeClientMeetingRequestModel.getAllChangeClientMeetingRequest(),

    ])
        .then(function (result) {
            const admin = result[0];
            const allStaffMeetings = result[1];
            const allClientMeetings = result[2];
            const changeRequstNumber = result[3].length + result[4].length;

            res.render('admin/timetable', {
                pageTitle: 'Timetable',
                admin: admin,
                allStaffMeetings: allStaffMeetings,
                allClientMeetings: allClientMeetings,
                changeRequstNumber: changeRequstNumber,
            });
        });
});

router.get('/timetable_change', checkAdminLogin,function (req, res) {
    Promise.all([
        adminModel.getAdminByID(req.session.userinfo),
        staffModel.getAllStaff(),
        changeStaffMeetingRequestModel.getAllChangeStaffMeetingRequest(),
        changeClientMeetingRequestModel.getAllChangeClientMeetingRequest(),
        teamModel.getAllTeam(),
        clientMeetingModel.getAllClientMeetings(),
        staffMeetingModel.getAllStaffMeetings(),
    ])
        .then(function (result) {
            const admin = result[0];
            const allStaff = result[1];
            const changeStaffMeetingRequest = result[2];
            const changeClientMeetingRequest = result[3];
            const allTeam = result[4];
            const allClientMeeting = result[5];
            const allStaffMeeting = result[6];
            res.render('admin/timetable_change', {
                pageTitle: 'Change Timetable',
                admin: admin,
                allStaff: allStaff,
                allTeam: allTeam,
                allClientMeeting : allClientMeeting,
                allStaffMeeting : allStaffMeeting,
                changeStaffMeetingRequest: changeStaffMeetingRequest,
                changeClientMeetingRequest: changeClientMeetingRequest,
            });
        })
});


router.post('/client_timetable_change', checkAdminLogin,function (req, res) {
    const changeClientMeetingID = mongoose.Types.ObjectId(req.body.client_meetingid);
    const changeClientMeetingDate = req.body.client_changetime;
    const changeClientMeetingPlace = req.body.client_place;
    Promise.all([
        clientMeetingModel.getClientMeetingByMeetingID(changeClientMeetingID),
    ])
        .then(function (result) {
            if(changeClientMeetingPlace == ''){
                clientMeetingModel.updateClientMeetingByMeetingID(changeClientMeetingID,changeClientMeetingDate,result[0].Place)
            }else{
                clientMeetingModel.updateClientMeetingByMeetingID(changeClientMeetingID,changeClientMeetingDate,changeClientMeetingPlace)
            }
        })
    res.redirect('/admin/timetable_change');
});

router.post('/staff_timetable_change', checkAdminLogin,function (req, res) {
    const changeStaffMeetingID = mongoose.Types.ObjectId(req.body.staff_meetingid);
    const changeStaffMeetingDate = req.body.staff_changetime;
    const changeStaffMeetingPlace = req.body.staff_place;
    const TempStaffID = req.body.staff_supervisor;
    Promise.all([
        staffMeetingModel.getStaffMeetingByMeetingID(changeStaffMeetingID),
    ])
        .then(function (result) {
            if(changeStaffMeetingDate == '' ){
                if(changeStaffMeetingPlace == ''){
                staffMeetingModel.updateStaffMeetingWithTempStaffByMeetingID(changeStaffMeetingID,result[0].Date,result[0].Place,TempStaffID)
                } else if(changeStaffMeetingPlace != ''){
                    if(TempStaffID!='none'){
                        staffMeetingModel.updateStaffMeetingWithTempStaffByMeetingID(changeStaffMeetingID,result[0].Date,changeStaffMeetingPlace,TempStaffID)
                    }else{
                        staffMeetingModel.updateStaffMeetingByMeetingID(changeStaffMeetingID,result[0].Date,changeStaffMeetingPlace)
                    }
                }
            }else if(changeStaffMeetingDate != ''){
                if(changeStaffMeetingPlace == ''){
                    if(TempStaffID!='none'){
                        staffMeetingModel.updateStaffMeetingWithTempStaffByMeetingID(changeStaffMeetingID,changeStaffMeetingDate,result[0].Place,TempStaffID)
                    } else {
                        staffMeetingModel.updateStaffMeetingByMeetingID(changeStaffMeetingID,changeStaffMeetingDate,result[0].Place)
                    }
                } else if(changeStaffMeetingPlace != ''){
                    if(TempStaffID!='none'){
                        staffMeetingModel.updateStaffMeetingWithTempStaffByMeetingID(changeStaffMeetingID,changeStaffMeetingDate,changeStaffMeetingPlace,TempStaffID)
                    } else {
                        staffMeetingModel.updateStaffMeetingByMeetingID(changeStaffMeetingID,changeStaffMeetingDate,changeStaffMeetingPlace)
                    }
                }
            }
        })
        res.redirect('/admin/timetable_change');
});

router.post('/staff_request_reject',checkAdminLogin, function (req, res) {
    const requestID = mongoose.Types.ObjectId(req.body.requestID);
    const reason = req.body.reason;
    console.log('enter');
    console.log(reason);
    console.log(requestID);
    // let command = {
    //     id: changeStaffMeetingRequestID,
    //     Status: 'rejected',
    //     AdminReply: {
    //         AdminName: "Emma Norling",
    //         Date: nowDate,
    //         Content: rejectReason,
    //     }
    // }
    // changeStaffMeetingRequestModel.adminRejectRequest(command)
    //     .then(function () {
    //         res.redirect('/admin/timetable_change')
    //     })
})

router.post('/client_request_reject', checkAdminLogin,function (req, res) {
    const staffMeetingID = req.body.staffMeetingID;
    const rejectReason = req.body.rejectReason;
    console.log('enter')
    const nowDate = new Date();
    console.log(rejectReason);
    // let command = {
    //     id: changeStaffMeetingRequestID,
    //     Status: 'rejected',
    //     AdminReply: {
    //         AdminName: "Emma Norling",
    //         Date: nowDate,
    //         Content: rejectReason,
    //     }
    // }
    // changeStaffMeetingRequestModel.adminRejectRequest(command)
    //     .then(function () {
    //         res.redirect('/admin/timetable_change')
    //     })
})

router.get('/staff_request_approve', checkAdminLogin,function (req, res) {
    const changeStaffMeetingRequestID = mongoose.Types.ObjectId(req.query.id);
    changeStaffMeetingRequestModel.adminApproveRequest(changeStaffMeetingRequestID)
        .then(function (result) {
            const staffmeetingID = result.MeetingID;
            if (result.NewStaffID != undefined) {
                const newStaff = result.NewStaffID;
                staffMeetingModel.editStaffMeetingNewStaffByStaffMeetingID(staffmeetingID, newStaff).then();
            }
            if (result.NewMeetingTime != undefined) {
                const newMeetingTime = result.NewMeetingTime;
                staffMeetingModel.editStaffMeetingTimeByStaffMeetingID(staffmeetingID, newMeetingTime).then();
            }
        })
    res.redirect('/admin/timetable_change')
})

router.get('/client_request_approve',checkAdminLogin, function (req, res) {
    const changeClientMeetingRequestID = mongoose.Types.ObjectId(req.query.id);
    changeClientMeetingRequestModel.adminEditCPendingStatusTimetable(changeclientmeetingrequest)
        .then(function () {
            const meetingtime = result.NewMeetingTime;
            const clientmeetingID = result.MeetingID;
            clientMeetingModel.editClientMeetingByChangeMeeting(clientmeetingID, meetingtime).then(function () {

                res.redirect('/admin/timetable_change')
            })
        })
})

router.get('/project_list', checkAdminLogin,function (req, res, next) {
    Promise.all([
        adminModel.getAdminByID(req.session.userinfo),
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

router.get('/edit_project', checkAdminLogin,function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        adminModel.getAdminByID(req.session.userinfo),
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

router.get('/project_approved',checkAdminLogin, function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        adminModel.getAdminByID(req.session.userinfo),
        proposalModel.getProposalByProposalID(proposalID),
        teamModel.getGroupByProposalID(proposalID),
        teamModel.getAllTeam(),
    ])
        .then(function (result) {
            const admin = result[0];
            const proposal = result[1];
            const teams = result[2];
            const allTeam = result[3];

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

router.get('/project_pending', checkAdminLogin,function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        adminModel.getAdminByID(req.session.userinfo),
        proposalModel.getProposalByProposalID(proposalID),
    ])
        .then(function (result) {
            const admin = result[0];
            const proposal = result[1];
            res.render('admin/project_pending', {
                proposal: proposal,
                pageTitle: proposal.Topic,
                admin: admin,
            });
        })
        .catch(next);
});

router.get('/project_rejected',checkAdminLogin, function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        adminModel.getAdminByID(req.session.userinfo),
        proposalModel.getProposalByProposalID(proposalID),
    ])
        .then(function (result) {
            const admin = result[0];
            const proposal = result[1];
            res.render('admin/project_rejected', {
                proposal: proposal,
                pageTitle: proposal.Topic,
                admin: admin,
            });
        })
        .catch(next);
});

router.get('/student_detail', checkAdminLogin,function (req, res, next) {
    const studentID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        adminModel.getAdminByID(req.session.userinfo),
        studentModel.getStudentByStudentID(studentID),
        teamModel.getTeamByStudentID(studentID),
        proposalModel.getProposalByStudentID(studentID),
    ])
        .then(function (result) {
            const admin = result[0];
            const student = result[1];
            const team = result[2];
            const proposal = result[3];
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
    router.post('/edit_project', checkAdminLogin,function (req, res, next) {
        const proposalID = mongoose.Types.ObjectId(req.body.proposalID);
        const topic = req.body.topic;
        const content = req.body.content;
        newDate = new Date();
        let proposal = {
            _id: proposalID,
            Topic: topic,
            Content: content,
            Date: newDate,
        }
        Promise.all([
            proposalModel.adminEditProposal(proposal),
            clientModel.getClientByProposalID(proposalID),
            teamModel.getGroupByProposalID(proposalID),
        ])

            .then(function (result) {
                const client = result[1];
                const team = result[2];
                transporter.sendMail({
                    from: 'ssit_group3@outlook.com', // sender address
                    to: client.UserName, // list of receivers
                    subject: 'Project edited', // Subject line
                    text: 'Your project: ' + proposalID.Topic + 'has been edited. ' , // plain text body
                } );
                for(let i=0;i<team.length;i++) {
                    for (let j = 0; j < team[i].StudentID[j].length; i++) {
                        transporter.sendMail({
                            from: 'ssit_group3@outlook.com', // sender address
                            to: team[i].StudentID[j].UserName, // list of receivers
                            subject: 'Project edited', // Subject line
                            text: 'Your project: ' + proposalID.Topic + 'has been edited. ', // plain text body
                        });
                        transporter.sendMail({
                            from: 'ssit_group3@outlook.com', // sender address
                            to: team[i].StaffID.UserName, // list of receivers
                            subject: 'Project edited', // Subject line
                            text: 'Your project: ' + proposalID.Topic + 'has been edited. ', // plain text body
                        });
                    }
                }
                res.redirect('/admin/project_list')
            })
            .catch(next)
    });

router.get('/pending_approved',checkAdminLogin, function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    const newDate = new Date();
    let proposal = {
        _id: proposalID,
        Date: newDate,
        Status: 'approved'
    }
    Promise.all([
        proposalModel.adminEditPendingStatusProposal(proposal),
        clientModel.getClientByProposalID(proposalID),
    ])

        .then(function (result) {
            const client = result[1];
            transporter.sendMail({
                from: 'ssit_group3@outlook.com', // sender address
                to: client.UserName, // list of receivers
                subject: 'Project status changed', // Subject line
                text: 'Your project: ' + proposalID.Topic + 'has been approved. ', // plain text body
            } );
            res.redirect('/admin/project_approved?id=' + req.query.id)
        })
        .catch(next)
});

router.get('/pending_rejected', checkAdminLogin,function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    const newDate = new Date();
    let proposal = {
        _id: proposalID,
        Date: newDate,
        Status: 'rejected'
    }
    Promise.all([
        proposalModel.adminEditPendingStatusProposal(proposal),
        clientModel.getClientByProposalID(proposalID),
    ])

        .then(function (result) {
            const client = result[1];
            transporter.sendMail({
                from: 'ssit_group3@outlook.com', // sender address
                to: client.UserName, // list of receivers
                subject: 'Project status changed', // Subject line
                text: 'Your project: ' + proposalID.Topic + 'has been rejected. ', // plain text body
            } );
            res.redirect('/admin/project_rejected?id=' + req.query.id)
        })
        .catch(next)
});

router.get('/rejected_pending',checkAdminLogin, function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    const newDate = new Date();
    let proposal = {
        _id: proposalID,
        Date: newDate,
        Status: 'pending'
    }
    Promise.all([
        proposalModel.adminEditPendingStatusProposal(proposal),
        clientModel.getClientByProposalID(proposalID),
    ])

        .then(function (result) {
            const client = result[1];
            transporter.sendMail({
                from: 'ssit_group3@outlook.com', // sender address
                to: client.UserName, // list of receivers
                subject: 'Project status changed', // Subject line
                text: 'Your project: ' + proposalID.Topic + 'has been pending. ', // plain text body
            } );
            res.redirect('/admin/project_pending?id=' + req.query.id)
        })
        .catch(next)
});

router.get('/approved_pending', checkAdminLogin,function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        teamModel.getGroupByProposalID(proposalID),
        clientModel.getClientByProposalID(proposalID),
    ])
        .then(function (result) {
        const teams = result[0];
            const client = result[1];
            transporter.sendMail({
                from: 'ssit_group3@outlook.com', // sender address
                to: client.UserName, // list of receivers
                subject: 'Project status changed', // Subject line
                text: 'Your project: ' + proposalID.Topic + 'has been pending. ', // plain text body
            } );
            for(let i=0;i<teams.length;i++) {
                for (let j = 0; j < teams[i].StudentID[j].length; j++) {
                    transporter.sendMail({
                        from: 'ssit_group3@outlook.com', // sender address
                        to: teams[i].StudentID[j].UserName, // list of receivers
                        subject: 'Project status changed', // Subject line
                        text: 'Your project: ' + proposalID.Topic + 'has been pending. ', // plain text body
                    });
                    transporter.sendMail({
                        from: 'ssit_group3@outlook.com', // sender address
                        to: teams[i].StaffID.UserName, // list of receivers
                        subject: 'Project status changed', // Subject line
                        text: 'Your project: ' + proposalID.Topic + 'has been pending. ', // plain text body
                    });
                }
            }

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

router.post('/project_pending', checkAdminLogin,function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.body.proposalID);
    const comment = req.body.comment;
    const replyDate = new Date();
    Promise.all([
        adminModel.getAdminByID(req.session.userinfo),
        proposalModel.getProposalByProposalID(proposalID),
        clientModel.getClientByProposalID(proposalID),
    ])
        .then(function (result) {
            let reply = result[1].Reply;
            reply.push({
                Author: result[0].Name,
                Comment: comment,
                ReplyDate: replyDate,
            });
            const admin = result[0];
            const client = result[2];
            const addComment = proposalModel.addProposalComment(result[1]._id, reply);
            addComment.then(function () {
                transporter.sendMail({
                    from: 'ssit_group3@outlook.com', // sender address
                    to: client.UserName, // list of receivers
                    subject: 'New comment received', // Subject line
                    text: admin.Name + ' made a comment in your project: ' + proposalID.Topic + '\n Comment: ' + comment, // plain text body
                } );
                res.redirect('/admin/project_pending?id=' + proposalID)
            })
        })
        .catch(next)
});

router.post('/project_rejected', checkAdminLogin,function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.body.proposalID);
    const comment = req.body.comment;
    const replyDate = new Date();
    Promise.all([
        adminModel.getAdminByID(req.session.userinfo),
        proposalModel.getProposalByProposalID(proposalID),
        clientModel.getClientByProposalID(proposalID),
    ])
        .then(function (result) {
            let reply = result[1].Reply;
            reply.push({
                Author: result[0].Name,
                Comment: comment,
                ReplyDate: replyDate,
            });
            const admin = result[0];
            const client = result[2];
            const addComment = proposalModel.addProposalComment(result[1]._id, reply);
            addComment.then(function () {
                transporter.sendMail({
                    from: 'ssit_group3@outlook.com', // sender address
                    to: client.UserName, // list of receivers
                    subject: 'New comment received', // Subject line
                    text: admin.Name + ' made a comment in your project: ' + proposalID.Topic + '\n Comment: ' + comment, // plain text body
                } );
                res.redirect('/admin/project_rejected?id=' + proposalID)
            })
        })
        .catch(next)
});

//delete team
router.post('/delete_team', checkAdminLogin,function (req, res, next) {
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
            const client = result[0];
            transporter.sendMail({
                from: 'ssit_group3@outlook.com', // sender address
                to: client.UserName, // list of receivers
                subject: 'Team deleted', // Subject line
                text: 'Your team ' + teamID.TeamName + 'has been deleted from project: '+ proposalId.Topic+'.', // plain text body
            } );
            if(teamID.StaffID!==undefined || teamID.StudentID!==undefined){
                transporter.sendMail({
                    from: 'ssit_group3@outlook.com', // sender address
                    to: teamID.StaffID.UserName, // list of receivers
                    subject: 'Team deleted', // Subject line
                    text: 'Your team ' + teamID.TeamName + 'has been deleted from project: '+ proposalId.Topic+'.', // plain text body
                });
                for (let i = 0; i < teamID.StudentID[i].length; i++) {
                    transporter.sendMail({
                        from: 'ssit_group3@outlook.com', // sender address
                        to: teamID.StudentID[i].UserName, // list of receivers
                        subject: 'Team deleted', // Subject line
                        text: 'Your team ' + teamID.TeamName + 'has been deleted from project: '+ proposalId.Topic+'.', // plain text body
                    });
                }
            }
            else{
            }
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
router.post('/delete_project', checkAdminLogin,function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.body.proposalID);
    Promise.all([
        clientModel.getClientByProposalID(proposalID),
    ])
        .then(function (result) {
            const client = result[0];
            transporter.sendMail({
                from: 'ssit_group3@outlook.com', // sender address
                to: client.UserName, // list of receivers
                subject: 'Project deleted', // Subject line
                text: 'Your project: ' + proposalID.Topic + 'has been deleted. ', // plain text body
            } );
        })
    Promise.all([
        clientModel.deleteProposalFromClientListByProposalID(client._id,proposalID),
        proposalModel.deleteProposal(proposalID)
    ])
        .then(function (result) {
            res.redirect('/admin/project_list')
        })
        .catch(next)
});

router.post('/allocate_team', checkAdminLogin,function (req, res) {
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
                const client = result[0];
                transporter.sendMail({
                    from: 'ssit_group3@outlook.com', // sender address
                    to: client.UserName, // list of receivers
                    subject: 'Team allocated', // Subject line
                    text: 'Your project: ' + proposalID.Topic + 'has been allocated a new team. ', // plain text body
                } );
                transporter.sendMail({
                    from: 'ssit_group3@outlook.com', // sender address
                    to: teamID.StaffID.UserName, // list of receivers
                    subject: 'Project allocated', // Subject line
                    text: 'Your team has been allocated a project: '+ proposalId.Topic, // plain text body
                });
                for (let i = 0; i < teamID.StudentID[i].length; i++) {
                    transporter.sendMail({
                        from: 'ssit_group3@outlook.com', // sender address
                        to: teamID.StudentID[i].UserName, // list of receivers
                        subject: 'Project allocated', // Subject line
                        text: 'Your team has been allocated a project: '+ proposalId.Topic, // plain text body
                    });
                }

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

router.get('/change_stage', checkAdminLogin,function (req, res) {
    Promise.all([
        adminModel.getAdminByID(req.session.userinfo),
        stageModel.getStage(),
    ])
        .then(function (result) {
            const admin = result[0];
            const stage = result[1][0];
            res.render('admin/change_stage', {
                pageTitle: 'Change stage',
                admin: admin,
                stage: stage,
            });
        })
});

router.post('/change_stage', checkAdminLogin, function (req,res) {
    const stage = req.body.stage;
    Promise.all([
        stageModel.changeStage(stage),
        clientModel.getAllClient(),
        studentModel.getAllStudent(),
        staffModel.getAllStaff(),
    ])
    .then(function (result) {
        const client = result[1];
        const student = result[2];
        const staff = result[3];
        for(let i=0; i < client.length;i++){
            transporter.sendMail({
                from: 'ssit_group3@outlook.com', // sender address
                to: client[i].UserName, // list of receivers
                subject: 'Stage changed', // Subject line
                text: 'Stage has been changed.', // plain text body
            } );
        }
        for(let i=0; i < student.length;i++){
            transporter.sendMail({
                from: 'ssit_group3@outlook.com', // sender address
                to: student[i].UserName, // list of receivers
                subject: 'Stage changed', // Subject line
                text: 'Stage has been changed. ', // plain text body
            } );
        }
        for(let i=0; i < staff.length;i++){
            transporter.sendMail({
                from: 'ssit_group3@outlook.com', // sender address
                to: staff[i].UserName, // list of receivers
                subject: 'Stage changed', // Subject line
                text: 'Stage has been changed. ', // plain text body
            } );
        }
        res.redirect('/admin/change_stage')
    })
});



module.exports = router;
