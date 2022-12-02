import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
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
    }
})

export default mongoose.model('Inventory', itemSchema);