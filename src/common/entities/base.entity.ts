import { IsDate, IsUUID } from "class-validator";
import {
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity()
export class Base {
	@IsUUID()
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@IsDate()
	@CreateDateColumn({ name: "created_at", select: false })
	createdAt: Date;

	@IsDate()
	@UpdateDateColumn({ name: "updated_at", select: false })
	updatedAt: Date;
}
