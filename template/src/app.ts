import 'reflect-metadata';
import {server} from './api/server';
import mongo from "./persistence/mongo";
import {Config} from "../config";


async function init() {
    console.log('Connecting to Mongo...')
    await mongo.start()
    console.log('Connected to Mongo')

    server.listen(Config.port, () => {
        console.log(`Listening on port ${Config.port}...`)
    })
}

init()
