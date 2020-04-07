const mongo = require('../lib/mongo');
const client = mongo.clients;
const proposal = mongo.proposals;






module.exports = {

    /**
     * @param {ObjectId} id
     * @return {client} a client object
     */
    getClientByClientID: function getClientByClientID(id) {
        return client
            .findOne({_id: id})
            .exec();
    },

    getClientByProposalID: function getClientByProposalID(id) {
        return client
            .findOne({AllProposalID: id})
            .exec();
    },

};
