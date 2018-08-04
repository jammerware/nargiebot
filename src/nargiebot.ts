import { IChatProvider } from "./chatProviders/chat-provider";
import { ILogger } from './loggers/logger';
import { ConsoleLogger } from './loggers/console-logger';
import { IResponder } from "./responders/responder";
import { SimpleResponder } from "./responders/simple-responder";

import { IncomingChatMessage } from "./models/incoming-chat-message";
import { ResponseContext } from "./models/response-context";

export class Nargiebot {
    public static create(logger?: ILogger) {
        const bot = new Nargiebot(logger);
        return bot;
    }

    private _chatProviders: IChatProvider[] = [];
    private _logger: ILogger = new ConsoleLogger();
    private _responders: IResponder[] = [];

    private constructor(logger?: ILogger) {
        if (logger) {
            this._logger = logger as ILogger;
        }
    }

    public addResponder<T extends IResponder>(type: (new () => T)) {
        this._responders.push(new type());
    }

    public addRespondersByType<T extends IResponder>(...responderTypes: Array<(new () => T)>) {
        for (const responderType of responderTypes) {
            this._responders.push(new responderType());
        }
    }

    public addResponders(...responders: IResponder[]) {
        for (const responder of responders) {
            this._responders.push(responder);
        }
    }

    // simple responder methods (i.e. myBot.respondsTo("hi").with("Greetings!"))
    public respondsTo(respondsToText: string): SimpleResponder {
        const responder = new SimpleResponder(respondsToText);
        this._responders.push(responder);

        return responder;
    }

    public async connect(...providers: IChatProvider[]): Promise<void> {
        for (const provider of providers) {
            await provider.connect();

            provider.onSignedIn.on('eventInfo', eventInfo => {
                this._logger.logInfo(`signed in: ${eventInfo}`);
            });

            provider.onMessage.on('message', async (message) => {
                await this.onMessage(message, provider);
            });

            this._chatProviders.push(provider);
        }
    }

    private async onMessage(message: IncomingChatMessage, provider: IChatProvider) {
        const responseContext = new ResponseContext(this._logger);
        responseContext.chatProvider = provider;
        responseContext.isBotMentioned = await provider.isBotMentioned(message);
        responseContext.message = message;

        try {
            for (const responder of this._responders) {
                if (await responder.canRespond(responseContext)) {
                    responseContext.hasResponded = true;
                    const response = await responder.getResponse(responseContext);

                    if (response) {
                        await provider.say(response);
                    }
                }
            }
        } catch (err) {
            this._logger.logError(err);
        }
    }
}
