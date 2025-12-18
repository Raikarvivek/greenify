'use client'

import { useState, useEffect } from 'react'
import { MapPin, CheckCircle, AlertCircle, Loader } from 'lucide-react'

interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
  address?: string
  timestamp: number
}

interface LocationTrackerProps {
  onLocationUpdate: (location: LocationData) => void
  required?: boolean
}

export default function LocationTracker({ onLocationUpdate, required = false }: LocationTrackerProps) {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt')

  useEffect(() => {
    checkLocationPermission()
  }, [])

  const checkLocationPermission = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser')
      return
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' })
      setPermissionStatus(permission.state)
      
      permission.addEventListener('change', () => {
        setPermissionStatus(permission.state)
      })
    } catch (error) {
      console.warn('Permission API not supported')
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser')
      return
    }

    setLoading(true)
    setError(null)

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // Cache for 1 minute
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        }

        // Try to get address from coordinates (reverse geocoding)
        try {
          const address = await reverseGeocode(locationData.latitude, locationData.longitude)
          locationData.address = address
        } catch (error) {
          console.warn('Could not get address from coordinates:', error)
        }

        setLocation(locationData)
        onLocationUpdate(locationData)
        setLoading(false)
      },
      (error) => {
        setLoading(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please enable location permissions.')
            setPermissionStatus('denied')
            break
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.')
            break
          case error.TIMEOUT:
            setError('Location request timed out. Please try again.')
            break
          default:
            setError('An unknown error occurred while retrieving location.')
            break
        }
      },
      options
    )
  }

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    // Using a simple reverse geocoding service (in production, use a proper API like Google Maps)
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      )
      
      if (response.ok) {
        const data = await response.json()
        return `${data.locality || data.city || 'Unknown City'}, ${data.principalSubdivision || data.countryName || 'Unknown Region'}`
      }
    } catch (error) {
      console.warn('Reverse geocoding failed:', error)
    }
    
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }

  const formatAccuracy = (accuracy: number) => {
    if (accuracy < 10) return 'Very High'
    if (accuracy < 50) return 'High'
    if (accuracy < 100) return 'Medium'
    return 'Low'
  }

  const getStatusColor = () => {
    if (error) return 'text-red-600'
    if (location) return 'text-green-600'
    return 'text-gray-600'
  }

  const getStatusIcon = () => {
    if (loading) return <Loader className="h-5 w-5 animate-spin" />
    if (error) return <AlertCircle className="h-5 w-5 text-red-500" />
    if (location) return <CheckCircle className="h-5 w-5 text-green-500" />
    return <MapPin className="h-5 w-5 text-gray-500" />
  }

  return (
    <div className="space-y-4">
      {/* Location Status */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h4 className={`text-sm font-medium ${getStatusColor()}`}>
              {loading && 'Getting your location...'}
              {error && 'Location Error'}
              {location && 'Location Captured'}
              {!loading && !error && !location && 'Location Required'}
            </h4>
            {location && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Accuracy: {formatAccuracy(location.accuracy)} ({location.accuracy.toFixed(0)}m)
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={getCurrentLocation}
          disabled={loading}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            location
              ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? 'Getting Location...' : location ? 'Update Location' : 'Get Location'}
        </button>
      </div>

      {/* Location Details */}
      {location && (
        <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
          <h5 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
            📍 Current Location
          </h5>
          <div className="space-y-1 text-sm text-green-700 dark:text-green-300">
            {location.address && (
              <p><strong>Address:</strong> {location.address}</p>
            )}
            <p><strong>Coordinates:</strong> {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</p>
            <p><strong>Captured:</strong> {new Date(location.timestamp).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-red-800 dark:text-red-300">Location Error</h5>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              {permissionStatus === 'denied' && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Please enable location permissions in your browser settings and refresh the page.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Location Guidelines */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h5 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
          🌍 Why We Need Your Location
        </h5>
        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Verify you're at the location where the activity took place</li>
          <li>• Help track local environmental impact</li>
          <li>• Enable location-based eco-challenges and rewards</li>
          <li>• Your location data is encrypted and never shared publicly</li>
        </ul>
      </div>

      {required && !location && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            ⚠️ Location is required to submit this activity for verification.
          </p>
        </div>
      )}
    </div>
  )
}
