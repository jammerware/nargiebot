import {
    Nargiebot,
    IResponder,
    IncomingChatMessage,
    OutgoingChatMessage,
    SlackChatProvider,
} from '../src/index';

class DumbResponder implements IResponder {
    public canRespond(message: IncomingChatMessage): Promise<boolean> {
        return Promise.resolve(true);
    }

    public getResponse(message: IncomingChatMessage): Promise<OutgoingChatMessage> {
        return Promise.resolve({ text: "Drink with me, friend!", channelId: message.channelId });
    }
}

const bot = Nargiebot.create();
bot.addResponders(new DumbResponder());

bot.connect(new SlackChatProvider(process.env.SLACK_BOT_TOKEN || '')).then(() => {
    console.log("Connected to Slack with bot", bot);
}).catch(err => {
    console.error("Error connecting Slack bot", err);
});
