import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApartMentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { apartmentMessages, makePagingResult } from './apartments.utils';
import { contains } from 'class-validator';
import { Prisma } from 'generated/prisma';
import { mainModule } from 'process';

@Injectable()
export class ApartmentService{
    constructor(private prisma: PrismaService) {}

    async create(ownerId: number, data: CreateApartMentDto, imageUrl?: string) {
        const apt = await this.prisma.apartments.create({
            data: { ...data, user_id: ownerId, image_url: imageUrl ?? null },
        });

        return { message: apartmentMessages.SUCCESS.CREATED, apartment: apt};
    }

    async findAll(ownerId: number, page: number, limit: number, name?: string, address?: string) {
        const where: any = { user_id: ownerId};

        if (name) {
            where.name = { contains: name, mode: 'insensitive' };
        }

        if (address) {
            where.address = { contains: address, mode:'insensitive'};
        }

        const [items, total] = await this.prisma.$transaction([
            this.prisma.apartments.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.apartments.count({ where }),
        ]);

        return {
            data: items,
            total,
            page, 
            limit
        }
    }    

    async findOne(id: number, ownerId: number) {
        const apt = await this.prisma.apartments.findFirst({
            where: { id, user_id: ownerId },
            include: { owner: { select: { id: true, name: true, email: true } } },
        });
        if (!apt) throw new NotFoundException(apartmentMessages.ERROR.NOT_FOUND);
        return apt;
        }
    
    async update(id: number, ownerId: number, data: UpdateApartmentDto, imageUrl?: string) {
        const result = await this.prisma.apartments.updateMany({
            where: { id, user_id: ownerId },
            data: { ...data, ...(imageUrl ? { image_url: imageUrl } : {}) },
        });
        if (result.count === 0) 
            throw new NotFoundException(apartmentMessages.ERROR.UPDATE_FAILED);
        
        return { message: apartmentMessages.SUCCESS.UPDATED};
    }
    
    async remove(id: number, ownerId: number) {
        const result = await this.prisma.apartments.deleteMany({
            where: { id, user_id: ownerId },
        });

        if(result.count === 0) 
            throw new NotFoundException(apartmentMessages.ERROR.DELETE_FAILED);
        return { message: apartmentMessages.SUCCESS.DELETED};
    }
}