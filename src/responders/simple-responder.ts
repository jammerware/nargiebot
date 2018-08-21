import { IResponder } from "./responder";
import { ResponseContext } from "../models/response-context";
import { OutgoingChatMessage } from "../models/outgoing-chat-message";

export class SimpleResponder implements IResponder {
    private _respondsIfNotMentioned = false;
    private _respondsToText = "";
    private _respondsWithText = "";

    constructor(respondsToText: string) {
        this._respondsToText = respondsToText.toLocaleLowerCase();
    }

    public canRespond(context: ResponseContext): Promise<boolean> {
        return Promise.resolve(
            !!this._respondsToText &&
            (context.isBotMentioned || this._respondsIfNotMentioned) &&
            context.message.text.toLocaleLowerCase().indexOf(this._respondsToText) >= 0);
    }

    public getResponse(context: ResponseContext): Promise<OutgoingChatMessage> {
        return Promise.resolve({
            channelId: context.message.channelId,
            text: this._respondsWithText,
        });
    }

    // this enables the syntactic-sugary bot.respondsTo(things).with(stuff).evenIfNotMentioned()
    public evenIfNotMentioned(): SimpleResponder {
        this._respondsIfNotMentioned = true;
        return this;
    }

    public with(text: string): SimpleResponder {
        this._respondsWithText = text;
        return this;
    }

    // these are just in case anyone constructs a simple responder
    public respondsIfNotMentioned(respondsIfNotMentioned: boolean) {
        this._respondsIfNotMentioned = respondsIfNotMentioned;
    }

    public setRespondsToText(respondsToText: string) {
        this._respondsToText = respondsToText;
    }

    public setRespondsWithText(respondsWithText: string) {
        this.with(respondsWithText);
    }
}
