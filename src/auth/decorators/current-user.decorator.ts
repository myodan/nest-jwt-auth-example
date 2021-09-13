import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User as UserEntity } from "src/users/entities/user.entity";

export const CurrentUser = createParamDecorator(
	(_data: unknown, context: ExecutionContext): UserEntity | null => {
		const request = context.switchToHttp().getRequest();
		const { user } = request;

		if (!user) {
			return null;
		}

		return user;
	},
);
