import { IResponder, OutgoingChatMessage, ResponseContext } from '../../src';

export class ScorePlusResponder implements IResponder {
    // like <@U02FW57LP>+1 or <@U02FW57LP> + 1
    private SCORING_REGEX = new RegExp(/(<@([a-zA-Z0-9]+)>)\s*\+\s*1/);

    public canRespond(context: ResponseContext): Promise<boolean> {
        return Promise.resolve(this.SCORING_REGEX.test(context.message.text));
    }

    public getResponse(context: ResponseContext): Promise<OutgoingChatMessage> {
        // note that this doesn't deal with groups unless the regex doesn't have the g flag
        // need to revise if we're allowing multiple scoring expressions per message
        const regexMatch = context.message.text.match(this.SCORING_REGEX);

        if (regexMatch && regexMatch.length >= 2) {
            return Promise.resolve({
                channelId: context.message.channelId,
                text: `Cool. I gave ${regexMatch[1]} a point! Way to go.`,
            });
        }

        return Promise.reject(`Couldn't find the match in "${context.message.text}."`);
    }
}
