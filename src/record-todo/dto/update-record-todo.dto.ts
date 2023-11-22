import { PartialType } from '@nestjs/mapped-types';
import { CreateRecordTodoDto } from './create-record-todo.dto';

export class UpdateRecordTodoDto extends PartialType(CreateRecordTodoDto) {
    done: boolean;
}
