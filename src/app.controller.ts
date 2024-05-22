import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreatUserDto } from './dto/crreateUser.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async createUser(@Body() body: CreatUserDto) {
    this.appService.createUser(body);
  }
}
