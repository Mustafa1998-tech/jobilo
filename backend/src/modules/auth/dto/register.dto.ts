import { IsEmail, IsString, MinLength, IsBoolean, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  confirmPassword: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty({ enum: ['FREELANCER', 'CLIENT'] })
  @IsIn(['FREELANCER', 'CLIENT'])
  role: 'FREELANCER' | 'CLIENT';

  @ApiProperty()
  @IsBoolean()
  agreeToTerms: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  locale?: string;
}
