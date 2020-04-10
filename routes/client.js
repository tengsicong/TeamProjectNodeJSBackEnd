const express = require('express');
const router = express.Router();
const clientModel = require('../models/client');
const proposalModel = require('../models/proposal');
const teamModel = require('../models/team');
const mongoose = require('mongoose');
const studentModel = require('../models/student');
const clientMeetingModel = require('../models/clientmeetings');
const changeClientMeetingRequestModel = require('../models/changeclientmeetingrequest')

const clientID = mongoose.Types.ObjectId('5e7d2198f8f7d40d64f332d5');
const staffID = mongoose.Types.ObjectId('5e7aa6c6446d0305c8e28c6d');


router.get('/myproject', function(req, res, next) {
    Promise.all([
        clientModel.getClientByClientID(clientID),
        proposalModel.getProposalByClientID(clientID),
    ])
        .then(function(proposals) {
            const client = proposals[0];

            res.render('client/my_proposals', {
                proposals: proposals[1],
                pageTitle: 'My Projects',
                username: client.Name,
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
})



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
                res.redirect('/client/myproject/project_pending?id='+req.query.id)
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
    const proposalID = mongoose.Types.ObjectId(req.query.id);
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
            res.redirect('/client/myproject/project_pending?id='+req.query.id)
        })
        .catch(next)
})

/*Delete proposal*/
router.get('/delete_project',function(req,res,next){
    const proposalID = mongoose.Types.ObjectId(req.query.id);
    newDate = new Date();
    proposalModel.deleteProposal(proposalID)
    //clientModel.deleteProposalFromClientListByProposalID(clientID,proposalID)
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
    ])
        .then(function(result) {
            //console.log(result[1].ClientMeetingID[0].Date)
            res.render('client/team_page', {
                team: result[1],
                pageTitle: 'SSIT TEAM'+result[1].TeamName,
                username: result[0].Name,
                meetings: result[1].ClientMeetingID,
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

router.post('myteam/teammark',function(req,res,next) {
    const mark1 = req.body.mark1;
    const mark1_reason = req.body.mark1_reason;
    const mark2 = req.body.mark2;
    const mark2_reason = req.body.mark2_reason;
    const mark3 = req.body.mark1;
    const mark3_reason = req.body.mark3_reason;
    const mark4 = req.body.mark1;
    const mark4_reason = req.body.mark4_reason;
    const mark5 = req.body.mark1;
    const mark5_reason = req.body.mark5_reason;
    const mark6 = req.body.mark1;
    const mark6_reason = req.body.mark6_reason;
    const mark7 = req.body.mark7;
    const mark7_reason = req.body.mark7_reason;
    const mark8 = req.body.mark8;
    const mark8_reason = req.body.mark8_reason;
    // console.log('mark1: '+mark1+' reason1: '+mark1_reason);
    // console.log('mark2: '+mark2+' reason2: '+mark2_reason);
    // console.log('mark3: '+mark3+' reason3: '+mark3_reason);
    // console.log('mark4: '+mark4+' reason4: '+mark4_reason);
    // console.log('mark5: '+mark5+' reason5: '+mark5_reason);
    // console.log('mark6: '+mark6+' reason6: '+mark6_reason);
    // console.log('mark7: '+mark7+' reason7: '+mark7_reason);
    // console.log('mark8: '+mark8+' reason8: '+mark8_reason);
    res.redirect('client/myteam/teampage');
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
    const select =req.body.selection;
    const number = select.substr(select.length-1,1);
    const meetingnumber = number-1;
    const reason =req.body.reason;
    const time = req.body.time;
    nowDate = new Date();
    Promise.all([
        clientModel.getClientByClientID(clientID),
        clientMeetingModel.getClientMeetingByClientID(clientID),
    ])
        .then(function (result) {
            const meetings = result[1];
            let request = {
                MeetingID: meetings[meetingnumber]._id,
                ClientID: clientID,
                Status:'pending',
                NewMeetingTime:time,
                RequestComment:{
                    RequestName:result[0].Name,
                    Date:nowDate,
                    Content:reason
                }}
            changeClientMeetingRequestModel.createChangeClientMeetingRequest(request);
            res.redirect('/client/mytimetable')
            });
});




module.exports = router;
