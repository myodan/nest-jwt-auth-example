import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import * as joi from "joi";

@Module({
	imports: [
		NestConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [".env"],
			validationSchema: joi.object({
				NODE_ENV: joi.string().valid("development", "production"),
				APP_NAME: joi.string(),
				APP_DOMAIN: joi.string(),
				APP_PORT: joi.number().default(4000),
				DB_HOST: joi.string().default("localhost"),
				DB_PORT: joi.number().default(5432),
				DB_USERNAME: joi.string().default("postgres"),
				DB_PASSWORD: joi.string().required(),
				DB_NAME: joi.string().required(),
				SECRET_KEY: joi.string().required(),
			}),
		}),
	],
})
export class ConfigModule {}
