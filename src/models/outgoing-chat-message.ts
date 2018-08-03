import { MessageAttachment } from "./message-attachment";

export class OutgoingChatMessage {
    public channelId: string;
    public text: string;
    public attachments?: MessageAttachment[] = [];
}
