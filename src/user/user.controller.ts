import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Session,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiCreateUser } from './decorators/api-create-user.decorator';
import { ApiFindAllUsers } from './decorators/api-find-all-users.decorator';
import { ApiFindUserById } from './decorators/api-find-user-by-id.decorator';
import { ApiUpdateUser } from './decorators/api-update-user.decorator';
import { ApiDeleteUser } from './decorators/api-delete-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from './enum/user-role.enum';
@ApiTags('users')
@Controller('user')
@UseGuards(AuthGuard) // Protect all routes in UserController with session-based auth guard
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreateUser()
  @Roles(UserRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiFindAllUsers()
  @Roles(UserRole.ADMIN, UserRole.USER)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiFindUserById()
  @Roles(UserRole.ADMIN, UserRole.USER)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Post(':id')
  @ApiUpdateUser()
  @Roles(UserRole.ADMIN, UserRole.USER)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiDeleteUser()
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
