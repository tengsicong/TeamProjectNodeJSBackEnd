const express = require('express');
const router = express.Router();
const clientModel = require('../models/client');
const proposalModel = require('../models/proposal');
const teamModel = require('../models/team');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const studentModel = require('../models/student');
const clientMeetingModel = require('../models/clientmeetings');
const changeClientMeetingRequestModel = require('../models/changeclientmeetingrequest')
const stageModel = require('../models/stage');
const adminModel = require('../models/admin');
const checkClientLogin = require('../middlewares/check').checkClientLogin;
const config = require('config-lite')(__dirname);

let transporter = nodemailer.createTransport(config.transporter);

router.get('/myproject', checkClientLogin, function (req, res, next) {
    Promise.all([
        clientModel.getClientByClientID(req.session.userinfo),
        proposalModel.getProposalByClientID(req.session.userinfo),
        stageModel.getStage(),
    ])
        .then(function (proposals) {
            const client = proposals[0];
            const stage = proposals[2][0];
            res.render('client/my_proposals', {
                proposals: proposals[1],
                pageTitle: 'My Projects',
                username: client.Name,
                stage: stage,
            });
        })
        .catch(next);
    // res.render('client/client_myproposals');
});

router.get('/myproject/create_project', checkClientLogin, function (req, res, next) {
    Promise.all([
        clientModel.getClientByClientID(req.session.userinfo),
    ])
        .then(function (result) {
            const client = result[0];

            res.render('client/create_project', {
                pageTitle: 'Create Project',
                username: client.Name,
            });
        })
        .catch(next);
});


/*Create new proposals*/
router.post('/myproject/create_project', checkClientLogin, function (req, res, next) {
    const clientID = req.session.userinfo;
    const topic = req.body.topic;
    const content = req.body.content;
    const nowDate = new Date();
    let proposal = {
        _id: mongoose.Types.ObjectId(),
        ClientID: clientID,
        Topic: topic,
        Content: content,
        Date: nowDate,
        Status: 'pending'
    }
    Promise.all([
        clientModel.getClientByClientID(clientID),
        proposalModel.createProposal(proposal),
        clientModel.updateClientProposalListByProposalID(clientID, proposal._id),
        adminModel.getAllAdmin(),
    ])
        .then(function (result) {
            const admin = result[3];
            const client = result[0];
            const asyncSendMail = async function(){
                for (let i = 0; i < admin.length; i++) {
                    let to = ''
                    to = to + admin[i].UserName + ',';
                    await transporter.sendMail({
                        from: config.transporter.auth.user, // sender address
                        to: admin.UserName, // list of receivers
                        subject: 'New proposal from ' + client.Name + ' was created', // Subject line
                        text: client.Name + 'has created a new proposal.',
                    });
                }}
            asyncSendMail().then();
            res.redirect('/client/myproject/project_pending?id=' + proposal._id)
        })
        .catch(next)
});


router.get('/myproject/project_approved', checkClientLogin, function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        proposalModel.getProposalByProposalID(proposalID),
        clientModel.getClientByProposalID(proposalID),
        teamModel.getGroupByProposalID(proposalID),
        stageModel.getStage(),
    ])
        .then(function (result) {
            const stage = result[3][0];
            console.log(result[1])
            res.render('client/project_approved', {
                proposal: result[0],
                pageTitle: result[0].Topic,
                username: result[1].Name,
                teams: result[2],
                stage: stage,
                Replies: result[0].Reply,
            });
        })
        .catch(next);
});

router.get('/myproject/project_pending', checkClientLogin, function (req, res, next) {
    //console.log(req.query.id);
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        proposalModel.getProposalByProposalID(proposalID),
        clientModel.getClientByProposalID(proposalID),
    ])
        .then(function (result) {
            res.render('client/project_pending', {
                proposal: result[0],
                pageTitle: result[0].Topic,
                username: result[1].Name,
                Replies: result[0].Reply,
            });
        })
        .catch(next);
});


/*添加评论*/
router.post('/myproject/project_pending', checkClientLogin, function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.body.proposalID);
    const comment = req.body.comment;
    const replyDate = new Date();
    Promise.all([
        clientModel.getClientByProposalID(proposalID),
        proposalModel.getProposalByProposalID(proposalID),
        adminModel.getAllAdmin(),
    ])
        .then(function (result) {
            const admin = result[2];
            const client = result[0];
            const proposal = result[1];
            let reply = proposal.Reply;
            reply.push({
                Author: client.Name,
                Comment: comment,
                ReplyDate: replyDate,
            });
            const addComment = proposalModel.addProposalComment(proposal._id, reply);
            addComment.then(function () {
                const asyncSendMail = async function(){
                    for (let i = 0; i < admin.length; i++) {
                        let to = ''
                        to = to + admin[i].UserName + ',';
                        await transporter.sendMail({
                            from: config.transporter.auth.user, // sender address
                            to: admin.UserName, // list of receivers
                            subject: 'New comment for ' + proposal.Topic, // Subject line
                            text: client.Name + ' add new comment for ' + proposal.Topic, // plain text body
                        });
                    }}
                asyncSendMail().then();
                res.redirect('/client/myproject/project_pending?id=' + proposalID)
            });
        })
        .catch(next)
})


router.get('/myproject/project_rejected', checkClientLogin, function (req, res, next) {
    //console.log(req.query.id);
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        proposalModel.getProposalByProposalID(proposalID),
        clientModel.getClientByProposalID(proposalID),
    ])
        .then(function (result) {
            res.render('client/project_rejected', {
                proposal: result[0],
                pageTitle: result[0].Topic,
                username: result[1].Name,
                Replies: result[0].Reply,
            });
        })
        .catch(next);
});

/*添加评论*/
router.post('/myproject/project_rejected', checkClientLogin, function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.body.proposalID);
    const comment = req.body.comment;
    const replyDate = new Date();
    Promise.all([
        clientModel.getClientByProposalID(proposalID),
        proposalModel.getProposalByProposalID(proposalID),
        adminModel.getAllAdmin(),
    ])
        .then(function (result) {
            //console.log(result[1])
            const admin = result[2];
            const client = result[0];
            const proposal = result[1];
            let reply = proposal.Reply;
            reply.push({
                Author: result[0].Name,
                Comment: comment,
                ReplyDate: replyDate,
            });
            const addComment = proposalModel.addProposalComment(proposal._id, reply);
            addComment.then(function () {
                const asyncSendMail = async function(){
                    for (let i = 0; i < admin.length; i++) {
                        let to = ''
                        to = to + admin[i].UserName + ',';
                        await transporter.sendMail({
                            from: config.transporter.auth.user, // sender address
                            to: admin.UserName, // list of receivers
                            subject: 'New comment for ' + proposal.Topic, // Subject line
                            text: client.Name + ' add new comment for ' + proposal.Topic, // plain text body
                        });
                    }}
                asyncSendMail().then();
                res.redirect('/client/myproject/project_rejected?id=' + proposalID)
            });
        })
        .catch(next)
})


router.get('/edit_project', checkClientLogin, function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        proposalModel.getProposalByProposalID(proposalID),
        clientModel.getClientByProposalID(proposalID),
    ])
        .then(function (result) {
            res.render('client/edit_project', {
                proposal: result[0],
                pageTitle: 'Edit Project',
                username: result[1].Name,
            });
        })
        .catch(next);
});

/*Edit proposal*/
router.post('/edit_project', checkClientLogin, function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.body.proposalID);
    //console.log('id= '+ proposalID)
    const topic = req.body.topic;
    const content = req.body.content;
    const newDate = new Date();
    let proposal = {
        _id: proposalID,
        Topic: topic,
        Content: content,
        Date: newDate,
        Status: 'pending'
    }
    proposalModel.editProposal(proposal)
        .then(function () {
            res.redirect('/client/myproject/project_pending?id=' + proposalID)
        })
        .catch(next)
})

/*Delete proposal*/
router.post('/delete_project', checkClientLogin, function (req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.body.proposalID);
    Promise.all([
        clientModel.deleteProposalFromClientListByProposalID(req.session.userinfo, proposalID),
        proposalModel.deleteProposal(proposalID),
        adminModel.getAllAdmin(),
    ])
        .then(function (result) {
            const admin = result[2];
            const client = result[0];
            const proposal = result[1];
            const asyncSendMail = async function(){
                for (let i = 0; i < admin.length; i++) {
                    let to = ''
                    to = to + admin[i].UserName + ',';
                    await transporter.sendMail({
                        from: config.transporter.auth.user, // sender address
                        to: admin.UserName, // list of receivers
                        subject: 'Delete ' + proposal.Topic, // Subject line
                        text: client.Name + ' delete ' + proposal.Topic, // plain text body
                    });
                }}
            asyncSendMail().then();
            res.redirect('/client/myproject')
        })
        .catch(next)
})

router.get('/myteam', checkClientLogin, function (req, res, next) {
    Promise.all([
        clientModel.getClientByClientID(req.session.userinfo),
        stageModel.getStage(),
    ])
        .then(function (result) {
            const stage = result[1][0];
            res.render('client/my_teams', {
                teams: result[0].GroupID,
                pageTitle: 'My Teams',
                username: result[0].Name,
                stage: stage,
            });
        })
        .catch(next);
});

router.get('/myteam/teampage', checkClientLogin, function (req, res, next) {
    const teamID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        clientModel.getClientByClientID(req.session.userinfo),
        teamModel.getTeamByTeamID(teamID),
        stageModel.getStage()
    ])
        .then(function (result) {
            const stage = result[2][0];
            //console.log(result[1].ClientMeetingID[0].Date)
            res.render('client/team_page', {
                team: result[1],
                pageTitle: 'SSIT TEAM' + result[1].TeamName,
                username: result[0].Name,
                meetings: result[1].ClientMeetingID,
                stage: stage,
            });
        })
        .catch(next);
});


router.get('/myteam/teammark', checkClientLogin, function (req, res, next) {
    const teamID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        clientModel.getClientByClientID(req.session.userinfo),
        teamModel.getTeamByTeamID(teamID),
    ])
        .then(function (result) {
            //console.log(result[1].ClientMeetingID[0].Date)
            res.render('client/team_mark', {
                team: result[1],
                pageTitle: 'SSIT TEAM ' + result[1].TeamName + ' Mark',
                username: result[0].Name,
                meetings: result[1].ClientMeetingID,
            });
        })
        .catch(next);
});

router.get('/myteam/edit_teammark', checkClientLogin, function (req, res, next) {
    const teamID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        clientModel.getClientByClientID(req.session.userinfo),
        teamModel.getTeamByTeamID(teamID),
    ])
        .then(function (result) {
            //console.log(result[1].ClientMeetingID[0].Date)
            res.render('client/edit_teammark', {
                team: result[1],
                pageTitle: 'SSIT TEAM ' + result[1].TeamName + ' Mark',
                username: result[0].Name,
                meetings: result[1].ClientMeetingID,
            });
        })
        .catch(next);
});

//mark for team
router.post('/myteam/teammark', checkClientLogin, function (req, res, next) {
    const teamid = mongoose.Types.ObjectId(req.body.GroupID);
    const clientID = req.session.userinfo;
    let marks = [];
    let reasons = [];
    for (let i = 1; i < 9; i++) {
        marks.push(eval('req.body.mark' + i))
    }
    for (let i = 1; i < 9; i++) {
        reasons.push(eval('req.body.mark' + i + '_reason'))
    }
    clientModel.updateClientGroupMark(teamid, marks, reasons).then(function () {
        Promise.all([
            teamModel.getTeamByTeamID(teamid),
            clientModel.getClientByClientID(clientID),
            proposalModel.getProposalByGroupID(teamid),
        ]).then(function (result) {
            const team = result[0];
            const students = team.StudentID;
            const client = result[1];
            const proposal = result[2];
            const asyncSendMail = async function(){
            for (let i = 0; i < students.length; i++) {
                let to = ''
                to = to + students[i].UserName + ',';
                await transporter.sendMail({
                    from: config.transporter.auth.user, // sender address
                    to: to, // list of receivers
                    subject: 'Client Mark for your project ' + proposal.Topic, // Subject line
                    text: client.Name + ' gave client mark for your project ' + proposal.Topic, // plain text body
                });
            }}
            asyncSendMail().then();
            res.redirect('/client/myteam/teampage?id=' + teamid);
        })
    })
});


router.get('/mytimetable', checkClientLogin, function (req, res, next) {
    Promise.all([
        clientModel.getClientByClientID(req.session.userinfo),
        clientMeetingModel.getClientMeetingByClientID(req.session.userinfo),
        changeClientMeetingRequestModel.getChangeClientMeetingRequestByClientID(req.session.userinfo),
        stageModel.getStage(),
    ])
        .then(function (result) {
            const changeClientMeetingRequest = result[2];
            const stage = result[3][0];
            res.render('client/my_timetable', {
                meetings: result[1],
                pageTitle: 'My TimeTable',
                username: result[0].Name,
                changeClientMeetingRequest: changeClientMeetingRequest,
                stage: stage,
            });
        })
        .catch(next);
});


/*发送更改会议请求*/
router.post('/mytimetable', checkClientLogin, function (req, res, next) {
    const selectMeetingid = mongoose.Types.ObjectId(req.body.selection);
    const reason = req.body.reason;
    const time = req.body.time;
    const nowDate = new Date();
    Promise.all([
        clientMeetingModel.getClientMeetingByMeetingID(selectMeetingid),
        adminModel.getAllAdmin(),
    ])
        .then(function (result) {
            const client = result[0].ClientID;
            const admin = result[1];
            let request = {
                MeetingID: result[0]._id,
                ClientID: req.session.userinfo,
                Status: 'pending',
                NewMeetingTime: time,
                RequestComment: {
                    RequestName: client.Name,
                    Date: nowDate,
                    Content: reason,
                }
            }
            changeClientMeetingRequestModel.createChangeClientMeetingRequest(request);
            const asyncSendMail = async function(){
                for (let i = 0; i < admin.length; i++) {
                    let to = ''
                    to = to + admin[i].UserName + ',';
                    await transporter.sendMail({
                        from: config.transporter.auth.user, // sender address
                        to: admin, // list of receivers
                        subject: 'New change client meeting request from ' + client.Name, // Subject line
                        text: 'Client ' + client.Name + ' send new change meeting request.',
                    });
                }}
                asyncSendMail().then();
            res.redirect('/client/mytimetable')
        });
});


module.exports = router;
