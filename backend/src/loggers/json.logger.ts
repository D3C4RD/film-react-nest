import { LoggerService, Injectable } from '@nestjs/common';

export type LogMessage = string | number | boolean | object | Error | null | undefined;

@Injectable()
export class JsonLogger implements LoggerService {
  formatMessage(level: string, message: LogMessage, ...optionalParams: LogMessage[]) {
    return JSON.stringify({ level, message, optionalParams });
  }

  log(message: LogMessage, ...optionalParams: LogMessage[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: LogMessage, ...optionalParams: LogMessage[]) {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: LogMessage, ...optionalParams: LogMessage[]) {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }
}