import { PartialType } from '@nestjs/mapped-types';
import { CreateRecordDayLoveCommentDto } from './create-record-day-love-comment.dto';

export class UpdateRecordDayLoveCommentDto extends PartialType(CreateRecordDayLoveCommentDto) {}
