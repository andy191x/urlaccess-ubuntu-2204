import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const ip = process.env.ip ?? "127.0.0.1";
const port = process.env.PORT ? parseInt(process.env.PORT) : 8022;

app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');

    let x = 0;
    x++;
    x++;
});

app.listen(port, ip, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
