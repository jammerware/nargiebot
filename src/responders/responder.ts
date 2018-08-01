import { IncomingChatMessage } from "../models/incoming-chat-message";
import { OutgoingChatMessage } from "../models/outgoing-chat-message";

export interface IResponder {
    canRespond(message: IncomingChatMessage): Promise<boolean>;
    getResponse(message: IncomingChatMessage): Promise<OutgoingChatMessage>;
}
