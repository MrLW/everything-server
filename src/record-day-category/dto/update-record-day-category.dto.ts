import { PartialType } from '@nestjs/mapped-types';
import { CreateRecordDayCategoryDto } from './create-record-day-category.dto';

export class UpdateRecordDayCategoryDto extends PartialType(CreateRecordDayCategoryDto) {}
