import mongoose from 'mongoose';
import JWT from 'jsonwebtoken';
import { MongoServerError } from 'mongodb';

const { TokenExpiredError, JsonWebTokenError } = JWT
const { StrictModeError, ValidationError, CastError } = mongoose.Error;

export class AuthError extends Error {
    constructor(type) {
        super()
        this.name = 'AuthError';
        this.type = type;
    }
}

export class InvalidAuthError extends Error {
    constructor(message = 'Invalid credentials provided') {
        super(message);
        this.name = 'InvalidAuthError';
    }
}

export class InvalidRequestError extends Error {
    constructor(message = 'Invalid request') {
        super(message)
        this.name = 'InvalidRequestError';
    }
}

export class NotFoundError extends Error {
    constructor(resource) {
        super()
        this.resource = resource;
    }
}

const respond = (response) => {
    return (statusCode, message) => {
        if (message)
        response.status(statusCode).json({ message: message });
        else
        response.status(statusCode).end();
    }
}

export default (error, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }

    const resp = respond(res);

    console.log(error.constructor)
    // console.log(error)

    switch(error.constructor) {
        case AuthError:
            if (error.type === 'user') return resp(401, 'Invalid user');
            if (error.type === 'organization') return resp(401, 'Invalid organization');
            if (error.type === 'password') return resp(401, 'Invalid password');
            if (error.type === 'permission') return resp(403, 'Forbidden');
            next();
            break;
        case InvalidAuthError:
            return resp(401, error.message);
        case InvalidRequestError:
            return resp(400, error.message);
        case JsonWebTokenError:
            return resp(401, 'Invalid Token');
        case TokenExpiredError:
            return resp(401, 'Token Expired');
        case SyntaxError:
            if (error.type === 'entity.parse.failed') return resp(400, 'Malformed JSON body');
            next()
            break;
        case NotFoundError:
            return resp(404, error.resource + ' not found');
        case StrictModeError:
            return resp(400, 'Invalid field' + error.path);
        case ValidationError:
            let message = 'Fields ';
            for (let [field, action] of Object.entries(error.errors)) message += field + ' is ' + action.kind + ', ';
            message = message.slice(0, -2);
            return resp(400, message);
        case MongoServerError:
            if (error.code === 11000) return resp(409, 'Already registered');
            next()
            break;
        case CastError:
            return resp(400, 'Invalid resource ' + error.path.replace(/^_/,''));
        default:
            console.log(error);
            resp(500)
            next()
            break;
    }

}