import request from 'supertest';
import { resolve } from 'path';
import * as fs from 'fs';

import app from '../../src/app';
import truncate from '../util/truncate';

import auth from '../util/auth';
import Icon from '../../src/app/models/Icon';

let token;

describe('Icon', () => {
    beforeAll(async () => {
        await truncate();
        token = await auth();
    });

    request = request(app);

    it('should be able to upload a new icon', async () => {
        const iconPath = resolve(__dirname, 'iconsTest', 'icon.jpg');
        const response = await request
            .post('/v1/icons')
            .attach('file', iconPath)
            .set('Authorization', `Bearer ${token}`);

        const path = resolve(
            __dirname,
            '..',
            '..',
            '..',
            'tmp',
            'uploads',
            response.body.path
        );

        const iconExists = await fs.existsSync(path);

        if (iconExists) {
            await fs.unlinkSync(path);
        }

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('path');
        expect(response.body).toHaveProperty('url');
    });

    it('should not be able to delete icon when icon not exists', async () => {
        const response = await request
            .delete('/v1/icons/0')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
    });

    it('should be able to delete an icon', async () => {
        const icon = await Icon.findOne({});
        const response = await request
            .delete(`/v1/icons/${icon.id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(204);
    });
});
