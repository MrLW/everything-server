import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, Query, Req, UseGuards, Request as NestRequest} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Ret } from 'src/common/ret';
import { AuthGuard } from './auth.guard';
import { SkipAuth } from './metadata';
import { extractTokenFromHeader } from 'src/utils';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Post("logout")
  async logout(@Req() req){
    const token = extractTokenFromHeader(req);
    await this.userService.logout(req)
    return Ret.ok();
  }

  @Get("token/:openid")
  async token(@Param('openid') openid: string){
    const res = await this.userService.token(openid);
    return Ret.ok(res);
  }

  @Post('regist')
  async create(@Body() createUserDto: CreateUserDto) {
    const res = await this.userService.create(createUserDto);
    return Ret.ok(res);
  }

  @Post('loginByWx')
  @SkipAuth()
  async loginByWx(@Body('openid') openid: string) {
    const res = await this.userService.loginByWx(openid);
    return Ret.ok(res);
  }

  @Get('/info')
  @UseGuards(AuthGuard)
  async info(@NestRequest() req) {
    return Ret.ok(req.user);
  }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.userService.findOne(+id);
  }

  @Patch(':openid')
  async  update(@Param('openid') openid: string, @Body() updateUserDto: UpdateUserDto) {
    const res = await  this.userService.update(openid, updateUserDto);
    return Ret.ok(res);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
