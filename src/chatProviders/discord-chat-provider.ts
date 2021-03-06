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

            this._discordClient.on('message', (message: any) => {
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

        if (message.attachments && message.attachments.length) {
            for (const attachment of message.attachments) {
                const embed = new Discord.RichEmbed();

                if (attachment.author) {
                    embed.author = {
                        icon_url: attachment.author.icon,
                        name: attachment.author.name,
                        url: attachment.author.link,
                    };
                }

                if (attachment.fields && attachment.fields.length) {
                    for (const field of attachment.fields) {
                        embed.addField(field.title, field.value);
                    }
                }

                if (attachment.image) {
                    embed.image = { url: attachment.image };
                }

                embed.color = 0xff9900; // TODO: conversion from string to hex literal?
                embed.description = attachment.text;
                embed.title = attachment.title;
                embed.url = attachment.titleLink;

                channel.sendEmbed(embed);
            }
        }

        return Promise.resolve();
    }
}
