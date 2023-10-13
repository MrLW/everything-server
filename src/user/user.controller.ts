import { Controller, Get, Post, Body, Patch, Param, Delete,  Req, UseGuards, Request as NestRequest, GoneException} from '@nestjs/common';
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

  @Post('/marry/apply')
  async marryApply( @Req() req, @Body("receEid") receEid: string ){
    const res = await this.userService.marryApply(req.user.id, receEid);
    return Ret.ok(res)
  }

  @Get('/marry/info')
  async marryInfo( @Req() req ){
    const res = await this.userService.marryInfo(req.user.id);
    return Ret.ok(res)
  }

  @Post('/updateSex')
  async updateSex(@Body("sex") sex: number, @Req() req ){
    const success = await this.userService.updateSex(req.user.id , sex);
    return success ? Ret.ok(): Ret.fail("该EID已存在");
  }

  @Post('/updateEid')
  async updateEid(@Body("eid") eid: string, @Req() req ){
    const success = await this.userService.updateEid(req.user.id , eid);
    return success ? Ret.ok(): Ret.fail("该EID已存在");
  }

  @Post('/updateUsername')
  async updateUsername(@Body("username") username: string, @Req() req ){
    await this.userService.updateUsername(req.user.id , username);
    return Ret.ok()
  }

  @Post('/updateDesc')
  async updateDesc(@Body("desc") desc: string, @Req() req ){
    await this.userService.updateDesc(req.user.id , desc);
    return Ret.ok()
  }

  @Post('/updateAvatarUrl')
  async updateAvatarUrl(@Body("avatar") avatar: string, @Req() req ){
    const res = await this.userService.updateAvatarUrl(req.user.id , avatar);
    return Ret.ok(res)
  }

  @Post('/updateArea')
  async updateArea(@Body("codes") codes: string[], @Req() req ){
    await this.userService.updateArea(req.user.id , codes);
    return Ret.ok()
  }


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
    const info = await this.userService.info(req.user.id);
    return Ret.ok(info);
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
