const mongo = require('../lib/mongo');
const changeclientmeetingrequest = mongo.change_client_meeting_requests;


module.exports = {
    getAllChangeClientMeetingRequest: function getAllChangeClientMeetingRequest() {
        return changeclientmeetingrequest
            .find()
            .populate({path: 'MeetingID',populate:{ path: 'ClientID' }})
            .populate({path: 'MeetingID',populate:{ path: 'GroupID' }})
            .exec()
    },


    getChangeClientMeetingRequestByClientID: function getChangeClientMeetingRequestByClientID(id) {
        return changeclientmeetingrequest
            .find({ClientID:id})
            //.populate('ClientID')
            .populate({path: 'MeetingID',populate:{ path: 'ClientID' }})
            .populate({path: 'MeetingID',populate:{ path: 'GroupID' }})
            .exec()
    },


    createChangeClientMeetingRequest :function createChangeClientMeetingRequest(request) {
        return changeclientmeetingrequest.create(request)
    },

    deleteChangeClientMeetingRequestByMeetingID: function deleteChangeClientMeetingRequestByMeetingID(MeetingID) {
        return changeclientmeetingrequest
            .deleteMany({MeetingID: MeetingID})
            .exec()
    },

    adminRejectClientRequest: function adminRejectClientRequest (requestID, adminName, comment) {
        return changeclientmeetingrequest
            .findOneAndUpdate({_id: requestID}, {$set: {Status: 'rejected', AdminReply: {AdminName: adminName, Date: new Date(), Content: comment}}},{new:true})
            .populate('ClientID')
            .exec()
    },

    adminApproveClientRequest: function adminApproveClientRequest (id) {
        return changeclientmeetingrequest
            .findOneAndUpdate({_id: id},{$set:{Status: 'approved'}})
            .exec()

    },

};
