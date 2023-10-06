import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
// import { AuthMiddleWare } from './middleware/auth';
@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
  }),
  EventsModule, RecordDayCategoryModule, RecordDayLoveMomentModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    RecordDayLoveCommentModule,
    WeixinModule,
    UserModule,
    RedisModule,
    JwtModule.register({ secret: 'everything' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}; 

/** implements NestModule{

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleWare).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    })
  }
  
} */ 
