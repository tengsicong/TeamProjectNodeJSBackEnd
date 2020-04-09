const mongo = require('../lib/mongo');
const staff = mongo.staffs;
const proposal = mongo.proposals;
const team = mongo.teams;

// console.log('start')
// staff
//     .find()
//     .populate('GroupID')
//     .exec()
//     .then(function(result) {
//         console.log(result[0]);
//         console.log('end');
//     });

// module.exports={
//
// }

module.exports = {
    /**
     * @param {ObjectId} id
     * @return {[teams]} allocated team
     */
    getAllocatedTeamByStaffID: function getAllocatedTeamByStaffID(id) {
        return team
            .find({StaffID: id})
            .populate('StaffID','Name')
            .populate('StudentID','Name')
            .populate('Representer','Name')
            .populate({path: 'ProposalID', populate: {path: 'ClientID',select: 'Name'}})
            .populate({path: 'StaffMeetingID',populate: {path:'StaffID'}})
            .exec();
    },

    /**
     * @param {ObjectId} id
     * @return {project} a project
     */
    getStaffByStaffID: function getProjectByStaffID(id) {
        return staff
            .findById(id)
            .exec();
    },

    /**
     * @param {String} name, staff's user name which is usually an email address
     * @return {staffs} a staff object
     */
    getStaffByUserName: function getStaffByUserName(name) {
        return staff
            .findOne({UserName: name})
            .exec();
    },

    /**
     * @return {[staffs]} staff object
     */
    getAllStaff: function getAllStaff() {
        return staff
            .find()
            .exec();
    },

    resetPasswordByStaffId: function resetPasswordByStaffId(id, password) {
        return staff.findByIdAndUpdate(id, { Password: password });
    }
};
