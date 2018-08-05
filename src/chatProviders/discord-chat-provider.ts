import { IChatProvider } from "./chat-provider";
import Discord from 'discord.js';
import Emittery from 'emittery';
import { IncomingChatMessage } from '../models/incoming-chat-message';
import { OutgoingChatMessage } from "../models/outgoing-chat-message";

export class DiscordChatProvider implements IChatProvider {
    public name = "Discord";

    public onMessage = new Emittery.Typed<{ message: IncomingChatMessage }, 'message'>();
    public onSignedIn = new Emittery.Typed<{ eventInfo: string }, 'eventInfo'>();

    private _discordClient: Discord.Client;

    public constructor(private _botAccessToken: string) { }

    public connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this._discordClient && this._discordClient.uptime) {
                this._discordClient.destroy();
            }
            delete this._discordClient;

            this._discordClient = new Discord.Client();
            this._discordClient.on('ready', () => { resolve(); });

            this._discordClient.on('message', message => {
                if (message.author.bot) { return; }

                this.onMessage.emit('message', {
                    channelId: message.channel.id,
                    messageId: message.id,
                    raw: message,
                    text: message.content,
                    userId: message.author.id,
                });
            });

            this._discordClient.login(this._botAccessToken);
        });
    }

    public isBotMentioned(message: IncomingChatMessage): Promise<boolean> {
        const botId = this._discordClient.user.id;
        return Promise.resolve(!!message.raw.mentions.users.find((u: any) => u.id === botId));
    }

    public say(message: OutgoingChatMessage): Promise<void> {
        const channel: Discord.TextChannel = this._discordClient.channels.get(message.channelId) as Discord.TextChannel;
        channel.send(message.text);
        return Promise.resolve();
    }
}
