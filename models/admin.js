const mongo = require('../lib/mongo');
const admin = mongo.admins;

module.exports = {
    updatePasswordByAdminId: function updatePasswordByAdminId(id, password) {
        return admin
            .findByIdAndUpdate(id, { Password: password })
            .exec();
    },
    getAdminByID: function getAdminByID(id) {
        return admin
            .findOne({_id: id})
            .exec();
    },
    getAdminByUserName: function getAdminByUserName(email) {
        return admin
            .findOne({UserName: email})
            .exec();
    },
    getAllAdmin: function getAllAdmin() {
        return admin
            .find()
            .exec();
    }
}
