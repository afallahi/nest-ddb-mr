import { Controller, Get, Post, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import User from '../interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getUsers(): Promise<User[]> {
      return await this.userService.getUsers();
    }
  
    @Post()
    async createUser(@Body() user: User): Promise<User> {
      return await this.userService.createUser(user);
    }
  
    @Get(':id')
    async getUserById(@Param('id') id: string): Promise<User> {
      const user = await this.userService.getUserById(id);
        if (!user) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
        return user;
    }
  
    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<any> {
      return await this.userService.deleteUser(id);
    }
  

}
