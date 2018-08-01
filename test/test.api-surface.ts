import { Nargiebot, SlackChatProvider } from '../src/index';

const bot = Nargiebot.create(new SlackChatProvider());
console.log('hi!');
console.log('bot', bot);
