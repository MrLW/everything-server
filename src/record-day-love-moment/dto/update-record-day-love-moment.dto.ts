import { PartialType } from '@nestjs/mapped-types';
import { CreateRecordDayLoveMomentDto } from './create-record-day-love-moment.dto';

export class UpdateRecordDayLoveMomentDto extends PartialType(CreateRecordDayLoveMomentDto) {}
