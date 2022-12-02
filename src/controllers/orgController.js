import jwt from 'jsonwebtoken';
import { AuthError, InvalidAuthError, InvalidRequestError } from '../helpers/errorHandler.js'

const secret = process.env.JWT_SECRET;

export default class Organization {
    constructor(model) {
        this.model = model;
    }

    createOrg = async (req, res, next) => {
        try {

            const { name, oid, password } = req.body;

            await this.model.create({ name, oid, password, rating: 0 })

            res.status(201).end();

        } catch (error) { next(error) }
    }

    loginOrg = async (req, res, next) => {
        try {

            const credentials = req.headers['authorization'];

            if (!credentials || credentials.split(' ')[0] !== 'Basic') throw new InvalidAuthError();

            const [oid, password] = Buffer.from(credentials.split(' ')[1], 'base64').toString().split(':');

            if (!(oid && password)) throw new InvalidAuthError();

            const org = await this.model.findOne({ oid: oid });
            if (!org) throw new AuthError('organization');

            if (! await org.verifyPassword(password)) throw new AuthError('password');

            const token = jwt.sign({
                oid: org.oid,
                name: org.name,
            }, secret, { expiresIn: '1h' })

            res.json({
                token: token,
                expire: new Date(jwt.decode(token).exp * 1000).toString()
            });

        } catch (error) { next(error) }
    }

    getOrgs = async (req, res, next) => {
        try {
            const { name } = req.query;
            const query = {};
            if (name) query.name = new RegExp(name);

            const orgs = await this.model.find(query);
            res.json(orgs);
        }
        catch (error) { next(error) }
    }

    getOrg = async (req, res, next) => {
        try {
            const { oid } = req.params;
            if (!oid) throw new InvalidRequestError('Invalid oid');
            else {
                const org = await this.model.find({ oid: oid });
                res.json(org);
            }
        } catch(error) { next(error) }
    }

    static authenticate(req, res, next) {

        const credentials = req.headers['authorization'];

        if (!credentials || credentials.split(' ')[0] !== 'Bearer') throw new InvalidAuthError();

        const token = credentials.split(' ')[1];

        if (!token) throw new InvalidAuthError();

            const { oid, name } = jwt.verify(token, secret);

            req.org = { oid, name }

            next();

    }
}

export const authenticate = Organization.authenticate;