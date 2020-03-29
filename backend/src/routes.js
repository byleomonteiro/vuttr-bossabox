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

if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
    const bruteStore = new BruteRedis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    });

    const BruteForce = new Brute(bruteStore);

    routes.post(
        '/sessions',
        BruteForce.prevent,
        validateSessionStore,
        SessionController.store
    );
} else {
    routes.post('/sessions', validateSessionStore, SessionController.store);
}

// => Main route
routes.get('/', ({ res }) => {
    return res.json({ message: 'VUTTR API Initialized' });
});

// => Create user route
routes.post('/users', validateUserStore, UserController.store);

// => Auth Middleware
routes.use(authMiddleware);

// => Users routes
routes.get('/users', UserController.index);
routes.put('/users', validateUserUpdate, UserController.update);

// => Tools routes
routes.get('/tools', ToolController.index);
routes.post('/tools', validateToolStore, ToolController.store);
routes.put('/tools/:id', validateToolUpdate, ToolController.update);
routes.delete('/tools/:id', ToolController.destroy);

// => Icon routes
routes.post('/icons', upload.single('file'), IconController.store);

export default routes;
