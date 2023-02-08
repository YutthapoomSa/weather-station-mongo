import { Injectable } from '@nestjs/common';

@Injectable()
export class FlexMassageTemplateNo1Service {
    getTemplateNo1(contentsText: string, contentDetail: TemplateNo1Content3[], templateNo1Content4: TemplateNo1Content4[]): TemplateNo1 {
        const res = {
            messages: [
                {
                    type: 'flex',
                    altText: 'this is a flex message',
                    contents: {
                        type: 'bubble',
                        hero: {
                            type: 'image',
                            url: 'https://wallpaperaccess.com/full/5236169.jpg',
                            size: 'full',
                            aspectRatio: '20:13',
                            aspectMode: 'cover',
                            action: {
                                type: 'message',
                                label: 'Message',
                                text: 'Hello World!',
                            },
                        },
                        body: {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                                {
                                    type: 'text',
                                    text: contentsText,
                                    weight: 'bold',
                                    size: 'xl',
                                },
                                {
                                    type: 'box',
                                    layout: 'vertical',
                                    margin: 'lg',
                                    spacing: 'sm',
                                    contents: [
                                        {
                                            type: 'box',
                                            layout: 'baseline',
                                            spacing: 'sm',
                                            contents: contentDetail,
                                        },
                                    ],
                                },
                            ],
                        },
                        footer: {
                            type: 'box',
                            layout: 'vertical',
                            spacing: 'sm',
                            contents: templateNo1Content4,
                            flex: 0,
                        },
                    },
                },
            ],
        };
        return res;
    }
}

// ────────────────────────────────────────────────────────────────────────────────

export interface TemplateNo1 {
    messages: TemplateNo1Message[];
}

export interface TemplateNo1Message {
    type: string;
    altText: string;
    contents: TemplateNo1Contents;
}

export interface TemplateNo1Contents {
    type: string;
    hero: TemplateNo1Hero;
    body: TemplateNo1Body;
    footer: TemplateNo1Footer;
}

export interface TemplateNo1Hero {
    type: string;
    url: string;
    size: string;
    aspectRatio: string;
    aspectMode: string;
    action: TemplateNo1Action;
}

export interface TemplateNo1Action {
    type: string;
    label: string;
    text: string;
}

export interface TemplateNo1Body {
    type: string;
    layout: string;
    contents: TemplateNo1Content[];
}

export interface TemplateNo1Content {
    type: string;
    text?: string;
    weight?: string;
    size?: string;
    layout?: string;
    margin?: string;
    spacing?: string;
    contents?: TemplateNo1Content2[];
}

export interface TemplateNo1Content2 {
    type: string;
    layout: string;
    spacing: string;
    contents: TemplateNo1Content3[];
}

export interface TemplateNo1Content3 {
    type: string;
    text: string;
    color: string;
    size: string;
    flex: number;
    wrap?: boolean;
}

export interface TemplateNo1Footer {
    type: string;
    layout: string;
    spacing: string;
    contents: TemplateNo1Content4[];
    flex: number;
}

export interface TemplateNo1Content4 {
    type: string;
    style?: string;
    height?: string;
    action?: TemplateNo1Action2;
    layout?: string;
    contents?: any[];
    margin?: string;
}

export interface TemplateNo1Action2 {
    type: string;
    label: string;
    text: string;
}
