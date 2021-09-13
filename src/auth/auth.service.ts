import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { v4 as uuidv4 } from "uuid";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { ConfigService } from "@nestjs/config";
import { UserTokens } from "src/auth/interfaces/user-token.interface";

@Injectable()
export class AuthService {
	constructor(
		private readonly configService: ConfigService,
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	async validateUser(email: string, password: string): Promise<User> {
		const user = await this.usersService.findOneByEmailWithPassword(email);
		if (!(await user.checkPassword(password))) {
			throw new UnauthorizedException("Invalid password");
		}
		delete user.password;
		return user;
	}

	async generateTokens(user: User): Promise<UserTokens> {
		const tokenId = uuidv4();
		const accessToken = await this.jwtService.signAsync(
			{},
			{
				audience: user.id,
				expiresIn: "1h",
				issuer: this.configService.get<string>("APP_DOMAIN"),
				subject: "access_token",
			},
		);
		const refreshToken = await this.jwtService.signAsync(
			{},
			{
				audience: user.id,
				expiresIn: "30d",
				issuer: this.configService.get<string>("APP_DOMAIN"),
				jwtid: tokenId,
				subject: "refresh_token",
			},
		);
		await this.usersService.update(user.id, { tokenId });
		return {
			accessToken,
			refreshToken,
		};
	}
}
