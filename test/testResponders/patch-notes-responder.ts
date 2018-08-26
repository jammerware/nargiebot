import { IResponder, OutgoingChatMessage, ResponseContext } from '../../src/index';

export class PatchNotesResponder implements IResponder {
    public canRespond(context: ResponseContext): Promise<boolean> {
        return Promise.resolve(context.isBotMentioned && /what's new/.test(context.message.text));
    }

    public getResponse(context: ResponseContext): Promise<OutgoingChatMessage> {
        // this is just a random example of the kind of responder you might make using this method,
        // but note that this version stuff only works if your bot is defined in a node package launched with npm start
        const version = process.env.npm_package_version;
        const patchNotes = require('./patch-notes.json');

        let responseText = `I'm FriendlyBot v.${version}. Here's what's going on with me lately:\n\n`;

        for (const note of patchNotes.notes) {
            responseText += `\n - ${note}`;
        }

        return Promise.resolve({ channelId: context.message.channelId, text: responseText });
    }
}
