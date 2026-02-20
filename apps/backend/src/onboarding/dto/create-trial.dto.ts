import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTrialDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    companyName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    slug: string;
}
