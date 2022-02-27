import chalk from 'chalk';

export default class Logging {
    public static log = (args: any): void => this.info(args);
    public static info = (args: any): void => console.log(chalk.blue(`[${new Date().toLocaleString()}][INFO] `), typeof args === 'string' ? chalk.blueBright(args) : args);
    public static warn = (args: any): void => console.log(chalk.yellow(`[${new Date().toLocaleString()}][INFO] `), typeof args === 'string' ? chalk.yellowBright(args) : args);
    public static error = (args: any): void => console.log(chalk.red(`[${new Date().toLocaleString()}][INFO] `), typeof args === 'string' ? chalk.redBright(args) : args);
}
