interface MockResult {
  id: string
  title: string
  description: string
  imageUrl: string
  author: string
  tags: string[]
  category: string
  likes: number
  liked: boolean
  saved: boolean
  createdAt: Date
}

const sampleImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop'
]

const sampleTitles = [
  'Mountain Landscape at Sunset',
  'Urban Architecture in Black and White',
  'Abstract Digital Art Composition',
  'Natural Forest Path Leading to Adventure',
  'Modern City Skyline at Night',
  'Peaceful Lake Reflection',
  'Colorful Street Art Mural',
  'Cozy Coffee Shop Interior',
  'Vintage Car in Desert Setting',
  'Ocean Waves Crashing on Rocks',
  'Minimalist Design Poster',
  'Wildlife Photography in Action'
]

const sampleDescriptions = [
  'A breathtaking view of mountain peaks bathed in golden sunlight during the golden hour.',
  'Stark contrast between light and shadow in this architectural photography piece.',
  'Modern digital art featuring geometric shapes and vibrant color gradients.',
  'A winding forest trail that invites exploration and adventure into nature.',
  'The city comes alive at night with thousands of twinkling lights.',
  'Perfect mirror-like reflection of surrounding trees and sky in the calm water.',
  'Vibrant street art that transforms urban spaces into canvases of expression.',
  'Warm and inviting atmosphere perfect for relaxation and conversation.',
  'Classic automobile against the backdrop of endless desert dunes.',
  'The raw power and beauty of ocean waves meeting rocky coastline.',
  'Clean, simple design that communicates through minimal elements.',
  'Capturing the essence of wildlife in their natural habitat.'
]

const sampleAuthors = [
  'Alex Johnson',
  'Sarah Chen',
  'Mike Rodriguez',
  'Emma Thompson',
  'David Kim',
  'Lisa Wang',
  'Tom Wilson',
  'Anna Martinez',
  'Chris Brown',
  'Julia Davis',
  'Ryan Taylor',
  'Maria Garcia'
]

const categories = ['photography', 'design', 'art', 'technology', 'nature']

export function generateMockResults(query: string, count: number = 12): MockResult[] {
  const results: MockResult[] = []
  
  for (let i = 0; i < count; i++) {
    const category = categories[i % categories.length]
    const tags = generateTags(query, category)
    
    results.push({
      id: `result-${i + 1}`,
      title: sampleTitles[i % sampleTitles.length],
      description: sampleDescriptions[i % sampleDescriptions.length],
      imageUrl: sampleImages[i % sampleImages.length],
      author: sampleAuthors[i % sampleAuthors.length],
      tags,
      category,
      likes: Math.floor(Math.random() * 1000) + 10,
      liked: Math.random() > 0.7,
      saved: Math.random() > 0.8,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
    })
  }
  
  return results
}

function generateTags(query: string, category: string): string[] {
  const baseTags = [category]
  
  // Add query-related tags
  const queryWords = query.toLowerCase().split(' ')
  baseTags.push(...queryWords.slice(0, 2))
  
  // Add some random tags based on category
  const categoryTags = {
    photography: ['landscape', 'portrait', 'nature', 'urban'],
    design: ['minimalist', 'modern', 'typography', 'branding'],
    art: ['abstract', 'digital', 'painting', 'sculpture'],
    technology: ['ai', 'innovation', 'future', 'digital'],
    nature: ['outdoor', 'wildlife', 'conservation', 'environment']
  }
  
  const availableTags = categoryTags[category as keyof typeof categoryTags] || []
  const randomTags = availableTags.sort(() => 0.5 - Math.random()).slice(0, 2)
  
  return [...baseTags, ...randomTags].slice(0, 4)
}

export function searchResults(query: string, results: MockResult[]): MockResult[] {
  if (!query.trim()) return results
  
  const searchTerm = query.toLowerCase()
  
  return results.filter(result =>
    result.title.toLowerCase().includes(searchTerm) ||
    result.description.toLowerCase().includes(searchTerm) ||
    result.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    result.author.toLowerCase().includes(searchTerm)
  )
}

export function sortResults(results: MockResult[], sortBy: string): MockResult[] {
  const sorted = [...results]
  
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    case 'oldest':
      return sorted.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    case 'popular':
      return sorted.sort((a, b) => b.likes - a.likes)
    case 'relevance':
    default:
      return sorted
  }
}
