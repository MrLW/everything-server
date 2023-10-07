import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";
import { jwtConstants, redisConstants } from "src/common/constants";
import { IS_PUBLIC_KEY } from "./metadata";
import { RedisService } from "src/redis/redis.service";
import { extractTokenFromHeader } from "src/utils";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private jwtService: JwtService, private reflector: Reflector, private redisService: RedisService){}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if(isPublic) return true;
        const request = context.switchToHttp().getRequest();
        const token = extractTokenFromHeader(request);
        if(!token) {
            throw new UnauthorizedException();
        }
        // 有可能手动退出登录
        const exist = await this.redisService.getValue(redisConstants.tokenKeyPrefix + token);
        if(!exist) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: jwtConstants.secret
                }
            );
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }


}