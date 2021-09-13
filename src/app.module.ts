import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "./config.module";
import { DatabaseModule } from "./database.module";
import { AuthModule } from "./auth/auth.module";

@Module({
	imports: [ConfigModule, DatabaseModule, UsersModule, AuthModule],
})
export class AppModule {}
