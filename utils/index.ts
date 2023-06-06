import * as util from "util";
const exec = util.promisify(require("child_process").exec);

export const l = (text: string) => {
    let time = new Date().toISOString().slice(0, 19).replace("T", " ");
    console.log("[" + time + "]: " + text);
};

export const lr = (code: number, req: any) => {
    l(code.toString() + " - " + req.ip + " - " + req.path);
};

export const getProcessENV = (name: string, def: string = ""): string => {
    if (process.env.hasOwnProperty(name)) {
        let temp = process.env[name];
        if (temp) {
            return temp;
        }
    }
    return def;
};

export const parsePathArray = (text: string): string[] => {
    let result = [];
    try {
        let blob = JSON.parse(text);
        let valid = true;

        if (Array.isArray(blob)) {
            for (let i = 0; i < blob.length; i++) {
                if (typeof blob[i] != "string") {
                    valid = false;
                    break;
                }
            }
        }

        if (valid) {
            for (let i = 0; i < blob.length; i++) {
                result.push(blob[i]);
            }
        }
    } catch (e) {
        return [];
    }
    return result;
};

export const validatePathArray = (pathArray: string[]): string[] => {
    if (pathArray.length == 0) {
        throw new Error("At least one path must be defined in PATH_ARRAY.");
    }

    for (let i = 0; i < pathArray.length; i++) {
        if (pathArray[i].length == 0 || pathArray[i] == "/") {
            throw new Error("Invalid path at index: " + i);
        }
    }

    return pathArray;
};

// Runs a system command, returns stdout as a line array
export const runCommandGetStdout = async (command: string, debug: boolean = false): Promise<string[]> => {
    if (debug) {
        console.log("runCommandGetStdout (run): " + command);
    }

    let { stdout } = await exec(command); // /usr/bin/something arg1 arg2 ...
    if (stdout == null || stdout == undefined) {
        return [];
    }

    stdout = stdout.toString().trim();
    stdout = stdout.replace("\r\n", "\n");
    const lines = stdout.split("\n");

    if (debug) {
        for (let i = 0; i < lines.length; i++) {
            console.log("runCommandGetStdout (line): " + lines[i]);
        }
    }

    return lines;
};
