import { useState } from 'react'
import { useRouter } from 'next/router'

interface SearchBarProps {
  className?: string
}

export default function SearchBar({ className = "" }: SearchBarProps) {
  const [school, setSchool] = useState('')
  const [year, setYear] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (school.trim()) {
      const queryParams = new URLSearchParams()
      queryParams.set('school', school.trim())
      if (year.trim()) {
        queryParams.set('year', year.trim())
      }
      router.push(`/results?${queryParams.toString()}`)
    }
  }

  const popularSchools = [
    'Lincoln High School',
    'Washington Elementary',
    'Roosevelt Middle School',
    'Jefferson High School',
    'Madison Elementary'
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i)

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-primary-200 p-6 transition-all duration-300 hover:shadow-2xl">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* School Name Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-primary-700 mb-2">
              🏫 School Name
            </label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter school name..."
              className="search-input"
              required
            />
          </div>

          {/* Year Input */}
          <div className="w-full md:w-32">
            <label className="block text-sm font-medium text-primary-700 mb-2">
              📅 Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="search-input"
            >
              <option value="">Any year</option>
              {years.map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="btn-primary w-full md:w-auto"
          >
            <span className="mr-2">🔍</span>
            Find Memories
          </button>
        </div>

        {/* Popular Schools Suggestions */}
        {isFocused && (
          <div className="mt-4 pt-4 border-t border-primary-200">
            <p className="text-sm text-primary-600 mb-3 font-medium">Popular schools:</p>
            <div className="flex flex-wrap gap-2">
              {popularSchools.map((schoolName) => (
                <button
                  key={schoolName}
                  type="button"
                  onClick={() => {
                    setSchool(schoolName)
                    setIsFocused(false)
                  }}
                  className="px-3 py-1 text-sm bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-full transition-colors"
                >
                  {schoolName}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </form>
  )
}
