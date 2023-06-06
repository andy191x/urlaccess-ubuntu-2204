import express from "express";
import dotenv from "dotenv";
import { l, lr, getProcessENV, parsePathArray, validatePathArray, runCommandGetStdout } from "./utils";

//
// Webserver
//

dotenv.config();

const app = express();
const expressIP = getProcessENV("EXPRESS_IP", "127.0.0.1");
const expressPort = parseInt(getProcessENV("EXPRESS_PORT", "8022"));
const pathArray = validatePathArray(parsePathArray(getProcessENV("PATH_ARRAY", "")));
const ufw = getProcessENV("UFW_COMMAND", "/usr/bin/sudo /usr/sbin/ufw");
const debug = getProcessENV("DEBUG") == "true";

app.get("/", (req, res) => {
    lr(403, req);
    res.status(403).send("Forbidden");
});

app.get("/ping", (req, res) => {
    lr(res.statusCode, req);
    res.send("OK");
});

app.get(pathArray, async (req, res) => {
    lr(res.statusCode, req);

    // Parse IP
    if (!req.ip.match(/^\d+\.\d+\.\d+\.\d+$/)) {
        res.send("Invalid IP address: " + req.ip);
        return;
    }

    // Check if rule already exists
    let lines = await runCommandGetStdout(ufw + " status", debug);
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/^22\s+/) && lines[i].match(new RegExp("\\s+" + req.ip + "$"))) {
            res.send("Rule already exists.");
            return;
        }
    }

    // Add rule
    await runCommandGetStdout(ufw + " allow from " + req.ip + "/32 to any port 22", debug);
    await runCommandGetStdout(ufw + " allow from " + req.ip + "/32 to any port 443", debug);
    res.send("Authenticated " + req.ip);
});

app.use((req, res, next) => {
    lr(404, req);
    res.status(404).send("Not Found");
});

app.listen(expressPort, expressIP, () => {
    l("urlaccess is running at http://" + expressIP + ":" + expressPort + "/");
    l("ufw command: " + ufw);
    l("---");
});
