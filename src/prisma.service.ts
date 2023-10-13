
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super({
            log: [
                { level: 'query', emit: 'event' }, // 在控制台显示
                { level: 'info', emit: 'stdout' }, // 不在控制台显示
                // { level: 'info', emit: 'event' }, // 在控制台显示
                { level: 'warn', emit: 'event' }, // 在控制台显示
                { level: 'error', emit: 'event' },// 在控制台显示
            ]
        })
    }
    async onModuleInit() {
        await this.$connect()
    }
}