import './bootstrap';

import express from 'express';
import helmet from 'helmet';
import redis from 'redis';
import RateLimit from 'express-rate-limit';
import RateLimitRedis from 'rate-limit-redis';
import { resolve } from 'path';
import routes from './routes';

import ErrorHandler from './app/middlewares/errorHandler';

import './database';

class App {
    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
        this.errorMiddlewares();
    }

    middlewares() {
        this.server.use(express.json());
        this.server.use(helmet());
        this.server.use(
            '/icons',
            express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
        );

        if (process.env.NODE_ENV === 'production') {
            this.server.use(
                new RateLimit({
                    store: new RateLimitRedis({
                        client: redis.createClient({
                            host: process.env.REDIS_HOST,
                            port: process.env.REDIS_PORT,
                        }),
                    }),
                    windowMs: 1000 * 60 * 15,
                    max: 100,
                })
            );
        }
    }

    errorMiddlewares() {
        this.server.use(ErrorHandler.catchNotFound);
    }

    routes() {
        this.server.use('/v1', routes);
    }
}

export default new App().server;
