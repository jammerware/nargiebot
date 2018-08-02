import { Nargiebot, SlackChatProvider } from '../src/index';
import { DumbResponder } from './testResponders/dumb-responder';
import { ScorePlusResponder } from './testResponders/score-plus-responder';

const bot = Nargiebot.create();
bot.respondsTo("Hello").with("Greetings, friend!");
bot.addResponders(
    new ScorePlusResponder(),
    new DumbResponder(),
);

bot.connect(new SlackChatProvider(process.env.SLACK_BOT_TOKEN || '')).then(() => {
    console.log("Connected to Slack with bot", bot);
}).catch((err: Error) => {
    console.error("Error connecting Slack bot", err);
});
