import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
	constructor(private authService: AuthService) {
		super({
			usernameField: "email",
			passwordField: "password",
		});
	}

	async validate(email: string, password: string): Promise<User> {
		return await this.authService.validateUser(email, password);
	}
}
