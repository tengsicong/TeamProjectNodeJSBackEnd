const mongo = require('../lib/mongo');
const admin = mongo.admins;

module.exports = {
    getAdminByID: function getAdminByID(id) {
        return admin
            .findOne({_id: id})
            .exec();
    },

}
