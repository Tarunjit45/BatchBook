import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import PhotoCard from '../components/PhotoCard'

// Mock data for school yearbooks
const mockYearbooks = [
  {
    schoolName: 'Lincoln High School',
    year: '2020',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
    title: 'Senior Year Memories',
    subtitle: 'Class of 2020 Yearbook'
  },
  {
    schoolName: 'Lincoln High School',
    year: '2019',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    title: 'Junior Prom & Activities',
    subtitle: 'Class of 2019 Yearbook'
  },
  {
    schoolName: 'Washington Elementary',
    year: '2018',
    imageUrl: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop',
    title: 'Elementary School Days',
    subtitle: 'Class of 2018 Yearbook'
  },
  {
    schoolName: 'Roosevelt Middle School',
    year: '2017',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
    title: 'Middle School Adventures',
    subtitle: 'Class of 2017 Yearbook'
  },
  {
    schoolName: 'Jefferson High School',
    year: '2021',
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    title: 'Virtual Learning Year',
    subtitle: 'Class of 2021 Yearbook'
  },
  {
    schoolName: 'Madison Elementary',
    year: '2016',
    imageUrl: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop',
    title: 'Elementary Graduation',
    subtitle: 'Class of 2016 Yearbook'
  },
  {
    schoolName: 'Lincoln High School',
    year: '2018',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
    title: 'Sophomore Year',
    subtitle: 'Class of 2018 Yearbook'
  },
  {
    schoolName: 'Washington Elementary',
    year: '2020',
    imageUrl: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop',
    title: 'Remote Learning Memories',
    subtitle: 'Class of 2020 Yearbook'
  }
]

export default function Results() {
  const router = useRouter()
  const [school, setSchool] = useState('')
  const [year, setYear] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Get search parameters from URL
  useEffect(() => {
    const { school: urlSchool, year: urlYear } = router.query
    if (urlSchool) {
      setSchool(urlSchool as string)
      setYear((urlYear as string) || '')
      handleSearch(urlSchool as string, (urlYear as string) || '')
    }
  }, [router.query])

  const handleSearch = async (schoolName: string, yearFilter: string = '') => {
    setLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Filter mock results based on search criteria
    let filteredResults = mockYearbooks.filter(item => 
      item.schoolName.toLowerCase().includes(schoolName.toLowerCase())
    )
    
    if (yearFilter) {
      filteredResults = filteredResults.filter(item => item.year === yearFilter)
    }
    
    setResults(filteredResults)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Search Results - BatchBook</title>
        <meta name="description" content={`School memories from ${school} ${year ? `- ${year}` : ''} on BatchBook`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Search Section */}
          <div className="mb-8">
            <SearchBar className="max-w-2xl mx-auto" />
          </div>

          {/* Results Header */}
          {school && (
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-nostalgic font-bold text-primary-800 mb-4">
                {school}
                {year && ` - Class of ${year}`}
              </h1>
              <p className="text-lg text-gray-600">
                {results.length} {results.length === 1 ? 'yearbook' : 'yearbooks'} found
              </p>
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              <span className="ml-4 text-primary-600 font-medium">Searching memories...</span>
            </div>
          ) : (
            <>
              {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {results.map((item, index) => (
                    <PhotoCard
                      key={`${item.schoolName}-${item.year}-${index}`}
                      schoolName={item.schoolName}
                      year={item.year}
                      imageUrl={item.imageUrl}
                      title={item.title}
                      subtitle={item.subtitle}
                    />
                  ))}
                </div>
              ) : school ? (
                <div className="text-center py-20">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-6xl">📚</span>
                  </div>
                  <h3 className="text-2xl font-nostalgic font-bold text-primary-800 mb-4">
                    No yearbooks found
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    We couldn't find any yearbooks for {school} {year ? `in ${year}` : ''}. 
                    Try a different school name or year.
                  </p>
                  <button
                    onClick={() => router.push('/')}
                    className="btn-primary"
                  >
                    <span className="mr-2">🏠</span>
                    Back to Home
                  </button>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-6xl">🔍</span>
                  </div>
                  <h3 className="text-2xl font-nostalgic font-bold text-primary-800 mb-4">
                    Search for your school
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Use the search form above to find yearbooks and school memories by school name and year.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Popular Schools */}
          {!school && (
            <div className="mt-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-nostalgic font-bold text-primary-800 mb-4">
                  Popular Schools
                </h2>
                <p className="text-gray-600">Browse yearbooks from these popular schools</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {['Lincoln High School', 'Washington Elementary', 'Roosevelt Middle School'].map((schoolName) => (
                  <div key={schoolName} className="card text-center group cursor-pointer">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">🏫</span>
                    </div>
                    <h3 className="text-lg font-nostalgic font-bold text-primary-800 mb-2">
                      {schoolName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Browse yearbooks and memories
                    </p>
                    <button 
                      onClick={() => router.push(`/results?school=${encodeURIComponent(schoolName)}`)}
                      className="btn-secondary text-sm w-full"
                    >
                      View Yearbooks
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
