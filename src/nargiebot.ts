import { IChatProvider } from "./chatProviders/chat-provider";
import { IncomingChatMessage } from "./models/incoming-chat-message";
import { IResponder } from "./responders/responder";

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
        for (const responder of this._responders) {
            if (responder.canRespond(message)) {
                const response = await responder.getResponse(message);
                await provider.say(response);
            }
        }
    }
}
