import { Request } from "express";
/**
 * 根据http 请求解析token
 * @param request http 请求
 * @returns 
 */
export function extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
}