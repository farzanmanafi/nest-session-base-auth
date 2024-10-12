import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  // Instantiate a logger with a context (UserService)
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(
      `Creating a new user with username: ${createUserDto.username}`,
    );
    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);
    this.logger.log(`User created successfully with ID: ${savedUser.id}`);
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    this.logger.log('Retrieving all users from the database');
    const users = await this.userRepository.find();
    this.logger.log(`Found ${users.length} user(s)`);
    return users;
  }

  async findOne(id: number): Promise<User> {
    this.logger.log(`Looking for user with ID: ${id}`);
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.logger.log(`User with ID ${id} found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.log(`Updating user with ID: ${id}`);
    const user = await this.findOne(id);
    if (!user) {
      this.logger.warn(`User with ID ${id} not found for update`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    this.logger.log(`User with ID ${id} updated successfully`);
    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Removing user with ID: ${id}`);
    const user = await this.findOne(id);
    if (!user) {
      this.logger.warn(`User with ID ${id} not found for deletion`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.delete(id);
    this.logger.log(`User with ID ${id} deleted successfully`);
  }
}
