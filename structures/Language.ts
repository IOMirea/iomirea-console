import * as chalk from 'chalk';

export interface TextObject {
    t: string,
    c?: string
}

export interface Text {
    CHANNEL_NAME_INPUT: TextObject,
    RECIPIENTS_ID_INPUT: TextObject,
    USERID_NOT_INT: TextObject,
    CHANNEL_CREATE_S: TextObject,
    CHANNEL_CREATE_E: TextObject
}

const colorRegex: RegExp = /<(\w{1,10})>([^<]+)<\/\w{1,10}>/;

export default class Language {
    public texts: Text;

    constructor(texts: Text) {
        this.texts = texts;

        // Define `f` getter for each text
        for (const [k, v] of Object.entries(this.texts)) {
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