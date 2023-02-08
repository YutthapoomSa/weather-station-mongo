import { faker } from '@faker-js/faker';
import {
    ConflictException,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    OnApplicationBootstrap
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
import { WorkListPaginationDTO, WorkListPaginationResDTO } from './dto/pagination-workList.dto';
import { UpdateWorkListReqDTO } from './dto/update-work-list.dto';
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
    ) { }

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

    async fakeDoc() {
        const tag = this.fakeDoc.name;
        try {
            for (let index = 0; index < 50; index++) {
                const x = faker.internet.userName();
                // const firstName = faker.name.firstName();
                const _create = new this.userModel({
                    username: x,
                    password: CryptoJS.AES.encrypt(x, this.KEY_PASSWORD),
                    prefix: 'Mr',
                    nickname: 'wave',
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    position: 'Housekeeper',
                    phoneNumber: faker.phone.phoneNumber().replace('-', ''),
                    imageUser: 'string',
                    gender: UserDBGender.FEMALE,
                    role: UserDBRole.User,
                });

                await _create.save();

                // await _create.save();
                // const _document = new DocumentDB();
                // _document.name = faker.word.adjective();
                // _document.priority = EnumPriorityDocumentDB.high;
                // _document.barcode = new Date().getTime().toString();
                // _document.documentType = EnumDocTypeDocumentDB.external;
                // _document.userId = '37ec3e7e-17f6-4ed3-aa7e-aeddfa7dd040';
                // _document.agencyId = 'ab3de1a6-1d0a-4dc5-83ba-b853e929e59e';
                // _document.detail = faker.lorem.paragraph(1);
                // _document.governmentDocNo = faker.random.locale();
                // await _document.save();
            }
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // [function]────────────────────────────────────────────────────────────────────────────────

    async createUser(createUserDto: CreateUserDto) {
        let user = await this.getUserByUserName(createUserDto.username);

        if (user) {
            throw new ConflictException('User already exists');
        }

        user = new this.userModel({
            username: createUserDto.username,
            password: CryptoJS.AES.encrypt(createUserDto.password, this.KEY_PASSWORD),
            prefix: createUserDto.prefix,
            nickname: createUserDto.nickname,
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            position: createUserDto.position,
            phoneNumber: createUserDto.phoneNumber,
            // imageUser: createUserDto.imageUser,
            gender: createUserDto.gender,
            role: createUserDto.role,
        });

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
            user = await this.userModel.findById({ _id: _id }).populate({
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
                        position: body.position,
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

            const _create = new this.userModel({
                username: 'superAdmin',
                password: CryptoJS.AES.encrypt('superAdmin', this.KEY_PASSWORD),
                prefix: UserDBPrefix.Mr,
                nickname: 'wave',
                firstName: 'ยุทธภูมิ',
                lastName: 'สนาน้อย',
                position: 'ตรวจสอบพื้นที่',
                phoneNumber: '0956482914',
                gender: UserDBGender.MALE,
                role: UserDBRole.User,
            });

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
            const resultUser = await this.userModel.find().populate({
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

    async findPositionByUserId(userId: string) {
        const tag = this.findPositionByUserId.name;
        try {
            const ResultPosition = await this.userModel.findById(userId).select('position');
            if (!ResultPosition) return null;
            return ResultPosition.position;
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // async findIsInWorkListZone(userId: string, zoneId: string) {
    //     const tag = this.findIsInWorkListZone.name;
    //     try {
    //         // const ResultPosition = await this.findPositionByUserId(userId);
    //         const config = new ConfigService();
    //         const findZone: any = await this.zoneRepository.getZoneById(zoneId);
    //         console.log('findZone', JSON.stringify(findZone, null, 2));
    //         if (!findZone) return 'ไม่พบข้อมูล';
    //         if (!userId) {
    //             return (
    //                 config.lineCheckListEstimatePath().estimate +
    //                 `${String(findZone.estimate._id)}` +
    //                 '&&' +
    //                 // config.userIdPath().userId +
    //                 // `${userId}` +
    //                 // '&&' +
    //                 config.zoneIdPath().zoneId +
    //                 `${String(zoneId)}` + '&&' +
    //                 config.templateType().templateType +
    //                 'estimate'
    //             );
    //         }
    //         // if (ResultPosition == null) return 'ไม่พบข้อมูล';
    //         // console.log('resultPosition', ResultPosition);
    //         const workListOfUser: any = await this.findWorkListByUserId(userId);

    //         console.log('workListLength', workListOfUser.workList.length);

    //         if (workListOfUser.workList.length == 0) {
    //             return (
    //                 config.lineCheckListEstimatePath().estimate +
    //                 `${String(findZone.estimate._id)}` +
    //                 '&&' +
    //                 // config.userIdPath().userId +
    //                 // `${userId}` +
    //                 // '&&' +
    //                 config.zoneIdPath().zoneId +
    //                 `${String(zoneId)}` + '&&' +
    //                 config.templateType().templateType +
    //                 'estimate'
    //             );
    //         }
    //         const tmpDateNow = moment();
    //         // check if date.now is >= startDate & date.now <= endDate

    //         // return config.lineCheckListEstimatePath().estimate + `${zone.estimate._id}`+ 'userId/' + `${userId}`;
    //         // return `https://localhost:3000/line/estimate/estimateId?${zone.estimate._id}`;

    //         for (const workList of workListOfUser.workList) {
    //             // log workList
    //             console.log('workList', JSON.stringify(workList, null, 2));

    //             if (((moment(tmpDateNow).isSameOrAfter(workList.startDate), 'day') && moment(tmpDateNow).isSameOrBefore(workList.endDate), 'day')) {
    //                 console.log('startDate & endDate are true');
    //                 // check Is In Day
    //                 if (!!workList.day && workList.day.length > 0) {
    //                     for (const day of workList.day) {
    //                         if (moment(tmpDateNow).isSame(moment(day), 'day')) {
    //                             console.log('day are true');
    //                             console.log('workListZoneLength : ', workList.zone.length);

    //                             if (!!workList.zone && workList.zone.length > 0) {
    //                                 for (const zone of workList.zone) {
    //                                     console.log('zoneId', zone._id);
    //                                     if (zoneId == zone._id) {
    //                                         return (
    //                                             config.lineCheckListEstimatePath().checkList +
    //                                             `${String(zone.checkList._id)}` +
    //                                             '&&' +
    //                                             config.userIdPath().userId +
    //                                             `${String(userId)}` +
    //                                             '&&' +
    //                                             config.zoneIdPath().zoneId +
    //                                             `${String(zoneId)}` + '&&' +
    //                                             config.templateType().templateType +
    //                                             'checkList'
    //                                         );

    //                                         // if (ResultPosition == UserDBPosition.checkList) {
    //                                         // return config.lineCheckListEstimatePath().checkList + `${zone.checkList._id}` + 'userId/' + `${userId}`;
    //                                         // return `https://localhost:3000/line/checkList/checkListId?${zone.checkList._id}`;
    //                                         // }
    //                                     }
    //                                 }
    //                             }

    //                             // return 'ไม่พบข้อมูล';
    //                         }
    //                     }
    //                     // return (
    //                     //     config.lineCheckListEstimatePath().estimate +
    //                     //     `${String(findZone.estimate._id)}` +
    //                     //     '&&' +
    //                     //     // config.userIdPath().userId +
    //                     //     // `${userId}` +
    //                     //     // '&&' +
    //                     //     config.zoneIdPath().zoneId +
    //                     //     `${String(zoneId)}`
    //                     // );

    //                     // return 'ไม่พบข้อมูล';
    //                     // checkzone
    //                 }
    //                 //  else {
    //                 //     return (
    //                 //         config.lineCheckListEstimatePath().estimate +
    //                 //         `${String(findZone.estimate._id)}` +
    //                 //         '&&' +
    //                 //         // config.userIdPath().userId +
    //                 //         // `${userId}` +
    //                 //         // '&&' +
    //                 //         config.zoneIdPath().zoneId +
    //                 //         `${String(zoneId)}`
    //                 //     );
    //                 // }
    //             }
    //         }
    //         console.log('zoneId when estimate go  ', zoneId);
    //         return (
    //             config.lineCheckListEstimatePath().estimate +
    //             `${String(findZone.estimate._id)}` +
    //             '&&' +
    //             // config.userIdPath().userId +
    //             // `${userId}` +
    //             // '&&' +
    //             config.zoneIdPath().zoneId +
    //             `${String(zoneId)}` +
    //             config.templateType().templateType +
    //             'estimate'
    //         );

    //         // return workListOfUser;
    //     } catch (error) {
    //         console.error(`${tag} -> `, error);
    //         this.logger.error(`${tag} -> `, error);
    //         throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    // ─────────────────────────────────────────────────────────────────────────────

    async findWorkListById(userId: string, workListId: string) {
        const tag = this.findWorkListByUserId.name;

        try {
            const result = await this.userModel
                .findById(userId, {
                    workList: {
                        $elemMatch: { _id: mongoose.Types.ObjectId(workListId) },
                    },
                })
                .populate('workList.zones', '-__v');
            this.logger.debug(`${tag} user id -> `, userId);
            this.logger.debug(`${tag} worklist id -> `, workListId);
            this.logger.debug(`${tag} -> `, result);

            // if (result.workList.length === 0) {
            //     return 'ไม่พบข้อมูลที่ร้องขอโปรดลองใหม่อีกครั้งในภายหลัง ♥';
            // } else if (result.workList.length > 0) {
            //     return result;
            // } else {
            //     return 'เกิดข้อผิดพลาดโปรดลองใหม่อีกครั้งในภายหลัง';
            // }
            return result;
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────

    // async addWorkList(_userId: string, body: CreateWorkListReqDTO) {
    //     const tag = this.addWorkList.name;

    //     try {
    //         const findUserById = await this.userModel.findById(_userId);

    //         if (!findUserById) throw new HttpException(`cannot find user by id`, HttpStatus.INTERNAL_SERVER_ERROR);
    //         if (!body) {
    //             throw new Error('body is required ');
    //         }

    //         console.log(JSON.stringify(body, null, 2));
    //         const _create = new this.userDBWorkModel();
    //         _create.startDate = body.startDate;
    //         _create.endDate = body.endDate;
    //         _create.day = [];
    //         _create.zone = [];

    //         for (const iterator of body.day) {
    //             _create.day.push(iterator);
    //         }

    //         for (const iterator of body.zone) {
    //             _create.zone.push(mongoose.Types.ObjectId(iterator));
    //         }

    //         findUserById.workList.push(_create);
    //         const result = await findUserById.save();
    //         this.logger.debug(`${tag} result -> `, result);

    //         return await this.findWorkListById(_userId, result.workList[0]._id);
    //     } catch (error) {
    //         console.error(`${tag} -> `, error);
    //         this.logger.error(`${tag} -> `, error);
    //         throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }
    // ─────────────────────────────────────────────────────────────────────────────

    async updateWorkList(_userId: string, body: UpdateWorkListReqDTO) {
        const tag = this.updateWorkList.name;

        try {
            const find = async () => {
                return await this.userModel
                    .findById(_userId, {
                        workList: {
                            $elemMatch: { _id: mongoose.Types.ObjectId(body.workListId) },
                        },
                    })
                    .populate({
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
            };

            const result = await find();

            // this.logger.debug(`${tag} -> result`, result);

            if (!result) {
                this.logger.warn(`${tag} -> result null.`);
                return;
            }

            const _zones: any[] = [];

            for (const iterator of body.zone) {
                _zones.push(mongoose.Types.ObjectId(iterator));
            }

            await this.userModel.updateOne(
                {
                    _id: _userId,
                    workList: {
                        $elemMatch: {
                            _id: mongoose.Types.ObjectId(body.workListId),
                        },
                    },
                },
                {
                    $set: {
                        'workList.$.startDate': body.startDate,
                        'workList.$.endDate': body.startDate,
                        'workList.$.zones': _zones,
                    },
                },
            );

            return await find();
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────

    async deleteWorkList(_userId: string, id: string): Promise<number> {
        const tag = this.deleteWorkList.name;
        this.logger.debug(`${tag} -> userId`, _userId);

        const user = this.isUserAndWorkList(_userId, id);

        try {
            const result = await this.userModel.updateOne(
                {
                    _id: _userId,
                },
                {
                    $pull: {
                        workList: {
                            _id: id,
                        },
                    },
                },
            );
            this.logger.debug(`${tag} -> result`, result);
            return result.modifiedCount;
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async isUserAndWorkList(_userId: string, workListId: string): Promise<boolean> {
        const tag = this.isUserAndWorkList.name;
        try {
            return await this.userModel
                .find({
                    $and: [{ _id: _userId }, { workList: { $elemMatch: { _id: workListId } } }],
                })
                .then((res) => {
                    if (res.length !== 0) {
                        return true;
                    } else {
                        return false;
                    }
                })
                .catch((err) => {
                    return false;
                });
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

    // Todo workList paginationDTO

    async workListPagination(paginationDTO: WorkListPaginationDTO) {
        const tag = this.workListPagination.name;
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

            resData.data = await this.userModel
                .find(conditionFind)
                .select('firstName lastName workList ')
                .populate({
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
                })

                // .populate({ path: 'workList' })
                // .populate({ path: 'workList.zone' })
                // .populate({ path: 'workList.zone.checkList' })
                // .populate({ path: 'workList.zone.estimate' })
                // .populate('workList')
                // .populate('workList.zone')
                // .populate('workList.zone.checkList')
                // .populate('workList.zone.estimate')
                .limit(padding.limit)
                .skip(padding.skips);

            // console.log(resData.data);
            // let tmpResWorkListData = [];
            // for (const iterator of resData.data) {
            //     // console.log(iterator)
            //     let tmpWorkListData = await this.findWorkListByUserId(iterator.id);
            //     console.log('tmpWorkListData', tmpWorkListData);
            //     if (tmpWorkListData) {
            //         tmpResWorkListData.push(tmpWorkListData);
            //     }
            // }
            // resData.data = tmpResWorkListData;
            // console.log('resData.data : ', resData.data);
            resData.itemsPerPage = resData.data.length;

            // user ─────────────────────────────────────────────────────────────────────────────────

            // return new UserPaginationResDTO(
            //     ResStatus.success,
            //     '',
            //     resData.data,
            //     resData.totalItems,
            //     resData.itemsPerPage,
            //     resData.totalPages,
            //     resData.currentPage,
            // );

            // return resData.data;
            return new WorkListPaginationResDTO(
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
}
