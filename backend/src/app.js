import './bootstrap';

import express from 'express';
import { resolve } from 'path';
import routes from './routes';

import './database';

class App {
    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(express.json());
        this.server.use(
            '/icons',
            express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
        );
    }

    routes() {
        this.server.use('/v1', routes);
    }
}

export default new App().server;
