import { Router } from 'express';
import Video from '../models/Video.js';
import Recording from '../models/Recording.js';
import TimeByWords from '../middlewares/TimeByWords.js';
import config from '../config/config.js';
import {QueryTypes, Sequelize} from 'sequelize';
const router = Router();
const sequelize = new Sequelize(config.database, config.user, config.pw, {dialect : 'mysql', host : 'localhost', logging : false});

router.post('/:recordingID/createEntity/video', (req, res) => {
    const { recordingID } = req.params;
    const { title, participants, file, txt_file, file_name, buttons } = req.body;
    /* 
        ********* IMPORTANTE *********
        title : string
            ex : "Meeting title"
        participants : string
            ex : "email@email.com|email2@email.com"
        file : blob
            ex : "C:\\Users\\user\\Desktop\\video.mp4"
        txt_file : blob
            ex : "C:\\Users\\user\\Desktop\\video.txt"
        file_name : string
            ex : "video.mp4"
        buttons : string
            ex : "button1|button2"
    */

    console.log(`title: ${title}\nparticipants: ${participants}\nfile: ${file}\ntxt_file: ${txt_file}\nfile_name: ${file_name}\nbuttons: ${buttons}`);
    const recordingAlreadyExists = Video.findOne({
        where: {
            meeting_id: recordingID
        }
    });

    if (!recordingAlreadyExists)
        res.status(400).json({ error: "Recording already exists" });

    sequelize.query(`UPDATE \`recordings\` SET buttons = '${buttons}' WHERE meeting_id = ${parseInt(recordingID)}`, {
        type: QueryTypes.UPDATE });

    let timeByWords = new TimeByWords();
    timeByWords.handleFile(txt_file, buttons, parseInt(recordingID));

    Video.create({
        meeting_id: recordingID,
        title: title,
        participants: participants,
        file: file,
        txt_file: txt_file,
        file_name: file_name
    })
    .then(() => {
        res.status(200).json({ message: "Video created" });
    })
    .catch((err) => {
        res.status(400).json({ error: err });
    });
});

router.get('/:recordingID/getEntity/video', (req, res) => {
    const { recordingID } = req.params;

    const TIME_BUTTONS = sequelize.query(`SELECT \`buttons\` FROM \`recordings\` WHERE meeting_id = ${parseInt(recordingID)}`, {
        type: QueryTypes.SELECT });

    const CONTENT_BUTTONS = sequelize.query(`SELECT \`buttons\` FROM \`videos\` WHERE meeting_id = ${parseInt(recordingID)}`, {
        type: QueryTypes.SELECT });
    
    Promise.all([TIME_BUTTONS, CONTENT_BUTTONS])
    .then(([time, content]) => {
        const CONTENT_BUTTONS = time[0].buttons;
        const TIME_BUTTONS = content[0].buttons;
        const SEPARETED_CONTENT_BUTTONS = CONTENT_BUTTONS.split("|");
        const SEPARETED_TIME_BUTTONS = TIME_BUTTONS.split(",");
        let buttons = {};

        if (SEPARETED_CONTENT_BUTTONS.length == SEPARETED_TIME_BUTTONS.length) {
            SEPARETED_CONTENT_BUTTONS.forEach(button => {
                buttons = {...buttons, [button]: parseInt(SEPARETED_TIME_BUTTONS.shift())};
            });
        }
        res.status(200).json(JSON.parse(JSON.stringify(buttons)));
    })
});

export default router;