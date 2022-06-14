// const express = require("express");
// const router = express.Router();
// const token = require("../config/token");
// const rp = require("request-promise");
// const fetch = require("node-fetch");
import fetch from "node-fetch";
import { Router } from "express";
import token from "../config/token.js";

const router = Router();

router.get("/:userID/listRecordings", (req, res) => {
    const { userID } = req.params;
    const options = {
        method: "GET",
        uri: `https://api.zoom.us/v2/users/${userID}/recordings`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        json: true,
    };
    fetch(options.uri, options)
        .then(function (request) {
            console.log(`user : ${JSON.stringify(request)}`);
            console.log(`user : ${request.size}`);
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
    fetch(options.uri, options)
        .then((request) => {
            console.log(`recording : ${JSON.stringify(request)}`);
            res.status(200).send(request);
        })
        .catch((err) => {
            console.log(`API call failed, reason ${err}`);
            res.status(404).send(err);
        });
});

export default router;
