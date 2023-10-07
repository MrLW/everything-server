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
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
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
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':openid')
  update(@Param('openid') openid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(openid, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
