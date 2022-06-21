import express, { json, urlencoded } from 'express';
const app = express();

import rotaApiZoom from './controllers/api_zoom.js';
import rotaApiSignup from './controllers/api_signup.js';
import rotaApiLogin from './controllers/api_login.js';
import rotaApiRecording from './controllers/api_recording.js';

app.use(json());
app.use(urlencoded({ extended: true }));
app.use('/zoom', rotaApiZoom);
app.use('/signup', rotaApiSignup);
app.use('/login', rotaApiLogin);
app.use('/video', rotaApiRecording);

/* ******************************************************************************************* */
/* Referência das APIs  (JUMP TO MEETINGS RECORDINGS INC.)                                     */
/* Endpoints:                                                                                  */
/* ******************************************************************                          */
/* http://localhost:3300/zoom                                                                  */
/* GET                       /:userID/listRecordings                                           */ 
/* GET                       /:userID/listRecordings?from=YYYY-MM-DD&to=YYYY-MM-DD (opcional)  */
/* GET                       /:recordingID/download                                            */
/* GET                       /:recordingID/createEntity/recording                              */ 
/* ******************************************************************************************* */
/* http://localhost:3300/signup                                                                */
/* POST                      /createUser                                                       */
/* GET                       /getUser                                                          */
/* PUT                       /updateUser                                                       */
/* DELETE                    /:email/delete                                                    */
/* ******************************************************************************************* */
/* http://localhost:3300/login                                                                 */   
/* POST                      /login                                                            */                          
/* ******************************************************************************************* */
/*  http://localhost:3300/video                                                                */          
/* POST                      /:recordingID/createEntity/recording                              */                         
/* GET                       /:recordingID/getEntity/recording                                 */                    
/* GET                       /:recordingID/getEntity/player                                    */                
/* DELETE                    /:recordingID/deleteEntity/recording                              */            
/* ******************************************************************************************* */

export default app;