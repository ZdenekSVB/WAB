import { IsNotEmpty, Length, IsEmail, IsPhoneNumber } from 'class-validator';

export class CustomerUpdateDto {
    @IsNotEmpty()
    @Length(3, 50)
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsPhoneNumber(null) // You can use a specific region if needed, e.g., 'US'
    phone: string;
}
