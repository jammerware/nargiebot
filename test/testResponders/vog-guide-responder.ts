import { IResponder, OutgoingChatMessage, ResponseContext } from "../../src";

export class VogGuideResponder implements IResponder {
    public canRespond(context: ResponseContext): Promise<boolean> {
        if (context.isBotMentioned && context.message.text.indexOf("vault of glass") >= 0) {
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }

    public getResponse(context: ResponseContext): Promise<OutgoingChatMessage> {
        return Promise.resolve({
            attachments: [{
                fallbackText: "SBGC Guide to the Vault of Glass",
                fields: [{ title: "Is it good?", value: "Yes" }],
                text: "Yes, it really is more than 40 pages.",
                title: "SBGC Guide to the Vault of Glass",
                titleLink: "https://drive.google.com/open?id=1w1I2n-BJD_xhQmUB7jXI06kyp5zcjEcU",
            }],
            channelId: context.message.channelId,
            text: "Here you go!",
        });
    }
}
