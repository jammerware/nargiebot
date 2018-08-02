import { IChatProvider } from "./chatProviders/chat-provider";
import { IncomingChatMessage } from "./models/incoming-chat-message";
import { IResponder } from "./responders/responder";
import { ResponseContext } from "./models/response-context";

export class Nargiebot {
    public static create() {
        const bot = new Nargiebot();
        return bot;
    }

    private _chatProviders: IChatProvider[] = [];
    private _responders: IResponder[] = [];

    private constructor() { }

    public addResponders(...responders: IResponder[]) {
        for (const responder of responders) {
            this._responders.push(responder);
        }
    }

    public async connect(...providers: IChatProvider[]): Promise<void> {
        for (const provider of providers) {
            await provider.connect();

            provider.onSignedIn.on('eventInfo', eventInfo => {
                console.log('signed in', eventInfo);
            });

            provider.onMessage.on('message', async (message) => {
                await this.onMessage(message, provider);
            });

            this._chatProviders.push(provider);
        }
    }

    private async onMessage(message: IncomingChatMessage, provider: IChatProvider) {
        const responseContext: ResponseContext = {
            chatProvider: provider,
            hasResponded: false,
            isBotMentioned: await provider.isBotMentioned(message),
            message,
        };

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
            console.log("ERROR nargiebot.onMessage", err);
        }
    }
}
