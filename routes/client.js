const express = require('express');
const router = express.Router();
const clientModel = require('../models/client');
const proposalModel = require('../models/proposal');
const teamModel = require('../models/team');
const mongoose = require('mongoose');
const studentModel = require('../models/student');
const clientMeetingModel = require('../models/clientmeetings');
const changeClientMeetingRequestModel = require('../models/changeclientmeetingrequest')
const stageModel = require('../models/stage')
const clientID = mongoose.Types.ObjectId('5e7d2198f8f7d40d64f332d5');


router.get('/myproject', function(req, res, next) {
    Promise.all([
        clientModel.getClientByClientID(clientID),
        proposalModel.getProposalByClientID(clientID),
        stageModel.getStage(),
    ])
        .then(function(proposals) {
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

router.get('/myproject/create_project', function(req, res,next) {
    Promise.all([
        clientModel.getClientByClientID(clientID),
    ])
        .then(function(result) {
            const client = result[0];

            res.render('client/create_project', {
                pageTitle: 'Create Project',
                username: client.Name,
            });
        })
        .catch(next);
});


/*Create new proposals*/
router.post('/myproject/create_project',function(req,res,next){
    const client = clientID;
    const topic = req.body.topic;
    const content = req.body.content;
    nowDate = new Date();
    let proposal = {
        _id:mongoose.Types.ObjectId(),
        ClientID: client,
        Topic: topic,
        Content: content,
        Date:nowDate,
        Status:'pending'
    }
    proposalModel.createProposal(proposal)
    clientModel.updateClientProposalListByProposalID(client,proposal._id)
        .then(function () {
            res.redirect('/client/myproject/project_pending?id='+proposal._id)
            //res.redirect('/client/myproject')
        })
        .catch(next)
});



router.get('/myproject/project_approved', function(req, res, next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        proposalModel.getProposalByProposalID(proposalID),
        clientModel.getClientByProposalID(proposalID),
        teamModel.getGroupByProposalID(proposalID),
    ])
        .then(function(result) {
            res.render('client/project_approved', {
                proposal: result[0],
                pageTitle: result[0].Topic,
                username: result[1].Name,
                teams: result[2],
            });
        })
        .catch(next);
});

router.get('/myproject/project_pending', function(req, res, next) {
    //console.log(req.query.id);
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        proposalModel.getProposalByProposalID(proposalID),
        clientModel.getClientByProposalID(proposalID),
    ])
        .then(function(result) {
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
router.post('/myproject/project_pending',function(req,res,next){
    const proposalID = mongoose.Types.ObjectId(req.body.proposalID);
    const comment = req.body.comment;
    replyDate = new Date();
    Promise.all([
        clientModel.getClientByProposalID(proposalID),
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
                res.redirect('/client/myproject/project_pending?id='+proposalID)
            })
        })
        .catch(next)
})



router.get('/myproject/project_rejected', function(req, res, next) {
    //console.log(req.query.id);
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        proposalModel.getProposalByProposalID(proposalID),
        clientModel.getClientByProposalID(proposalID),
    ])
        .then(function(result) {
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
router.post('/myproject/project_rejected',function(req,res,next){
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    const comment = req.body.comment;
    replyDate = new Date();
    Promise.all([
        clientModel.getClientByProposalID(proposalID),
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
                res.redirect('/client/myproject/project_rejected?id='+req.query.id)
            })
        })
        .catch(next)
})


router.get('/edit_project', function(req, res,next) {
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        proposalModel.getProposalByProposalID(proposalID),
        clientModel.getClientByProposalID(proposalID),
    ])
        .then(function(result) {
            res.render('client/edit_project', {
                proposal: result[0],
                pageTitle: 'Edit Project',
                username: result[1].Name,
            });
        })
        .catch(next);
});

/*Edit proposal*/
router.post('/edit_project',function(req,res,next){
    const proposalID = mongoose.Types.ObjectId(req.body.proposalID);
    console.log('id= '+ proposalID)
    const topic = req.body.topic;
    const content = req.body.content;
    newDate = new Date();
    let proposal = {
        _id:proposalID,
        Topic: topic,
        Content: content,
        Date:newDate,
        Status:'pending'
    }
    proposalModel.editProposal(proposal)
        .then(function () {
            res.redirect('/client/myproject/project_pending?id='+proposalID)
        })
        .catch(next)
})

/*Delete proposal*/
router.get('/delete_project',function(req,res,next){
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    newDate = new Date();
    Promise.all([
        clientModel.deleteProposalFromClientListByProposalID(clientID,proposalID),
        proposalModel.deleteProposal(proposalID)
    ])
    .then(function (result) {
            res.redirect('/client/myproject')
        })
        .catch(next)
})

router.get('/myteam', function(req, res,next) {
    Promise.all([
        clientModel.getClientByClientID(clientID),
    ])
        .then(function(result) {
            res.render('client/my_teams', {
                teams: result[0].GroupID,
                pageTitle: 'My Teams',
                username: result[0].Name,
            });
        })
        .catch(next);
});

router.get('/myteam/teampage', function(req, res,next) {
    const teamID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        clientModel.getClientByClientID(clientID),
        teamModel.getTeamByTeamID(teamID),
        stageModel.getStage()
    ])
        .then(function(result) {
            const stage = result[2][0];
            //console.log(result[1].ClientMeetingID[0].Date)
            res.render('client/team_page', {
                team: result[1],
                pageTitle: 'SSIT TEAM'+result[1].TeamName,
                username: result[0].Name,
                meetings: result[1].ClientMeetingID,
                stage:stage,
            });
        })
        .catch(next);
});


router.get('/myteam/teammark', function(req, res, next) {
    const teamID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        clientModel.getClientByClientID(clientID),
        teamModel.getTeamByTeamID(teamID),
    ])
        .then(function(result) {
            //console.log(result[1].ClientMeetingID[0].Date)
            res.render('client/team_mark', {
                team: result[1],
                pageTitle: 'SSIT TEAM '+result[1].TeamName+' Mark',
                username: result[0].Name,
                meetings: result[1].ClientMeetingID,
            });
        })
        .catch(next);
});

router.get('/myteam/edit_teammark', function(req, res, next) {
    const teamID = mongoose.Types.ObjectId(req.query.id);
    Promise.all([
        clientModel.getClientByClientID(clientID),
        teamModel.getTeamByTeamID(teamID),
    ])
        .then(function(result) {
            //console.log(result[1].ClientMeetingID[0].Date)
            res.render('client/edit_teammark', {
                team: result[1],
                pageTitle: 'SSIT TEAM '+result[1].TeamName+' Mark',
                username: result[0].Name,
                meetings: result[1].ClientMeetingID,
            });
        })
        .catch(next);
});

router.post('/myteam/teammark',function(req,res,next) {
    const teamid = mongoose.Types.ObjectId(req.body.GroupID);
    let marks = [];
    let reasons = [];
    for (let i=1;i<9;i++){
        marks.push(eval('req.body.mark'+i))
    }
    for (let i=1;i<9;i++){
        reasons.push(eval('req.body.mark'+i+'_reason'))
    }
    clientModel.updateClientGroupMark(teamid,marks,reasons).then(function () {
        res.redirect('/client/myteam/teampage?id='+teamid);
    })
});



router.get('/mytimetable', function(req, res,next) {
    Promise.all([
        clientModel.getClientByClientID(clientID),
        clientMeetingModel.getClientMeetingByClientID(clientID),
        changeClientMeetingRequestModel.getChangeClientMeetingRequestByClientID(clientID),
    ])
        .then(function(result) {
            const changeClientMeetingRequest = result[2];
            res.render('client/my_timetable', {
                meetings: result[1],
                pageTitle: 'My TimeTable',
                username: result[0].Name,
                changeClientMeetingRequest: changeClientMeetingRequest,
            });
        })
        .catch(next);
});


/*发送更改会议请求*/
router.post('/mytimetable', function(req, res,next) {
    const selectMeetingid =mongoose.Types.ObjectId(req.body.selection);
    const reason =req.body.reason;
    const time = req.body.time;
    nowDate = new Date();
    Promise.all([
        clientMeetingModel.getClientMeetingByMeetingID(selectMeetingid)
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
            res.redirect('/client/mytimetable')
           });
});




module.exports = router;
