import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Ret } from 'src/common/ret';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Post("logout")
  async logout(@Req() req: Request){
    const token = req.headers.authorization;
    await this.userService.logout(token);
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

  @Get(':openid')
  getUserByOpenId(@Param('openid') openid: string) {
    return this.userService.findByOpenId(openid);
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
