const mongo = require('../lib/mongo');
const stage = mongo.stages;

module.exports = {
    getStage: function getStage() {
        return stage
            .find()
            .exec();
    },
};
