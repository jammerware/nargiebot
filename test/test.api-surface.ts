import {
    DiscordChatProvider,
    Nargiebot,
    SlackChatProvider,
    OutgoingChatMessage,
    ResponseContext,
} from '../src/index';
import { DumbResponder } from './testResponders/dumb-responder';
import { PatchNotesResponder } from './testResponders/patch-notes-responder';
import { ScorePlusResponder } from './testResponders/score-plus-responder';
import { VogGuideResponder } from './testResponders/vog-guide-responder';

const bot = Nargiebot.create();
bot.respondsTo("Heya").with("Heya, amigo!");
bot.addRespondersByType(PatchNotesResponder, ScorePlusResponder, VogGuideResponder, DumbResponder);

// bot.connect(new DiscordChatProvider(process.env.DISCORD_BOT_TOKEN || '')).then(() => {
//     console.log('connected to Discord');
// }).catch((err: Error) => {
//     console.log('error connecting discord bot', err);
// });

bot.connect(new SlackChatProvider(process.env.SLACK_BOT_TOKEN || '')).then(() => {
    console.log("Connected to Slack");
}).catch((err: Error) => {
    console.error("Error connecting Slack bot", err);
});
