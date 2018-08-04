import { IResponder } from "./responder";
import { ResponseContext } from "../models/response-context";
import { OutgoingChatMessage } from "../models/outgoing-chat-message";

export class SimpleResponder implements IResponder {
    private _respondsToText: string = "";
    private _respondsWithText: string = "";

    constructor(respondsToText: string) {
        this._respondsToText = respondsToText.toLocaleLowerCase();
    }

    public canRespond(context: ResponseContext): Promise<boolean> {
        return Promise.resolve(
            !!this._respondsToText &&
            context.isBotMentioned &&
            context.message.text.toLocaleLowerCase().indexOf(this._respondsToText) >= 0);
    }

    public getResponse(context: ResponseContext): Promise<OutgoingChatMessage> {
        return Promise.resolve({
            channelId: context.message.channelId,
            text: this._respondsWithText,
        });
    }

    // this enables the syntactic-sugary bot.respondsTo(things).with(stuff)
    public with(text: string) {
        this._respondsWithText = text;
    }

    // these are just in case anyone constructs a simple responder
    public setRespondsToText(respondsToText: string) {
        this._respondsToText = respondsToText;
    }

    public setRespondsWithText(respondsWithText: string) {
        this.with(respondsWithText);
    }
}
