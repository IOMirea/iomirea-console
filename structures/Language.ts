import * as chalk from 'chalk';

export interface TextObject {
    t: string,
    c?: string,
    f?: Function
}

export interface Text {
    CHANNEL_NAME_INPUT: TextObject,
    RECIPIENTS_ID_INPUT: TextObject,
    USERID_NOT_INT: TextObject,
    CHANNEL_CREATE_S: TextObject,
    CHANNEL_CREATE_E: TextObject,
    MONTH_1: TextObject,
    MONTH_2: TextObject,
    MONTH_3: TextObject,
    MONTH_4: TextObject,
    MONTH_5: TextObject,
    MONTH_6: TextObject,
    MONTH_7: TextObject,
    MONTH_8: TextObject,
    MONTH_9: TextObject,
    MONTH_10: TextObject,
    MONTH_11: TextObject,
    MONTH_12: TextObject,
    CHANNEL_BACK: TextObject,
    CHANNEL_SEND: TextObject,
    CHANNEL_BROWSER: TextObject,
    CHANNEL_RELOAD: TextObject,
    CHANNEL_CREATE: TextObject,
    CHANNEL_NAME: TextObject,
    MENU_VIEW_CHANNEL: TextObject,
    MENU_ACCOUNT_INFO: TextObject,
    MENU_SETTINGS: TextObject,
    MENU_EXIT: TextObject,
    FS_WRITE_ERROR: TextObject,
    LOGIN_ERROR_D: TextObject,
    LOGIN_ERROR: TextObject,
    WS_CONNECTING: TextObject,
    WS_CONNECTED_MSG: TextObject,
    NOT_SUPPORTED: TextObject,
    ACCESS_TOKEN_UPDATED: TextObject,
    NEW_ACCESS_TOKEN: TextObject
}

const colorRegex: RegExp = /<(\w{1,10})>([^<]+)<\/\w{1,10}>/;

export default class Language {
    public texts: Text;

    constructor(texts: Text) {
        this.texts = texts;

        // Define `f` getter for each text
        for (const [k, v] of Object.entries(this.texts)) {
            this.texts[k].toString = this.texts[k].valueOf = function() {
                return this.t;
            };
            Object.defineProperty(this.texts[k], "f", {
                get() {
                    if (!chalk[v.c]) return v.t;
                    return chalk[v.c](v.t);
                }
            });
        }
    }

    escape(textConstant: string, replaceObj: any, format: boolean = false): string {
        let o: TextObject = this.texts[textConstant];
        let t: string = o.t;
        for (const [k, v] of Object.entries(replaceObj)) {
            t = t.replace(new RegExp("{" + k + "}", "g"), (v || { toString: () => "Unknown error" }).toString());
        }
        if (format === true) t = chalk[o.c || "white"](t);
        return t;
    }
}