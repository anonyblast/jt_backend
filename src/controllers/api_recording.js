import {Router} from 'express';
import token from '../config/token.js';
import pkg from 'request-promise';
import Recording from '../models/Recording';
const router = Router();

router.get('/:recordingID/createEntity', (req, res) => {
    const { recordingID } = req.params;
    const options = {
        method: "GET",
        uri: `https://api.zoom.us/v2/meetings/${recordingID}/recordings`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        json: true,
    };
    pkg(options)
        .then((request) => {
            // 
         });
});