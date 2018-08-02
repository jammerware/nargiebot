import Emittery from 'emittery';
import { IncomingChatMessage } from '../models/incoming-chat-message';
import { OutgoingChatMessage } from '../models/outgoing-chat-message';

export interface IChatProvider {
    name: string;

    onMessage: Emittery.Typed<{ message: IncomingChatMessage }, 'message'>;
    onSignedIn: Emittery.Typed<{ eventInfo: string }, 'eventInfo'>;

    connect(): Promise<void>;
    say(message: OutgoingChatMessage): Promise<void>;
}
