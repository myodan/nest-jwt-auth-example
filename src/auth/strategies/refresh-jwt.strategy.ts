import type { Request } from "express";
import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { Payload } from "../interfaces/payload.interface";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
	Strategy,
	"jwt-refresh",
) {
	constructor(
		private readonly configService: ConfigService,
		private readonly usersService: UsersService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => req.cookies.refreshToken,
			]),
			secretOrKey: configService.get<string>("SECRET_KEY"),
		});
	}

	async validate(payload: Payload): Promise<User> {
		const user = await this.usersService.findOneWithTokenId(payload.aud);
		if (user.tokenId !== payload.jti) {
			throw new UnauthorizedException("The refresh token is invalid.");
		}
		const now = new Date().getTime();
		const diff = payload.exp * 1000 - now;
		if (!(diff < 1000 * 60 * 60 * 24 * 15)) {
			throw new BadRequestException(
				"There is still a lot of validity left for Refresh Tokens!",
			);
		}
		delete user.tokenId;
		return user;
	}
}
