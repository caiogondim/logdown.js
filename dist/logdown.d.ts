declare module 'logdown' {
  class Logdown {
    constructor(options?: Object);
    markdown: boolean;
    prefix: string;
    prefixColor: string;
    public debug(...args: any[]): void;
    public error(...args: any[]): void;
    public info(...args: any[]): void;
    public log(...args: any[]): void;
    public warn(...args: any[]): void;
    public static disable(...args: string[]): void;
    public static enable(...args: string[]): void;
  }

  export = Logdown;
}
