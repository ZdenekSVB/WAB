import * as mongoose from "mongoose";

const Aircraft = mongoose.model('Aircraft',new mongoose.Schema({
    name:String,
    model:String,
    capacity:Number,
}))
export default Aircraft