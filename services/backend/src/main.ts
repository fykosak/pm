require('dotenv').config();
import {Request, Response} from "express";
import {DirectoryManager} from "./directory/directory-manager";
import {ScriptExecutor} from "./script-executor";
import {previewControllers} from "./preview-controller/preview-controllers";
import cors from 'cors';

const express = require('express');
const app = express();

const directoryManager = new DirectoryManager(process.env.DIRECTORY_ROOT);
const scriptExecutor = new ScriptExecutor();

app.use(express.json());
app.use(cors());

app.post('/preview/:type', async function (request: Request, response: Response) {
    const controllerConstructor = previewControllers[request.params.type];

    if (!controllerConstructor) {
        response.status(404).send("Unknown preview type");
        return;
    }

    const previewController = new controllerConstructor(directoryManager, scriptExecutor);
    previewController.handle(request, response);
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`✨  Backend service listening on port ${port}.`)
});
