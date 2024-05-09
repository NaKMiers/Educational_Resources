'use client'

import { useState } from 'react'

function AdminPage() {
  const [file, setFile] = useState<File | null>(null)

  console.log('file', file)

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        console.log('Image uploaded successfully')
      } else {
        console.error('Failed to upload image')
      }
    } catch (err) {
      console.error('Failed to upload image', err)
    }
  }

  return (
    <div className='bg-white rounded-lg p-21 text-dark'>
      <input
        className='bg-dark-100 text-white'
        type='file'
        onChange={(e: any) => setFile(e.target.files[0])}
      />
      <button className='bg-dark-100 text-white px-3 py-0.5 ml-2' onClick={handleUpload}>
        Upload
      </button>
    </div>
  )
}

export default AdminPage
