import Image from 'next/image'
import { useState } from 'react'

interface PhotoCardProps {
  schoolName: string
  year: string
  imageUrl: string
  title?: string
  subtitle?: string
  className?: string
}

export default function PhotoCard({
  schoolName,
  year,
  imageUrl,
  title,
  subtitle,
  className = ""
}: PhotoCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className={`yearbook-card group ${className}`}>
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={`${schoolName} ${year} yearbook`}
          fill
          className={`object-cover transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Vintage Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Year Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
          <span className="text-sm font-bold text-primary-700">{year}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* School Name */}
        <h3 className="text-lg font-nostalgic font-bold text-primary-800 leading-tight">
          {schoolName}
        </h3>
        
        {/* Year */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl">📚</span>
          <span className="text-sm font-medium text-primary-600">Class of {year}</span>
        </div>
        
        {/* Title and Subtitle */}
        {(title || subtitle) && (
          <div className="space-y-2 pt-2 border-t border-primary-100">
            {title && (
              <p className="text-sm font-medium text-gray-700 line-clamp-2">
                {title}
              </p>
            )}
            {subtitle && (
              <p className="text-xs text-gray-500 line-clamp-2">
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        {/* Action Button */}
        <button className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-primary-100 to-secondary-100 hover:from-primary-200 hover:to-secondary-200 text-primary-700 rounded-xl transition-all duration-300 text-sm font-medium">
          View Memories →
        </button>
      </div>
    </div>
  )
}
