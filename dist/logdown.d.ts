declare class Logdown {
  constructor(options: Object);
  public log(...args: string[]): void;
  public info(...args: string[]): void;
  public warn(...args: string[]): void;
  public debug(...args: string[]): void;
  public error(...args: string[]): void;
  public static disable(...args: string[]): void;
  public static enable(...args: string[]): void;
}

export = Logdown;
