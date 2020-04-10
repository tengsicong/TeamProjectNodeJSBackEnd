const mongo = require('../lib/mongo');
const client = mongo.clients;
const proposal = mongo.proposals;
const mongoose = require('mongoose');






module.exports = {

    getClientByUserName: function getClientByUserName(email){
        return client
            .findOne({UserName:email})
            .exec();
    },

    /**
     * @param {ObjectId} id
     * @return {client} a client object
     */
    getClientByClientID: function getClientByClientID(id) {
        return client
            .findOne({_id: id})
            .populate({path:'GroupID',populate:{path: "StaffID"}})
            .populate({path:'GroupID', populate: {path:'StudentID'}})
            .exec();
    },

    getClientByProposalID: function getClientByProposalID(id) {
        return client
            .findOne({AllProposalID: id})
            .exec();
    },


    /**
     * @param {ObjectId} id, proposalID  id:clientID
     * @return {client} a client object
     */
    updateClientProposalListByProposalID: function updateClientProposalListByProposalID(id,proposalID) {
        return client.update({_id:id},{$addToSet:{AllProposalID: proposalID}})

    },

    /**
     * @param {ObjectId} id, proposalID  id:clientID
     * @return {client} a client object
     */
    deleteProposalFromClientListByProposalID: function deleteProposalFromClientListByProposalID(id,proposalID) {
        return client.update({_id:id},{$pull:{AllProposalID: {$in:proposalID}}})
    }

};

// client.findOneAndUpdate({_id:id},{$pull:{AllProposalID: {$in: proposalID}}})

// //const mongoose = require('mongoose');
// const clientID = mongoose.Types.ObjectId('5e7d2198f8f7d40d64f332d5');
// //
// //
// client
//     .findOne({_id:clientID})
//     .populate('AllProposalID')
//     //     //.updateOne({_id:clientID},{$unset:{Name:'remove'}})
//     .exec()
//     .then(function(result){
//         console.log(result)
// //         console.log(client.Name)
// })
