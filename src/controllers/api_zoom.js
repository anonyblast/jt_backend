// const express = require("express");
// const router = express.Router();
// const token = require("../config/token");
// const rp = require("request-promise");
// const fetch = require("node-fetch");
import { Router } from "express";
import token from "../config/token.js";
import pkg from "request-promise";
import ZoomDownloader from "../middlewares/ZoomDownloader.js";

const router = Router();

router.get("/:userID/listRecordings", (req, res) => {
    const { userID } = req.params;
    // O formato da data é YYYY-MM-DD
    const {from, to } = req.query;
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
            console.log(options.uri);
            console.log(`user : ${JSON.stringify(request)}`);
            // console.log(`user : ${request.meetings[0].uuid}`);
            // console.log(`user : ${request.meetings[0].recording_files[0].download_url}`);
            // request.meetings[0].recording_files.forEach((file) => {
            //     console.log(`url ${file.file_type} : ${file.download_url}`);
            // });
            // Se o usuário não tiver nenhum registro de gravação, retorna um status de erro
            if (request.size === 0)
                return res.status(404).send("User has no recordings");
            return res.status(200).send(request);
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
            // console.log(`recording : ${JSON.stringify(request)}`);
            let arr = [];

            request.recording_files.forEach((file) => {
                console.log(`url ${file.file_type} : ${file.download_url}`);
                arr.push(file.download_url);
            });
            const zoomDownloader = new ZoomDownloader();
            zoomDownloader.Access_Info(arr[0], request.password);
            console.log(`recoring password : ${request.password}`);
            res.status(200).send(request);
        })
        .catch((err) => {
            console.log(`API call failed, reason ${err}`);
            res.status(404).send(err);
        });
});

export default router;
