import type { Response } from "express";
import { Controller, Post, Res, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { User } from "src/users/entities/user.entity";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { RefreshJwtAuthGuard } from "./guards/refresh-jwt-auth.guard";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post()
	@UseGuards(LocalAuthGuard)
	async generateUserTokens(
		@CurrentUser() user: User,
		@Res({ passthrough: true }) res: Response,
	): Promise<void> {
		const { accessToken, refreshToken } = await this.authService.generateTokens(
			user,
		);
		res.cookie("accessToken", accessToken, { httpOnly: true });
		res.cookie("refreshToken", refreshToken, { httpOnly: true });
	}

	@Post("refresh")
	@UseGuards(RefreshJwtAuthGuard)
	async refreshUserTokens(
		@CurrentUser() user: User,
		@Res({ passthrough: true }) res: Response,
	): Promise<void> {
		const { accessToken, refreshToken } = await this.authService.generateTokens(
			user,
		);
		res.cookie("accessToken", accessToken, { httpOnly: true });
		res.cookie("refreshToken", refreshToken, { httpOnly: true });
	}
}
