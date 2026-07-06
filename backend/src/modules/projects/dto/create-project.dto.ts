import { IsString, IsNumber, IsIn, IsOptional, IsArray, IsBoolean, Min, MinLength, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class SkillDto {
  @ApiProperty()
  @IsUUID()
  skillId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  level?: string;
}

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  fileSize?: number;
}

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  title: string;

  @ApiProperty()
  @IsString()
  @MinLength(50)
  description: string;

  @ApiProperty()
  @IsUUID()
  categoryId: string;

  @ApiProperty({ enum: ['FIXED', 'HOURLY'] })
  @IsIn(['FIXED', 'HOURLY'])
  projectType: 'FIXED' | 'HOURLY';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  budgetMin?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  budgetMax?: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  durationDays: number;

  @ApiProperty({ enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'], required: false })
  @IsOptional()
  @IsIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'])
  experienceLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

  @ApiProperty({ type: [SkillDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillDto)
  skills: SkillDto[];

  @ApiProperty({ type: [AttachmentDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;
}
