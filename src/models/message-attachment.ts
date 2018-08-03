export class MessageAttachment {
    public author?: {
        name: string,
        link: string,
        icon: string,
    };
    public color?: string;
    public fallbackText: string;
    public fields: Array<{ title: string; value: string; }>;
    public footer?: {
        text: string;
        icon: string;
    }
    public headerText?: string;
    public image?: string;
    public text?: string;
    public title: string;
    public titleLink: string;

}