import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.modul';
import { ApartmentModule } from './apartments/apartments.module';

@Module({
  imports: [UserModule, 
            PrismaModule, 
            ApartmentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
