import {Config} from "../../config";

const mongoose = require('mongoose');

const mongo = {
    async start() {
        if (!Config.mongo.url) {
            throw new Error('Mongo URL not set!')
        }
        await mongoose.connect(Config.mongo.url);
    },

    async stop() {
        await mongoose.disconnect()
    }
}

export default mongo
