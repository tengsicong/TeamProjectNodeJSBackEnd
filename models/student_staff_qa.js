const mongo = require('../lib/mongo');
const studentStaffQa = mongo.student_staff_qas;
const reply = mongo.reply;

module.exports= {

    /**
     *
     * @param id
     * @returns {Promise|PromiseLike<[]>|Promise<[]>}
     */
    getQAByStudentID: function getQAByStudentID(id) {
        return studentStaffQa
            .find()
            .populate({path: 'GroupID', match: {StudentID: {$elemMatch: {$eq: id}}}})
            .exec()
            .then(function(result) {
                const r = [];
                for (let i = 0; i < result.length; i++) {
                    if (result[i]['GroupID'] != null) {
                        r.push(result[i]);
                    }
                }
                return r;
            });
    },

    getQAByGroupID: function getQAByGroupID(id) {
        return studentStaffQa
            .find({GroupID: id})
            .populate('Author', 'Name UserName')
            .exec();
    },

    getQAByQAID: function getQAByQAID(id) {
        return studentStaffQa
            .findById(id)
            .populate('Author', 'Name UserName')
            .exec();
    },

    updateReplyByQAID: function updateReplyByQAID(id, reply) {
        return studentStaffQa
            .findByIdAndUpdate(id,{$push:{Replies: reply}});
    },

    createNewQA: function postNewQA(student, topic, content) {
        studentStaffQa
            .create({GroupID: student.GroupID, Topic: topic, Replies: [{Author: student.Name, Comment: content, ReplyDate: new Date()}]});
    },

    deleteQAByGroupID: function deleteQAByGroupID(GroupID) {
        return studentStaffQa
            .deleteMany({GroupID:GroupID})
            .exec()
    },

    postReplyByQAID: function postReplyByQAID(id, name, re) {
        const r = new reply({
            Author: name,
            Comment: re,
            ReplyDate: new Date(),
        })
        return studentStaffQa
            .findOneAndUpdate({_id: id}, {$push: {Replies: r}})
            .exec();
    }
};

// const mongoose = require('mongoose');
// const studentID = mongoose.Types.ObjectId('5e7b6ace4f4ed29e60233999');
// studentStaffQa
//     .find()
//     .populate({path: 'GroupID', match: {StudentID: {$elemMatch: {$eq: studentID}}}})
//     .exec()
//     .then(function(result) {
//         const r = []
//         for (let i = 0; i < result.length; i++) {
//
//             if (result[i]['GroupID'] != null) {
//                 r.push(result[i]);
//             }
//         }
//         console.log(r);
//         console.log(r[0].Replies[0].ReplyDate);
//         console.log(new Date())
//     })
