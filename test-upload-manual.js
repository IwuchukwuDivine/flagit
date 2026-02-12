// Manual test script for upload endpoint
import { readFileSync, writeFileSync } from 'fs'

// Create a test PNG image (1x1 pixel red PNG)
const pngData = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
  0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
  0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
  0x54, 0x08, 0x99, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
  0x00, 0x00, 0x03, 0x00, 0x01, 0x4E, 0x82, 0x8E,
  0x4F, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E,
  0x44, 0xAE, 0x42, 0x60, 0x82
])

console.log('Testing upload endpoint...')
console.log('Test image size:', pngData.length, 'bytes')

async function testUpload() {
  try {
    const formData = new FormData()
    const blob = new Blob([pngData], { type: 'image/png' })
    formData.append('file', blob, 'test.png')

    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Upload failed:', response.status, error)
      return
    }

    const result = await response.json()
    console.log('✓ Upload successful:', result)

    // Now test creating a complaint with the image
    const complaintResponse = await fetch('http://localhost:3000/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test with image',
        body: 'Testing image upload',
        authorName: 'Test User',
        category: 'roads',
        location: 'Test Location',
        imageUrl: result.url
      })
    })

    if (!complaintResponse.ok) {
      const error = await complaintResponse.text()
      console.error('Complaint creation failed:', complaintResponse.status, error)
      return
    }

    const complaint = await complaintResponse.json()
    console.log('✓ Complaint created with image:', complaint)

    console.log('\n✓ ALL MANUAL TESTS PASSED')
  } catch (error) {
    console.error('Error:', error)
  }
}

testUpload()
