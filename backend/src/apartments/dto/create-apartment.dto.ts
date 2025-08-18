import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateApartMentDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsOptional()
    @IsString()
    province_id?: string;

    @IsOptional()
    @IsString()
    district_id?: string;

    @IsOptional()
    @IsString()
    ward_id?: string;
}