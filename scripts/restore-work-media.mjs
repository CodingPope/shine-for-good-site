import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { put } from '@vercel/blob'

// Recovery of the originals left in the disconnected Chelsea store.
// Default is read-only. --restore requires the active store's token.
const source = 'https://q5ytr87xq0kmjcoi.public.blob.vercel-storage.com'
const destination = 'https://fb3dtp4n2c7uvqhj.public.blob.vercel-storage.com'
const files = [
  ['IMG_5474.jpeg', 2609348],
  ['IMG_5477.jpeg', 2399559],
  ['IMG_5503.jpeg', 1998952],
  ['IMG_5507.jpeg', 1803096],
  ['IMG_5393.jpeg', 1852433],
  ['IMG_5396.jpeg', 4045340],
  ['IMG_5117.jpeg', 3098087],
  ['IMG_5119.jpeg', 3217629],
  ['IMG_4926.jpeg', 3402415],
  ['IMG_4927.jpeg', 2994261],
  ['IMG_5590.jpeg', 1691616],
  ['IMG_5592.jpeg', 1445938],
  ['IMG_5578.jpeg', 1554470],
  ['IMG_5580.jpeg', 2354944],
  ['IMG_3596.jpeg', 3523619],
]
const restore = process.argv.includes('--restore')
const token = process.env.BLOB_READ_WRITE_TOKEN
if (restore) {
  assert(token?.toLowerCase().startsWith('vercel_blob_rw_fb3dtp4n2c7uvqhj_'), 'Expected the active Shine for Good Blob store token')
}
const digest = buffer => createHash('sha256').update(buffer).digest('hex')
async function read(url) {
  const response = await fetch(url, { cache: 'no-store' })
  assert.equal(response.status, 200, `Cannot read ${url}`)
  return Buffer.from(await response.arrayBuffer())
}

for (const [filename, size] of files) {
  const original = await read(`${source}/${filename}`)
  assert.equal(original.length, size, `Original size mismatch: ${filename}`)
  const targetURL = `${destination}/${filename}`
  const existing = await fetch(targetURL, { method: 'HEAD', cache: 'no-store' })
  if (existing.ok) {
    assert.equal(digest(await read(targetURL)), digest(original), `Existing file differs: ${filename}`)
    console.log(`Verified existing: ${filename}`)
    continue
  }
  assert.equal(existing.status, 404, `Unexpected destination response: ${filename}`)
  if (!restore) {
    console.log(`Ready to restore: ${filename} (${size} bytes)`)
    continue
  }
  await put(filename, original, {
    token,
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: false,
    contentType: 'image/jpeg',
  })
  // A unique query avoids any previously cached 404 during verification.
  const copied = await read(`${targetURL}?restored=${Date.now()}`)
  assert.equal(digest(copied), digest(original), `Restored file differs: ${filename}`)
  console.log(`Restored and verified: ${filename}`)
}
console.log(restore ? 'All 15 originals restored and verified.' : 'Read-only recovery check complete.')
