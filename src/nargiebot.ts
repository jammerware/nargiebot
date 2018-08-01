import { IChatProvider } from "./chatProviders/chat-provider";

export class Nargiebot {
    public static create(...providers: IChatProvider[]) {
        const bot = new Nargiebot();

        for (const provider of providers) {
            bot._chatProviders.push(provider);
        }

        return bot;
    }

    private _chatProviders: IChatProvider[] = [];

    private constructor() { }
}
