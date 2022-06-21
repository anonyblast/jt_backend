// const express = require("express");
// const router = express.Router();
// const token = require("../config/token");
// const rp = require("request-promise");
// const fetch = require("node-fetch");
import { Router } from "express";
import token from "../config/token.js";
import pkg from "request-promise";
import ZoomDownloader from "../middlewares/ZoomDownloader.js";
import Recording from "../models/Recording.js";

const router = Router();

router.get("/:userID/listRecordings", (req, res) => {
    const { userID } = req.params;
    // O formato da data é YYYY-MM-DD
    const { from, to } = req.query;
    const options = {
        method: "GET",
        uri: `https://api.zoom.us/v2/users/${userID}/recordings?from=${from}&to=${to}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        json: true,
    };
    pkg(options)
        .then(function (request) {
            // console.log(options.uri);
            // console.log(`user : ${JSON.stringify(request)}`);
            let arr = new Array();
            // Se o campo de gravação estiver vazio, ou seja, não houver nenhuma gravação, então retorna um erro
            if (request.total_records === 0)
                res.status(400).json({ error: "No recordings found" });
            for (let element in request.meetings) {
                let obj = {
                    id: request.meetings[element].id,
                    start_time: request.meetings[element].start_time.substring(0, 10),
                    end_time: request.meetings[element].end_time,
                    topic: request.meetings[element].topic,
                    owner: request.meetings[element].host_id
                }
                arr.push(JSON.parse(JSON.stringify(obj)));
            }
            // console.log(`arr : ${JSON.stringify(arr)}`);
            return res.status(200).send(JSON.parse(JSON.stringify(arr)));
        })
        .catch(function (err) {
            console.log(`API call failed, reason ${err}`);
            res.status(404).send(err);
        });
});

router.get('/:recordingID/download', (req, res) => {
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
            let arr = [];

            request.recording_files.forEach((file) => {
                console.log(`url ${file.file_type} : ${file.download_url}`);
                let obj = {
                    file_type: file.file_type,
                    download_url: file.download_url,
                }
                arr.push(JSON.parse(JSON.stringify(obj)));
            });
            const meeting_id = request.id;
            // MÉTODO QUE CRIA UM WEB SCRAPER PARA DOWNLOAD DOS ARQUIVOS
            // const zoomDownloader = new ZoomDownloader();
            // zoomDownloader.Access_Info(arr[0], request.password);
            const response = {
                recordings: arr,
                token: request.password
            };
            // console.log(`recording password : ${request.password}`);
            // console.log(request)
            res.status(200).send(JSON.parse(JSON.stringify(response)));
        })
        .catch((err) => {
            console.log(`API call failed, reason ${err}`);
            res.status(404).send(err);
        });
});

router.get('/:recordingID/createEntity/recording', (req, res) => {
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
            let arr = [];

            request.recording_files.forEach((file) => {
                console.log(`url ${file.file_type} : ${file.download_url}`);
                let obj = {
                    file_type: file.file_type,
                    download_url: file.download_url,
                }
                arr.push(JSON.parse(JSON.stringify(obj)));
            });
            // Se a gravação existir retona um erro 
            const recordingAlreadyExists = Recording.findOne({
                where: {
                    meeting_id: recordingID
                }
            });
            if (recordingAlreadyExists || arr.length === 0) {
                res.status(400).json({ error: "Recording already exists" });
                // Validar o tipo do arquivo e atribuir ao modelo
                let video_url = (arr[0].file_type === "MP4") ? arr[0].download_url : null;
                let audio_url = (arr[1].file_type === "M4A") ? arr[1].download_url : null;
                let timeline_url = (arr[2].file_type === "TIMELINE") ? arr[2].download_url : null;
                let chat_url = (arr[3].file_type === "CHAT") ? arr[3].download_url : null;

                Recording.create({
                    host_id: request.host_id,
                    meeting_id: request.id,
                    host_email: request.host_email,
                    description: request.topic,
                    start_time: request.start_time,
                    end_time: request.end_time,
                    recording_video_url: video_url,
                    recording_audio_url: audio_url,
                    recording_chat_url: chat_url,
                    recording_timeline_url: timeline_url,
                });
                res.status(200).send('Recording created');
            }
        })
        .catch((err) => {
            console.log(`API call failed, reason ${err}`);
            res.status(404).send(err);
        });
});

export default router;
