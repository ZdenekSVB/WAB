import Aircraft from "../persistence/models/aircraft.model";
import AircraftModel from "../persistence/models/aircraft.model";


export const aircraftService = {
    async create(data: any ) {
        const aircraft = new Aircraft(data)
        await  aircraft.save()
        return aircraft
    },
    async getAll(){
        return await Aircraft.find()
    },
    async getById(id:string){
        return await Aircraft.findById(id)
    },
    async update(id:string,data:any){
        return await Aircraft.findByIdAndUpdate(id,data)
    },
    async delete(id:string){
        return Aircraft.findByIdAndDelete(id)
    }
}
