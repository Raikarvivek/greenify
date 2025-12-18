'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { Toast as ToastType } from '@/app/hooks/useToast'

interface ToastProps {
  toast: ToastType
  onClose: (id: string) => void
}

export function Toast({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 10)
  }, [])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose(toast.id)
    }, 300)
  }

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getStyles = () => {
    const baseStyles = "border-l-4 shadow-lg backdrop-blur-sm"
    switch (toast.type) {
      case 'success':
        return `${baseStyles} bg-green-50/95 border-green-400 dark:bg-green-900/80 dark:border-green-400`
      case 'error':
        return `${baseStyles} bg-red-50/95 border-red-400 dark:bg-red-900/80 dark:border-red-400`
      case 'warning':
        return `${baseStyles} bg-yellow-50/95 border-yellow-400 dark:bg-yellow-900/80 dark:border-yellow-400`
      case 'info':
        return `${baseStyles} bg-blue-50/95 border-blue-400 dark:bg-blue-900/80 dark:border-blue-400`
    }
  }

  return (
    <div
      className={`
        max-w-sm w-full p-4 rounded-lg transition-all duration-300 transform mb-2
        ${getStyles()}
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
      `}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {toast.title}
          </h3>
          {toast.message && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {toast.message}
            </p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={handleClose}
            className="inline-flex text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function ToastContainer({ toasts, onClose }: { toasts: ToastType[], onClose: (id: string) => void }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  )
}
