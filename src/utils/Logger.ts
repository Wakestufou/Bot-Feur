import process from 'process';
import { Color } from './Colors';

class Logger {
    private _write(
        message: string,
        prefix: string,
        fct: (message: string) => void,
        color: Color | null = null
    ) {
        const date = new Date().toLocaleString();
        const pref =
            '[' +
            date +
            ']' +
            (color === null ? '' : color) +
            '[' +
            prefix +
            '] ';

        for (const line of message.toString().split('\n')) {
            fct(pref + line + Color.Reset);
        }
    }

    public info(message: string, prefix = 'INFO', color: Color | null = null) {
        this._write(message, prefix, console.log, color);
    }

    public warn(
        message: string,
        prefix = 'WARN',
        color: Color | null = Color.FgYellow
    ) {
        this._write(message, prefix, console.warn, color);
    }

    public error(
        message: string,
        error: Error,
        prefix = 'ERROR',
        color: Color | null = Color.FgMagenta
    ) {
        this._write(message, prefix, console.error, color);
        if (error !== undefined && error.stack !== undefined) {
            this._write(error.stack, prefix, console.error, color);
        }
    }

    public fatal(
        message: string,
        error: Error,
        code: number,
        prefix = 'FATAL',
        color: Color | null = Color.FgRed
    ) {
        this._write(message, prefix, console.error, color);
        if (error !== undefined && error.stack !== undefined) {
            this._write(error.stack, prefix, console.error, color);
        }

        process.exit(code !== undefined ? code : -1);
    }
}

export default new Logger();
