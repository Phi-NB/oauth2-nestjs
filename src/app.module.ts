import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { OauthModule } from './oauth/oauth.module';
import { OidcProviderModule } from './oidc/oidc-provider.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 3306),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      logging: process.env.NODE_ENV !== 'production',
    }),
    OauthModule,
    OidcProviderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
