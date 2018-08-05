import {
    DiscordChatProvider,
    Nargiebot,
    SlackChatProvider,
} from '../src/index';
import { DumbResponder } from './testResponders/dumb-responder';
import { ScorePlusResponder } from './testResponders/score-plus-responder';

const bot = Nargiebot.create();
bot.respondsTo("Hello").with("Greetings, friend!");
bot.addRespondersByType(ScorePlusResponder, DumbResponder);

bot.connect(new DiscordChatProvider(process.env.DISCORD_BOT_TOKEN || '')).then(() => {
    console.log('connected to Discord');
}).catch((err: Error) => {
    console.log('error connecting discord bot', err);
});

bot.connect(new SlackChatProvider(process.env.SLACK_BOT_TOKEN || '')).then(() => {
    console.log("Connected to Slack");
}).catch((err: Error) => {
    console.error("Error connecting Slack bot", err);
});
