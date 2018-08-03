import { RTMClient, WebClient } from '@slack/client';
import Emittery from 'emittery';
import { IChatProvider } from "./chat-provider";
import { IncomingChatMessage } from '../models/incoming-chat-message';
import { OutgoingChatMessage } from '../models/outgoing-chat-message';
import { MessageAttachment } from '../models/message-attachment';

export class SlackChatProvider implements IChatProvider {
    public name = "Slack";
    public onMessage = new Emittery.Typed<{ message: IncomingChatMessage }, 'message'>();
    public onSignedIn = new Emittery.Typed<{ eventInfo: string }, 'eventInfo'>();

    private _rtmClient: RTMClient;
    private _webClient: WebClient;

    public constructor(private _botAccessToken: string) { }

    public connect(): Promise<void> {
        if (this._rtmClient && this._rtmClient.connected) {
            this._rtmClient.disconnect();
        }
        delete this._rtmClient;
        delete this._webClient;

        const rtmClient = new RTMClient(this._botAccessToken);
        this._webClient = new WebClient(this._botAccessToken);

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

    public async isBotMentioned(message: IncomingChatMessage): Promise<boolean> {
        const authResult = await this._webClient.auth.test();

        if (!authResult.ok) {
            throw new Error("Bot hasn't been authed when checking for bot mention.");
        }

        const botNameExpression = `<@${(authResult as any).user_id}>`;
        return message.text.indexOf(botNameExpression) >= 0;
    }

    public async say(message: OutgoingChatMessage) {
        if (!this._rtmClient) {
            Promise.reject("The chat provider isn't connected.");
        }

        const messageBody = {
            attachments: message.attachments && message.attachments.length ? message.attachments.map(a => this.buildSlackAttachment(a)) : [],
            channel: message.channelId,
            text: message.text,
        };

        const result = await this
            ._rtmClient!
            .addOutgoingEvent(true, 'message', messageBody);

        if (result.error) {
            throw new Error(`Error from Slack: ${result.error}`);
        }
    }

    private buildSlackAttachment(attachment: MessageAttachment): {} {
        const slackAttachment: any = {
            attachments: [],
            color: attachment.color,
            fallback: attachment.fallbackText,
            text: attachment.text,
            title: attachment.title,
            title_link: attachment.titleLink,
        };

        if (attachment.author) {
            slackAttachment.author_name = attachment.author.name;
            slackAttachment.author_link = attachment.author.link;
            slackAttachment.author_icon = attachment.author.icon;
        }

        if (attachment.fields.length) {
            for (const field of attachment.fields) {
                slackAttachment.fields.push({
                    title: field.title,
                    value: field.value,
                });
            }
        }

        return slackAttachment;
    }
}
