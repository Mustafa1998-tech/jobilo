import { IsOptional, IsString, IsInt, IsEnum, IsArray, IsBoolean, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class QueryProjectsDto {
  @IsOptional() @IsInt() @Min(1) @Type(() => Number)
  page?: number;

  @IsOptional() @IsInt() @Min(1) @Type(() => Number)
  pageSize?: number;

  @IsOptional() @IsString()
  sortBy?: string;

  @IsOptional() @IsString()
  sortOrder?: 'asc' | 'desc';

  @IsOptional() @IsString()
  search?: string;

  @IsOptional() @IsString()
  categoryId?: string;

  @IsOptional() @IsArray() @IsString({ each: true })
  skillIds?: string[];

  @IsOptional() @IsString()
  status?: string;

  @IsOptional() @IsString()
  projectType?: 'FIXED' | 'HOURLY';

  @IsOptional() @IsInt() @Type(() => Number)
  budgetMin?: number;

  @IsOptional() @IsInt() @Type(() => Number)
  budgetMax?: number;

  @IsOptional() @IsInt() @Type(() => Number)
  durationMin?: number;

  @IsOptional() @IsInt() @Type(() => Number)
  durationMax?: number;

  @IsOptional() @IsString()
  experienceLevel?: string;

  @IsOptional() @IsString()
  location?: string;

  @IsOptional() @IsBoolean() @Transform(({ value }) => value === 'true')
  isUrgent?: boolean;
}
