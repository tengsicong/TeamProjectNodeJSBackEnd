const express = require('express');
const router = express.Router();
const studentModel = require('../models/student');
const proposalModel = require('../models/proposal');
const staffModel = require('../models/staff');
const teamModel = require('../models/team');
const qaModel = require('../models/student_staff_qa');
const mongoose = require('mongoose')

const staffID = mongoose.Types.ObjectId('5e7a97ab66135760069ca372');

router.get('/my_project', function(req, res) {
    //console.log(req.session.role);
    if (req.session.role === 'staff') {
        Promise.all([
            staffModel.getStaffByStaffID(req.session.userinfo),
            staffModel.getAllocatedTeamByStaffID(req.session.userinfo),
        ])
            .then(function(result) {
                const maxDisplay = 4;
                const staff = result[0];
                const allTeams = result[1];
                let groupMember = [];

                for (let i = 0; i < allTeams.length; i++) {
                    //console.log(allTeams[i]);
                    groupMember[i] = '';
                    const max = (maxDisplay < allTeams[i].StudentID.length)? maxDisplay : allTeams[i].StudentID.length;
                    for (let j = 0; j < max; j++) {
                        groupMember[i] = groupMember[i] + allTeams[i].StudentID[j].Name;
                        if (j < max - 1) {
                            groupMember[i] = groupMember[i] + ', ';
                        }
                        else {
                            if(allTeams[i].StudentID.length > maxDisplay) groupMember[i] = groupMember[i] + '...';
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
    const teamID = parseInt(req.query.seq);
    Promise.all([
        staffModel.getStaffByStaffID(staffID),
        staffModel.getAllocatedTeamByStaffID(staffID),
    ])
        .then(function(result) {
            const staff = result[0];
            const allTeams = result[1];
            let groupMember;
            groupMember = '';
            const max =allTeams[teamID].StudentID.length;
            for (let j = 0; j < max; j++) {
                groupMember = groupMember + allTeams[teamID].StudentID[j].Name;
                if (j < max - 1) {
                    groupMember = groupMember + ', ';
                }
            }
            let meetingList = [];
            meetingList = allTeams[teamID].StaffMeetingID;
            console.log(allTeams[teamID]);
            let nowtime = new Date();
            res.render('staff/project_detail', {
                pageTitle: 'Project Detail',
                username: staff.Name,
                team: allTeams[teamID],
                teamMemberList: groupMember,
                allmeeting: meetingList,
                nowtime: nowtime,
            });
        });
});

router.get('/discussion', function(req, res) {
    if (req.session.role === 'staff') {
        const routePromise = staffModel.getStaffByStaffID(req.session.userinfo);
        routePromise.then(function(result) {
            const staff = result;
            let qa = [];

            const completedQAPromise = new Promise(function(resolve) {
                let loaded = 0;

                for(let i = 0; i < staff.AllocatedTeamID.length; i++) {
                    let qaPromise = qaModel.getQAByGroupID(staff.AllocatedTeamID[i]);
                    qaPromise.then(function(result) {
                        qa.push(...result);
                        loaded++;
                        if(loaded == staff.AllocatedTeamID.length) {
                            resolve(qa);
                        }
                    });
                }
            });
 
            completedQAPromise.then(function(result){
                //console.log(qa);

                res.render('staff/discussion', {
                    pageTitle: 'Discussion',
                    username: staff.Name,
                    qa: result,
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
        routePromise.then(function(result) {
            const staff = result;
            let qa = [];

            const completedQAPromise = new Promise(function(resolve) {
                let loaded = 0;

                for(let i = 0; i < staff.AllocatedTeamID.length; i++) {
                    let qaPromise = qaModel.getQAByGroupID(staff.AllocatedTeamID[i]);
                    qaPromise.then(function(result) {
                        qa.push(...result);
                        loaded++;
                        if(loaded == staff.AllocatedTeamID.length) {
                            resolve(qa);
                        }
                    });
                }
            });
            completedQAPromise.then(function(result){
                //console.log(qa);

                res.render('staff/discussion_details', {
                    pageTitle: 'Discussion details',
                    username: staff.Name,
                    qa: result[questionID],
                });
            });
        });
    }
    else {
        res.redirect('/role_select');
    }
});

module.exports = router;
