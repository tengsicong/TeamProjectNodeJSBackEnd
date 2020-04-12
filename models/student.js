const mongo = require('../lib/mongo');
const student = mongo.students;
const mongoose = require('mongoose');

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
            .populate('PeopleLike')
            .populate('PeopleDontLike')
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

    getStudentByGroupID: function getStudentByGroupID(id) {
        return student
            .findOne({_id: id})
            .exec();
    },

    postPeopleLikeByStudentID: function postPeopleLikeByStudentID(thisStudentID, peopoleID) {
        student
            .findOneAndUpdate({_id: thisStudentID}, {$set: {PeopleLike: peopoleID}})
            .exec();
    },

    postPeopleDontLikeByStudentID: function postPeopleDontLikeByStudentID(thisStudentID, peopoleID) {
        student
            .findOneAndUpdate({_id: thisStudentID}, {$push: {PeopleDontLike: peopoleID}})
            .exec();
    },


    deletePeopleLikeByStudentID: function deletePeopleLikeByStudentID(studentID) {
        return student
            .findOneAndUpdate({_id: studentID}, {$unset: {PeopleLike: ''}}, {new: true})
            .exec()
    },

    /**
     * @param {ObjectId} id, GroupID  id:studentID
     * @return {client} a client object
     */
    updateStudentTeamByTeamID: function updateStudentTeamByTeamID(id,GroupID) {
        return student.update({_id:id},{$addToSet:{GroupID: GroupID}})

    },
    deletePeopleDontLikeByStudentID: function deletePeopleDontLikeByStudentID(studentID) {
        return student
            .findOneAndUpdate({_id: studentID}, {$unset: {PeopleDontLike: ''}}, {new: true})
            .exec()
    },

    deleteStudentGroupByGroupID: function deleteStudentGroupByGroupID(studentID,GroupID){
        return student
            .findOneAndUpdate({_id:studentID},{$unset:{GroupID:''}},{new:true})
            .exec()
    },

};

// const studentID = mongoose.Types.ObjectId('5e8c235739bad87c4c0c5e26');
// // student
// //     .findOneAndUpdate({_id: studentID}, {$unset: {PeopleLike: ''}}).then(console.log)
//
// student
//     .findOneAndUpdate({_id: studentID}, {$push: {PeopleDontLike: studentID}})
//     .exec();
