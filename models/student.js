const mongo = require('../lib/mongo');
const student = mongo.students;
const mongoose = require('mongoose');

module.exports = {

    updatePasswordByStudentId: function updatePasswordByStudentId(id, password) {
        return student
            .findByIdAndUpdate(id, { Password: password })
            .exec();
    },

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
            .populate({path: 'GroupID', populate: {path: 'ProposalID'}})
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

    deletePeopleDontLikeByStudentID: function deletePeopleDontLikeByStudentID(studentID) {
        return student
            .findOneAndUpdate({_id: studentID}, {$unset: {PeopleDontLike: ''}}, {new: true})
            .exec()
    },

    addNewStudent: function addNewStudent(addStudentName, addStudentUserName) {
        student
            .create({Name: addStudentName, UserName: addStudentUserName, Password: addStudentName})

    },


    postTeamMateMarkByStudentID: function postTeamMateMarkByStudentID(studentID, mark) {
        return student
            .findOneAndUpdate({_id: studentID}, {$addToSet: {Mark: mark}})
            .exec()
    },

    postMarkedForTeamMate: function postMarkedForTeamMate(studentID) {
        return student
            .findOneAndUpdate({_id: studentID}, {$set: {MarkForTeam: true}})
            .exec()
    },

    /**
     * @author: wang
     */
    postStudentTeamByStudentID: function postStudentTeamByStudentID(studentID, groupID) {
        return student
            .findOneAndUpdate({_id: studentID}, {$set: {GroupID: groupID}})
            .exec()
    },
    deletePreStudentGroupID: function deletePreStudentGroupID(studentID) {
        return student
            .findOneAndUpdate({_id: studentID}, {$unset: {GroupID: ''}},{new: true})
            .exec()
    },
    addNewStudentGroupID: function addNewStudentGroupID( studentID, groupID) {
        return student
            .findOneAndUpdate({_id: studentID}, {$set: {GroupID: groupID}},{new: true})
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
