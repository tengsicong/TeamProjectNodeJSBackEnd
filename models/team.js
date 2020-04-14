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
            .populate({path: 'ProposalID', populate: {path: 'ClientID'}})
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
    createTeam: function createTeam(studentID, staffID, representer, teamName) {
        return team
            .create({StudentID: studentID, StaffID: staffID, Representer: representer, TeamName: teamName})
    },

    editTeam: function editTeam(Tid, staffID, studentID, staffMeetingIDList,representer){
        return team
            .findOneAndUpdate({_id: Tid},{$set:{StaffID: staffID, StudentID: studentID, StaffMeetingID: staffMeetingIDList, Representer:representer }})
            .exec()
    },

    // deleteTeamStudent: function deleteTeamStudent(teamName, selector2) {
    //     return team
    //         .findOneAndUpdate({TeamName: teamName}, {$unset: {StudentID: ''}}, {new: true})
    //         .exec()
    // },
    // deleteTeamStaff: function deleteTeamStaff(teamName, peopleID) {
    //     return team
    //         .findOneAndUpdate({TeamName: teamName}, {$unset: {StaffID: ''}}, {new: true})
    //         .exec()
    // },

    // editTeamStaff: function editTeamStaff(staffID, newStaffID) {
    //     team
    //         .findOneAndUpdate({StaffID: staffID },{$set: {StaffID: newStaffID}})
    //         .exec()
    // },
    //
    // editTeamStudent: function editTeamStudent(studentID, newStudentID) {
    //     team
    //         .findOneAndUpdate({StudentID: studentID}, {$push: {StudentID: newStudentID}})
    //         .exec()
    // },

    deleteTeamProposalByGroupID: function deleteTeamProposalByGroupID(id) {
        return team.findOneAndUpdate({_id: id}, {$unset: {ProposalID: '', ClientMeetingID: ''}}, {new: true}).exec()
    },

    postProjectPreferenceByStudentID: function postProjectPreferenceByStudentID(studentID, projectID) {
        return team
            .findOneAndUpdate({StudentID: {$elemMatch: {$eq: studentID}}}, {$push: {Preference: projectID}}, {new: true})
            .exec()
    },

    deleteProjectPreferenceByStudentID: function deleteProjectPreferenceByStudentID(studentID) {
        return team
            .findOneAndUpdate({StudentID: {$elemMatch: {$eq: studentID}}}, {$unset: {Preference: ''}}, {new: true})
            .exec()
    },

    postTeamNewRepresenter: function postTeamNewRepresenter(studentID, newStudentID) {
        team
            .findOneAndUpdate({Representer: studentID}, {$set: {Representer: newStudentID}})
            .exec()

    },

    allocateProposal: function allocateProposal(id, proposalID) {
        team
            .findOneAndUpdate({_id: id}, {$set: {ProposalID: proposalID}}).exec()

    },

    addClientMeetingByGroupID: function addClientMeetingByGroupID(id, meetingID) {
        team
            .findOneAndUpdate({_id: id}, {$addToSet: {ClientMeetingID: meetingID}}).exec()
    },
    addStaffMeetingID: function addStaffMeetingID(groupID, staffMeetingID) {
        return team
            .findOneAndUpdate({_id: groupID}, {$addToSet: {StaffMeetingID: staffMeetingID}})
            .exec()
    },
    getTeamBygroupID: function getTeamBygroupID(id) {
        return team
            .find({_id: id})
            .exec();
    },
};
