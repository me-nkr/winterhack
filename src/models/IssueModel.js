import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
    summary: {
        type: String,
        required: true
    },
    uid: {
        type: String,
        required: true
    },
    oid: {
        type: String,
        required: true
    },
    creation: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    encourage: [
        {
            type: String
        }
    ],
    discourage: [
        {
            type: String
        }
    ],
    solution: {
        type: String,
        required: true
    },
    agree: [
        {
            type: String
        }
    ],
    disagree: [
        {
            type: String
        }
    ]
})

export default mongoose.model('Issue', issueSchema);