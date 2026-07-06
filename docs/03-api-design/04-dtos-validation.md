# Jobilo - DTOs & Validation Rules

---

## Validation Strategy

| Layer | Tool | Purpose |
|-------|------|---------|
| **Frontend** | Zod + React Hook Form | Client-side validation, instant feedback |
| **Backend API** | class-validator + class-transformer | Request body validation (Pipes) |
| **Database** | Prisma Schema + PostgreSQL constraints | Database-level integrity |
| **Business Logic** | Custom validators in Services | Domain rules |

### Validation Pipeline
```
Request → ValidationPipe (class-validator) → DTO → Service → Prisma → DB
                                        ↓
                              Return 400 + errors
```

---

## Shared DTOs

### PaginationQueryDto
```typescript
export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
```

### ApiResponseDto
```typescript
export class ApiResponseDto<T> {
  success: boolean;
  data?: T;
  error?: ApiErrorDto;
  message?: string;
  meta?: PaginationMetaDto;
}

export class PaginationMetaDto {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class ApiErrorDto {
  code: string;
  message: string;
  details?: ValidationErrorDto[];
  traceId: string;
}

export class ValidationErrorDto {
  field: string;
  message: string;
  code: string;
}
```

---

## Auth Module DTOs

### RegisterDto
```typescript
export class RegisterDto {
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'كلمة السر يجب أن تكون 8 أحرف على الأقل' })
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'كلمة السر يجب أن تحتوي على حرف كبير وحرف صغير ورقم',
  })
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @IsEnum(UserRole, { message: 'نوع الحساب غير صالح' })
  role: UserRole;

  @IsBoolean()
  @IsTrue({ message: 'يجب الموافقة على الشروط' })
  agreeToTerms: boolean;

  @IsOptional()
  @IsString()
  locale?: string;
}
```

### LoginDto
```typescript
export class LoginDto {
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'كلمة السر مطلوبة' })
  password: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
```

### ChangePasswordDto
```typescript
export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  newPassword: string;

  @IsString()
  @MatchesField('newPassword', { message: 'كلمتا السر غير متطابقتين' })
  confirmNewPassword: string;
}
```

---

## Users Module DTOs

### UpdateFreelancerProfileDto
```typescript
export class UpdateFreelancerProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(500)
  hourlyRate?: number;

  @IsOptional()
  @IsEnum(SkillLevel)
  experienceLevel?: SkillLevel;

  @IsOptional()
  @IsBoolean()
  availableForHire?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FreelancerSkillDto)
  skills?: FreelancerSkillDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  education?: string;
}

export class FreelancerSkillDto {
  @IsUUID()
  skillId: string;

  @IsEnum(SkillLevel)
  level: SkillLevel;

  @IsOptional()
  @IsBoolean()
  isTop?: boolean;
}
```

### AdminUpdateUserDto
```typescript
export class AdminUpdateUserDto {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsString()
  suspendReason?: string;
}
```

---

## Projects Module DTOs

### CreateProjectDto
```typescript
export class CreateProjectDto {
  @IsString()
  @MinLength(10, { message: 'العنوان يجب أن يكون 10 أحرف على الأقل' })
  @MaxLength(200, { message: 'العنوان يجب أن يكون أقل من 200 حرف' })
  title: string;

  @IsString()
  @MinLength(50, { message: 'الوصف يجب أن يكون 50 حرفاً على الأقل' })
  @MaxLength(10000, { message: 'الوصف طويل جداً' })
  description: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsEnum(['FIXED', 'HOURLY'])
  projectType: 'FIXED' | 'HOURLY';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(10)
  budgetMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(10)
  budgetMax?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'المدة يجب أن تكون يوماً واحداً على الأقل' })
  @Max(365, { message: 'المدة يجب أن تكون أقل من سنة' })
  durationDays: number;

  @IsOptional()
  @IsEnum(SkillLevel)
  experienceLevel?: SkillLevel;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectSkillDto)
  @ArrayMinSize(1, { message: 'يجب إضافة مهارة واحدة على الأقل' })
  @ArrayMaxSize(20)
  skills: ProjectSkillDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectAttachmentDto)
  attachments?: ProjectAttachmentDto[];

  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;

  @IsOptional()
  @IsString()
  location?: string;
}

export class ProjectSkillDto {
  @IsUUID()
  skillId: string;

  @IsOptional()
  @IsEnum(SkillLevel)
  level?: SkillLevel;
}

export class ProjectAttachmentDto {
  @IsUrl()
  fileUrl: string;

  @IsString()
  fileName: string;

  @IsEnum(FileType)
  fileType: FileType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  fileSize?: number;
}
```

### QueryProjectsDto
```typescript
export class QueryProjectsDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  skillIds?: string[];

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsEnum(['FIXED', 'HOURLY'])
  projectType?: 'FIXED' | 'HOURLY';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budgetMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budgetMax?: number;

  @IsOptional()
  @IsEnum(SkillLevel)
  experienceLevel?: SkillLevel;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;
}
```

---

## Proposals Module DTOs

### CreateProposalDto
```typescript
export class CreateProposalDto {
  @IsString()
  @MinLength(50, { message: 'رسالة التقديم يجب أن تكون 50 حرفاً على الأقل' })
  @MaxLength(5000, { message: 'رسالة التقديم طويلة جداً' })
  coverLetter: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'المبلغ يجب أن يكون أكبر من 0' })
  bidAmount: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(365)
  durationDays: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProposalAttachmentDto)
  attachments?: ProposalAttachmentDto[];
}

export class ProposalAttachmentDto {
  @IsUrl()
  fileUrl: string;

  @IsString()
  fileName: string;

  @IsEnum(FileType)
  fileType: FileType;
}
```

---

## Contracts Module DTOs

### CreateContractDto
```typescript
export class CreateContractDto {
  @IsUUID()
  proposalId: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  terms?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMilestoneDto)
  @ArrayMinSize(1)
  milestones: CreateMilestoneDto[];
}

export class CreateMilestoneDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder: number;
}
```

---

## Payments DTOs

### FundEscrowDto
```typescript
export class FundEscrowDto {
  @IsUUID()
  contractId: string;

  @IsOptional()
  @IsUUID()
  milestoneId?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;
}

export class WithdrawDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100000)
  amount: number;

  @IsUUID()
  paymentAccountId: string;
}

export class AddPaymentAccountDto {
  @IsString()
  @IsIn(['bank', 'mobile_money', 'paypal', 'stripe'])
  type: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  label: string;

  @IsObject()
  details: Record<string, any>;
}
```

---

## Messages DTOs

### SendMessageDto
```typescript
export class SendMessageDto {
  @IsUUID()
  receiverId: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsString()
  @IsNotEmpty({ message: 'محتوى الرسالة مطلوب' })
  @MaxLength(5000, { message: 'الرسالة طويلة جداً' })
  content: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageAttachmentDto)
  attachments?: MessageAttachmentDto[];
}

export class MessageAttachmentDto {
  @IsUrl()
  fileUrl: string;

  @IsString()
  fileName: string;

  @IsEnum(FileType)
  fileType: FileType;
}
```

---

## Reviews DTOs

### CreateReviewDto
```typescript
export class CreateReviewDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  quality?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  communication?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  adherence?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  timeliness?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment?: string;
}
```

---

## Admin DTOs

### AdminUpdateSettingsDto
```typescript
export class AdminUpdateSettingsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(50)
  platformCommission?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxFreeProjectsPerMonth?: number;

  @IsOptional()
  @IsBoolean()
  maintenanceMode?: boolean;

  @IsOptional()
  @IsString()
  maintenanceMessage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedPaymentMethods?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minWithdrawalAmount?: number;
}
```

---

## Custom Decorators & Validators

### @MatchesField
```typescript
// Validates that a field matches another field (e.g., password confirmation)
@MatchesField('password', { message: 'الحقلين غير متطابقين' })
confirmPassword: string;
```

### @IsTrue
```typescript
// Validates that a boolean field is true
@IsTrue({ message: 'يجب الموافقة على الشروط' })
agreeToTerms: boolean;
```

### @IsFileSize
```typescript
// Validates file size
@IsFileSize(5 * 1024 * 1024, { message: 'حجم الملف يجب أن يكون أقل من 5MB' })
file: Express.Multer.File;
```

### @IsAllowedFileType
```typescript
// Validates file type
@IsAllowedFileType(['image/jpeg', 'image/png', 'application/pdf'], { message: 'نوع الملف غير مسموح' })
file: Express.Multer.File;
```

---

## Validation Error Mapping

| Prisma Error | HTTP Status | API Error Code |
|-------------|-------------|----------------|
| `P2002` (Unique constraint) | 409 | `DUPLICATE_ENTRY` |
| `P2025` (Not found) | 404 | `RESOURCE_NOT_FOUND` |
| `P2014` (Foreign key violation) | 400 | `INVALID_REFERENCE` |
| `P2003` (Constraint violation) | 400 | `CONSTRAINT_VIOLATION` |

---

## File Validation Rules

| Rule | Value |
|------|-------|
| Max file size | 10 MB (images), 20 MB (documents), 50 MB (video) |
| Allowed image types | JPEG, PNG, GIF, WebP |
| Allowed document types | PDF, DOCX, XLSX, PPTX, TXT |
| Allowed video types | MP4, MOV, AVI |
| Max files per upload | 10 |
| Max portfolio images | 20 per user |
| Avatar dimensions | Max 500x500px, square |
| Banner dimensions | Max 1920x400px |
| Image auto-optimization | Cloudinary (quality 80, f_auto) |
