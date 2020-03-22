import { Router } from 'express';
import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import ToolController from './app/controllers/ToolController';
import SessionController from './app/controllers/SessionController';
import IconController from './app/controllers/IconController';

import authMiddleware from './app/middlewares/auth';

import validateSessionStore from './app/validations/SessionStore';
import validateUserStore from './app/validations/UserStore';
import validateUserUpdate from './app/validations/UserUpdate';
import validateToolStore from './app/validations/ToolStore';
import validateToolUpdate from './app/validations/ToolUpdate';

const routes = new Router();
const upload = multer(multerConfig);

const bruteStore = new BruteRedis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

const BruteForce = new Brute(bruteStore);

// => Mail route
routes.get('/', ({ res }) => {
    return res.json({ message: 'VUTTR Initialized' });
});

// => Authentication route
routes.post(
    '/sessions',
    // BruteForce.prevent,
    validateSessionStore,
    SessionController.store
);

// => Auth Middleware
routes.use(authMiddleware);

// => Users routes
routes.get('/users', UserController.index);
routes.post('/users', validateUserStore, UserController.store);
routes.put('/users', validateUserUpdate, UserController.update);
routes.delete('/users', UserController.destroy);

// => Tools routes
routes.get('/tools', ToolController.index);
routes.get('/find', ToolController.show);
routes.post('/tools', validateToolStore, ToolController.store);
routes.put('/tools/:id', validateToolUpdate, ToolController.update);
routes.delete('/tools/:id', ToolController.destroy);

// => Icon routes
routes.post('/icons', upload.single('file'), IconController.store);
routes.delete('/icons/:id', IconController.delete);

export default routes;
