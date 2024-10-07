import {aircraftService} from "../../../business/aircraft.service";
import { Response,Request} from "express";
import {AircraftCreateRequest, AircraftGetByIdRequest} from "./aircraft.dto";

export const aircraftController = {
    async getAll(req:Request,res:Response) {
        const aircrafts = await aircraftService.getAll()
        res.status(200).send(aircrafts)
    },
    async getById(req:typeof  AircraftGetByIdRequest,res:Response) {
        const aircraft = await aircraftService.getById(req.paramsDto.id)
        res.status(200).send(aircraft)
    },
    async create(req:typeof  AircraftCreateRequest,res:Response) {
        const aircraft = await aircraftService.create(req.bodyDto)
        res.status(201).send(aircraft)
    },
    async update(req:Request,res:Response) {
        if(await aircraftService.getById(req.params.id) === null){
            res.status(404).send()
        return
        }
        const aircraft = await aircraftService.update(req.params.id,req.body)
        res.status(202).send(aircraft)
    },
    async delete(req:Request,res:Response) {
        await aircraftService.delete(req.params.id)
        res.status(204).send()
    }
}