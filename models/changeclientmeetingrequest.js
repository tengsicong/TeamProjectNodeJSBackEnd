const mongo = require('../lib/mongo');
const clientmeetings = mongo.client_meetings;
const student = mongo.students;
const client = mongo.clients;
const mongoose = require('mongoose');
const changeclientmeetingrequest = mongo.change_client_meeting_requests;


module.exports = {
    getChangeClientMeetingRequest: function getChangeClientMeetingRequest() {
        return changeclientmeetingrequest
            .find()
            // .populate('ClientID')
            .populate({path: 'MeetingID',populate:{ path: 'ClientID' }})
            .exec()
    }
};
