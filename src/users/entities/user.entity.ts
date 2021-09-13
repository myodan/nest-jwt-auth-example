import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
import {
	IsBoolean,
	IsEmail,
	IsEnum,
	IsString,
	IsUUID,
	Matches,
} from "class-validator";
import { Base } from "src/common/entities/base.entity";
import * as bcrypt from "bcrypt";

export enum UserRole {
	USER = "user",
	ADMIN = "admin",
}

@Entity()
export class User extends Base {
	@IsEmail()
	@Column({ unique: true })
	email: string;

	@Matches(
		/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,128}$/,
	)
	@Column({ select: false })
	password: string;

	@IsEnum(UserRole)
	@Column({ type: "enum", enum: UserRole, default: UserRole.USER })
	role: UserRole;

	@IsString()
	@Column({ name: "profile_image", nullable: true })
	profileImage: string;

	@IsBoolean()
	@Column({ default: false })
	verified: boolean;

	@IsUUID()
	@Column({ name: "token_id", type: "uuid", select: false, nullable: true })
	tokenId!: string;

	@BeforeInsert()
	@BeforeUpdate()
	async preDataProcess(): Promise<void> {
		if (this.email) {
			this.email = this.email.toLowerCase();
		}
		if (this.password) {
			this.password = await bcrypt.hash(this.password, 10);
		}
	}

	async checkPassword(password: string): Promise<boolean> {
		return await bcrypt.compare(password, this.password);
	}
}
