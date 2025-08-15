import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { userMessages } from "./users.utils";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    // Create a new user
    async create(data: CreateUserDto) {
        const existingUser = await this.prisma.users.findUnique({ where: { email: data.email } });
        if (existingUser) {
            throw new ConflictException(userMessages.ERROR.ALREADY_EXISTS);
        }

        const user = await this.prisma.users.create({ data });
        return { message: userMessages.SUCCESS.CREATED}
    }

    async findAll() {
        const users = await this.prisma.users.findMany();
        return { message: userMessages.SUCCESS.FETCHED, data: users};
    }

    async findOne(id: number) {
        const user = await this.prisma.users.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException(userMessages.ERROR.NOT_FOUND);
        }

        return {data: user };
    }

    async update(id: number, data: UpdateUserDto) {
        const user = await this.prisma.users.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException(userMessages.ERROR.NOT_FOUND);
        }

        const updatedUser = await this.prisma.users.update({ where: { id }, data });
        
        return { message: userMessages.SUCCESS.UPDATED, data: updatedUser };
    }

    async remove(id: number) {
        const user = await this.prisma.users.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException(userMessages.ERROR.NOT_FOUND);
        }
        await this.prisma.users.delete({ where: { id } });
        return { message: userMessages.SUCCESS.DELETED };
    }

}