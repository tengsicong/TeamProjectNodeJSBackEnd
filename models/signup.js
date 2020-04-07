const mongo = require('../lib/mongo');
const mongoose = require('mongoose');
const client = mongo.clients;

module.exports = {

    /**
     * @param {mongo.clients} doc - the description of a mongo.clients entity
     * @return {Promise} A callback when a document is created
     */
    createClient: function createClient(doc) {
        return client.create(doc);
    },
};