import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: "postgres",
				host: configService.get<string>("DB_HOST"),
				port: configService.get<number>("DB_PORT"),
				username: configService.get<string>("DB_USERNAME"),
				password: configService.get<string>("DB_PASSWORD"),
				database: configService.get<string>("DB_NAME"),
				logging: configService.get<string>("NODE_ENV") !== "production",
				entities: [`${__dirname}/!(common)/**/*.entity{.ts,.js}`],
				synchronize: configService.get<string>("NODE_ENV") !== "production",
			}),
			inject: [ConfigService],
		}),
	],
})
export class DatabaseModule {}
