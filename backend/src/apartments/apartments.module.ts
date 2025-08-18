import { Module } from "@nestjs/common";
import { ApartmentService } from './apartments.service';
import { ApartmentController } from "./apartments.controller";
import { PrismaModule } from "src/prisma/prisma.modul";

@Module({
    imports: [PrismaModule],
    controllers: [ApartmentController],
    providers: [ApartmentService],
    exports: [ApartmentService],
})
export class ApartmentModule {}