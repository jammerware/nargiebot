export class IncomingChatMessage {
    public channelId: string;
    public isBotMentioned?: boolean;
    public messageId: string;
    public text: string;
    public userId: string;
}
