const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer  = require('nodemailer');
const checkStaffLogin = require('../middlewares/check').checkStaffLogin;
const studentModel = require('../models/student');
const proposalModel = require('../models/proposal');
const staffModel = require('../models/staff');
const teamModel = require('../models/team');
const qaModel = require('../models/student_staff_qa');
const recordModel = require('../models/staffMeetingRecords');
const stageModel = require('../models/stage');
const staffMeetingModel = require('../models/staffmeetings');
const adminModel = require('../models/admin');

const config = require('config-lite')(__dirname);

let transporter = nodemailer.createTransport(config.transporter);

router.get('/my_project', checkStaffLogin, function(req, res) {
    Promise.all([
        staffModel.getStaffByStaffID(req.session.userinfo),
        staffModel.getAllocatedTeamByStaffID(req.session.userinfo),
    ])
        .then(function(result) {
            const staff = result[0];
            const allTeams = result[1];
            let groupMember = [];
            for (let i = 0; i < allTeams.length; i++) {
                groupMember[i] = '';
                for (let j = 0; j < allTeams[i].StudentID.length; j++) {
                    groupMember[i] = groupMember[i] + allTeams[i].StudentID[j].Name;
                    if (j < allTeams[i].StudentID.length - 1) {
                        groupMember[i] = groupMember[i] + ' / ';
                    }
                }
            }
            res.render('staff/my_project', {
                pageTitle: 'My Projects',
                username: staff.Name,
                allTeams: allTeams,
                groupMember: groupMember,
            });
        });
});

router.get('/project_detail', checkStaffLogin, function(req, res) {
    const teamID = parseInt(req.query.seq);
    Promise.all([
        staffModel.getStaffByStaffID(req.session.userinfo),
        staffModel.getAllocatedTeamByStaffID(req.session.userinfo),
        stageModel.getStage(),
    ])
        .then(function (result) {
            const staff = result[0];
            const allTeams = result[1];
            let groupMember;
            groupMember = '';
            let stage=result[2];
            //console.log(allTeams[teamID]);
            const max = allTeams[teamID].StudentID.length;
            for (let j = 0; j < max; j++) {
                groupMember = groupMember + allTeams[teamID].StudentID[j].Name;
                if (j < max - 1) {
                    groupMember = groupMember + ' / ';
                }
            }
            let meetingList = [];
            meetingList = allTeams[teamID].StaffMeetingID;
            let nowtime = new Date();
            res.render('staff/project_detail', {
                pageTitle: 'Project Detail',
                username: staff.Name,
                team: allTeams[teamID],
                teamMemberList: groupMember,
                allmeeting: meetingList,
                nowtime: nowtime,
                teamseq: teamID,
                stage:stage[0],
            });
        });
});

router.post('/meeting_detail_pre', checkStaffLogin, function(req,res) {
    let timechange = req.body.timechange;
    let staffchange = req.body.staffchange;
    let changereason = req.body.changereason;

    Promise.all([
        staffModel.getStaffMeetingByMeetingID(req.query.seq),
        adminModel.getAllAdmin(),
        staffModel.getStaffByName(staffchange),
    ])
    .then(function (result) {
        ////console.log(result);
        let primaryMeetingResult = result[0];
        let staffchangeID = result[2]._id;
        let nowStaff = primaryMeetingResult.StaffID;
        if(primaryMeetingResult.TemporaryStaffID != null)
            nowStaff = primaryMeetingResult.TemporaryStaffID;
        let newRequest = {
            _id:mongoose.Types.ObjectId(),
            MeetingID:primaryMeetingResult._id,
            StaffID:nowStaff,
            NewMeetingTime: timechange,
            NewStaffID: staffchangeID,
            Status: 'pending',
            RequestComment:{
                RequestName: primaryMeetingResult.StaffID.Name,
                Date: new Date(),
                Content: changereason,
            }
        };
        let adminemail = [];
        for(let i = 0;i < result[1].length;i++)
            adminemail[i] = result[1][i].UserName;
        transporter.sendMail({
            from: 'klxsxweng@gmail.com',
            to: adminemail,
            subject: "SSIT Team Project: a new staff meeting changing request",
            text: "pre You have a new staff meeting changing request from Staff " + result[0].StaffID.Name + " .",
        });
        staffModel.createMeetingChangeRequest(newRequest)
            .then(function () {
                res.redirect('/staff/meeting_detail_pre?seq='+req.query.seq);
            });
    });
});

router.get('/meeting_detail_pre', checkStaffLogin, function(req, res) {
    const meetingID = req.query.seq;
    Promise.all([
        staffModel.getStaffMeetingByMeetingID(meetingID),
        staffModel.getStaffMeetingChangeRequestByMeetingID(meetingID),
        staffModel.getAllStaff(),
        staffModel.getStaffByStaffID(req.session.userinfo),
    ])
        .then(function(result) {
            const staffs = result[2];
            const meeting = result[0];
            const meetingModify = result[1];
            const staff = result[3];
            let nowStaff = meeting.StaffID;
            if(meeting.TemporaryStaffID != null) {
                nowStaff = meeting.TemporaryStaffID;
                ////console.log(meeting);
                let nowtime = new Date();
                res.render('staff/meeting_detail_pre',{
                    meeting : meeting,
                    pageTitle : 'Meeting Detail',
                    username: staff.Name,
                    meetingModify: meetingModify,
                    stafflist: staffs,
                    nowtime : nowtime,
                    nowstaff : nowStaff,
                });
            }
        });
});

router.post('/meeting_detail_post', checkStaffLogin, function(req,res) {
    const t1 = req.body.t1;
    let present = req.body.present;
    const storycard = req.body.storycard;
    const progress = req.body.progress;
    const timesheets = req.body.timesheets;
    const clearplan = req.body.clearPlan;
    const dynamics = req.body.dynamics;
    let RecordID;
    const MeetingId = req.query.seq;
    for(let i=0;i<present.length;i++)
        present[i]%=3;
    //console.log(req.body);
    staffModel.getStaffMeetingByMeetingID(MeetingId)
        .then(function (result) {
            meeting = result;
            RecordID = meeting.RecordID;
            let change = [7];
            for(var i=0;i<7;i++)
                change[i] = (i==storycard);
            let newRecord = {
                _id:mongoose.Types.ObjectId(),
                Present:present,
                LastMeetingNote:t1[0],
                AchievePlan:t1[1],
                Change:change,
                ChangeOther:t1[2],
                RequirementCapture:t1[3],
                TeamProgress:progress,
                TimeSheets:timesheets,
                ClearPlan:clearplan,
                Dynamics:dynamics,
                AnyOtherNote:t1[4],
            };
            if(RecordID != null)
            {
                recordModel.deleteStaffMeetingRecordByRecordID(RecordID).then();
            }
            let email = [];
            //console.log(result);
            for(let i=0;i<present.length;i++)
                email[i] = result.GroupID.StudentID[i].UserName;
            transporter.sendMail({
                from: 'ssit_group3@outlook.com',
                to: email,
                subject: "SSIT Team Project: a new meeting record",
                text: "You have a new meeting record from Staff " + result.StaffID.Name + " .",
            });
            staffMeetingModel.updateStaffMeetingRecordByMeetingID(MeetingId,newRecord._id).then();
            recordModel.createStaffMeetingRecord(newRecord)
                .then(function () {
                    res.redirect('/staff/meeting_detail_post?seq='+req.query.seq);
                })
        })
});

router.get('/meeting_detail_post', checkStaffLogin, function(req, res) {
    const meetingID = req.query.seq;
    if (req.session.role === 'staff') {
        //const meetingID = req.query.seq;
        Promise.all([
                staffModel.getStaffMeetingByMeetingID(meetingID),
                staffModel.getStaffByStaffID(req.session.userinfo),
                staffModel.getAllocatedTeamByStaffID(req.session.userinfo),
            ]
        )
            .then(function (result) {
                const staff = result[1];
                const meeting = result[0];
                let nowtime = new Date();
                let presents = ['Presents','Absent','Late'];
                let changes = [
                    'Significant number of story cards added (most likely in early weeks)',
                    'Significant changes to existing story cards (most likely in early weeks)',
                    'Story cards merged or deleted',
                    'Small number of story cards added',
                    'Minor changes to existing story cards',
                    'No changes to story cards',
                    'Other',
                ];
                let teamProgress = [
                    'Yes',
                    'Exceeds expectations',
                    'Slightly behind',
                    'Significantly behind',
                ];
                let timeSheets = [
                    'Yes',
                    'Yes, except those who have not engaged (noted in records here AND recorded in minutes)',
                    'No',
                ];
                let clearPlan = [
                    'Yes',
                    'Some plan, but not detailed enough',
                    'No',
                ];
                let dynamics = [
                    'Seem fine',
                    'I have minor concerns',
                    'I have major concerns (please email Emma too)',
                ];
                let record = meeting.RecordID;
                if(record == null)
                {
                    record = {
                        Present: [9,9,9,9,9,9,9],
                        LastMeetingNote:'',
                        AchievePlan:'',
                        Change:9,
                        ChangeOther:'',
                        RequirementCapture:'',
                        TeamProgress:9,
                        TimeSheets:9,
                        ClearPlan:9,
                        Dynamics:9,
                        AnyOtherNote:'',
                    };
                }
                res.render('staff/meeting_detail_post',{
                    meeting : meeting,
                    pageTitle : 'Meeting Detail',
                    username: staff.Name,
                    record: record,
                    nowtime : nowtime,
                    presents: presents,
                    changes: changes,
                    teamProgress: teamProgress,
                    timeSheets: timeSheets,
                    clearPlan: clearPlan,
                    dynamics: dynamics,
                })
            })
    }
    else {
        res.redirect('/role_select');
    }
});

router.post('/my_timetable', checkStaffLogin, function (req, res) {
    let timechange = req.body.changetime;
    let staffchange = req.body.changestaff;
    let meetingchange = req.body.meetingID;
    let changereason = req.body.t1;
    let meetingidList = meetingchange.split('-');
    let meetingID = meetingidList[1];
    let staffchangeID ;
    //console.log(meetingchange);

    Promise.all([
        staffModel.getStaffMeetingByMeetingID(meetingID),
        adminModel.getAllAdmin(),
        staffModel.getStaffByName(staffchange),
    ])
        .then(function (result) {
        ////console.log(result);
        primaryMeetingResult = result[0];
        let nowStaff = primaryMeetingResult.StaffID;
        if(primaryMeetingResult.TemporaryStaffID != null)
            nowStaff = primaryMeetingResult.TemporaryStaffID;
        let newRequest;
        if(staffchangeID == null){
            //console.log('no staff');
            newRequest = {
                _id: mongoose.Types.ObjectId(),
                MeetingID: meetingID,
                StaffID: nowStaff,
                NewMeetingTime: timechange,
                Status: 'pending',
                RequestComment: {
                    RequestName: primaryMeetingResult.StaffID.Name,
                    Date: new Date(),
                    Content: changereason,
                }
            }
        }
        else if(timechange == null || timechange === '') {
            //console.log('no time');
            newRequest = {
                _id:mongoose.Types.ObjectId(),
                MeetingID:meetingID,
                StaffID:nowStaff,
                NewStaffID: staffchangeID,
                Status: 'pending',
                RequestComment:{
                    RequestName: primaryMeetingResult.StaffID.Name,
                    Date: new Date(),
                    Content: changereason,
                }
            }
        }
        else
        {
            newRequest = {
                _id:mongoose.Types.ObjectId(),
                MeetingID:meetingID,
                StaffID:nowStaff,
                NewMeetingTime: timechange,
                NewStaffID: staffchangeID,
                Status: 'pending',
                RequestComment:{
                    RequestName: primaryMeetingResult.StaffID.Name,
                    Date: new Date(),
                    Content: changereason,
                }
            }
        }
        let adminemail = [];
        for(let i = 0;i < result[1].length;i++)
            adminemail[i] = result[1][i].UserName;
        console.log('-----' + adminemail + '-------');
        transporter.sendMail({
            from: 'klxsxweng@gmail.com',
            to: adminemail,
            subject: "SSIT Team Project: a new staff meeting changing request",
            text: "pre You have a new staff meeting changing request from Staff " + result[0].StaffID.Name + " .",
        });
        staffModel.createMeetingChangeRequest(newRequest)
            .then(function () {
                res.redirect('/staff/my_timetable');
            })
    })
});



router.get('/my_timetable', checkStaffLogin, function(req, res) {
    Promise.all([
        staffModel.getStaffByStaffID(req.session.userinfo),
        staffModel.getAllStaff(),
        staffModel.getStaffMeetingByStaffID(req.session.userinfo),
        staffModel.getStaffMeetingByTempStaffID(req.session.userinfo),
        staffModel.getStaffMeetingChangeRequestByStaffID(req.session.userinfo),
    ])
        .then(function (result) {
            const staff = result[0];
            const meetingList = result[2];
            const staffList = result[1];
            const TempmeetingList = result[3];
            const RequestList = result[4];
            let nowtime = new Date();
            let meetingStaff = [];
            let delnumber = 0;
            for(var i=0;i<meetingList.length;i++){
                meetingStaff[i] = (meetingList[i].TemporaryStaffID == null)? meetingList[i].StaffID:meetingList[i].TemporaryStaffID;
                delnumber+=(meetingList[i].GroupID.ProposalID == null);
            }
            //console.log(meetingList);
            res.render('staff/my_timetable', {
                pageTitle: 'My Timetable',
                username: staff.Name,
                meetingList: meetingList,
                tempMeetingList: TempmeetingList,
                staffList: staffList,
                nowtime: nowtime,
                meetingStaff: meetingStaff,
                changeStaffMeetingRequest: RequestList,
                delnumber: delnumber,
            });
        });
});

router.post('/marking', checkStaffLogin, function (req,res,next) {
    const teamcontent=req.body.t1;
    const teamselect = req.body.selector1;
    const indiselect = req.body.selector2;
    const indicontent = req.body.t2;
    const teamid = mongoose.Types.ObjectId(req.query.id);
    let studentList = [];
    //console.log(req.body);

    staffModel.getAllocatedTeamByTeamID(teamid)
        .then(function(result){
             list = result;
             studentList = list.StudentID;
             let score = [];
             let reason = [];
             let email = [];
            for(let i=0;i<studentList.length;i++)
                email[i] = result.StudentID[i].UserName;
            //console.log(email);
            transporter.sendMail({
                from: 'ssit_group3@outlook.com',
                to: email,
                subject: "SSIT Team Project: a new mark",
                text: "You have a new mark from Staff " + result.StaffID.Name + " .",
            });
            for(let i=0;i<studentList.length;i++)
            {
                score = [
                    indiselect[i*2],
                    indiselect[i*2+1],
                ];
                reason =[
                indicontent[i*2],
                indicontent[i*2+1],
                ];
                staffModel.updateIndeMark(studentList[i]._id,score,reason)
                    .then(function () {
                        ////console.log(studentList[i]._id);
                    })
            }
    })
    staffModel.updateTeamMark(teamid,teamcontent,teamselect)
        .then(function () {
            res.redirect('/staff/marking?seq='+req.query.seq+'&id='+req.query.id);
        })
})

router.get('/marking', checkStaffLogin, function(req, res) {
    const teamID = parseInt(req.query.seq);
    Promise.all([
        staffModel.getStaffByStaffID(req.session.userinfo),
        staffModel.getAllocatedTeamByStaffID(req.session.userinfo),
    ])
        .then(function (result) {
            const staff = result[0];
            const allTeams = result[1];
            const idxIndPerf = 7;
            const items = ['Management','','','Testing','','QA','Poster session','Pesonal evaluation','Timesheets'];
            const description = ['Team organisation (regular meetings, good quality minutes of meetings appearing on time in the team google drive, work allocation).',
                                    'Progress with implementation (problems solved, completing agreed tasks in a timely manner, maintaining risk register).',
                                    'Key documents (story cards, design documents).',
                                    'Unit tests (these should run automatically).',
                                    'System tests (either running automatically, or well-documented manual test).',
                                    'You are assessed on how well you spot problems with the code of another team. Any problems detected in your own code do not affect your grade for this part (but if a client detects them, they may mark you down).',
                                    'How well your final presentations sells your work, and how well you did a demo of your system and answered questions.',
                                    'Submitted via MOLE in the final week of the semester.',
                                    'Entered on time into epiManage every week (and including all the activities associated with the project).'];
            const criteria5 = [
                'Very Well',
                'Good',
                'Regularly',
                'Insufficient',
                'Poor',
            ];
            const criteria10 = [
                'Very Well',
                '',
                'Good',
                '',
                'Regularly',
                '',
                'Insufficient',
                '',
                'Poor',
            ];
            const scores = [5,5,5,5,5,5,5,10,5];
            ////console.log(teamID);
            res.render('staff/marking', {
                pageTitle: 'Marking',
                username: staff.Name,
                team: allTeams[teamID],
                items: items,
                description: description,
                idxIndPerf: idxIndPerf,
                scores: scores,
                criteria5:criteria5,
                criteria10:criteria10,
            });
        });
});

router.get('/discussion', checkStaffLogin, function(req, res) {
    Promise.all([
        staffModel.getStaffByStaffID(req.session.userinfo),
        staffModel.getAllocatedTeamByStaffID(req.session.userinfo),
    ])
        .then(function(result) {
            const staff = result[0];
            const allTeams = result[1];

            const completedQA = async () => {
                let qaList = [];

                for (let i = 0; i < allTeams.length; i++) {
                    if(allTeams[i].ProposalID !== undefined) {
                        let qa =  await qaModel.getQAByGroupID(allTeams[i]._id);
                        qaList.push({
                            teamName: allTeams[i].TeamName,
                            qas: qa,
                        });
                    }
                }

                return qaList;
            };

            completedQA().then(function(qa) {
                ////console.log(qa);
                res.render('staff/discussion', {
                    pageTitle: 'Discussion',
                    username: staff.Name,
                    qa: qa,
                });
            });
        });
});

router.get('/discussion_details', checkStaffLogin, function(req, res) {
    const questionID = req.query.id;

    const routePromise = staffModel.getStaffByStaffID(req.session.userinfo);
    routePromise.then(function(staff) {
        const detailPromise = qaModel.getQAByQAID(questionID);
        detailPromise.then(function(qa){
            ////console.log(qa);
            res.render('staff/discussion_details', {
                pageTitle: qa.Topic + ' - Discussion Details',
                username: staff.Name,
                qa: qa,
            });
        });
    });
});

router.post('/discussion_details', checkStaffLogin, function(req, res) {
    const questionID = req.query.id;
    const reply = req.body.reply;

    const routePromise = staffModel.getStaffByStaffID(req.session.userinfo);
    routePromise.then(function(staff) {
        const detailPromise = qaModel.getQAByQAID(questionID);
        detailPromise.then(function(qa){
            //console.log(qa);
            const updatePromise = qaModel.updateReplyByQAID(qa._id, {
                Author: staff.Name,
                Comment: reply,
                ReplyDate: new Date().getTime(),
            });
            updatePromise.then(function(result) {
                transporter.sendMail({
                    from: config.transporter.auth.user, // sender address
                    to: qa.Author.UserName, // list of receivers
                    subject: 'New reply from ' + staff.Name + ' to your question', // Subject line
                    text: staff.Name + ' replied to your question ' + qa.Topic + '\n Comment:' + reply, // plain text body
                    html: 'Greeting, <br>' + staff.Name + ' replied to your question <b>' + qa.Topic + '</b><br>' + 
                            '<p>\"' + reply + '\"</p><br>' + 
                            'Team Project', // html body
                }, function(error, info) {
                    if(error)
                        return //console.log(error);
                    //console.log(`Message: ${info.messageId}`);
                    //console.log(`sent: ${info.response}`);
                });
                res.redirect('discussion_details?id=' + qa._id);
            });
        });
    });
});

module.exports = router;
