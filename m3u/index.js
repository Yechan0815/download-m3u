import axios from "axios";
import fs from 'fs';
import { m3u_parse } from './parser.js';

export function download(url, path) { 
    const url_parent = url.substring(0, url.lastIndexOf('/') + 1);

    return new Promise(async (resolve, reject) => {
        var m3u_body;
        try {
            m3u_body = await axios.get(url);
        }
        catch (error) {
            reject(error);            
        }
        const result = m3u_parse(m3u_body.data);
        for (const i in result.file) {
            if (result.file[i].indexOf('http') === -1) {
                result.file[i] = url_parent + result.file[i];
            }
        }
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
        const writer = fs.createWriteStream(path);
        for (const link of result.file) {
            try {
                const media_response = await axios.get(link, { responseType: 'stream' });
                await new Promise((resolve, reject) => {
                    media_response.data.on('data', (data) => {
                        if (!writer.write(data))
                        {
                            writer.removeAllListeners('drain');
                            writer.once('drain', () => {
                                media_response.data.resume();
                            });
                            media_response.data.pause();
                        }
                    });
                    media_response.data.on('error', (error) => {
                        writer.end();
                        reject(error);
                    });
                    media_response.data.on('end', () => {
                        resolve();
                    });
                });
            }
            catch (error) {
                reject(error);
            } 
        }
        writer.end(() => {
            resolve();
        });
    });
}