import express from 'express';
import { getDirName } from './utils/getDirName.js';
import router from './routes/routes.js';
import path from 'path';

const app = express();

const dirname = getDirName(import.meta.url)

app.use(express.static(path.join(dirname, 'views')));

app.use('/', router);

export default app;