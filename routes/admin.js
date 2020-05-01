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
const nodemailer = require('nodemailer');

const config = require('config-lite')(__dirname);
let transporter = nodemailer.createTransport(config.transporter);

router.post('/search', checkAdminLogin, function (req, res) {
    const search = req.body.search;
    Promise.all([
        adminModel.getAdminByID(req.session.userinfo),
        studentModel.getSearchStudent(search),
    ]).then(function (result) {
        const admin = result[0];
        const searchStudent = result[1];
        res.render('admin/search_students', {
            pageTitle: 'Search Student List',
            admin: admin,
            searchStudent: searchStudent,
            searchCondition:search,
        })
    })
})

/* GET edit team page. */
router.get('/edit_team', checkAdminLogin, function (req, res) {
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
router.post('/submit_newteam', checkAdminLogin, function (req, res) {
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
router.post('/submit_editteam', checkAdminLogin, function (req, res) {

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
                    studentModel.addNewStudentGroupID((studentIDArray[j]), Tid)
                }
                res.redirect('/admin/team_list')
            })

    });
});

router.get('/team_list', checkAdminLogin, function (req, res) {
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
router.get('/student_list', checkAdminLogin, function (req, res) {

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
            })
            // return res.send(data)

        });
});
router.post('/add_new_student', checkAdminLogin, function (req, res) {
    const addStudentName = req.body.addStudentName;
    const addStudentUserName = req.body.addStudentUserName;
    Promise.all([
        studentModel.addNewStudent(addStudentName, addStudentUserName)
    ]).then(function (result) {
        const newStudent = result[0];
        const asyncSendMail = async function () {
            await transporter.sendMail({
                from: 'ssit_group3@outlook.com', // sender address
                // from: '1010870945@qq.com',
                to: newStudent.UserName, // list of receivers
                subject: 'SSIT Team Project: Registered successfully! ', // Subject line
                text: 'Welcome,' + newStudent.Name + '!' + '\n Your account initial password is ' + newStudent.Password + ', for security, please change to a more safe password.', // plain text body
                html: 'Welcome, <br> <b>' + newStudent.Name + '</b>!' + '\n Your account initial password is <b>' + newStudent.Password + '</b>, for security, please change to a more safe password.',// html body
            }).then();
        }

        asyncSendMail().then();

        res.redirect('/admin/student_list')
    })
});
router.post('/add_new_staff', checkAdminLogin, function (req, res) {
    const addStaffName = req.body.addStaffName;
    const addStaffUserName = req.body.addStaffUserName;
    Promise.all([
        staffModel.addNewStaff(addStaffName, addStaffUserName)
    ]).then(function (result) {
        const newStaff = result[0];
        const asyncSendMail = async function () {
            await transporter.sendMail({
                from: 'ssit_group3@outlook.com', // sender address
                // from: '1010870945@qq.com',
                to: newStaff.UserName, // list of receivers
                subject: 'SSIT Team Project: Registered successfully! ', // Subject line
                text: 'Welcome,' + newStaff.Name + '!' + '\n Your account initial password is' + newStaff.Password + ', for security, please change to a more safe password.', // plain text body
                html: 'Welcome, <br> <b>' + newStaff.Name + '</b>!' + '\n Your account initial password is<b>' + newStaff.Password + '</b>, for security, please change to a more safe password.',// html body
            }).then();
        }
        asyncSendMail().then();

        res.redirect('/admin/team_list')
    })
});
router.get('/timetable', checkAdminLogin, function (req, res) {
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
            const changeStaffMeetingRequest = result[3];
            const changeClientMeetingRequest = result[4];
            let changeRequestNumber = 0;
            for (let i = 0; i < changeStaffMeetingRequest.length; i++) {
                if (changeStaffMeetingRequest[i].Status == 'pending') {
                    changeRequestNumber++;
                }
            }
            for (let i = 0; i < changeClientMeetingRequest.length; i++) {
                if (changeClientMeetingRequest[i].Status == 'pending') {
                    changeRequestNumber++;
                }
            }
            res.render('admin/timetable', {
                pageTitle: 'Timetable',
                admin: admin,
                allStaffMeetings: allStaffMeetings,
                allClientMeetings: allClientMeetings,
                changeRequestNumber: changeRequestNumber,
            });
        });
});

router.get('/timetable_change', checkAdminLogin, function (req, res) {
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
                allClientMeeting: allClientMeeting,
                allStaffMeeting: allStaffMeeting,
                changeStaffMeetingRequest: changeStaffMeetingRequest,
                changeClientMeetingRequest: changeClientMeetingRequest,
            });
        })
});


router.post('/client_timetable_change', checkAdminLogin, function (req, res) {
    const changeClientMeetingID = mongoose.Types.ObjectId(req.body.client_meetingid);
    const changeClientMeetingDate = req.body.client_changetime;
    const changeClientMeetingPlace = req.body.client_place;
    Promise.all([
        clientMeetingModel.getClientMeetingByMeetingID(changeClientMeetingID),
    ])
        .then(function (result) {
            if (changeClientMeetingPlace == '') {
                clientMeetingModel.updateClientMeetingByMeetingID(changeClientMeetingID, changeClientMeetingDate, result[0].Place)
            } else {
                clientMeetingModel.updateClientMeetingByMeetingID(changeClientMeetingID, changeClientMeetingDate, changeClientMeetingPlace)
            }
        })
    res.redirect('/admin/timetable_change');
});

router.post('/staff_timetable_change', checkAdminLogin, function (req, res) {
    const changeStaffMeetingID = mongoose.Types.ObjectId(req.body.staff_meetingid);
    const changeStaffMeetingDate = req.body.staff_changetime;
    const changeStaffMeetingPlace = req.body.staff_place;
    const TempStaffID = req.body.staff_supervisor;
    Promise.all([
        staffMeetingModel.getStaffMeetingByMeetingID(changeStaffMeetingID),
    ])
        .then(function (result) {
            if (changeStaffMeetingDate == '') {
                if (changeStaffMeetingPlace == '') {
                    staffMeetingModel.updateStaffMeetingWithTempStaffByMeetingID(changeStaffMeetingID, result[0].Date, result[0].Place, TempStaffID)
                } else if (changeStaffMeetingPlace != '') {
                    if (TempStaffID != 'none') {
                        staffMeetingModel.updateStaffMeetingWithTempStaffByMeetingID(changeStaffMeetingID, result[0].Date, changeStaffMeetingPlace, TempStaffID)
                    } else {
                        staffMeetingModel.updateStaffMeetingByMeetingID(changeStaffMeetingID, result[0].Date, changeStaffMeetingPlace)
                    }
                }
            } else if (changeStaffMeetingDate != '') {
                if (changeStaffMeetingPlace == '') {
                    if (TempStaffID != 'none') {
                        staffMeetingModel.updateStaffMeetingWithTempStaffByMeetingID(changeStaffMeetingID, changeStaffMeetingDate, result[0].Place, TempStaffID)
                    } else {
                        staffMeetingModel.updateStaffMeetingByMeetingID(changeStaffMeetingID, changeStaffMeetingDate, result[0].Place)
                    }
                } else if (changeStaffMeetingPlace != '') {
                    if (TempStaffID != 'none') {
                        staffMeetingModel.updateStaffMeetingWithTempStaffByMeetingID(changeStaffMeetingID, changeStaffMeetingDate, changeStaffMeetingPlace, TempStaffID)
                    } else {
                        staffMeetingModel.updateStaffMeetingByMeetingID(changeStaffMeetingID, changeStaffMeetingDate, changeStaffMeetingPlace)
                    }
                }
            }
        })
    res.redirect('/admin/timetable_change');
});

router.post('/staff_request_reject', checkAdminLogin, function (req, res) {
    console.log('srr')
    const requestID = mongoose.Types.ObjectId(req.body.requestID);
    const reason = req.body.reason;
    adminModel.getAdminByID(req.session.userinfo).then(function (result) {
        changeStaffMeetingRequestModel.adminRejectStaffRequest(requestID, result.Name, reason).then(
            function (staffChange) {
                const asyncSendMail = async function () {
                    await transporter.sendMail({
                        from: 'ssit_group3@outlook.com', // sender address
                        // from: '1010870945@qq.com', // sender address
                        to: staffChange.StaffID.UserName, // list of receivers
                        subject: 'SSIT Team Project: Reject Meeting Change! ', // Subject line
                        text: 'Sorry!, ' + staffChange.StaffID.Name + '!' + '\n Your change meeting request is rejected. More information please check your own account page.', // plain text body
                        html: 'Sorry!, <b>' + staffChange.StaffID.Name + '</b>!' + '\n Your change meeting request is rejected. More information please check your own account page.',// html body
                    }).then();
                }
                asyncSendMail().then();
                res.redirect('/admin/timetable_change')
            })
    })
})

router.post('/client_request_reject', checkAdminLogin, function (req, res) {
    console.log('crr')
    const requestID = mongoose.Types.ObjectId(req.body.requestID);
    const reason = req.body.reason;
    adminModel.getAdminByID(req.session.userinfo).then(function (result) {
        changeClientMeetingRequestModel.adminRejectClientRequest(requestID, result.Name, reason).then(
            function (clientChange) {
                const asyncSendMail = async function () {
                    await transporter.sendMail({
                        from: 'ssit_group3@outlook.com', // sender address
                        // from: '1010870945@qq.com', // sender address
                        to: clientChange.ClientID.UserName, // list of receivers
                        subject: 'SSIT Team Project: Reject Meeting Change! ', // Subject line
                        text: 'Sorry!, ' + clientChange.ClientID.Name + '!' + '\n Your change meeting request is rejected. More information please check your own account page.', // plain text body
                        html: 'Sorry!, <b>' + clientChange.ClientID.Name + '</b>!' + '\n Your change meeting request is rejected. More information please check your own account page.',// html body
                    }).then();
                }
                asyncSendMail().then();
                res.redirect('/admin/timetable_change')
            }
        )
    })
})

router.get('/staff_request_approve', checkAdminLogin, function (req, res) {
    console.log('sra')
    const requestID = mongoose.Types.ObjectId(req.query.id);
    changeStaffMeetingRequestModel.adminApproveStaffRequest(requestID).then(function (result) {
        const staffMeetingID = result.MeetingID;
        const preStaffID = result.StaffID

        const asyncSendMail = async function () {
            await transporter.sendMail({
                from: 'ssit_group3@outlook.com', // sender address
                // from: '1010870945@qq.com', // sender address
                to: preStaffID.UserName, // list of receivers
                subject: 'SSIT Team Project: Update Meeting Change! ', // Subject line
                text: 'Congratulations!, ' + preStaffID.Name + '!' + '\n Your change meeting request successfully approved.', // plain text body
                html: 'Congratulations!, <b>' + preStaffID.Name + '</b>!' + '\n Your change meeting request successfully approved.',// html body
            }).then(console.log);
        }
        asyncSendMail().then();
        if (result.NewStaffID != undefined) {
            const newStaff = result.NewStaffID;
            Promise.all([
                staffMeetingModel.editStaffMeetingNewStaffByStaffMeetingID(staffMeetingID, newStaff)
            ])
           .then(
            function (newResult) {
                const newStaffID = newResult[0].TemporaryStaffID;
                const newStaffUserName = newStaffID.UserName;
                const asyncSendMail = async function () {
                    await transporter.sendMail({
                        from: 'ssit_group3@outlook.com', // sender address
                        // from: '1010870945@qq.com',
                        to: newStaffUserName, // list of receivers
                        subject: 'SSIT Team Project: Update Meeting Change! ', // Subject line
                        text: 'Hi,' + newStaffID.Name + '!' + '\n You have a new change of meeting.', // plain text body
                        html: 'Hi, <br> <b>' + newStaffID.Name + '</b>!' + '\n You have a new change of a meeting.',// html body
                    }).then();
                }
                asyncSendMail().then();
            })
        }
        if (result.NewMeetingTime != undefined) {
            const newMeetingTime = result.NewMeetingTime;
            staffMeetingModel.editStaffMeetingTimeByStaffMeetingID(staffMeetingID, newMeetingTime).then(
            function (newResult) {
                const newStaffID = newResult.TemporaryStaffID;
                const asyncSendMail = async function () {
                    await transporter.sendMail({
                        from: 'ssit_group3@outlook.com', // sender address
                        // from: '1010870945@qq.com',
                        to: newStaffID.UserName, // list of receivers
                        subject: 'SSIT Team Project: Update Meeting Change! ', // Subject line
                        text: 'Hi,' + newStaffID.Name + '!' + '\n You have a new change of meeting.', // plain text body
                        html: 'Hi, <br> <b>' + newStaffID.Name + '</b>!' + '\n You have a new change of a meeting.',// html body
                    }).then();
                }
                asyncSendMail().then();
            }
            )
        }
    })
    res.redirect('/admin/timetable_change')
})

router.get('/client_request_approve',checkAdminLogin, function (req, res) {
    const requestID = mongoose.Types.ObjectId(req.query.id);
    changeClientMeetingRequestModel.adminApproveClientRequest(requestID).then(function (result) {
        const clientMeetingID = result.MeetingID;
        const newMeetingTime = result.NewMeetingTime;
        clientMeetingModel.editClientMeetingTimeByClientMeetingID(clientMeetingID, newMeetingTime).then(function (newMeeting) {
            const asyncSendMail = async function () {
                await transporter.sendMail({
                    from: 'ssit_group3@outlook.com', // sender address
                    // from: '1010870945@qq.com',
                    to: newMeeting.ClientID.UserName, // list of receivers
                    subject: 'SSIT Team Project: Update Meeting Change! ', // Subject line
                    text: 'Hi,' + newMeeting.ClientID.Name + '!' + '\n You have a new change of meeting.' + '\n Meeting time: ' + newMeeting.Date + '\nMeeting place:' + newMeeting.Place, // plain text body
                    html: 'Hi, <br> <b>' + newMeeting.ClientID.Name + '</b>!' + '\n You have a new change of a meeting.' + ',\n <b>Meeting time:</b>' + newMeeting.Date + '\n<b>Meeting place:</b>' + newMeeting.Place,// html body
                }).then();
            }
            asyncSendMail().then();
            res.redirect('/admin/timetable_change')
        })
    })
})

router.get('/project_list', checkAdminLogin, function (req, res, next) {
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

router.get('/edit_project', checkAdminLogin, function (req, res, next) {
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

router.get('/project_approved', checkAdminLogin, function (req, res, next) {
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

router.get('/project_pending', checkAdminLogin, function (req, res, next) {
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

router.get('/project_rejected', checkAdminLogin, function (req, res, next) {
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

router.get('/student_detail', checkAdminLogin, function (req, res, next) {
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
router.post('/edit_project', checkAdminLogin, function (req, res, next) {
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
            const asyncSendMail = async function () {
                await transporter.sendMail({
                    from: 'ssit_group3@outlook.com', // sender address
                    to: client.UserName, // list of receivers
                    subject: 'SSIT Team Project: project edited', // Subject line
                    text: 'Your project: ' + topic + ' has been edited. ', // plain text body
                }).then();
                for (let i = 0; i < team.length; i++) {
                    for (let j = 0; j < team[i].StudentID.length; j++) {
                        await transporter.sendMail({
                            from: 'ssit_group3@outlook.com', // sender address
                            to: team[i].StudentID[j].UserName, // list of receivers
                            subject: 'SSIT Team Project: project edited', // Subject line
                            text: 'Your project: ' + topic + ' has been edited. ', // plain text body
                        }).then();
                        await transporter.sendMail({
                            from: 'ssit_group3@outlook.com', // sender address
                            to: team[i].StaffID.UserName, // list of receivers
                            subject: 'SSIT Team Project: project edited', // Subject line
                            text: 'Your project: ' + topic + ' has been edited. ', // plain text body
                        }).then();
                    }
                }
            }
            asyncSendMail().then();
            res.redirect('/admin/project_list')
        })
        .catch(next)
});

router.get('/pending_approved', checkAdminLogin, function (req, res, next) {
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
        proposalModel.getProposalByProposalID(proposalID),
    ])

        .then(function (result) {
            const client = result[1];
            const proposal1 = result[2];
            const asyncSendMail = async function () {
                await transporter.sendMail({
                    from: 'ssit_group3@outlook.com', // sender address
                    to: client.UserName, // list of receivers
                    subject: 'SSIT Team Project: project status changed', // Subject line
                    text: 'Your project: ' + proposal1.Topic + ' has been approved. ', // plain text body
                });
            }
            asyncSendMail().then();
            res.redirect('/admin/project_approved?id=' + req.query.id)
        })
        .catch(next)
});

router.get('/pending_rejected', checkAdminLogin, function (req, res, next) {
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
        proposalModel.getProposalByProposalID(proposalID),
    ])

        .then(function (result) {
            const client = result[1];
            const proposal1 = result[2];
            const asyncSendMail = async function () {
                await transporter.sendMail({
                    from: 'ssit_group3@outlook.com', // sender address
                    to: client.UserName, // list of receivers
                    subject: 'SSIT Team Project: project status changed', // Subject line
                    text: 'Your project: ' + proposal1.Topic + 'has been rejected. ', // plain text body
                });
            }
            asyncSendMail().then();
            res.redirect('/admin/project_rejected?id=' + req.query.id)
        })
        .catch(next)
});

router.get('/rejected_pending', checkAdminLogin, function (req, res, next) {
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
        proposalModel.getProposalByProposalID(proposalID),
    ])

        .then(function (result) {
            const client = result[1];
            const proposal1 = result[2];
            const asyncSendMail = async function () {
                await transporter.sendMail({
                    from: 'ssit_group3@outlook.com', // sender address
                    to: client.UserName, // list of receivers
                    subject: 'SSIT Team Project: project status changed', // Subject line
                    text: 'Your project: ' + proposal1.Topic + 'has been pending. ', // plain text body
                });
            }
            asyncSendMail().then();
            res.redirect('/admin/project_pending?id=' + req.query.id)
        })
        .catch(next)
});

router.get('/approved_pending', checkAdminLogin, function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        teamModel.getGroupByProposalID(proposalID),
        clientModel.getClientByProposalID(proposalID),
        proposalModel.getProposalByProposalID(proposalID),
    ])
        .then(function (result) {
            const teams = result[0];
            const client = result[1];
            const proposal = result[2];
            const asyncSendMail = async function () {
                await transporter.sendMail({
                    from: 'ssit_group3@outlook.com', // sender address
                    to: client.UserName, // list of receivers
                    subject: 'SSIT Team Project: project status changed', // Subject line
                    text: 'Your project: ' + proposal.Topic + ' has been pending. ', // plain text body
                });
                for (let i = 0; i < teams.length; i++) {
                    for (let j = 0; j < teams[i].StudentID.length; j++) {
                        await transporter.sendMail({
                            from: 'ssit_group3@outlook.com', // sender address
                            to: teams[i].StudentID[j].UserName, // list of receivers
                            subject: 'SSIT Team Project: project status changed', // Subject line
                            text: 'Your project: ' + proposal.Topic + ' has been pending. ', // plain text body
                        });
                        await transporter.sendMail({
                            from: 'ssit_group3@outlook.com', // sender address
                            to: teams[i].StaffID.UserName, // list of receivers
                            subject: 'SSIT Team Project: project status changed', // Subject line
                            text: 'Your project: ' + proposal.Topic + ' has been pending. ', // plain text body
                        });
                    }
                }
            }
            asyncSendMail().then();

            for (let i = 0; i < teams.length; i++) {
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
            }
        })
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
            const proposal = result[1];
            const client = result[2];
            const addComment = proposalModel.addProposalComment(result[1]._id, reply);
            addComment.then(function () {
                const asyncSendMail = async function () {
                    await transporter.sendMail({
                        from: 'ssit_group3@outlook.com', // sender address
                        to: client.UserName, // list of receivers
                        subject: 'SSIT Team Project: new comment received', // Subject line
                        text: admin.Name + ' has made a comment in your project: ' + proposal.Topic + '.', // plain text body
                    });
                }
                asyncSendMail().then();
                res.redirect('/admin/project_pending?id=' + proposalID)
            })
        })
        .catch(next)
});

router.post('/project_rejected', checkAdminLogin, function (req, res, next) {
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
            const proposal = result[1];
            const client = result[2];
            const addComment = proposalModel.addProposalComment(result[1]._id, reply);
            addComment.then(function () {
                const asyncSendMail = async function () {
                    await transporter.sendMail({
                        from: 'ssit_group3@outlook.com', // sender address
                        to: client.UserName, // list of receivers
                        subject: 'SSIT Team Project: new comment received', // Subject line
                        text: admin.Name + ' has made a comment in your project: ' + proposal.Topic + '.', // plain text body
                    });
                }
                asyncSendMail().then();
                res.redirect('/admin/project_rejected?id=' + proposalID)
            })
        })
        .catch(next)
});

//delete team
router.post('/delete_team', checkAdminLogin, function (req, res, next) {
    const teamID = mongoose.Types.ObjectId(req.body.teamID);
    const proposalId = mongoose.Types.ObjectId(req.body.proposalID);
    proposalModel.deleteProposalTeamByGroupID(proposalId, teamID);
    teamModel.deleteTeamProposalByGroupID(teamID);
    Promise.all([
        clientModel.getClientByProposalID(proposalId),
        clientMeetingModel.getClientMeetingByGroupID(teamID),
        teamModel.getTeamByTeamID(teamID),
        proposalModel.getProposalByProposalID(proposalId),
    ])
        .then(function (result) {
            const clientID = result[0]._id;
            const client = result[0];
            const teams = result[2];
            const proposal = result[3];
            clientModel.deleteGroupFromClientListByGroupID(clientID, teamID);
            const meetings = result[1];
            for (let i = 0; i < meetings.length; i++) {
                const meetingid = meetings[i]._id;
                changeClientMeetingRequestModel.deleteChangeClientMeetingRequestByMeetingID(meetingid);
            }
            clientMeetingModel.deleteClientMeetingByGroupID(teamID);
            ;
            const asyncSendMail = async function () {
                await transporter.sendMail({
                    from: 'ssit_group3@outlook.com', // sender address
                    to: client.UserName, // list of receivers
                    subject: 'SSIT Team Project: team deleted', // Subject line
                    text: 'Your team ' + teams.TeamName + ' has been deleted from project: ' + proposal.Topic + '.', // plain text body
                });
                if (teams.StaffID !== undefined || teams.StudentID !== undefined) {
                    await transporter.sendMail({
                        from: 'ssit_group3@outlook.com', // sender address
                        to: teams.StaffID.UserName, // list of receivers
                        subject: 'SSIT Team Project: team deleted', // Subject line
                        text: 'Your team ' + teams.TeamName + ' has been deleted from project: ' + proposal.Topic + '.', // plain text body
                    });
                    for (let i = 0; i < teams.StudentID.length; i++) {
                        await transporter.sendMail({
                            from: 'ssit_group3@outlook.com', // sender address
                            to: teams.StudentID[i].UserName, // list of receivers
                            subject: 'SSIT Team Project: team deleted', // Subject line
                            text: 'Your team ' + teams.TeamName + ' has been deleted from project: ' + proposal.Topic + '.', // plain text body
                        });
                    }
                } else {
                }
            }
            asyncSendMail().then();
            res.redirect('/admin/project_approved?id=' + proposalId)
        })
        .catch(next);
});


//delete project
router.post('/delete_project', checkAdminLogin, function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.body.proposalID);
    Promise.all([
        clientModel.getClientByProposalID(proposalID),
        proposalModel.getProposalByProposalID(proposalID),
    ])
        .then(function (result) {
            const client = result[0];
            const proposal = result[1];
            const asyncSendMail = async function () {
                await transporter.sendMail({
                    from: 'ssit_group3@outlook.com', // sender address
                    to: client.UserName, // list of receivers
                    subject: 'SSIT Team Project: project deleted', // Subject line
                    text: 'Your project: ' + proposal.Topic + ' has been deleted. ', // plain text body
                });
            }
            asyncSendMail().then();

            Promise.all([
                clientModel.deleteProposalFromClientListByProposalID(client._id, proposalID),
                proposalModel.deleteProposal(proposalID)
            ])
                .then(function (result) {
                    res.redirect('/admin/project_list')
                })
        })
        .catch(next)
});

router.post('/allocate_team', checkAdminLogin, function (req, res) {
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
    Promise.all([
        clientModel.getClientByProposalID(proposalId),
    ])
        .then(function (result) {
            clientModel.updateGroupOfClientListByGroupID(result[0]._id, teamID);
            Promise.all([
                clientMeetingModel.getClientMeetingByGroupID(teamID)
            ]).then(function (result) {
                teamModel.allocateProposal(teamID, proposalId);
            });
            Promise.all([
                clientModel.getClientByProposalID(proposalId),
                teamModel.getTeamByTeamID(teamID),
                proposalModel.getProposalByProposalID(proposalId),
            ])
                .then(function (result) {
                    const client = result[0];
                    const teams = result[1];
                    const proposal = result[2];
                    const asyncSendMail = async function () {
                        await transporter.sendMail({
                            from: 'ssit_group3@outlook.com', // sender address
                            to: client.UserName, // list of receivers
                            subject: 'SSIT Team Project: team allocated', // Subject line
                            text: 'Your project: ' + proposal.Topic + ' has been allocated a new team. ', // plain text body
                        });
                        await transporter.sendMail({
                            from: 'ssit_group3@outlook.com', // sender address
                            to: teams.StaffID.UserName, // list of receivers
                            subject: 'SSIT Team Project: team allocated', // Subject line
                            text: 'Your team has been allocated a project: ' + proposal.Topic, // plain text body
                        });
                        for (let i = 0; i < teams.StudentID[i].length; i++) {
                            await transporter.sendMail({
                                from: 'ssit_group3@outlook.com', // sender address
                                to: teams.StudentID[i].UserName, // list of receivers
                                subject: 'SSIT Team Project: team allocated', // Subject line
                                text: 'Your team has been allocated a project: ' + proposal.Topic, // plain text body
                            });
                        }
                    }
                    asyncSendMail().then();
                })
            res.redirect('/admin/project_approved?id=' + proposalId);
        });
});

router.get('/change_stage', checkAdminLogin, function (req, res) {
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

router.post('/change_stage', checkAdminLogin, function (req, res) {
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
            const asyncSendMail = async function () {
                if (stage == 0) {
                    for (let i = 0; i < client.length; i++) {
                        let to = ''
                        to = to + client[i].UserName + ',';
                        await transporter.sendMail({
                            from: 'ssit_group3@outlook.com', // sender address
                            to: to, // list of receivers
                            subject: 'SSIT Team Project: stage changed', // Subject line
                            text: 'Stage has been changed to: ' + stage + '. Now you can create, edit and delete your projects.', // plain text body
                        }).then();
                    }
                }
                if (stage == 1) {
                    for (let i = 0; i < client.length; i++) {
                        await transporter.sendMail({
                            from: 'ssit_group3@outlook.com', // sender address
                            to: client[i].UserName, // list of receivers
                            subject: 'SSIT Team Project: stage changed', // Subject line
                            text: 'Stage has been changed to: ' + stage + '. Now you cannot create your projects.', // plain text body
                        }).then();
                    }

                    for (let j = 0; j < student.length; j++) {
                        await transporter.sendMail({
                            from: 'ssit_group3@outlook.com', // sender address
                            to: student[j].UserName, // list of receivers
                            subject: 'SSIT Team Project: stage changed', // Subject line
                            text: 'Stage has been changed to: ' + stage + '.', // plain text body
                        }).then();
                    }

                    for (let k = 0; k < staff.length; k++) {
                        await transporter.sendMail({
                            from: 'ssit_group3@outlook.com', // sender address
                            to: staff[k].UserName, // list of receivers
                            subject: 'SSIT Team Project: stage changed', // Subject line
                            text: 'Stage has been changed to: ' + stage + '.', // plain text body
                        }).then();
                    }
                }
                if (stage == 2) {

                    for (let i = 0; i < client.length; i++) {
                        await transporter.sendMail({
                            from: 'ssit_group3@outlook.com', // sender address
                            to: client[i].UserName, // list of receivers
                            subject: 'SSIT Team Project: stage changed', // Subject line
                            text: 'Stage has been changed to: ' + stage + '. Now you can mark your students.', // plain text body
                        }).then();
                    }

                    for (let j = 0; j < student.length; j++) {
                        await transporter.sendMail({
                            from: 'ssit_group3@outlook.com', // sender address
                            to: student[j].UserName, // list of receivers
                            subject: 'SSIT Team Project: stage changed', // Subject line
                            text: 'Stage has been changed to: ' + stage + '.', // plain text body
                        }).then();
                    }

                    for (let k = 0; k < staff.length; k++) {
                        await transporter.sendMail({
                            from: 'ssit_group3@outlook.com', // sender address
                            to: staff[k].UserName, // list of receivers
                            subject: 'SSIT Team Project: stage changed', // Subject line
                            text: 'Stage has been changed to: ' + stage + '. Now you can mark for your students.', // plain text body
                        }).then();
                    }
                }

            }
            asyncSendMail().then();


            res.redirect('/admin/change_stage')
        })
});


module.exports = router;
