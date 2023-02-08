import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import moment from 'moment-timezone';
import { diskStorage } from 'multer';
import path from 'path';
import { UserDB } from './../../entities/user.entity';
import { User } from './../../share/decorator/user.decorator';
import { editFileName, imageFileFilter } from './../../share/utils/file-upload.utils';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginDTO } from './dto/login.dto';
import { UserPaginationDTO, UserPaginationResDTO } from './dto/pagination-user.dto';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

import { LogService } from './../../services/log.service';
import { CreateUserImage } from './dto/create-user-image.dto';
import { LoginUserResDTO } from './dto/login-user.dto';
import { UpdateUserReqDto } from './dto/updateUser.dto';
moment.tz.setDefault('Asia/Bangkok');

@ApiTags('user')
@Controller('user')
export class UserController {
    private logger = new LogService(UserController.name);
    constructor(private userService: UserService, private userRepository: UserRepository) {}

    // ────────────────────────────────────────────────────────────────────────────────

    // @Post('createUser')
    // @ApiOkResponse({ type: CreateUserDto })
    // async createUser(@Body() createUserDto: CreateUserDto) {
    //     return await this.userService.createUser(createUserDto);
    // }

    // @Post('/login')
    // @ApiOkResponse({ type: LoginUserResDTO })
    // async login(@Body() body: LoginDTO) {
    //     return await this.userService.login(body);
    // }

    // @Get('/getUserById/:id')
    // // @ApiBearerAuth()
    // // @UseGuards(AuthGuard('jwt'))
    // async getCompanyById(@Param('id') id: string) {
    //     return await this.userService.getUserById(`${id}`);
    // }

    // @Get('/findAllUser')
    // async findAllUser() {
    //     return await this.userService.findAllUser();
    // }

    // // ─────────────────────────────────────────────────────────────────────────────
    // @Post('/infoMe')
    // @ApiBearerAuth()
    // @UseGuards(AuthGuard('jwt'))
    // async infoMe(@User() user: UserDB) {
    //     return await this.userService.getUserById(user.id);
    // }

    // @Post('paginationUser')
    // // @ApiBearerAuth()
    // // @UseGuards(AuthGuard('jwt'))
    // @ApiOkResponse({ type: UserPaginationResDTO })
    // @ApiOperation({ summary: 'pagination user' })
    // async paginationDocument(@Body() paginationDTO: UserPaginationDTO) {
    //     return await this.userRepository.userPagination(paginationDTO);
    // }

    // @Patch('update/:userId')
    // @ApiBearerAuth()
    // @UseGuards(AuthGuard('jwt'))
    // async updateUser(@Param('userId') userId: string, @User() user: UserDB, @Body() updateUserDto: UpdateUserReqDto) {
    //     return await this.userService.update(user.id, updateUserDto);
    // }

    // @Delete('deleteUserById/:userId')
    // @ApiBearerAuth()
    // @UseGuards(AuthGuard('jwt'))
    // async deleteUserByUserId(@Param('userId') userId: string, @User() user: UserDB) {
    //     return await this.userService.deleteUserByUserId(userId, user);
    // }

    // @Post('uploads-image/users')
    // @ApiConsumes('multipart/form-data')
    // @ApiOperation({ summary: 'เพิ่มรูปภาพของผู้ใช้งาน' })
    // @UseInterceptors(
    //     FilesInterceptor('imageUser', 1, {
    //         limits: {
    //             fileSize: 5 * 1024 * 1024,
    //         },
    //         storage: diskStorage({
    //             destination: `${path.resolve(__dirname, '..', '..', '..', 'upload', 'profile')}`,
    //             filename: editFileName,
    //         }),
    //         fileFilter: imageFileFilter,
    //     }),
    // )
    // @ApiBearerAuth()
    // @UseGuards(AuthGuard('jwt'))
    // async uploadUserImage(@UploadedFiles() imageUser: Express.Multer.File[], @Body() body: CreateUserImage, @User() user: UserDB) {
    //     this.logger.debug('user -> ', user);
    //     return await this.userRepository.uploadUserImage(imageUser, user.id, body);
    // }
}
