import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	async create(createUserDto: CreateUserDto): Promise<void> {
		const { email } = createUserDto;
		const found = await this.usersRepository.findOne({ email });
		if (found) {
			throw new BadRequestException(`Cannot sign up with email '${email}'`);
		}
		await this.usersRepository.save(this.usersRepository.create(createUserDto));
	}

	async findAll(): Promise<User[]> {
		return await this.usersRepository.find();
	}

	async findOneById(id: string): Promise<User> {
		const found = await this.usersRepository.findOne({ id });
		if (!found) {
			throw new NotFoundException(`User with id '${id}' does not exist`);
		}
		return found;
	}

	async findOneByEmailWithPassword(email: string): Promise<User> {
		const found = await this.usersRepository.findOne(
			{ email },
			{ select: ["id", "email", "password", "role", "verified"] },
		);
		if (!found) {
			throw new NotFoundException(`User with email '${email}' does not exist`);
		}
		return found;
	}

	async findOneWithTokenId(id: string): Promise<User> {
		const found = await this.usersRepository.findOne(
			{ id },
			{ select: ["id", "email", "role", "verified", "tokenId"] },
		);
		if (!found) {
			throw new NotFoundException(`User with id '${id}' does not exist`);
		}
		return found;
	}

	async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
		const found = await this.usersRepository.findOne({ id });
		if (!found) {
			throw new NotFoundException(`User with id '${id}' does not exist`);
		}
		await this.usersRepository.save(
			this.usersRepository.create({ id, ...updateUserDto }),
		);
	}

	async remove(id: string): Promise<void> {
		const found = await this.usersRepository.findOne({ id });
		if (!found) {
			throw new NotFoundException(`User with id '${id}' does not exist`);
		}
		await this.usersRepository.delete({ id });
	}
}
