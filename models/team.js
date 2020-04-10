const mongo = require('../lib/mongo');
const team = mongo.teams;
const proposal = mongo.proposals;
const client = require('./client');
// team
//     .find()
//     .populate('ProposalID')
//     .populate('Preference')
//     .exec()
//     .then(function (result) {
//         console.log(result[0]);
//     })

module.exports = {

    /**
     * Author: WANG
     * User:
     * @param {ObjectID} id
     * @return {Object: team} a team object
     */
    getTeamByTeamID: function getTeamByTeamID(id) {
        return team
            .findOne({_id: id})
            .populate('ProposalID')
            .populate('StudentID')
            .populate('StaffID')
            .populate('ClientMeetingID')
            .populate('Representer')
            .exec();
    },

    getGroupByProposalID: function getGroupByProposalID(id) {
        return team
            .find({ProposalID: id})
            .populate('StudentID')
            .populate('StaffID')
            // .populate('StaffID')
            .exec();
    },
    /**
     * @return {team} a team object
     */
    getAllTeam: function getAllTeam() {
        return team
            .find()
            .populate('StudentID')
            .populate('StaffID')
            .populate('ProposalID')

            .exec();
    },

    /**
     * @author TENG
     * @param { ObjectID } id
     * @return {Object: Team}
     */
    getTeamByStudentID: function getTeamByStudentID(id) {
        return team
            .findOne({StudentID: {$elemMatch: {$eq: id}}})
            .populate({path: 'ProposalID', populate: {path: 'ClientID'}})
            .populate('StudentID')
            .populate('StaffID')
            .populate('Preference')
            .populate('Representer')
            .populate('ClientMeetingID')
            .populate({path: 'StaffMeetingID', populate: {path: 'TemporaryStaffID'}})
            .exec();
    },
    /**
     * @author : wang
     * @param {object} team : team object.
     * @return {[team]} team
     */
    postTeam: function postTeam (TeamName) {
         team
            .create({TeamName:TeamName})
             .populate('GroupID')
            .exec()
    },
    createTeam: function createTeam (teams) {
        return team
            .create(teams)
    },
    //
    // editTeam: function editTeam (newteam) {
    //     return team
    //     .update({_id:newteam._id})
    //         .exec()
    // },


    // deleteTeam: function deleteTeam (teamID) {
    // },

    postProjectPreferenceByStudentID: function postProjectPreferenceByStudentID(studentID, projectID) {
        return team
            .findOneAndUpdate( {StudentID: {$elemMatch: {$eq: studentID}}}, {$push: {Preference: projectID}}, {new: true})
            .exec()
    },

    deleteProjectPreferenceByStudentID: function deleteProjectPreferenceByStudentID(studentID) {
        return team
            .findOneAndUpdate( {StudentID: {$elemMatch: {$eq: studentID}}}, {$unset: {Preference: ''}}, {new: true})
            .exec()
    },
    // /**
    //  * @param { ObjectID } client id
    //  * @return {Object: Team}
    //  */
    // getTeamByClientID: function getTeamByClientID(id) {
    //     return team
    //     .deleteOne({_id:teamID})
    //         .exec()
    // },
    postTeamNewRepresenter: function postTeamNewRepresenter(studentID, newStudentID) {
        team
            .findOneAndUpdate({ Representer: studentID }, { $set: { Representer: newStudentID}})
            .exec()

    },
};
