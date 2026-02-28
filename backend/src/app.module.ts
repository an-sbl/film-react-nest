import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { RepositoryModule } from './repository/repository.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ...(process.env.DATABASE_DRIVER === 'mongodb'
      ? [
          MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
              uri: configService.get<string>('DATABASE_URL'),
            }),
            inject: [ConfigService],
          }),
        ]
      : [
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
              type: 'postgres',
              host: configService.get('DATABASE_HOST', 'localhost'),
              port: configService.get('DATABASE_PORT', 5432),
              username: configService.get('DATABASE_USERNAME', 'postgres'),
              password: configService.get('DATABASE_PASSWORD', ''),
              database: configService.get('DATABASE_NAME', 'prac'),
              entities: [__dirname + '/**/*.entity{.ts,.js}'],
              synchronize: true,
              autoLoadEntities: true,
            }),
            inject: [ConfigService],
          }),
        ]),
    RepositoryModule,
    FilmsModule,
    OrderModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
  ],
  controllers: [],
  providers: [configProvider],
})
export class AppModule {}
