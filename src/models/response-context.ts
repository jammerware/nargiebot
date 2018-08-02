import { IncomingChatMessage } from "./incoming-chat-message";
import { IChatProvider } from "../chatProviders/chat-provider";

export class ResponseContext {
    public chatProvider: IChatProvider;
    public hasResponded = false;
    public isBotMentioned = false;
    public message: IncomingChatMessage;
}