import { IResponder, IncomingChatMessage, OutgoingChatMessage } from '../../src';
import { ResponseContext } from '../../src';

export class DumbResponder implements IResponder {
    public canRespond(context: ResponseContext): Promise<boolean> {
        if (context.message.text.toLocaleLowerCase() === "hi" && !context.hasResponded) {
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }

    public getResponse(context: ResponseContext): Promise<OutgoingChatMessage> {
        return Promise.resolve({ text: "Hello, friend!", channelId: context.message.channelId });
    }
}