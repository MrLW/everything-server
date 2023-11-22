export class ListRecordTodoDto {
    pageNum: number;
    pageSize: number;
    startDay: string;
    selectTag: 'all' | 'done' | 'no';
}
