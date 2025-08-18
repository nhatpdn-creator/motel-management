import {
     Controller, 
     Get, 
     Post, 
     Query,
     Patch,
     Param,
     Body,
     Delete,
     UploadedFile, 
     UseInterceptors,
     Headers,
     UploadedFiles,
     BadRequestException
} from "@nestjs/common";
import { ApartmentService } from "./apartments.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { extname, join } from "path";
import { CreateApartMentDto } from "./dto/create-apartment.dto";
import { UpdateApartmentDto } from "./dto/update-apartment.dto";
import { apartmentMessages, resolveOwnerId } from "./apartments.utils";

@Controller('apartments') 
export class ApartmentController {
    constructor(private readonly apartmentService: ApartmentService) {}

    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: (_req, _file, cb) =>
                    cb(null, join(process.cwd(), 'uploads', 'apartments')),
                filename: (_req, file, cb) => {
                    const name = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, `${name}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    create(
        @Headers() headers: Record<string, any>,
        @Body() dto: CreateApartMentDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        const ownerId = resolveOwnerId(headers);
        return this.apartmentService.create(ownerId, dto, file?.filename);
    }

    // Search apartments by name or address
    @Get('search')
    findAll(
        @Headers() headers: Record<string, any>,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('name') name?: string,
        @Query('address') address?: string,
    ) {
        if (!name && !address) {
            throw new BadRequestException(apartmentMessages.ERROR.MISSING_FILTER);
        }
        const ownerId = resolveOwnerId(headers);
        return this.apartmentService.findAll(ownerId, +page, +limit, name, address);
    }

    @Get(':id')
    findOne(@Headers() headers: Record<string, any>, @Param('id') id: string) {
        const ownerId = resolveOwnerId(headers);
        console.log('Headers:', headers);
        return this.apartmentService.findOne(+id, ownerId);
    }

    @Patch(':id') 
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: (_req, _file, cb) =>
                    cb(null, join(process.cwd(), 'uploads', 'apartments')),
                filename: (_req, file, cb) => {
                    const name = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, `${name}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    update(
        @Headers() headers: Record<string, any>,
        @Param('id') id: string,
        @Body() dto: UpdateApartmentDto,
        @UploadedFile() file?: Express.Multer.File, 
    ) {
        const ownerId = resolveOwnerId(headers);
        return this.apartmentService.update(+id, ownerId, dto, file?.filename);
    }

    @Delete(':id')
    remove(@Headers() headers: Record<string, any>, @Param('id') id: string) {
        const ownerId = resolveOwnerId(headers);
        return this.apartmentService.remove(+id, ownerId);
    }
}