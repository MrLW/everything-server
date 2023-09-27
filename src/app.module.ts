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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
