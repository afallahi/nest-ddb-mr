import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { AppService } from './app.service';
import User from './interface';

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
  async getUsers(): Promise<User[]> {
    return await this.appService.getUsers();
  }

  @Post()
  async createUser(@Body() user: User): Promise<User> {
    return await this.appService.createUser(user);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return await this.appService.getUserById(id);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<any> {
    return await this.appService.deleteUser(id);
  }
}
