import statusController from "./controllers/status/status.controller";

import express = require('express');
import {aircraftController} from "./controllers/aircraft/aircraft.controller";
import {validateRequest} from "../middleware/validation.middleware";
import {AircraftCreateRequest, AircraftGetByIdRequest} from "./controllers/aircraft/aircraft.dto";

export const server = express()

// Middleware to parse JSON and URL-encoded data
server.use(express.json());
server.use(express.urlencoded({ extended: true }))

// Homepage
server.get('/', statusController.getStatus)

// Aircrafts
server.get('/aircrafts',aircraftController.getAll)
server.get('/aircrafts/:id',validateRequest(AircraftGetByIdRequest),aircraftController.getById)
server.post('/aircrafts',validateRequest(AircraftCreateRequest),aircraftController.create)
server.put('/aircrafts/:id',aircraftController.update)
server.delete('/aircrafts/:id',aircraftController.delete)