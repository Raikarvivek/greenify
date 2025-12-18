import ImageKit from 'imagekit'

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
})

if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
  throw new Error('ImageKit environment variables are not properly configured')
}

export interface UploadResponse {
  fileId: string
  name: string
  url: string
  thumbnailUrl: string
  height: number
  width: number
  size: number
  filePath: string
  tags: string[]
  isPrivateFile: boolean
  customCoordinates: string | null
  fileType: string
}

export interface UploadOptions {
  fileName: string
  folder?: string
  tags?: string[]
  isPrivateFile?: boolean
  useUniqueFileName?: boolean
  responseFields?: string[]
}

// Upload file to ImageKit
export async function uploadFile(
  file: Buffer | string,
  options: UploadOptions
): Promise<UploadResponse> {
  try {
    const uploadOptions = {
      file,
      fileName: options.fileName,
      folder: options.folder || '/greenify',
      tags: options.tags || [],
      isPrivateFile: options.isPrivateFile || false,
      useUniqueFileName: options.useUniqueFileName !== false,
      responseFields: options.responseFields || [
        'fileId',
        'name',
        'url',
        'thumbnailUrl',
        'height',
        'width',
        'size',
        'filePath',
        'tags',
        'isPrivateFile',
        'customCoordinates',
        'fileType'
      ],
    }

    const result = await imagekit.upload(uploadOptions)
    return result as UploadResponse
  } catch (error) {
    console.error('ImageKit upload error:', error)
    throw new Error('Failed to upload file to ImageKit')
  }
}

// Delete file from ImageKit
export async function deleteFile(fileId: string): Promise<void> {
  try {
    await imagekit.deleteFile(fileId)
  } catch (error) {
    console.error('ImageKit delete error:', error)
    throw new Error('Failed to delete file from ImageKit')
  }
}

// Get file details
export async function getFileDetails(fileId: string) {
  try {
    return await imagekit.getFileDetails(fileId)
  } catch (error) {
    console.error('ImageKit get file details error:', error)
    throw new Error('Failed to get file details from ImageKit')
  }
}

// Generate authentication parameters for client-side upload
export function getAuthenticationParameters() {
  const token = imagekit.getAuthenticationParameters()
  return {
    signature: token.signature,
    expire: token.expire,
    token: token.token,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
  }
}

// Validate file type and size
export function validateFile(file: File): { isValid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size must be less than 10MB'
    }
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'File type not supported. Please upload images (JPEG, PNG, WebP) or videos (MP4, WebM, MOV)'
    }
  }

  return { isValid: true }
}

// Generate optimized URL with transformations
export function getOptimizedUrl(
  url: string,
  transformations?: {
    width?: number
    height?: number
    quality?: number
    format?: 'auto' | 'webp' | 'jpg' | 'png'
    crop?: 'maintain_ratio' | 'force' | 'at_least' | 'at_max'
  }
): string {
  if (!transformations) return url

  const params = []
  
  if (transformations.width) params.push(`w-${transformations.width}`)
  if (transformations.height) params.push(`h-${transformations.height}`)
  if (transformations.quality) params.push(`q-${transformations.quality}`)
  if (transformations.format) params.push(`f-${transformations.format}`)
  if (transformations.crop) params.push(`c-${transformations.crop}`)

  if (params.length === 0) return url

  // Insert transformations into ImageKit URL
  const transformationString = `tr:${params.join(',')}`
  return url.replace(/\/([^\/]+)$/, `/${transformationString}/$1`)
}

export default imagekit
