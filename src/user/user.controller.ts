import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
