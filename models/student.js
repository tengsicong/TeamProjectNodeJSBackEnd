const mongo = require('../lib/mongo');
const student = mongo.students;
const team = mongo.teams;

module.exports = {

    getStudentByUserName: function getStudentByUserName(email) {
        return student
            .findOne({UserName: email})
            .exec();
    },

    /**
     * Author: TENG
     * User:
     * @param {ObjectId} id
     * @return {Object} a student object
     */
    getStudentByStudentID: function getUserByStudentID(id) {
        return student
            .findOne({_id: id})
            .populate('GroupID')
            .exec();
    },
    /**
     * @param {Number} id
     * @return {Object} a student object
     */
    getAllStudent: function getAllStudent() {
        return student
            .find()
            .populate('GroupID')
            .populate({path: 'GroupID',populate:{ path: 'ProposalID' }})
            .exec();
    },

    getStudentByClientID: function getStudentByClientID(id) {
        return student
            .populate('GroupID')
            .find({GroupID: id})
            .exec();
    },

    postPeopleLikeByStudentID: function postPeopleLikeByStudentID(thisStudentID, peopoleID) {
        student
            .findOneAndUpdate({_id: thisStudentID}, {$set: {PeopleLike: peopoleID}})
            .exec();
    },

    deletePeopleLikeByStudentID: function deletePeopleLikeByStudentID(studentID) {
        student
            .findOneAndUpdate({_id: studentID}, {$unset: {PeopleLike: ''}})
    }


};
