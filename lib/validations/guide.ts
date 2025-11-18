import { z } from 'zod'

export const createGuideSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  key: z
    .string()
    .min(1, 'Key is required')
    .max(100, 'Key must be less than 100 characters')
    .regex(/^[a-z0-9-_]+$/, 'Key must contain only lowercase letters, numbers, hyphens, and underscores'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
})

export const updateGuideSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters').optional(),
  key: z
    .string()
    .min(1, 'Key is required')
    .max(100, 'Key must be less than 100 characters')
    .regex(/^[a-z0-9-_]+$/, 'Key must contain only lowercase letters, numbers, hyphens, and underscores')
    .optional(),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
})

export const createStepSchema = z.object({
  selector: z.string().min(1, 'Selector is required').max(500, 'Selector must be less than 500 characters'),
  contentMarkdown: z.string().min(1, 'Content is required').max(5000, 'Content must be less than 5000 characters'),
  placement: z.enum(['top', 'right', 'bottom', 'left']).default('bottom'),
  routePath: z.string().max(500, 'Route path must be less than 500 characters').optional(),
  metaJson: z.string().max(5000, 'Meta JSON must be less than 5000 characters').optional(),
  orderIndex: z.number().int().min(0).optional(),
})

export const updateStepSchema = z.object({
  selector: z.string().min(1, 'Selector is required').max(500, 'Selector must be less than 500 characters').optional(),
  contentMarkdown: z.string().min(1, 'Content is required').max(5000, 'Content must be less than 5000 characters').optional(),
  placement: z.enum(['top', 'right', 'bottom', 'left']).optional(),
  routePath: z.string().max(500, 'Route path must be less than 500 characters').optional(),
  metaJson: z.string().max(5000, 'Meta JSON must be less than 5000 characters').optional(),
  orderIndex: z.number().int().min(0).optional(),
})

export type CreateGuideInput = z.infer<typeof createGuideSchema>
export type UpdateGuideInput = z.infer<typeof updateGuideSchema>
export type CreateStepInput = z.infer<typeof createStepSchema>
export type UpdateStepInput = z.infer<typeof updateStepSchema>
