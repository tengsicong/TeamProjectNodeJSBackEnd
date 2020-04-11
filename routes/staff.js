const express = require('express');
const router = express.Router();
const studentModel = require('../models/student');
const proposalModel = require('../models/proposal');
const staffModel = require('../models/staff');
const teamModel = require('../models/team');
const qaModel = require('../models/student_staff_qa');
const mongoose = require('mongoose');
//const meetingID = mongoose.Types.ObjectId('5e7aaa02c35155e53fe5c97e');
const stageMoudel = require('../models/stage')


const staffID = mongoose.Types.ObjectId('5e7aaa02c35155e53fe5c97f');

router.get('/my_project', function(req, res) {
    //console.log(req.session.role);
    if (req.session.role === 'staff') {
        Promise.all([
            staffModel.getStaffByStaffID(req.session.userinfo),
            staffModel.getAllocatedTeamByStaffID(req.session.userinfo),
        ])
            .then(function(result) {
                const staff = result[0];
                const allTeams = result[1];
                let groupMember = [];

                for (let i = 0; i < allTeams.length; i++) {
                    //console.log(allTeams[i]);
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
    }
    else {
        res.redirect('/role_select');
    }
});

router.get('/project_detail', function(req, res) {
    if (req.session.role === 'staff') {
        const teamID = parseInt(req.query.seq);
        Promise.all([
            staffModel.getStaffByStaffID(req.session.userinfo),
            staffModel.getAllocatedTeamByStaffID(req.session.userinfo),
            stageMoudel.getStage(),
        ])
            .then(function (result) {
                const staff = result[0];
                const allTeams = result[1];
                let groupMember;
                groupMember = '';
                let stage=result[2];
                const max = allTeams[teamID].StudentID.length;
                for (let j = 0; j < max; j++) {
                    groupMember = groupMember + allTeams[teamID].StudentID[j].Name;
                    if (j < max - 1) {
                        groupMember = groupMember + ' / ';
                    }
                }
                let meetingList = [];
                //console.log(stage[0].Stage);
                meetingList = allTeams[teamID].StaffMeetingID;
                let nowtime = new Date();
                // console.log(nowtime.toUTCString());
                // console.log(nowtime);
                // console.log(nowtime.toISOString().replace(/T.*/,' ') + nowtime.toLocaleTimeString().replace(/ G.*/,""));
                // let solvednowtime = nowtime.toISOString().replace(/T.*/,' ') + nowtime.toLocaleTimeString().replace(/ G.*/,"");
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
    }
    else {
        res.redirect('/role_select');
    }
});

router.post('/meeting_detail_pre',function (req,res) {
    let timechange = req.body.timechange;
    let staffchange = req.body.staffchange;
    let changereason = req.body.changereason;
    console.log(timechange);
    let staffchangeID ;
    let requestID ;
    const primary_meeting = staffModel.getStaffMeetingByMeetingID(req.query.seq);

    const staffID = staffModel.getStaffByName(staffchange)
        staffID.then(function (result) {
            staffchangeID = result._id;
        })

    const changerequest = staffModel.getStaffMeetingChangeRequestByMeetingID(req.query.seq);
    changerequest.then(function (result) {
        requestID = result
    })

    primary_meeting.then(function (result) {
        //console.log(result);
        primaryMeetingResult = result;
        if(staffchange === primaryMeetingResult.StaffID.Name)
            staffchangeID = null;
        if(requestID === null)
        {
            console.log('create');
            let newRequest = {
                _id:mongoose.Types.ObjectId(),
                MeetingID:primaryMeetingResult._id,
                StaffID:primaryMeetingResult.StaffID,
                NewMeetingTime: timechange,
                NewStaffID: staffchangeID,
                RequestComment:{
                    RequestName: primaryMeetingResult.StaffID.Name,
                    Date: new Date(),
                    Content: changereason,
                }
            }
            staffModel.createMeetingChangeRequest(newRequest)
                .then(function () {
                    res.redirect('/staff/meeting_detail_pre?seq='+req.query.seq);
                })
        }
        else
        {
            requestID.NewStaffID = (staffchange===null)?requestID.NewStaffID:staffchangeID;
            requestID.NewMeetingTime = (timechange===null)?requestID.NewMeetingTime:timechange;
            requestID.RequestComment.Content = changereason;
            requestID.RequestComment.Date = new Date();
            staffModel.updateMeetingChangeRequest(requestID)
                .then(function () {
                    res.redirect('/staff/meeting_detail_pre?seq='+req.query.seq);
                })
        }
    })

})

router.get('/meeting_detail_pre', function(req, res) {
    if (req.session.role === 'staff') {
        const meetingID = req.query.seq;
        Promise.all([
            staffModel.getStaffMeetingByMeetingID(meetingID),
            staffModel.getStaffMeetingChangeRequestByMeetingID(meetingID),
            staffModel.getAllStaff(),
            staffModel.getStaffByStaffID(req.session.userinfo),
            ]
        )
            .then(function (result) {
                const staffs = result[2];
                const meeting = result[0];
                const meetingModify = result[1];
                const staff = result[3];
                let nowStaff = meeting.StaffID;
                if(meeting.TemporaryStaffID != null)
                    nowStaff = meeting.TemporaryStaffID;
                //console.log(meeting);
                let nowtime = new Date();
                res.render('staff/meeting_detail_pre',{
                    meeting : meeting,
                    pageTitle : 'Meeting Detail',
                    username: staff.Name,
                    meetingModify: meetingModify,
                    stafflist: staffs,
                    nowtime : nowtime,
                    nowstaff : nowStaff,
                })
            })
    }
    else {
        res.redirect('/role_select');
    }
});

router.get('/meeting_detail_post', function(req, res) {
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
                console.log(meetingID);
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
                ]
                let timeSheets = [
                    'Yes',
                    'Yes, except those who have not engaged (noted in records here AND recorded in minutes)',
                    'No',
                ]
                let clearPlan = [
                    'Yes',
                    'Some plan, but not detailed enough',
                    'No',
                ]
                let dynamics = [
                    'Seem fine',
                    'I have minor concerns',
                    'I have major concerns (please email Emma too)',
                ]
                res.render('staff/meeting_detail_post',{
                    meeting : meeting,
                    pageTitle : 'Meeting Detail',
                    username: staff.Name,
                    record: meeting.RecordID,
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

router.post('/my_timetable',function (req,res) {
    let timechange = req.body.time;
    let staffchange = req.body.staffchange;
    let changereason = req.body.changereason;
    let staffchangeID ;
    let requestID ;
    const primary_meeting = staffModel.getStaffMeetingByMeetingID(req.query.seq);

    const staffID = staffModel.getStaffByName(staffchange)
    staffID.then(function (result) {
        staffchangeID = result._id;
    })

    const changerequest = staffModel.getStaffMeetingChangeRequestByMeetingID(req.query.seq);
    changerequest.then(function (result) {
        requestID = result
    })

    primary_meeting.then(function (result) {
        //console.log(result);
        primaryMeetingResult = result;
        if(staffchange === primaryMeetingResult.StaffID.Name)
            staffchangeID = null;
        if(requestID === null)
        {
            console.log('create');
            let newRequest = {
                _id:mongoose.Types.ObjectId(),
                MeetingID:primaryMeetingResult._id,
                StaffID:primaryMeetingResult.StaffID,
                NewMeetingTime: timechange,
                NewStaffID: staffchangeID,
                RequestComment:{
                    RequestName: primaryMeetingResult.StaffID.Name,
                    Date: new Date(),
                    Content: changereason,
                }
            }
            staffModel.createMeetingChangeRequest(newRequest)
                .then(function () {
                    res.redirect('/staff/meeting_detail_pre?seq='+req.query.seq);
                })
        }
        else
        {
            requestID.NewStaffID = (staffchange===null)?requestID.NewStaffID:staffchangeID;
            requestID.NewMeetingTime = (timechange===null)?requestID.NewMeetingTime:timechange;
            requestID.RequestComment.Content = changereason;
            requestID.RequestComment.Date = new Date();
            staffModel.updateMeetingChangeRequest(requestID)
                .then(function () {
                    res.redirect('/staff/meeting_detail_pre?seq='+req.query.seq);
                })
        }
    })

})

router.get('/my_timetable', function(req, res) {
    if (req.session.role === 'staff') {
        Promise.all([
            staffModel.getStaffByStaffID(req.session.userinfo),
            staffModel.getAllStaff(),
            staffModel.getAllMeetingByStaffID(req.session.userinfo),
        ])
            .then(function (result) {
                const staff = result[0];
                const meetingList = result[2];
                const staffList = result[1];
                let nowtime = new Date();
                res.render('staff/my_timetable', {
                    pageTitle: 'My Timetable',
                    username: staff.Name,
                    meetingList: meetingList,
                    staffList: staffList,
                    nowtime: nowtime,
                });
            });
    }
    else {
        res.redirect('/role_select');
    }
});

router.post('/marking', function (req,res,next) {
    const staff=req.session.userinfo;
    const content=req.body.t1;
    const select = req.body.selector1;
    const teamid = mongoose.Types.ObjectId(req.query.id);
    //console.log(select);
    staffModel.updateTeamMark(teamid,content,select)
        .then(function () {
            res.redirect('/staff/marking?seq='+req.query.seq+'&id='+req.query.id);
        })
    //.catch(next);
})

router.get('/marking', function(req, res) {
    if (req.session.role === 'staff') {
        const teamID = parseInt(req.query.seq);
        const teamsqr = req.query.id;
        Promise.all([
            staffModel.getStaffByStaffID(req.session.userinfo),
            staffModel.getAllocatedTeamByStaffID(req.session.userinfo),
        ])
            .then(function (result) {
                const staff = result[0];
                const allTeams = result[1];
                //console.log(teamID);
                res.render('staff/marking', {
                    pageTitle: 'Marking',
                    username: staff.Name,
                    team: allTeams[teamID],
                });
            })
    }
    else {
        res.redirect('/role_select');
    }
});

router.get('/discussion', function(req, res) {
    if (req.session.role === 'staff') {
        const routePromise = staffModel.getStaffByStaffID(req.session.userinfo);
        routePromise.then(function(staff) {
            const completedQAPromise = new Promise(function(resolve) {
                let qaList = [];
                let loaded = 0;

                for(let i = 0; i < staff.AllocatedTeamID.length; i++) {
                    let qaPromise = qaModel.getQAByGroupID(staff.AllocatedTeamID[i]);
                    qaPromise.then(function(result) {
                        qaList.push(...result);
                        loaded++;
                        if(loaded == staff.AllocatedTeamID.length) {
                            resolve(qaList);
                        }
                    });
                }

                if(staff.AllocatedTeamID.length == 0) {
                    resolve(qaList);
                }
            });
 
            completedQAPromise.then(function(qaList){
                //console.log(qa);
                res.render('staff/discussion', {
                    pageTitle: 'Discussion',
                    username: staff.Name,
                    qa: qaList,
                });
            });
        });
    }
    else {
        res.redirect('/role_select');
    }
});

router.get('/discussion_details', function(req, res) {
    if (req.session.role === 'staff') {
        const questionID = req.query.id;

        const routePromise = staffModel.getStaffByStaffID(req.session.userinfo);
        routePromise.then(function(staff) {

            const detailPromise = qaModel.getQAByQAID(questionID);
            detailPromise.then(function(qa){
                //console.log(qa);
                res.render('staff/discussion_details', {
                    pageTitle: qa.Topic + ' - Discussion Details',
                    username: staff.Name,
                    qa: qa,
                });
            });
        });
    }
    else {
        res.redirect('/role_select');
    }
});

router.post('/discussion_details', function(req, res) {
    if (req.session.role === 'staff') {
        const questionID = req.query.id;
        const reply = req.body.reply;

        const routePromise = staffModel.getStaffByStaffID(req.session.userinfo);
        routePromise.then(function(staff) {
            const detailPromise = qaModel.getQAByQAID(questionID);
            detailPromise.then(function(qa){
                let replies = qa.Replies;
                replies.push({
                    Author: staff.Name,
                    Comment: reply,
                    ReplyDate: new Date().getTime(),
                });
                //console.log(replies);
                const updatePromise = qaModel.updateReplyByQAID(qa._id, replies);
                updatePromise.then(function(result) {
                    res.render('staff/discussion_details', {
                        pageTitle: qa.Topic + ' - Discussion Details',
                        username: staff.Name,
                        qa: qa,
                    });
                });
            });
        });
    }
    else {
        res.redirect('/role_select');
    }
});

module.exports = router;
