const mongo = require('../lib/mongo');
const admin = mongo.admins;

module.exports = {
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
