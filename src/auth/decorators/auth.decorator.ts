import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { UserRole } from "src/users/entities/user.entity";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";

export type AllowedRoles = keyof typeof UserRole | "ANY";

export function Auth(roles: AllowedRoles[]): any {
	return applyDecorators(
		SetMetadata("roles", roles),
		UseGuards(JwtAuthGuard, RolesGuard),
	);
}
