import { Controller, Get, Post, Body, Patch, Param, Delete,  Req, UseGuards, Request as NestRequest, GoneException, Logger, Query} from '@nestjs/common';
import { Message, UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Ret } from 'src/common/ret';
import { AuthGuard } from './auth.guard';
import { SkipAuth } from './metadata';
import { extractTokenFromHeader } from 'src/utils';
import { UserChatItemList } from './dto/chat-list.dto';
import { RecordDayLoveMomentService } from 'src/record-day-love-moment/record-day-love-moment.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly momentService: RecordDayLoveMomentService) {}

  @Get('/contacts')
  async contacts(@Req() req){
    const res = await this.userService.contacts(req.user.id);
    return Ret.ok(res);
  }

  @Get('/lovemoment/friend')
  async friendLoveMoments(@Req() req, @Query('friendId') friendId: number){
    const res = await this.momentService.friendLoveMoments(req.user.id, ~~friendId)
    return Ret.ok(res);
  }
  
  @Get('/lovemoment/love')
  async loveLoveMoments(@Req() req, @Query() query){
    const res = await this.momentService.loveLoveMoments(req.user.id, 'love', query)
    return Ret.ok(res);
  }

  @Get('/lovemoment/star')
  async starLoveMoments(@Req() req, @Query() query){
    const res = await this.momentService.loveLoveMoments(req.user.id, 'star', query)
    return Ret.ok(res);
  }

  @Get('/lovemoment/public')
  async publicLoveMoments(@Req() req, @Query() query){
    const res = await this.momentService.loveMoments(req.user.id, true, query)
    return Ret.ok(res);
  }

  @Get('/lovemoment/private')
  async privateLoveMoments(@Req() req, @Query() query){
    const res = await this.momentService.loveMoments(req.user.id, false, query)
    return Ret.ok(res);
  }

  @Post('/checkSocket')
  async checkSocket(@Body("sid") sid: string ){
    const res = await this.userService.checkSocketValid(sid)
    return Ret.ok(res);
  }

  @Get('/friends')
  async friends(@Req() req){
    const res = await this.userService.friends(req.user.id)
    return Ret.ok(res);
  }

  @Get('/search')
  async search(@Req() req, @Query('keyword') keyword: string){
    const res = await this.userService.searchUsers(req.user.id,keyword)
    return Ret.ok(res);
  }

  @Post('/subscribe')
  async subscribe(@Req() req, @Body('friendId') friendId: number){
    const res = await this.userService.subscribe(req.user.id,friendId)
    return Ret.ok(res);
  }

  @Post('/email/verify')
  @SkipAuth()
  async verifyCode(@Body("email") email: string, @Body("code") code: string){
    const res = await this.userService.verifyCode(email,code);
    return Ret.ok(res);
  }

  @Post('/email/code')
  @SkipAuth()
  async sendEmailCode(@Body("email") email: string){
    const res = await this.userService.sendEmailCode(email);
    return Ret.ok(res);
  }

  @Post('/chat')
  async createChat(@Req() req, @Body() message: Message ){
    message.sendId = req.user.id;
    const res = await this.userService.sendMessage(message);
    return Ret.ok(res);
  }

  @Get('/chat')
  async chatList(@Req() req, @Query() userList: UserChatItemList){
    const res = await this.userService.chatList(req.user.id, userList);
    return Ret.ok(res);
  }

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

  @Post('/updateBirthday')
  async updateBirthday(@Body("birthday") birthday: string, @Req() req ){
    await this.userService.updateBirthday(req.user.id , birthday);
    return Ret.ok()
  }

  @Post('/updateSex')
  async updateSex(@Body("sex") sex: number, @Req() req ){
    const success = await this.userService.updateSex(req.user.id , sex);
    return success ? Ret.ok(): Ret.fail("该EID已存在");
  }

  @Post('/updateEid')
  async updateEid(@Body("eid") eid: string, @Req() req ){
    const success = await this.userService.updateEid(req.user.id , eid);
    return  Ret.ok();
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
