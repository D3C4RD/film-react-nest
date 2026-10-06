import { LoggerService, Injectable } from '@nestjs/common';
import { LogMessage } from './json.logger';
@Injectable()
export class TskvLogger implements LoggerService {
  formatMessage(level: string, message: LogMessage, ...optionalParams: LogMessage[]) {
    return `level=${level}\tmessage=${message}\toptionalParams=${optionalParams}\n`;
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