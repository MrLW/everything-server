import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, Req } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Ret } from 'src/common/ret';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @Post()
  create(@Body() createEventDto: CreateEventDto, @Req() req) {
    return this.eventsService.create(createEventDto, req.user.id);
  }

  @Get()
  async findAll(@Req() req) {
    const res = await this.eventsService.findAll(req.user.id);
    return Ret.ok(res);
  }

  @Get('menses')
  async findMenses(@Req() req) {
    const res = await this.eventsService.findMenses(req.user.id)
    return Ret.ok(res);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.eventsService.findOne(+id);
    return Ret.ok(res);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    const res =await  this.eventsService.update(+id, updateEventDto);
    return Ret.ok(res);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res = await this.eventsService.remove(+id);
    return Ret.ok(res)
  }

  
}
