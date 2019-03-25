declare function logdown(prefix: string, opts?: logdown.LogdownOptions): logdown.Logger;

declare namespace logdown {
  type LoggerState = { isEnabled: boolean };
  type TransportFunction = (options: TransportOptions) => void;

  interface LogdownOptions {
    logger?: any;
    markdown?: boolean;
    prefix?: string;
    prefixColor?: string;
  }

  interface TransportOptions {
    args: any[];
    instance: string;
    level: string;
    msg: string;
    state: LoggerState;
  }

  let transports: TransportFunction[];

  class Logger {
    constructor(prefix: string, opts?: LogdownOptions);

    debug(...args: any[]): void;
    error(...args: any[]): void;
    info(...args: any[]): void;
    log(...args: any[]): void;
    warn(...args: any[]): void;

    state: LoggerState;
  }
}

export = logdown;
