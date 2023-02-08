import { LogService } from './log.service';
import { AxiosResponse } from './../../node_modules/axios/index.d';
import { HttpService } from '@nestjs/axios';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Observable } from 'rxjs';
import path from 'path';
import fs from 'fs';
export const TOKEN =
    '+tobvvT5bfABnbRvjuakIsR6xWXVETEZZYMc53DB9kRW/n6fbJl7PU+bBvGxiLDIgdPwLGkrPxEjctJXClhzYosV7pMXWR6WD5cUTTyh2M0XKcEK0kUiMpy17a1+fcksdiB2n7WOicNt7Tu96FNnlgdB04t89/1O/w1cDnyilFU=';
@Injectable()
export class ThirdPartyLineService implements OnApplicationBootstrap {
    private readonly TOKEN =
        '+tobvvT5bfABnbRvjuakIsR6xWXVETEZZYMc53DB9kRW/n6fbJl7PU+bBvGxiLDIgdPwLGkrPxEjctJXClhzYosV7pMXWR6WD5cUTTyh2M0XKcEK0kUiMpy17a1+fcksdiB2n7WOicNt7Tu96FNnlgdB04t89/1O/w1cDnyilFU=';

    private readonly LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
    private readonly LINE_CONTENT_API = 'https://api-data.line.me/v2/bot/message';
    private readonly LINE_HEADER = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.TOKEN}`,
    };

    private logger = new LogService(ThirdPartyLineService.name);

    constructor(private httpService: HttpService) {}

    onApplicationBootstrap() {
        // const _path = path.join(__dirname, '../../upload/line');
        // const _fileName = `xxxx.jpg`;
        // const _fullPath = `${_path}/${_fileName}`;
        // this.logger.debug('onApplicationBootstrap-> ', _fullPath);
        // this.reply({
        //     replyToken: '430d7752417f4540a6536b0af5fbd7a3',
        //     messages: [
        //         {
        //             type: 'text',
        //             text: `ภาพไม่ชัด หรือ ไม่ใช่ QRCODE กรุณาลองใหม่อีกครั้ง`,
        //         },
        //     ],
        // })
        //     .toPromise()
        //     .then((resp) => {
        //         console.log(resp);
        //     })
        //     .catch((err) => {
        //         console.error(err);
        //     });
    }

    getContent(messageId: string): Promise<ResGetContent> {
        return new Promise((resolve, reject) => {
            this.httpService
                .get(`${this.LINE_CONTENT_API}/${messageId}/content`, {
                    headers: this.LINE_HEADER,
                    responseType: 'arraybuffer',
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                })
                .subscribe(
                    async (resp: any) => {
                        this.logger.debug(` resp.data : `, resp.data);

                        const _path = path.join(__dirname, '../../upload/line');
                        const _fileName = `${messageId}.jpg`;
                        const _fullPath = `${_path}/${_fileName}`;

                        try {
                            fs.writeFileSync(_fullPath, resp.data);
                            return resolve({
                                fileName: _fileName,
                                destination: _path,
                                path: _fullPath,
                            });
                        } catch (error) {
                            return reject(error);
                        }
                    },
                    (err) => {
                        this.logger.error(err);
                        return reject(err);
                    },
                );
        });
    }

    broadcast(body: BodyMassage[]): Observable<AxiosResponse<any>> {
        return this.httpService.post(
            `${this.LINE_MESSAGING_API}/broadcast`,
            {
                messages: body,
            },
            {
                headers: this.LINE_HEADER,
            },
        );
    }

    push(body: PushMassage): Observable<AxiosResponse<any>> {
        return this.httpService.post(
            `${this.LINE_MESSAGING_API}/push`,
            {
                to: body.to,
                messages: body.messages,
            },
            {
                headers: this.LINE_HEADER,
            },
        );
    }

    // replyFlex(_replyToken: string, _messages: string): Observable<AxiosResponse<any>> {
    //     return this.httpService.post(
    //         `${this.LINE_MESSAGING_API}/reply`,
    //         {
    //             replyToken: _replyToken,
    //             messages: _messages,
    //         },
    //         {
    //             headers: this.LINE_HEADER,
    //         },
    //     );
    // }

    replyFlexMessage(body: ReplyFlexMessage) {
        return this.httpService.post(
            `${this.LINE_MESSAGING_API}/reply`,
            {
                replyToken: body.replyToken,
                messages: body.messages,
            },
            {
                headers: this.LINE_HEADER,
            },
        );
    }

    reply(body: ReplyTokenMassage) {
        return this.httpService.post(
            `${this.LINE_MESSAGING_API}/reply`,
            {
                replyToken: body.replyToken,
                messages: body.messages,
            },
            {
                headers: this.LINE_HEADER,
            },
        );
        // return new Promise((resolve, reject) => {
        //     this.httpService
        //         .post(
        //             `${this.LINE_MESSAGING_API}/reply`,
        //             {
        //                 messages: JSON.stringify(body),
        //             },
        //             {
        //                 headers: this.LINE_HEADER,
        //             },
        //         )
        //         .subscribe(
        //             (resp) => {
        //                 return resolve(resp.data);
        //             },
        //             (err) => {
        //                 return reject(err);
        //             },
        //         );
        // });
    }

    replyQuickMessage(body: ReplyQuickMessage) {
        return this.httpService.post(
            `${this.LINE_MESSAGING_API}/reply`,
            {
                replyToken: body.replyToken,
                messages: body.messages,
            },
            {
                headers: this.LINE_HEADER,
            },
        );
    }
}

export interface BodyMassage {
    type: string;
    text: string;
}

export interface PushMassage {
    to: string;
    messages: BodyMassage[];
}

export interface ReplyTokenMassage {
    replyToken: string;
    messages: BodyMassage[];
}

export interface ResGetContent {
    fileName: string;
    destination: string;
    path: string;
}
export interface QuickReplyMessage {
    to: string;
    messages: QuickReplyMessageMessage[];
}

export interface QuickReplyMessageMessage {
    type: string;
    text: string;
    quickReply: QuickReply;
}

export interface QuickReply {
    items: Item[];
}

export interface Item {
    type: string;
    action: Action;
    imageUrl?: string;
}

export interface Action {
    type: string;
    label: string;
    uri?: string;
    text?: string;
    data?: string;
    displayText?: string;
    mode?: string;
    initial?: string;
    max?: string;
    min?: string;
}

export interface ReplyQuickMessage {
    replyToken: string;
    messages: QuickReplyMessageMessage[];
}

export interface ReplyFlexMessage {
    replyToken: string;
    messages: FlexMessageMessage[];
}

export interface FlexMessageMessage {
    type: string;
    altText: string;
    contents: Contents;
}

export interface Contents {
    type: string;
    hero: Hero;
    body: Body;
    footer: Footer;
}

export interface Hero {
    type: string;
    url: string;
    size: string;
    aspectRatio: string;
    aspectMode: string;
    action: FlexMessageAction;
}

export interface FlexMessageAction {
    type: string;
    uri: string;
}

export interface Body {
    type: string;
    layout: string;
    contents: Content[];
}

export interface Content {
    type: string;
    text?: string;
    size?: string;
    weight?: string;
    style?: string;
    decoration?: string;
    align?: string;
    wrap?: boolean;
    layout?: string;
    margin?: string;
    spacing?: string;
    contents?: Content2[];
}

export interface Content2 {
    type: string;
    layout: string;
    spacing: string;
    contents: Content3[];
}

export interface Content3 {
    type: string;
    text: string;
    wrap: boolean;
    color: string;
    size: string;
    flex: number;
}

export interface Footer {
    type: string;
    layout: string;
    spacing: string;
    contents: Content4[];
    flex: number;
}

export interface Content4 {
    type: string;
    style?: string;
    height?: string;
    action?: Action2;
    layout?: string;
    contents?: any[];
    margin?: string;
}

export interface Action2 {
    type: string;
    label: string;
    uri?: string;
    text?: string;
}




export interface Root {
  type: string
  message: Message
  webhookEventId: string
  deliveryContext: DeliveryContext
  timestamp: number
  source: Source
  replyToken: string
  mode: string
}

export interface Message {
  type: string
  id: string
  text: string
  mention: Mention
}

export interface Mention {
  mentionees: Mentionee[]
}

export interface Mentionee {
  index: number
  length: number
  userId: string
}

export interface DeliveryContext {
  isRedelivery: boolean
}

export interface Source {
  type: string
  groupId: string
  userId: string
}
