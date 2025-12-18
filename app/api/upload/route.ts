import { NextRequest, NextResponse } from 'next/server'
import { uploadFile, validateFile, getAuthenticationParameters } from '@/app/lib/imagekit'
import { requireAuth } from '@/app/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const currentUser = requireAuth(request)
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'activities'
    const tags = formData.get('tags') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file
    const validation = validateFile(file)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to ImageKit
    const uploadResult = await uploadFile(buffer, {
      fileName: file.name,
      folder: `/greenify/${folder}`,
      tags: tags ? tags.split(',') : [`user_${currentUser.userId}`, folder],
      useUniqueFileName: true,
    })

    return NextResponse.json({
      success: true,
      file: {
        fileId: uploadResult.fileId,
        name: uploadResult.name,
        url: uploadResult.url,
        thumbnailUrl: uploadResult.thumbnailUrl,
        size: uploadResult.size,
        fileType: uploadResult.fileType,
        filePath: uploadResult.filePath,
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

// GET endpoint for ImageKit authentication parameters (for client-side uploads)
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const currentUser = requireAuth(request)
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const authParams = getAuthenticationParameters()
    return NextResponse.json(authParams)

  } catch (error) {
    console.error('Get auth params error:', error)
    return NextResponse.json(
      { error: 'Failed to get authentication parameters' },
      { status: 500 }
    )
  }
}
