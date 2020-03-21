import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../src/app/models/User';
import Tool from '../src/app/models/Tool';

factory.define('Session', User, {
    email: faker.internet.email(),
    password: faker.internet.password(),
});

factory.define('UserCreate', User, {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
});

factory.define('UserUpdate', User, {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    oldPassword: faker.internet.password(),
    confirmPassword: faker.internet.password(),
});

factory.define('Tool', Tool, {
    title: 'hotel',
    link: 'https://github.com/typicode/hotel',
    description:
        'Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
    tags: [
        'node',
        'organizing',
        'webapps',
        'domain',
        'developer',
        'https',
        'proxy',
    ],
});

export default factory;
