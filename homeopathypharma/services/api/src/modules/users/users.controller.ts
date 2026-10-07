import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('admin')
  @Get('')
  listUsers() {
    return this.usersService.listUsers();
  }

  @Roles('admin')
  @Get(':id')
  getUser() {
    return this.usersService.getUser();
  }

  @Roles('admin')
  @Patch(':id')
  updateUser(@Body() body?: unknown) {
    return this.usersService.updateUser(body);
  }

  @Roles('admin')
  @Delete(':id')
  deleteUser(@Body() body?: unknown) {
    return this.usersService.deleteUser(body);
  }

}
