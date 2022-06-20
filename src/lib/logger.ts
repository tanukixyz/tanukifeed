import chalk from 'chalk';

export interface LogEntry {
  source: string;
  message: string;
  props: any;

  error?: any;
}

class LogProvider {
  constructor() {}

  private static buildPropsLog(props: any): string {
    let logString = '';

    for (const [key, value] of Object.entries(props)) {
      logString += ` ${key}=${value}`;
    }

    return logString;
  }

  // simple write log to console
  public writeConsole(entry: any): void {
    console.log(entry);
  }

  public onInfo(entry: LogEntry): void {
    console.info(
      `${new Date().toISOString()} ${chalk.green('info'.padEnd(5))} | ${(entry.source + ': ' + entry.message).padEnd(
        50
      )}    ${LogProvider.buildPropsLog(entry.props)}`
    );
  }

  public onDebug(entry: LogEntry): void {
    console.info(
      `${new Date().toISOString()} ${chalk.grey('debug'.padEnd(5))} | ${(entry.source + ': ' + entry.message).padEnd(
        50
      )}    ${LogProvider.buildPropsLog(entry.props)}`
    );
  }

  public onWarn(entry: LogEntry): void {
    console.info(
      `${new Date().toISOString()} ${chalk.yellow('warn'.padEnd(5))} | ${(entry.source + ': ' + entry.message).padEnd(
        50
      )}    ${LogProvider.buildPropsLog(entry.props)}`
    );
  }

  public onError(entry: LogEntry): void {
    console.info(
      `${new Date().toISOString()} ${chalk.red('error'.padEnd(5))} | ${(entry.source + ': ' + entry.message).padEnd(
        50
      )}    ${LogProvider.buildPropsLog(entry.props)}`
    );
    if (entry.error) {
      console.error(entry.error);
    }
  }
}

export default new LogProvider();
