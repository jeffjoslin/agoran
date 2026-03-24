import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/api/auth'
import { errors } from '@/lib/api/errors'
import { db } from '@/lib/db'
import { uploadToR2 } from '@/lib/r2/client'
import { AssetType } from '@/generated/prisma'

const MAX_SIZE = 100 * 1024 * 1024 // 100MB

// Magic bytes for allowed file types
const MAGIC_BYTES: Record<string, { bytes: number[]; offset: number }[]> = {
  'application/pdf': [{ bytes: [0x25, 0x50, 0x44, 0x46], offset: 0 }], // %PDF
  'application/zip': [
    { bytes: [0x50, 0x4b, 0x03, 0x04], offset: 0 }, // PK\x03\x04
    { bytes: [0x50, 0x4b, 0x05, 0x06], offset: 0 }, // PK\x05\x06 (empty zip)
  ],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    { bytes: [0x50, 0x4b, 0x03, 0x04], offset: 0 }, // docx is zip
  ],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
    { bytes: [0x50, 0x4b, 0x03, 0x04], offset: 0 }, // xlsx is zip
  ],
}

const ALLOWED_EXTENSIONS = ['pdf', 'zip', 'docx', 'xlsx']
const ALLOWED_MIME_TYPES = Object.keys(MAGIC_BYTES)

function checkMagicBytes(buffer: Buffer, mimeType: string): boolean {
  const checks = MAGIC_BYTES[mimeType]
  if (!checks) return false
  return checks.some(({ bytes, offset }) =>
    bytes.every((byte, i) => buffer[offset + i] === byte)
  )
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateRequest(req)
  if (!auth) return errors.unauthorized()

  const { id } = await params

  const product = await db.product.findUnique({ where: { id } })
  if (!product) return errors.notFound('Product')
  if (product.agentId !== auth.agentId) return errors.notFound('Product')

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return errors.validation('Invalid form data')
  }

  const file = formData.get('file') as File | null
  const assetTypeRaw = (formData.get('asset_type') as string) ?? 'MAIN'

  if (!file) return errors.validation('file is required')

  // Validate size
  if (file.size > MAX_SIZE) {
    return errors.validation('File exceeds 100MB limit')
  }

  // Validate extension
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return errors.validation(`File type .${ext} not allowed. Allowed: pdf, zip, docx, xlsx`)
  }

  // Read buffer and validate magic bytes
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const mimeType = file.type || 'application/octet-stream'
  if (!ALLOWED_MIME_TYPES.includes(mimeType) || !checkMagicBytes(buffer, mimeType)) {
    // For docx/xlsx, also check as zip
    const isOfficeDoc = (
      (ext === 'docx' || ext === 'xlsx') &&
      buffer[0] === 0x50 && buffer[1] === 0x4b &&
      buffer[2] === 0x03 && buffer[3] === 0x04
    )
    if (!isOfficeDoc) {
      return errors.validation('File content does not match expected format (magic bytes validation failed)')
    }
  }

  // Validate asset_type enum value
  const validAssetTypes = Object.values(AssetType) as string[]
  const assetType = validAssetTypes.includes(assetTypeRaw.toUpperCase())
    ? assetTypeRaw.toUpperCase()
    : 'MAIN'

  const r2Key = `products/${id}/${assetType.toLowerCase()}/${file.name}`

  try {
    await uploadToR2(r2Key, buffer, mimeType)
  } catch (err) {
    console.error('R2 upload error:', err)
    return errors.uploadError()
  }

  try {
    const asset = await db.productAsset.create({
      data: {
        productId: id,
        assetType: assetType as AssetType,
        filename: file.name,
        mimeType,
        sizeBytes: file.size,
        r2Key,
      },
    })

    return NextResponse.json({ asset_id: asset.id, r2Key, filename: file.name }, { status: 201 })
  } catch (err) {
    console.error('Asset DB error:', err)
    return errors.uploadError('Failed to save asset record')
  }
}
