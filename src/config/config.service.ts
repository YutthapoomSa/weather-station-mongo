import * as dotenv from 'dotenv';

export class ConfigService {
    private readonly envConfig: Record<string, string>;
    constructor() {
        const result = dotenv.config();

        if (result.error) {
            this.envConfig = process.env;
        } else {
            this.envConfig = result.parsed;
        }
    }

    public get(key: string): string {
        return this.envConfig[key];
    }

    public async getPortConfig() {
        return this.get('PORT');
    }

    public getEncryptKey() {
        return 'secret';
    }

    public getJWTKey() {
        return 'secret';
    }

    public async getMongoConfig() {
        return {
            // uri: 'mongodb+srv://' + this.get('MONGO_USER') + ':' + this.get('MONGO_PASSWORD') + '@' + this.get('MONGO_HOST') + '/' + this.get('MONGO_DATABASE'),
            uri: 'mongodb://root:123456@internal.neercode.com:27017/example?authSource=admin&readPreference=primary&directConnection=true&ssl=false',
            // mongosh "mongodb+srv://cluster0.lx2wdhp.mongodb.net/myFirstDatabase" --apiVersion 1 --username admin
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
    }
    public imagePath() {
        return {
            userImagePath: 'http://localhost:2023/userImage',
            // userImagePath: 'https://api-siamit-cleanup.flowmisite.com/userImage',
            // resultAssessmentImagePath: 'https://api-siamit-cleanup.flowmisite.com/ResultImageAssessment',
            // resultAssessmentImagePath: 'http://localhost:3000/ResultImageAssessment',
        };
    }

    public userIdPath() {
        return {
            userId: 'userId=',
        };
    }
}
