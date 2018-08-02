import { OutgoingChatMessage } from "../models/outgoing-chat-message";
import { ResponseContext } from '../models/response-context';

export interface IResponder {
    canRespond(context: ResponseContext): Promise<boolean>;
    getResponse(message: ResponseContext): Promise<OutgoingChatMessage>;
}
