import {
    ConflictException,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { GlobalResDTO } from '../global-dto/global-res.dto';
import { ConfigService } from './../../config/config.service';
import { UserDB, UserDBGender, UserDBPrefix, UserDBRole } from './../../entities/user.entity';
import { LogService } from './../../services/log.service';
import { PaginationService } from './../../services/pagination.service';
import { ResStatus } from './../../share/enum/res-status.enum';
import { CreateUserImage } from './dto/create-user-image.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UserPaginationDTO, UserPaginationResDTO } from './dto/pagination-user.dto';
import { UpdateUserReqDto } from './dto/updateUser.dto';
var CryptoJS = require('crypto-js');
var mongoose = require('mongoose');
export class UserRepository implements OnApplicationBootstrap {
    private KEY_PASSWORD = new ConfigService().getEncryptKey();
    private logger = new LogService(UserRepository.name);

    constructor(
        @InjectModel(UserDB.name) private readonly userModel: Model<UserDB>,
        // @InjectModel(UserDBWork.name) private readonly userDBWorkModel: Model<UserDBWork>,
        private paginationService: PaginationService,
    ) {}

    async onApplicationBootstrap() {
        // const results = await this.userModel.find({});
        // for (const iterator of results) {
        //     const cipherText = CryptoJS.AES.encrypt('1234', this.KEY_PASSWORD).toString();
        //     iterator.password = cipherText;
        //     await iterator.save();
        // }
        // this.initSuperAdmin();
        // await this.fakeDoc();
        // const x = await this.userPagination({
        //     perPages: 10,
        //     page: 1,
        //     search: 'a',
        // });
        // this.logger.debug(x);
        // this.findWorkListByUserId('633a65f29e1105b316e19ed5');
    }

    // async fakeDoc() {
    //     const tag = this.fakeDoc.name;
    //     try {
    //         for (let index = 0; index < 50; index++) {
    //             const x = faker.internet.userName();
    //             // const firstName = faker.name.firstName();
    //             const _create = new this.userModel({
    //                 username: x,
    //                 password: CryptoJS.AES.encrypt(x, this.KEY_PASSWORD),
    //                 prefix: 'Mr',
    //                 nickname: 'wave',
    //                 firstName: faker.name.firstName(),
    //                 lastName: faker.name.lastName(),
    //                 position: 'Housekeeper',
    //                 phoneNumber: faker.phone.phoneNumber().replace('-', ''),
    //                 imageUser: 'string',
    //                 gender: UserDBGender.FEMALE,
    //                 role: UserDBRole.User,
    //             });

    //             await _create.save();

    //             // await _create.save();
    //             // const _document = new DocumentDB();
    //             // _document.name = faker.word.adjective();
    //             // _document.priority = EnumPriorityDocumentDB.high;
    //             // _document.barcode = new Date().getTime().toString();
    //             // _document.documentType = EnumDocTypeDocumentDB.external;
    //             // _document.userId = '37ec3e7e-17f6-4ed3-aa7e-aeddfa7dd040';
    //             // _document.agencyId = 'ab3de1a6-1d0a-4dc5-83ba-b853e929e59e';
    //             // _document.detail = faker.lorem.paragraph(1);
    //             // _document.governmentDocNo = faker.random.locale();
    //             // await _document.save();
    //         }
    //     } catch (error) {
    //         console.error(`${tag} -> `, error);
    //         this.logger.error(`${tag} -> `, error);
    //         throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    // [function]────────────────────────────────────────────────────────────────────────────────

    async createUser(createUserDto: CreateUserDto) {
        let user = await this.getUserByUserName(createUserDto.username);

        if (user) {
            throw new ConflictException('User already exists');
        }

        user = new this.userModel(
            {
                username: createUserDto.username,
                password: CryptoJS.AES.encrypt(createUserDto.password, this.KEY_PASSWORD),
                prefix: createUserDto.prefix,
                firstName: createUserDto.firstName,
                lastName: createUserDto.lastName,
                phoneNumber: createUserDto.phoneNumber,
                imageUser: createUserDto.imageUser,
                gender: createUserDto.gender,
                role: createUserDto.role,
            },
            '-__v',
        );

        try {
            user = await user.save();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!user) {
            throw new ConflictException('User not created');
        }

        return user;
    }

    // ────────────────────────────────────────────────────────────────────────────────

    async getUserById(_id: string) {
        let user: UserDB;
        try {
            user = await this.userModel.findById({ _id: _id }, '-__v');
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    // ────────────────────────────────────────────────────────────────────────────────

    async getUserByUserName(username: string) {
        let user: UserDB;
        try {
            user = await this.userModel.findOne({ username }, 'userName img role').exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return user;
    }

    // ────────────────────────────────────────────────────────────────────────────────

    async getLogin(_username: string, _password: string) {
        try {
            const user = await this.userModel.findOne({ username: _username }, '-__v').exec();

            this.logger.debug(user);

            if (!user) throw new NotFoundException('Invalid username or email or password.');

            const bytes = CryptoJS.AES.decrypt(user.password, this.KEY_PASSWORD);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);

            if (originalText !== _password) throw new NotFoundException('user or password not found');

            return user;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error);
        }
    }

    // ────────────────────────────────────────────────────────────────────────────────

    async updateUser(_id: string, body: UpdateUserReqDto) {
        const tag = this.updateUser.name;
        try {
            const updateUser = await this.userModel.updateOne(
                {
                    id: _id,
                },
                {
                    $set: {
                        username: body.username,
                        password: body.password,
                        phoneNumber: body.phoneNumber,
                        imageUser: body.imageUser,
                    },
                },
            );
            return updateUser;
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ────────────────────────────────────────────────────────────────────────────────

    async isUser(_id: MongooseSchema.Types.ObjectId) {
        try {
            this.logger.debug('isUser -> ', _id);
            const user = await this.userModel.findById(_id);
            if (user) return true;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return false;
    }

    // ────────────────────────────────────────────────────────────────────────────────

    async initSuperAdmin() {
        try {
            const user = await this.userModel.findOne();

            if (user) {
                return;
            }

            //             "name": "admin",
            //   "email": "test@gmail.com",
            //   "password": "1234",
            //   "weight": "60.5",
            //   "height": "180.5",
            //   "age": "60",
            //   "gender": "female",
            //   "role": "USER"

            const _create = new this.userModel(
                {
                    username: 'superAdmin',
                    password: CryptoJS.AES.encrypt('superAdmin', this.KEY_PASSWORD),
                    prefix: UserDBPrefix.Mr,
                    nickname: 'wave',
                    firstName: 'ยุทธภูมิ',
                    lastName: 'สนาน้อย',
                    phoneNumber: '0956482914',
                    gender: UserDBGender.MALE,
                    role: UserDBRole.Admin,
                },
                '-__v',
            );

            await _create.save();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return false;
    }

    async userPagination(paginationDTO: UserPaginationDTO) {
        const tag = this.userPagination.name;
        try {
            const resData = {
                totalItems: 0,
                itemsPerPage: 0,
                totalPages: 0,
                currentPage: paginationDTO.page,
                data: [],
            };

            let conditionFind = {};

            if (paginationDTO?.search) {
                conditionFind = {
                    $or: [
                        { firstName: { $regex: '.*' + paginationDTO.search + '.*' } },
                        { lastName: { $regex: '.*' + paginationDTO.search + '.*' } },
                    ],
                };
            }

            // จำนวนข้อมูลทั้งหมด ตามเงื่อนไข
            resData.totalItems = await this.userModel.count(conditionFind);

            // คำนวณชุดข้อมูล
            const padding = this.paginationService.paginationCal(resData.totalItems, paginationDTO.perPages, paginationDTO.page);

            resData.totalPages = padding.totalPages;

            resData.data = await this.userModel.find(conditionFind).select('-__v -password').limit(padding.limit).skip(padding.skips);

            resData.itemsPerPage = resData.data.length;

            // user ─────────────────────────────────────────────────────────────────────────────────

            return new UserPaginationResDTO(
                ResStatus.success,
                '',
                resData.data,
                resData.totalItems,
                resData.itemsPerPage,
                resData.totalPages,
                resData.currentPage,
            );
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async uploadUserImage(imageUser: Express.Multer.File[], _userId: string, body: CreateUserImage) {
        const tag = this.uploadUserImage.name;
        try {
            if (!imageUser || imageUser.length === 0) {
                throw new HttpException(`cannot image user`, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            const findUserById = await this.findOneUser(_userId);

            this.logger.debug('_userId -> ', _userId);
            // this.logger.debug('imageUser -> ', imageUser);
            if (!findUserById) throw new HttpException(`cannot find user by id`, HttpStatus.INTERNAL_SERVER_ERROR);
            this.logger.debug('user id data -> ', findUserById);
            findUserById.imageUser = imageUser[0].filename;
            await findUserById.save();

            return new GlobalResDTO(ResStatus.success, 'อัพโหลดรูปสำเร็จ');
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // ─────────────────────────────────────────────────────────────────────────────
    async findAllUser() {
        const tag = this.findAllUser.name;

        try {
            const resultUser = await this.userModel.find();

            if (resultUser) {
                return resultUser;
            } else {
                throw new NotFoundException('No User Yet :(');
            }
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // ─────────────────────────────────────────────────────────────────────────────

    // async findWorkListByUserId(userId: string): Promise<UserDB> {
    async findWorkListByUserId(userId: string): Promise<UserDB> {
        const tag = this.findWorkListByUserId.name;

        try {
            const user: number = await this.userModel.count({ _id: userId });
            this.logger.debug(`${tag} -> user : `, user);

            if (user === 0) throw new HttpException(`cannot find user by id`, HttpStatus.INTERNAL_SERVER_ERROR);

            const result = await this.userModel.findById(userId, '_id workList').populate({
                path: 'workList',
                populate: [
                    {
                        path: 'workList',
                    },
                    {
                        path: 'zone',
                        populate: { path: 'checkList estimate' },
                    },
                ],
            });
            // this.logger.debug(`${tag} -> `, result);

            return result;
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findRoleByUserId(userId: string) {
        const tag = this.findRoleByUserId.name;
        try {
            const ResultPosition = await this.userModel.findById(userId).select('role');
            if (!ResultPosition) return null;
            return ResultPosition.role;
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteUserByUserId(userId: string, user: UserDB) {
        const tag = this.deleteUserByUserId.name;
        try {
            if (!userId) throw new Error('userId is required');
            if (!user) throw new Error('Not Authorized');
            if (user.role !== UserDBRole.Admin) throw new Error('Not Authorized');

            const removeUser = await this.userModel.findByIdAndRemove(userId);
            if (!removeUser) throw new Error('User not found');
            return removeUser;
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOneUser(id: string) {
        const tag = this.findOneUser.name;
        try {
            const user = await this.userModel.findById(id);
            return user;
            // return new FindOneAssessmentDTO(ResStatus.success, '', template);
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
