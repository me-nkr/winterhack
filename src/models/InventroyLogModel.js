import mongoose, { mongo } from "mongoose";

const logSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    oid: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    change: {
        type: String,
        required: true,
        enum: ['create', 'add', 'remove']
    },
    creation: {
        type: Date,
        required: true
    }
})

export default mongoose.model('InventoryLog', logSchema);