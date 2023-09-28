import { Injectable, Logger } from '@nestjs/common';
import { JscodeToSessionDto } from './dto/jscode-to-session';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class WeixinService {
    constructor(private http: HttpService) { }

    /**
     * 根据微信code 获取openid
     * @param dto 
     */
    async jscode2session(dto: JscodeToSessionDto){
        const data = {
            appid: 'wx270b5422e3624c88',
            secret: '0d0f9b014d1552932c0b7c34ccca1520',
            js_code: dto.code,
        }
        const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${data.appid}&secret=${data.secret}&js_code=${data.js_code}&grant_type=authorization_code` ;
        const res = await this.http.request({
            url,
            method: 'GET',
        }).toPromise()
        Logger.log(res.data)
        return res.data;
    }
}
