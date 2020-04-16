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
    },

    getClientMeetingByMeetingID: function getClientMeetingByMeetingID(id) {
      return clientmeetings
          .findOne({_id:id})
          .populate('GroupID')
          .populate('ClientID')
    },

    deleteClientMeetingByGroupID: function deleteClientMeetingByGroupID(GroupID) {
        return clientmeetings
            .deleteMany({GroupID:GroupID})
            .exec()

    },

    addClientMeeting : function addCliengMeeting(clientmeeting){
        return clientmeetings
            .create(clientmeeting)
    },

    getClientMeetingByGroupID: function getClientMeetingByGroupID(groupid) {
        return clientmeetings
            .find({GroupID: groupid})
            .populate('GroupID')
            .populate('ClientID')
            .exec()
    },

    editClientMeetingTimeByClientMeetingID: function editClientMeetingTimeByClientMeetingID(id, newTime) {
        return clientmeetings
            .findOneAndUpdate({_id: id}, {$set: {Date: newTime}}, {new: true})
            .exec()
    },


    updateClientMeetingByMeetingID: function updateClientMeetingByMeetingID(id, newtime,newPlace) {
        return clientmeetings
            .findOneAndUpdate({_id: id}, {$set: {Date: newtime, Place:newPlace}}, {new: true})
            .exec()
    },





};
