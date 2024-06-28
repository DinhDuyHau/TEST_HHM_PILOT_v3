export class Notification {
    notification_id: number;
    title: string;
    body: string;
    image: string;
    send_date?: string;
    redirect?: string;
    status?: string;
    constructor() {
        this.notification_id = 0;
        this.title = '';
        this.body = '';
        this.image = '';
    }
}