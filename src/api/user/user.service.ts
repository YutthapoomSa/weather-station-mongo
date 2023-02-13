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
import { FindAllUserResDTO } from './dto/findAll-user.dto';
import { FindOneUserDTO } from './dto/findOne-user.dto';
import { LoginUserResDTO } from './dto/login-user.dto';
import { LoginDTO } from './dto/login.dto';
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
