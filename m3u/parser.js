/* m3u parser */

const MACRO = {
    NONE: 0,
    START: 1,
    FILE: 2,
    END: 3
};

function m3u_tag(tag) {
    var return_val = MACRO.NONE;
    var key = tag;
    var value = null;

    if (tag.indexOf(':') !== -1) {
        key = tag.substring(0, tag.indexOf(':'));
        value = tag.substring(tag.indexOf(':') + 1);
    }
    switch (key) {
        case 'EXTM3U':
            return_val = MACRO.START;
            break;

        case 'EXT-X-VERSION':
        case 'EXT-X-TARGETDURATION':
        case 'EXT-X-MEDIA-SEQUENCE':
        case 'EXT-X-PLAYLIST-TYPE':
            break;

        case 'EXTINF':
            return_val = MACRO.FILE;
            break;
            
        case 'EXT-X-ENDLIST':
            return_val = MACRO.END;
            break;
    }

    return return_val;
}

function m3u_readline(result, line) {
    if (result.flag.next === MACRO.FILE) {
        result.file.push(line);
        result.flag.next = MACRO.NONE;
    }
    else if (line[0] == '#') {
        result.flag.next = m3u_tag(line.substring(1));
    }
}

export function m3u_parse(body) {
    const result = {
        flag: {
            next: MACRO.NONE
        },
        file: []
    };

    while (1) {
        m3u_readline(result, body.substring(0, body.indexOf('\n')));
        body = body.substr(body.indexOf('\n') + 1);
        if (body.length == 0 || result.flag.next === MACRO.END)
            break;
    }
    return result;
}