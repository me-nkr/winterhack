import jwt from 'jsonwebtoken';
import { AuthError, InvalidAuthError } from '../helpers/errorHandler.js'

const secret = process.env.JWT_SECRET;

export default class User {
    constructor(model) {
        this.model = model;
    }

    createUser = async (req, res, next) => {
        try {

            const { name, uid, password } = req.body;

            await this.model.create({ name, uid, password, credibility: 0 })

            res.status(201).end();

        } catch (error) { next(error) }
    }

    loginUser = async (req, res, next) => {
        try {

            const credentials = req.headers['authorization'];

            if (!credentials || credentials.split(' ')[0] !== 'Basic') throw new InvalidAuthError();

            const [uid, password] = Buffer.from(credentials.split(' ')[1], 'base64').toString().split(':');

            if (!(uid && password)) throw new InvalidAuthError();

            const user = await this.model.findOne({ uid: uid });
            if (!user) throw new AuthError('user');

            if (! await user.verifyPassword(password)) throw new AuthError('password');

            const token = jwt.sign({
                uid: user.uid,
                name: user.name,
            }, secret, { expiresIn: '1h' })

            res.json({
                token: token,
                expire: new Date(jwt.decode(token).exp * 1000).toString()
            });

        } catch (error) { next(error) }
    }

    static authenticate(req, res, next) {

        const credentials = req.headers['authorization'];

        if (!credentials || credentials.split(' ')[0] !== 'Bearer') throw new InvalidAuthError();

        const token = credentials.split(' ')[1];

        if (!token) throw new InvalidAuthError();

            const { uid, name } = jwt.verify(token, secret);

            req.user = { uid, name }

            next();

    }
}

export const authenticate = User.authenticate;