import request from 'supertest';
import { resolve } from 'path';

import app from '../../src/app';
import truncate from '../util/truncate';

import auth from '../util/auth';

import RemoveFile from '../../src/app/services/RemoveFile';

let login;

describe('Icon', () => {
    beforeEach(async () => {
        await truncate();
        login = await auth();
    });

    request = request(app);

    it('should be able to upload a new icon', async () => {
        const iconPath = resolve(__dirname, 'iconsTest', 'icon.jpg');
        const response = await request
            .post('/v1/icons')
            .attach('file', iconPath)
            .set('Authorization', `Bearer ${login.token}`);

        await RemoveFile(response.body.path);

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            id: response.body.id,
            name: response.body.name,
            path: response.body.path,
            url: response.body.url,
        });
    });
});
