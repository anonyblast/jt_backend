import express, { json, urlencoded } from 'express';
const app = express();

import rotaApiZoom from './controllers/api_zoom.js';
import rotaApiSignup from './controllers/api_signup.js';
import rotaApiLogin from './controllers/api_login.js';

app.use(json());
app.use(urlencoded({ extended: true }));
app.use('/zoom', rotaApiZoom);
app.use('/signup', rotaApiSignup);
app.use('/login', rotaApiLogin);

export default app;