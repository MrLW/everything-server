export class CreateEventDto {
    type: 'love' | 'marry' | 'birthday' | 'menses';
    startTime: string;
    bf?: string;
    gf?: string;
    husband?: string;
    wife?: string;
}
