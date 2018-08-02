import { IncomingChatMessage } from "./incoming-chat-message";
import { IChatProvider } from "../chatProviders/chat-provider";
import { ILogger } from "../loggers/logger";

export class ResponseContext {
    public chatProvider: IChatProvider;
    public hasResponded = false;
    public isBotMentioned = false;
    public message: IncomingChatMessage;

    constructor(private logger: ILogger) { }

    public getLogger(): ILogger {
        return this.logger;
    }
}