import { RTMClient, WebClient } from '@slack/client';
import Emittery from 'emittery';
import { IChatProvider } from "./chat-provider";
import { IncomingChatMessage } from '../models/incoming-chat-message';
import { OutgoingChatMessage } from '../models/outgoing-chat-message';

export class SlackChatProvider implements IChatProvider {
    public name = "Slack";
    public onMessage = new Emittery.Typed<{ message: IncomingChatMessage }, 'message'>();
    public onSignedIn = new Emittery.Typed<{ eventInfo: string }, 'eventInfo'>();

    private _rtmClient: RTMClient;

    public constructor(private _botAccessToken: string) { }

    public connect(): Promise<void> {
        if (this._rtmClient && this._rtmClient.connected) {
            this._rtmClient.disconnect();
        }
        delete this._rtmClient;

        const rtmClient = new RTMClient(this._botAccessToken);

        rtmClient.on('hello', message => {
            this.onSignedIn.emit('eventInfo', message);
        });

        rtmClient.on('message', message => {
            // Skip messages that are from a bot or from this bot's uid
            if ((message.subtype && message.subtype === 'bot_message') ||
                (!message.subtype && message.user === rtmClient.activeUserId)) {
                return;
            }

            console.log('raw message', message);

            // emit the event
            this.onMessage.emit('message', {
                channelId: message.channel,
                messageId: message.client_message_id,
                text: message.text,
                userId: message.user,
            });
        });

        this._rtmClient = rtmClient;
        this._rtmClient.start();

        return Promise.resolve();
    }

    public async say(message: OutgoingChatMessage) {
        if (!this._rtmClient) {
            Promise.reject("The chat provider isn't connected.");
        }

        const result = await this
            ._rtmClient!
            .sendMessage(message.text, message.channelId);

        if (result.error) {
            throw new Error(`Error from Slack: ${result.error}`);
        }
    }
}
