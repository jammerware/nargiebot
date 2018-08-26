import { IResponder, OutgoingChatMessage, ResponseContext } from '../../src';

export class DumbResponder implements IResponder {
    public canRespond(context: ResponseContext): Promise<boolean> {
        if (context.isBotMentioned && !context.hasResponded) {
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }

    public getResponse(context: ResponseContext): Promise<OutgoingChatMessage> {
        return Promise.resolve({ text: "Hello, friend. None of my other responders knew quite what to do with that.", channelId: context.message.channelId });
    }
}