import app from './app';

app.listen(3333, () =>
    // eslint-disable-next-line no-console
    console.log(
        `API running at ${process.env.APP_URL} in ${process.env.NODE_ENV} mode.`
    )
);
