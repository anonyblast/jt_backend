import { Router } from 'express';
const router = Router();
import Video from '../models/Video.js';
import TimeByWords from '../middlewares/TimeByWords.js';
import config from '../config/config.js';
import { QueryTypes, Sequelize } from 'sequelize';

const sequelize = new Sequelize(config.database, config.user, config.pw, { dialect: 'mysql', host: 'localhost', logging: false });

router.post('/:recordingID/createEntity/recording', (req, res) => {
    const { recordingID } = req.params;
    const { title, participants, file, txt_file, file_name, buttons } = req.body;
    /* 
        ********* IMPORTANTE *********
        title : string
            ex : "Meeting title"
        participants : string
            ex : "email@email.com|email2@email.com"
        file : blob
            ex : C:\\Users\\user\\Desktop\\video.mp4"
        txt_file : blob
            ex : "C:\\Users\\user\\Desktop\\video.txt"
        file_name : string
            ex : "video.mp4" ou "video"
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
        type: QueryTypes.UPDATE
    });

    let timeByWords = new TimeByWords();
    // txt_file = C:\User\Downloads\File.txt
    // buttons = HTML|CSS|JS
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

router.get('/:recordingID/getEntity/recording', (req, res) => {
    const { recordingID } = req.params;

    const TIME_BUTTONS = sequelize.query(`SELECT \`buttons\` FROM \`recordings\` WHERE meeting_id = ${parseInt(recordingID)}`, {
        type: QueryTypes.SELECT
    });

    const CONTENT_BUTTONS = sequelize.query(`SELECT \`buttons\` FROM \`videos\` WHERE meeting_id = ${parseInt(recordingID)}`, {
        type: QueryTypes.SELECT
    });

    Promise.all([TIME_BUTTONS, CONTENT_BUTTONS])
        .then(([time, content]) => {
            const CONTENT_BUTTONS = time[0].buttons;
            const TIME_BUTTONS = content[0].buttons;
            const SEPARETED_CONTENT_BUTTONS = CONTENT_BUTTONS.split("|");
            const SEPARETED_TIME_BUTTONS = TIME_BUTTONS.split(",");
            let buttons = {};

            if (SEPARETED_CONTENT_BUTTONS.length == SEPARETED_TIME_BUTTONS.length) {
                SEPARETED_CONTENT_BUTTONS.forEach(button => {
                    buttons = { ...buttons, [button]: parseInt(SEPARETED_TIME_BUTTONS.shift()) };
                });
            }
            res.status(200).json(JSON.parse(JSON.stringify(buttons)));
        })
});

/*
    Para requisitar o player do video, basta passar o caminho do video como parametro na url.
        Ex: localhost:3300/video/:recordingID/getEntity/player?recording_path=C:\Users\user\Desktop\
    Onde :recordingID é o id do video, e com ele será possível acessar o nome da gravação.
*/
router.get('/:recordingID/getEntity/player', (req, res) => {
    const { recordingID } = req.params;
    const { recording_path } = req.query;
    const FILE_PATH = recording_path.replace(/\\/gm, "\\\\");
    sequelize.query(`SELECT \`file_name\` FROM \`videos\` WHERE \`meeting_id\` = ${recordingID} GROUP BY \`file_name\``, { 
        type : QueryTypes.SELECT
    }).then((v) =>  
    {
        let containsMP4 = v[0].file_name;
        console.log(`${FILE_PATH}${containsMP4}`);
        if (containsMP4.toUpperCase().includes('.MP4') == true)
            res.status(200).sendFile(v[0].file_name, { root : FILE_PATH});
        else 
            res.status(200).sendFile(`${v[0].file_name}.MP4`, { root : FILE_PATH});
    }) 
});

router.delete('/:recordingID/deleteEntity/recording', (req, res) => {
    const { recordingID } = req.params;
    const video = Video.findOne({
        where: {
            meeting_id: recordingID
        }
    });

    if (!video)
        res.status(400).json({ error: "Recording does not exist" });

    video.destroy()
        .then(() => {
            res.status(200).json({ message: "Video deleted" });
        })
        .catch((err) => {
            res.status(400).json({ error: err });
        });
});

export default router;