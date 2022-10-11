import { Request, Response } from 'express';
import { omit } from 'lodash';
import { CreateUserSchema } from '../schema/user.schema';
import { createUser } from '../service/user.service';
import logger from '../utils/logger';

export async function createUserHandler(req:Request<{}, {}, CreateUserSchema['body']>, res:Response) {
    try{ 
        const user = await createUser(req.body);
        return res.status(200).send(omit(user.toJSON(), "password"));
    }catch(e : any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}