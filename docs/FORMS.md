# Forms Guide

> **Version:** 1.0 | **Last Updated:** 2026-07-06 | **Applies to:** Frontend Application (`frontend/`)

## Table of Contents

1. [Form Validation Approach](#form-validation-approach)
2. [Client-Side Validation](#client-side-validation)
3. [Server-Side Validation](#server-side-validation)
4. [Error Display Patterns](#error-display-patterns)
5. [Loading States During Submission](#loading-states-during-submission)
6. [File Upload Handling](#file-upload-handling)
7. [Form Libraries Usage](#form-libraries-usage)
8. [RTL Form Layout](#rtl-form-layout)

---

## Form Validation Approach

### Validation Layers

| Layer | Technology | Timing | Purpose |
|-------|-----------|--------|---------|
| 1. HTML5 | Browser native | On input/blur | Required fields, type validation, maxlength |
| 2. Client | React Hook Form + Zod | On change/blur | User feedback, field-level rules |
| 3. Server | NestJS + class-validator | On submit | Security, business rules, data integrity |

### Validation Flow

```
User types → HTML5 validation (immediate)
           → Zod schema validation (debounced, 300ms)
           → Error displayed inline
User submits → Client validation (final check)
             → API request
             → Server validation (NestJS DTO)
             → Business logic validation
             → Response (success or error)
```

---

## Client-Side Validation

### Form Setup with React Hook Form + Zod

```tsx
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Schema definition
const projectSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description is too long'),
  categoryId: z.string().uuid('Category is required'),
  budgetType: z.enum(['fixed', 'hourly', 'range']),
  budgetMin: z.number().min(0).optional(),
  budgetMax: z.number().min(0).optional(),
  budgetFixed: z.number().min(1, 'Budget must be at least $1').optional(),
  skills: z.array(z.string()).min(1, 'Select at least one skill'),
  deadline: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Deadline must be in the future',
  }),
})

type ProjectFormData = z.infer<typeof projectSchema>

export function ProjectForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      budgetType: 'fixed',
      skills: [],
    },
  })

  const onSubmit = async (data: ProjectFormData) => {
    // Data is already validated by Zod at this point
    await createProject(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Form fields */}
    </form>
  )
}
```

### Validation Rules by Field Type

| Field Type | Validation Rules |
|-----------|-----------------|
| Text (short) | `minLength`, `maxLength`, `regex` pattern |
| Textarea | `minLength`, `maxLength` |
| Email | `email()` format check |
| URL | `url()` format check |
| Number | `min`, `max`, `positive`, `integer` |
| Date | `min` (must be future), `max` |
| Phone | `regex` pattern for country format |
| File | `maxSize`, `mimeType`, `count` |
| Select | `refine` to check non-empty |
| Array | `minLength(1)` for required selections |

---

## Server-Side Validation

### NestJS DTO Validation

```ts
// backend/src/modules/projects/dto/create-project.dto.ts
import {
  IsString, IsOptional, IsEnum, IsNumber, IsArray,
  MinLength, MaxLength, Min, IsUUID, ArrayMinSize,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateProjectDto {
  @ApiProperty({ example: 'Build React Dashboard' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string

  @ApiProperty({ example: 'I need a professional dashboard...' })
  @IsString()
  @MinLength(20)
  @MaxLength(5000)
  description: string

  @ApiProperty({ example: 'uuid-of-category' })
  @IsUUID()
  categoryId: string

  @ApiProperty({ enum: ['fixed', 'hourly', 'range'] })
  @IsEnum(['fixed', 'hourly', 'range'])
  budgetType: 'fixed' | 'hourly' | 'range'

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  budgetMin?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  budgetMax?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  budgetFixed?: number

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  skills: string[]

  @ApiProperty({ example: '2026-12-31' })
  @IsString()
  deadline: string
}
```

### Server Error Response Handling

```tsx
// Frontend: handle server validation errors
const onSubmit = async (data: ProjectFormData) => {
  try {
    await createProject(data)
    showToast({ type: 'success', title: 'Project created' })
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 400) {
      // Map server validation errors back to form fields
      const serverErrors = error.details
      Object.entries(serverErrors).forEach(([field, message]) => {
        setError(field as keyof ProjectFormData, {
          type: 'server',
          message: message as string,
        })
      })
    } else {
      showToast({ type: 'error', title: 'Something went wrong' })
    }
  }
}
```

---

## Error Display Patterns

### Inline Field Error

```tsx
// Input component with error state
<div className="space-y-1">
  <label htmlFor="title" className="text-sm font-medium text-gray-700">
    Project Title <span className="text-red-500">*</span>
  </label>
  <input
    id="title"
    className={cn(
      'w-full rounded-md border px-3 py-2 text-sm transition-colors',
      errors.title
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20',
    )}
    {...register('title')}
    aria-invalid={!!errors.title}
    aria-describedby={errors.title ? 'title-error' : undefined}
  />
  {errors.title && (
    <p id="title-error" className="text-xs text-red-600" role="alert">
      {errors.title.message}
    </p>
  )}
</div>
```

### Form-Level Error

```tsx
// General form error (e.g., network issue)
{formError && (
  <Alert variant="error" className="mb-6" dismissible onDismiss={() => setFormError(null)}>
    {formError}
  </Alert>
)}
```

### Error Display Types

| Pattern | Description | When to Use |
|---------|-------------|-------------|
| **Inline** | Error message directly below the field | Field-level validation errors |
| **Toast** | Floating notification | Server errors, network errors |
| **Alert banner** | Top-of-form error box | General form submission failures |
| **Tooltip** | Icon with hover tooltip | Optional field hints |
| **Summary** | Error summary at top of form | Long forms with multiple errors |

---

## Loading States During Submission

### Button Loading State

```tsx
<Button
  type="submit"
  isLoading={isSubmitting}
  disabled={isSubmitting}
  className="w-full sm:w-auto"
>
  {isSubmitting ? 'Creating project...' : 'Create Project'}
</Button>
```

### Form Disabled State

```tsx
// Disable entire form while submitting
<fieldset disabled={isSubmitting} className="space-y-6">
  <Input {...} />
  <Select {...} />
  <Button type="submit" isLoading={isSubmitting}>
    Submit
  </Button>
</fieldset>
```

### Submission Visual Feedback

| State | Button | Fields | Toast |
|-------|--------|--------|-------|
| Idle | Enabled, normal | Enabled | None |
| Validating | Enabled, normal | Enabled | None |
| Submitting | Loading spinner, disabled | Disabled | None |
| Success | Enabled, normal | Reset | Success toast |
| Error (client) | Enabled, normal | Enabled with errors | None (inline) |
| Error (server) | Enabled, normal | Enabled with server errors | Error toast |

---

## File Upload Handling

### Upload Component

```tsx
export function FileUpload({
  accept = 'image/*,.pdf,.doc,.docx',
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 5,
  onUpload,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleDrop = async (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter((f) => f.size <= maxSize)
    if (validFiles.length !== acceptedFiles.length) {
      showToast({ type: 'warning', title: 'Some files exceeded the size limit' })
    }
    setFiles((prev) => [...prev, ...validFiles].slice(0, maxFiles))
  }

  const handleUpload = async () => {
    setUploading(true)
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      await uploadFile(formData, {
        onProgress: (percent) => setProgress(percent),
      })
    }
    setUploading(false)
    setFiles([])
    showToast({ type: 'success', title: 'Files uploaded successfully' })
  }

  return (
    <div className="space-y-4">
      <Dropzone
        onDrop={handleDrop}
        accept={accept}
        maxSize={maxSize}
        disabled={uploading}
      >
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drop files here or click to browse
          </p>
          <p className="text-xs text-gray-500">
            Max {maxFiles} files, up to {maxSize / 1024 / 1024}MB each
          </p>
        </div>
      </Dropzone>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <FileItem key={i} file={file} onRemove={() => removeFile(i)} />
          ))}
          <Button onClick={handleUpload} isLoading={uploading}>
            Upload {files.length} file(s)
          </Button>
        </div>
      )}

      {uploading && <Progress value={progress} showLabel animated />}
    </div>
  )
}
```

### Supported File Types

| Use Case | Accepted Types | Max Size | Max Files |
|----------|---------------|----------|-----------|
| Profile image | `image/jpeg, image/png, image/webp` | 2MB | 1 |
| Project attachments | `image/*, .pdf, .doc, .docx, .zip` | 10MB | 10 |
| Contract documents | `.pdf` | 25MB | 5 |
| Portfolio items | `image/*, .pdf` | 5MB | 20 |
| Identity verification | `image/jpeg, image/png, .pdf` | 5MB | 3 |

---

## Form Libraries Usage

### Technology Stack

| Library | Version | Purpose |
|---------|---------|---------|
| `react-hook-form` | ^7.50 | Form state management and validation |
| `zod` | ^3.22 | Schema validation |
| `@hookform/resolvers` | ^3.3 | Zod resolver integration |
| `react-dropzone` | ^14.2 | File upload drag-and-drop |

### Why These Libraries

| Reason | Detail |
|--------|--------|
| **Performance** | React Hook Form isolates re-renders to individual fields |
| **Bundle size** | React Hook Form is ~5KB, Zod is lightweight |
| **Type safety** | Zod provides full TypeScript inference for form data |
| **Flexibility** | Works with any UI library; no dependency on Material UI etc. |

### Do NOT Use

- Formik (heavier, more re-renders)
- Yup (larger bundle, less TypeScript integration)
- Any form library that requires wrapping in `<Form>` context that re-renders everything

---

## RTL Form Layout

### RTL Form Structure

```tsx
<form
  dir={direction} // 'ltr' or 'rtl' based on locale
  className="space-y-6"
  onSubmit={handleSubmit(onSubmit)}
  noValidate
>
```

### RTL Field Adjustments

| LTR | RTL |
|-----|-----|
| Label on left | Label on right |
| Icon on left of input | Icon on right of input |
| Error text on left | Error text on right |
| Submit button on right | Submit button on left |
| Cancel button on left | Cancel button on right |
| Radio/Checkbox label on right | Radio/Checkbox label on left |
| Date picker opens left | Date picker opens right |

### RTL Input Component

```tsx
<div className="space-y-1">
  <label
    htmlFor={name}
    className={`text-sm font-medium text-gray-700 block ${isRTL ? 'text-right' : 'text-left'}`}
  >
    {label}
    {required && <span className="text-red-500 mr-1">*</span>}
  </label>
  <div className={`relative ${isRTL ? 'text-right' : 'text-left'}`}>
    {leftIcon && (
      <span className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center`}>
        {leftIcon}
      </span>
    )}
    <input
      className={cn(
        'w-full rounded-md border px-3 py-2 text-sm',
        leftIcon && (isRTL ? 'pr-10' : 'pl-10'),
        rightIcon && (isRTL ? 'pl-10' : 'pr-10'),
        error ? 'border-red-500' : 'border-gray-300',
      )}
      dir={isRTL ? 'rtl' : 'ltr'}
      {...register(name)}
    />
  </div>
  {error && (
    <p className={`text-xs text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}>
      {error}
    </p>
  )}
</div>
```

---

## Cross-References

| Document | Link |
|----------|------|
| UI Guidelines | [UI_GUIDELINES.md](./UI_GUIDELINES.md) |
| Components (Input, Select, etc.) | [COMPONENTS.md](./COMPONENTS.md#form-components) |
| Error Codes | [ERROR_CODES.md](./ERROR_CODES.md) |
| Responsive Design | [RESPONSIVE.md](./RESPONSIVE.md) |
| Accessibility | [ACCESSIBILITY.md](./ACCESSIBILITY.md) |
| State Management | [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) |
