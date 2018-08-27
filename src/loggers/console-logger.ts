import { ILogger } from "./logger";

export class ConsoleLogger implements ILogger {
    public logError(error: string) {
        // tslint:disable-next-line:no-console
        console.error(`Nargiebot ERROR: ${error}`);
    }

    public logInfo(info: string) {
        // tslint:disable-next-line:no-console
        console.log(`Nargiebot: ${info}`);
    }
}
