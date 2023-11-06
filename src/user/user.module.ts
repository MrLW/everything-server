import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { SocketGateway } from 'src/socket/socket.gateway';
import { RecordDayLoveMomentService } from 'src/record-day-love-moment/record-day-love-moment.service';


@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtService, RedisService, SocketGateway, RecordDayLoveMomentService],
})
export class UserModule {}
