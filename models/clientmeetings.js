const mongo = require('../lib/mongo');
const clientmeetings = mongo.client_meetings;
const student = mongo.students;
const client = mongo.clients;
const mongoose = require('mongoose');


module.exports = {
    getClientMeetingByClientID: function getClientMeetingByClientID(id) {
        return clientmeetings
            .find({ClientID: id})
            .populate('GroupID')
            .populate('ClientID')
            .exec()
    },
    getAllClientMeetings: function getAllClientMeetings() {
        return clientmeetings
            .find()
            .populate('GroupID')
            .populate('ClientID')
            .exec()
    }


};
