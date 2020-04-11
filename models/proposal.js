const mongo = require('../lib/mongo');
const proposal = mongo.proposals;
const student = mongo.students;
const client = mongo.clients;
const mongoose = require('mongoose');

module.exports = {

    /**
     * @author: Teng
     * @param {String} could be null / approved / pending / rejected.
     * @return {[proposal]} All proposals
     */
    getAllProposals: function getAllProposals(status) {
        let result;
        if (status == null) {
            console.log('null')
            result = proposal
                .find()
                .populate('ClientID')
                .populate('GroupID')
                .exec();
        } else if (status == 'approved' | status == 'pending' | status == 'rejected') {
            result = proposal
                .find({Status: status})
                .populate('ClientID')
                .populate('GroupID')
                .exec();
        } else {
            console.log('function: getAllProposals, parameter wrong');
        }
        return result;
    },

    /**
     * @param {ObjectId} proposal id.
     * @return {[proposal]} proposal
     */
    getProposalByProposalID: function getProposalByProposalID(id) {
        return proposal
            .findOne({_id: id})
            .populate({path: 'ClientID', populate: {path: 'AllProposalID'}})
            .populate({path:'GroupID',populate:{path: "StaffID"}})
            .exec();
    },

    /**
     * @param {Number} id student id.
     * @return {[proposal]} proposal of student
     */
    getProposalByStudentID: function getProposalByStudentID(id) {
        return proposal
            .find()
            .populate('ClientID')
            .populate({path: 'GroupID', match: {StudentID: {$elemMatch: {$eq: id}}}, populate: {path: 'StaffID'}})
            .exec()
            .then(function(result) {
                let r
                for (let i = 0; i < result.length; i++) {
                    if (result[i]['GroupID'].length == 1) {
                        r = result[i];
                    }
                }
                // console.log(r)
                return r;
            })
    },


    getProposalByClientID: function getProposalByClientID(id) {
        return proposal
            .find({ClientID: id})
            .populate('ClientID')
            .populate({path:'GroupID', populate: {path:'StaffID'}})
            .populate({path:'GroupID', populate: {path:'StudentID'}})
            .exec()

    },

    getProposalByGroupID: function getProposalByGroupID(id) {
        return proposal
            .find({_id: id})
            .exec();
    },

    /**
     * @param {object} proposal : proposal object.
     * @return {[proposal]} proposal
     */
    createProposal: function createProposal (proposals) {
        return proposal.create(proposals)
    },

    /**
     * @param {object} proposal : proposal object.
     * @return {[proposal]} proposal
     */
    editProposal: function editProposal (newproposal) {
        return proposal.update({_id:newproposal._id},{$set:{Topic:newproposal.Topic, Content:newproposal.Content, Date:newproposal.Date,Status:newproposal.Status}})
    },

    adminEditProposal: function adminEditProposal (newproposal) {
        return proposal.update({_id:newproposal._id},{$set:{Topic:newproposal.Topic, Content:newproposal.Content, Date:newproposal.Date}})
    },

    adminEditPendingStatusProposal: function adminEditPendingStatusProposal (newproposal) {
        return proposal.update({_id:newproposal._id},{$set:{Date:newproposal.Date,Status:newproposal.Status}})
    },

    /**
     * @param {objectID} proposalID
     * @return {[proposal]} proposal
     */
    deleteProposal: function deleteProposal (proposalID) {
        return proposal.deleteOne({_id:proposalID}).exec()
    },

    /**
     * @param {ObjectId} id: proposalID {array} comment
     * @return {[proposal]} proposal of student
     */
    addProposalComment: function addProposalComment (id,reply) {
        return proposal.findByIdAndUpdate(id,{Reply:reply})
    },

    deleteProposalTeamByGroupID: function deleteProposalTeamByGroupID (groupID) {
        return proposal.deleteOne({_id:groupID}).exec()
    },



};

// const id = mongoose.Types.ObjectId('5e8f2d6d3f95afd52382516f');
// date = new Date();
// let reply = proposal({_id:id}).Reply;
// reply.push({Author: 'test1', Comment: 'thisis test1',ReplyDate:date})
// //proposal.update({_id:id},{proposal:{$push:{Reply:reply}}})
// proposal.find({_id:id})
// .then (function (result) {
//     console.log(result)
// })




// const id = mongoose.Types.ObjectId('5e7b6ace4f4ed29e60233999');


// proposal
//     .find()
//     .populate('ClientID')
//     .populate('GroupID')
//     .exec()
//     .then(function(result) {
//         // let arr = [];
//         for (let i = 0; i < result.length; i++) {
//             for (let j = 0; j < result[i].GroupID.length; j++)
//             if (result[i]['GroupId'][j][_id] == studentID);
//             console.log(result[i]);
//         }
//         // console.log(result)
//         // console.log(result[2])
//     })
//     .catch()
