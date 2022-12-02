import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const orgSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    oid: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
}, { strict: 'throw' });

orgSchema.pre('save', async function (next) {
    const org = this;

    if (!org.isModified('password')) return next();

    const salt = await bcrypt.genSalt(Number(process.env.SALT_WORK_FACTOR));
    org.password = await bcrypt.hash(org.password, salt);

    next();
})

orgSchema.methods.verifyPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

export default mongoose.model('Organization', orgSchema);