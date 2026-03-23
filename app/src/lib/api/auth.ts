import { NextRequest } from 'next/server'
import { createHash } from 'crypto'
import { db } from '@/lib/db'

export interface AuthContext {
  agentId: string | null
  keyId: string
}

export async function authenticateRequest(req: NextRequest): Promise<AuthContext | null> {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const rawKey = authHeader.slice(7)
  if (!rawKey) return null

  // Hash the key for lookup - NEVER log the raw key
  const keyHash = createHash('sha256').update(rawKey).digest('hex')

  try {
    const apiKey = await db.apiKey.findFirst({
      where: {
        keyHash,
        isActive: true,
      },
    })

    if (!apiKey) return null

    // Update last used timestamp
    await db.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    })

    return { agentId: apiKey.agentId, keyId: apiKey.id }
  } catch {
    return null
  }
}
