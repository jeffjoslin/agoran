import { db } from '@/lib/db'

export function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

export async function generateUniqueSlug(title: string): Promise<string> {
  const base = toSlug(title)
  let slug = base
  let counter = 2

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await db.product.findUnique({ where: { slug } })
    if (!existing) return slug
    slug = `${base}-${counter}`
    counter++
  }
}
