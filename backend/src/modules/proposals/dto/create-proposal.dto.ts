import { IsString, IsNumber, Min, IsOptional, IsArray, ValidateNested, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class AttachmentDto {
  @ApiProperty()
  @IsString()
  fileUrl: string;

  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsString()
  fileType: string;
}

export class CreateProposalDto {
  @ApiProperty()
  @IsString()
  @MinLength(20)
  coverLetter: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  bidAmount: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  durationDays: number;

  @ApiProperty({ type: [AttachmentDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}
