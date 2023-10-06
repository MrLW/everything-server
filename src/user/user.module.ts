import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';


@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtService, RedisService],
})
export class UserModule {}
