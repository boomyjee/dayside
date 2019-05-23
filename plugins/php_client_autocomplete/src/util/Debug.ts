import { IConnection } from 'vscode-languageserver';

var http = require('http');

export class Debug{
    public static connection: IConnection;

    public static SetConnection(conn: IConnection) {
        Debug.connection = conn;
    }

    public static info(message: string) {
        console.debug('serverDebugMessage', { type: 'info', message: message });
    }

    public static error(message: string) {
        console.debug('serverDebugMessage', { type: 'error', message: message });
    }

    public static warning(message: string) {
        console.debug('serverDebugMessage', { type: 'warning', message: message });
    }

    public static sendErrorTelemetry(message: string) {
        console.debug('serverDebugMessage', { type: 'errorTelemetry', message: message });
    }
}
