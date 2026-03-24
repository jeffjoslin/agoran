import { NextResponse } from 'next/server'

export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'MISSING_ASSET'
  | 'ALREADY_PUBLISHED'
  | 'LLM_GENERATION_FAILED'
  | 'STRIPE_ERROR'
  | 'UPLOAD_ERROR'

export function errorResponse(
  code: ErrorCode,
  message: string,
  status: number
): NextResponse {
  return NextResponse.json({ error: { code, message } }, { status })
}

export const errors = {
  unauthorized: () => errorResponse('UNAUTHORIZED', 'Invalid or missing API key', 401),
  notFound: (resource = 'Resource') =>
    errorResponse('NOT_FOUND', `${resource} not found`, 404),
  validation: (message: string) =>
    errorResponse('VALIDATION_ERROR', message, 400),
  missingAsset: () =>
    errorResponse('MISSING_ASSET', 'Product must have at least one MAIN asset before publishing', 422),
  alreadyPublished: () =>
    errorResponse('ALREADY_PUBLISHED', 'Product is already published', 409),
  llmFailed: (message?: string) =>
    errorResponse('LLM_GENERATION_FAILED', message ?? 'Failed to generate landing page content', 422),
  stripeError: (message?: string) =>
    errorResponse('STRIPE_ERROR', message ?? 'Stripe operation failed', 502),
  uploadError: (message?: string) =>
    errorResponse('UPLOAD_ERROR', message ?? 'File upload failed', 502),
}
