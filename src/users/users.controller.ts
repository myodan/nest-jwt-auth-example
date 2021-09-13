import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from "@nestjs/common";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { Auth } from "src/auth/decorators/auth.decorator";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@Auth(["ADMIN"])
	findAll(): Promise<User[]> {
		return this.usersService.findAll();
	}

	@Get("me")
	@Auth(["ANY"])
	me(@CurrentUser() user: User): User {
		return user;
	}

	@Get(":id")
	@Auth(["ADMIN"])
	findOne(@Param("id") id: string): Promise<User> {
		return this.usersService.findOneById(id);
	}

	@Post()
	create(@Body() createUserDto: CreateUserDto): Promise<void> {
		return this.usersService.create(createUserDto);
	}

	@Patch(":id")
	@Auth(["ADMIN"])
	update(
		@Param("id") id: string,
		@Body() updateUserDto: UpdateUserDto,
	): Promise<void> {
		return this.usersService.update(id, updateUserDto);
	}

	@Delete(":id")
	@Auth(["ADMIN"])
	remove(@Param("id") id: string): Promise<void> {
		return this.usersService.remove(id);
	}
}
