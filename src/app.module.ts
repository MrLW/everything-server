import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { RecordDayCategoryModule } from './record-day-category/record-day-category.module';
import { RecordDayLoveMomentModule } from './record-day-love-moment/record-day-love-moment.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path'
import { RecordDayLoveCommentModule } from './record-day-love-comment/record-day-love-comment.module';
import { WeixinModule } from './weixin/weixin.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from './redis/redis.module';
import { jwtConstants } from './common/constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './user/auth.guard';
import { AreaModule } from './area/area.module';
import { MessageModule } from './message/message.module';
import { SocketModule } from './socket/socket.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // 静态资源服务
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'public'), // TODO: __dirname 不正确
    }),
    JwtModule.register({ secret: jwtConstants.secret, global: true, signOptions: { expiresIn: jwtConstants.expiresIn } }),
    EventsModule, RecordDayCategoryModule, RecordDayLoveMomentModule,
    RecordDayLoveCommentModule,
    WeixinModule,
    UserModule,
    RedisModule,
    AreaModule,
    MessageModule,
    SocketModule
  ],
  controllers: [AppController],
  providers: [AppService, 
    // 注册全局守卫
    { provide: APP_GUARD,useClass: AuthGuard }
  ],
})
export class AppModule {}; 
