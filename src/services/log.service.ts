import chalk from 'chalk';
import moment from 'moment';
import winston from 'winston';
export class LogService {
    private tag: string = '';
    private logger = winston.createLogger({
        level: 'debug',
        format: winston.format.simple(),
        // exceptionHandlers: [new winston.transports.File({ filename: 'logs/exceptions.log' })],
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({
                filename: 'log/all.log',
                maxsize: 5242880,
                maxFiles: 5,
            }),
            new winston.transports.File({
                filename: 'log/error.log',
                level: 'error',
                maxsize: 5242880,
                maxFiles: 5,
            }),
            new winston.transports.File({
                filename: 'log/warning.log',
                level: 'warning',
                maxsize: 5242880,
                maxFiles: 5,
            }),
            new winston.transports.File({
                filename: 'log/info.log',
                level: 'info',
                maxsize: 5242880,
                maxFiles: 5,
            }),
            new winston.transports.File({
                filename: 'log/debug.log',
                maxsize: 5242880,
                maxFiles: 5,
            }),
        ],
    });

    constructor(private tags: string) {
        this.tag = tags;
    }

    private getDate() {
        return moment().format();
    }

    info(...args: any) {
        this.logger.info(chalk.hex('#54C1E9')(`[${this.getDate()}][${this.tag}] =>  ${this.toString(args)} `));
    }
    debug(...args: any) {
        this.logger.debug(chalk.hex('#8CD10D')(`[${this.getDate()}][${this.tag}] =>  ${this.toString(args)} `));
    }
    warn(...args: any) {
        this.logger.warn(chalk.hex('#FAC848')(`[${this.getDate()}][${this.tag}] =>  ${this.toString(args)} `));
    }
    error(...args: any) {
        // console.log(`[${this.getDate()}][${this.tag}] =>  `, args);
        this.logger.error(chalk.hex('#F95C5A')(`[${this.getDate()}][${this.tag}] =>  ${this.toString(args)} `));
    }

    db(...args: any) {
        this.logger.debug(chalk.hex('#f9f9f9')(`[${this.getDate()}][${this.tag}] =>  ${this.toString(args)} `));
    }

    public toString(args: any) {
        let str = '';
        for (const key in args) {
            if (args.hasOwnProperty(key)) {
                const element = args[key];
                if (typeof element === 'object') {
                    try {
                        str += JSON.stringify(element) + ' ';
                    } catch (error) {
                        console.error(error);
                        console.log(element);
                    }
                } else {
                    str += element + ' ';
                }
            }
        }
        return str;
    }
}
