import { IncomingChatMessage } from "./incoming-chat-message";
import { IChatProvider } from "../chatProviders/chat-provider";

export class ResponseContext {
    public chatProvider: IChatProvider;
    public hasResponded: boolean;
    public message: IncomingChatMessage;
}