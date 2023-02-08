import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';
import { GlobalResDTO } from '../global-dto/global-res.dto';
import { ConfigService } from './../../config/config.service';
import { UserDB, UserDBRole } from './../../entities/user.entity';
import { EncryptionService } from './../../services/encryption.service';
import { LogService } from './../../services/log.service';
import { PaginationService } from './../../services/pagination.service';
import { ResStatus } from './../../share/enum/res-status.enum';
import { JwtPayload } from './auth/jwt-payload.model';
import { CreateUserDto } from './dto/createUser.dto';
import { CreateWorkListReqDTO, CreateWorkListResDTO } from './dto/createWorkList';
import { FindOneWorkListDTO } from './dto/find-one-work-list.dto';
import { FindAllUserResDTO } from './dto/findAll-user.dto';
import { FindOneUserDTO } from './dto/findOne-user.dto';
import { LoginUserResDTO } from './dto/login-user.dto';
import { LoginDTO } from './dto/login.dto';
import { ResDeleteWorkListDto } from './dto/res-delete-worklist.dto';
import { ResUpdateWorkListDTOList } from './dto/res-updateWorkList.dto';
import { UpdateWorkListReqDTO } from './dto/update-work-list.dto';
import { UpdateUserReqDto, UpdateUserResDTO } from './dto/updateUser.dto';
import { UserRepository } from './user.repository';
moment.tz.setDefault('Asia/Bangkok');

@Injectable()
export class UserService {
    private logger = new LogService(UserService.name);

    constructor(
        private readonly userRepository: UserRepository,
        private encryptionService: EncryptionService,
        private configService: ConfigService,
        private paginationService: PaginationService,
    ) { }

    // [resData]────────────────────────────────────────────────────────────────────────────────

    private resUser(user: UserDB) {
        const tag = this.resUser.name;
        try {
            return {
                id: user._id,
                username: user.username,
                password: user.password,
                prefix: user.prefix,
                nickname: user.nickname,
                firstName: user.firstName,
                lastName: user.lastName,
                position: user.position,
                phoneNumber: user.phoneNumber,
                // imageUser: user.imageUser,
                gender: user.gender,
                role: user.role,
                createdAt: moment(user.createdAt).format('YYYY-MM-DD HH:mm:ss'),
            };
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ────────────────────────────────────────────────────────────────────────────────

    async createUser(createUserDto: CreateUserDto) {
        const tag = this.createUser.name;
        try {
            const resultUser = await this.userRepository.createUser(createUserDto);
            return new FindOneUserDTO(ResStatus.success, '♥ สร้างข้อมูลผู้ใช้งานสำเร็จ ♥', resultUser);
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ────────────────────────────────────────────────────────────────────────────────

    async getUserById(id: string) {
        const tag = this.getUserById.name;
        try {
            const resultUser = await this.userRepository.getUserById(id);
            return new FindOneUserDTO(ResStatus.success, 'สำเร็จ', resultUser);
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAllUser() {
        const tag = this.findAllUser.name;
        try {
            const resultUser = await this.userRepository.findAllUser();
            return new FindAllUserResDTO(ResStatus.success, '', resultUser);
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ────────────────────────────────────────────────────────────────────────────────

    async login(body: LoginDTO) {
        const tag = this.login.name;
        try {
            const userLogin = await this.userRepository.getLogin(body.username, body.password);
            if (!userLogin) {
                throw new Error('user or pass incorrect');
            }
            this.logger.debug(`${tag} -> `, userLogin);
            const signLogin = await this.signToken(userLogin);
            return new LoginUserResDTO(
                ResStatus.success,
                '♥ ลงชื่อเข้าใช้งานสำเร็จ ♥',
                userLogin,
                signLogin.accessToken,
                signLogin.refreshToken,
                signLogin.expireDate,
            );
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // async update(id: string, body: CreateUserDto){
    //     const tag = this.update.name;
    //     try {
    //         const resultUpdate = await this.userRepository.updateUser(id,body);
    //         return resultUpdate;
    //     } catch (error) {
    //         this.logger.error(`${tag} -> `, error);
    //         throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    // ────────────────────────────────────────────────────────────────────────────────


    async deleteUserByUserId(userId: string, user: UserDB) {
        const tag = this.deleteUserByUserId.name;
        try {
            // const deleteUser = await this.userRepository.deleteUserByUserId(userId, user);
            await this.userRepository.deleteUserByUserId(userId, user);
            return new GlobalResDTO(ResStatus.success, 'ลบข้อมูลสำเร็จ');
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(_id: string, body: UpdateUserReqDto) {
        const tag = this.update.name;
        try {
            const resultUpdate: any = await this.userRepository.updateUser(_id, body);
            return new UpdateUserResDTO(ResStatus.success, '', resultUpdate);
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ────────────────────────────────────────────────────────────────────────────────

    private async signToken(user: UserDB, expires?: string) {
        const _jit = uuidv4();
        const enDeCodeId = this.encryptionService.encode(user.id.toString());
        const enDeCodeJit = this.encryptionService.encode(_jit);
        const enDeCodeRole = this.encryptionService.encode(user.role);
        const payload: JwtPayload = {
            id: enDeCodeId,
            role: enDeCodeRole,
            jit: enDeCodeJit,
        };
        const _expires = expires || '1y';
        const _expire = moment().add(1, 'y').toDate();

        return {
            accessToken: sign(payload, this.configService.getJWTKey(), { expiresIn: _expires }),
            refreshToken: sign(payload, this.configService.getJWTKey(), { expiresIn: _expires }),
            jit: _jit,
            expireDate: _expire,
        };
    }

    // ─────────────────────────────────────────────────────────────────────────────

    // async findWorkListById(user: UserDB, _userId: string, workListId: string): Promise<FindOneWorkListDTO> {
    async findWorkListById(user: UserDB, _userId: string, workListId: string) {
        const tag = this.findWorkListById.name;
        try {
            let userId: string = null;

            if (user.role === UserDBRole.Admin) {
                userId = _userId;
            } else {
                userId = user.id;
            }

            const resultWorkList = await this.userRepository.findWorkListByUserId(userId);
            // if (resultWorkList.workList.length > 0) {
            //     return new FindOneWorkListDTO(ResStatus.success, '', resultWorkList);
            // }
            // return new FindOneWorkListDTO(ResStatus.fail, 'ไม่พบข้อมูล', resultWorkList);

            return resultWorkList;
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // ─────────────────────────────────────────────────────────────────────────────

    // async findAllWorkList(userId: string): Promise<FindOneWorkListDTO> {
    async findAllWorkListByUserId(userId: string) {
        const tag = this.findAllWorkListByUserId.name;
        try {
            const resultWorkListByUserId = await this.userRepository.findWorkListByUserId(userId);
            return new FindOneWorkListDTO(ResStatus.success, '', resultWorkListByUserId);
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // async findIsInWorkListZone(userId: string, zoneId: string) {
    //     const tag = this.findIsInWorkListZone.name;
    //     try {
    //         const resultIsIn = await this.userRepository.findIsInWorkListZone(userId, zoneId);
    //         return resultIsIn;
    //     } catch (error) {
    //         this.logger.error(`${tag} -> `, error);
    //         throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    // ─────────────────────────────────────────────────────────────────────────────

    // async createWorkList(user: UserDB, body: CreateWorkListReqDTO): Promise<CreateWorkListResDTO> {
    //     const tag = this.createWorkList.name;
    //     try {
    //         let userId: string = null;

    //         if (user.role === UserDBRole.Admin) {
    //             userId = body.userId;
    //         } else {
    //             userId = user._id;
    //         }
    //         const resultWorkList: any = await this.userRepository.addWorkList(userId, body);

    //         if (!!resultWorkList && resultWorkList.workList.length > 0) {
    //             return new CreateWorkListResDTO(ResStatus.success, '', resultWorkList);
    //         }
    //         return new CreateWorkListResDTO(ResStatus.fail, 'ไม่พบข้อมูล', resultWorkList);
    //     } catch (error) {
    //         this.logger.error(`${tag} -> `, error);
    //         throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }
    // ─────────────────────────────────────────────────────────────────────────────

    async updateWork(user: UserDB, userIdParam: string, body: UpdateWorkListReqDTO): Promise<FindOneWorkListDTO> {
        const tag = this.updateWork.name;
        try {
            let userId: string = null;

            if (user.role === UserDBRole.Admin) {
                userId = userIdParam;
            } else {
                const isFind = await this.isUserAndWorkList(user.id, body.workListId);
                if (!isFind) {
                    throw new Error('no authorized.');
                }
                userId = userIdParam;
            }
            const result = await this.userRepository.updateWorkList(userId, body);

            if (result) {
                return new ResUpdateWorkListDTOList(ResStatus.success, 'อัพเดทงานสำเร็จ', result);
            } else {
                return new ResUpdateWorkListDTOList(ResStatus.success, 'อัพเดทไม่สำเร็จโปรดลองใหม่อีกครั้งในภายหลัง !', result);
            }

            // return result;
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────

    async deleteWorkList(user: UserDB, userId: string, workListId: string): Promise<ResDeleteWorkListDto> {
        const tag = this.deleteWorkList.name;

        try {
            let _userId: string = null;

            if (user.role === UserDBRole.Admin) {
                _userId = userId;
            } else {
                const isFind = await this.isUserAndWorkList(user.id, workListId);
                if (!isFind) {
                    throw new Error('no authorized.');
                }
                _userId = user.id;
            }
            const result = await this.userRepository.deleteWorkList(_userId, workListId);

            if (result >= 1) {
                return new ResDeleteWorkListDto(ResStatus.success, 'ลบข้อมูลสำเร็จ', null);
            } else {
                return new ResDeleteWorkListDto(ResStatus.success, 'เกิดข้อผิดพลาดโปรดลองใหม่อีกครั้งในภายหลัง', null);
            }
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // เช็คว่า user คนนี้จริงไหมที่จะทำอะไรก็ตามแต่กับ worklist

    async isUserAndWorkList(_userId: string, workListId: string) {
        console.log('id after login : ', _userId);
        const tag = this.isUserAndWorkList.name;
        try {
            const result = this.userRepository.isUserAndWorkList(_userId, workListId);
            return result;
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    async findOne(id: string) {
        const tag = this.findOne.name;
        try {
            const findOne = await this.userRepository.findOneUser(id);
            return new FindOneUserDTO(ResStatus.success, '', findOne);
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
