import { Logger } from "@nestjs/common";
import { NextFunction, Request } from "express";

export function auth(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if(!token){
        // 提示用户未登录
        
    }
    // 校验token
    next();
};