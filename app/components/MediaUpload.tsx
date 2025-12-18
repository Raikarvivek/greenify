'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image, Video, File } from 'lucide-react'

interface MediaFile {
  file: File
  preview: string
  type: 'image' | 'video'
}

interface MediaUploadProps {
  onFilesChange: (files: MediaFile[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
}

export default function MediaUpload({ 
  onFilesChange, 
  maxFiles = 3, 
  acceptedTypes = ['image/*', 'video/*'] 
}: MediaUploadProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (fileList: FileList) => {
    const newFiles: MediaFile[] = []
    
    Array.from(fileList).forEach((file) => {
      if (files.length + newFiles.length >= maxFiles) return
      
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      
      if (!isImage && !isVideo) return
      
      const mediaFile: MediaFile = {
        file,
        preview: URL.createObjectURL(file),
        type: isImage ? 'image' : 'video'
      }
      
      newFiles.push(mediaFile)
    })
    
    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(files[index].preview)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const getFileIcon = (type: string) => {
    if (type === 'image') return <Image className="h-5 w-5" />
    if (type === 'video') return <Video className="h-5 w-5" />
    return <File className="h-5 w-5" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
          Drop your photos or videos here, or click to browse
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Maximum {maxFiles} files • Images and videos only • Max 10MB each
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* File Previews */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Uploaded Files ({files.length}/{maxFiles})
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {files.map((mediaFile, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                {/* Preview */}
                <div className="flex-shrink-0">
                  {mediaFile.type === 'image' ? (
                    <img
                      src={mediaFile.preview}
                      alt="Preview"
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                      <Video className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(mediaFile.type)}
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      {mediaFile.file.name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(mediaFile.file.size)} • {mediaFile.type}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h5 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
          📸 Verification Guidelines
        </h5>
        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Take clear photos/videos showing your eco-friendly activity</li>
          <li>• Include yourself or identifiable elements in the media</li>
          <li>• Ensure good lighting and image quality</li>
          <li>• Videos should be under 2 minutes for faster review</li>
        </ul>
      </div>
    </div>
  )
}
