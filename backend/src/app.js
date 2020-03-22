import './bootstrap';

import express from 'express';
import helmet from 'helmet';
import redis from 'redis';
import Youch from 'youch';
import RateLimit from 'express-rate-limit';
import RateLimitRedis from 'rate-limit-redis';
import { resolve } from 'path';
import 'express-async-errors';
import routes from './routes';

import './database';

class App {
    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
        this.exceptionHandler();
    }

    middlewares() {
        this.server.use(express.json());
        this.server.use(helmet());
        this.server.use(
            '/icons',
            express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
        );

        if (process.env.NODE_ENV !== 'development') {
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

    routes() {
        this.server.use('/v1', routes);
    }

    exceptionHandler() {
        this.server.use(async (err, req, res, next) => {
            const errors = await new Youch(err, req).toJSON();
            return res.status(500).json(errors);
        });
    }
}

export default new App().server;
