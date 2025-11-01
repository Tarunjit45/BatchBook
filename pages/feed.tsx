import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { 
  FiArrowLeft, 
  FiClock, 
  FiMapPin, 
  FiUser, 
  FiImage, 
  FiHeart, 
  FiMessageSquare, 
  FiShare2, 
  FiX,
  FiSend,
  FiMoreHorizontal
} from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Header from '../components/Header';

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

interface Memory {
  id: string;
  imageUrl: string;
  schoolName: string;
  uploaderName: string;
  uploadDate: string;
  year: number;
  title: string;
  description: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  showComments: boolean;
  showCommentInput: boolean;
  newComment: string;
  showShareOptions: boolean;
}

export default function Feed() {
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const commentInputRefs = useRef<{[key: string]: HTMLInputElement | null}>({});
  const shareMenuRef = useRef<HTMLDivElement>(null);
  
  // Close share menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setMemories(memories => 
          memories.map(memory => ({
            ...memory,
            showShareOptions: false
          }))
        );
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Fetch memories from API
    const fetchMemories = async () => {
      try {
        const response = await fetch('/api/photos');
        const data = await response.json();
        
        if (data.success && data.photos.length > 0) {
          // Transform API data to component format
          const transformedMemories: Memory[] = data.photos.map((photo: any) => ({
            id: photo.id,
            imageUrl: photo.imageUrl,
            schoolName: photo.schoolName,
            uploaderName: photo.uploaderName,
            uploadDate: photo.uploadDate,
            year: photo.year,
            title: photo.title,
            description: photo.description,
            likes: photo.likes || 0,
            isLiked: photo.isLiked || false,
            comments: photo.comments || [],
            showComments: false,
            showCommentInput: false,
            newComment: '',
            showShareOptions: false
          }));
          
          setMemories(transformedMemories);
          setLoading(false);
        } else {
          // Use mock data if no real data available
          const mockMemories: Memory[] = [
            {
              id: '1',
              imageUrl: '/images/placeholder-image.jpg',
              schoolName: 'Example High School',
              uploaderName: 'John Doe',
              uploadDate: '2023-05-15',
              year: 2020,
              title: 'Graduation Day',
              description: 'Our final day at school. So many memories!',
              likes: 24,
              isLiked: false,
              comments: [
                {
                  id: 'c1',
                  user: 'Jane Smith',
                  text: 'This brings back so many memories!',
                  timestamp: '2023-05-16T10:30:00Z'
                },
                {
                  id: 'c2',
                  user: 'Mike Johnson',
                  text: 'Best class ever!',
                  timestamp: '2023-05-16T11:45:00Z'
                }
              ],
              showComments: false,
              showCommentInput: false,
              newComment: '',
              showShareOptions: false
            },
            {
              id: '2',
              imageUrl: '/images/placeholder-image.jpg',
              schoolName: 'Central College',
              uploaderName: 'Sarah Williams',
              uploadDate: '2023-06-10',
              year: 2021,
              title: 'Annual Sports Day',
              description: 'Won first place in the relay race!',
              likes: 15,
              isLiked: true,
              comments: [],
              showComments: false,
              showCommentInput: false,
              newComment: '',
              showShareOptions: false
            }
          ];
          
          setMemories(mockMemories);
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to load memories. Please try again later.');
        setLoading(false);
        console.error('Error fetching memories:', err);
      }
    };

    fetchMemories();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const toggleLike = (memoryId: string) => {
    setMemories(memories => 
      memories.map(memory => 
        memory.id === memoryId 
          ? { 
              ...memory, 
              isLiked: !memory.isLiked,
              likes: memory.isLiked ? memory.likes - 1 : memory.likes + 1
            } 
          : memory
      )
    );
  };

  const toggleComments = (memoryId: string) => {
    setMemories(memories => 
      memories.map(memory => 
        memory.id === memoryId 
          ? { 
              ...memory, 
              showComments: !memory.showComments,
              showCommentInput: memory.showComments ? false : memory.showCommentInput
            } 
          : memory
      )
    );
  };

  const toggleCommentInput = (memoryId: string) => {
    setMemories(memories => 
      memories.map(memory => 
        memory.id === memoryId 
          ? { ...memory, showCommentInput: !memory.showCommentInput } 
          : memory
      )
    );
    
    // Focus the input field when it becomes visible
    setTimeout(() => {
      const input = commentInputRefs.current[memoryId];
      if (input) {
        input.focus();
      }
    }, 0);
  };

  const toggleShareOptions = (e: React.MouseEvent, memoryId: string) => {
    e.stopPropagation();
    setMemories(memories => 
      memories.map(memory => 
        memory.id === memoryId 
          ? { ...memory, showShareOptions: !memory.showShareOptions } 
          : { ...memory, showShareOptions: false }
      )
    );
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>, memoryId: string) => {
    setMemories(memories => 
      memories.map(memory => 
        memory.id === memoryId 
          ? { ...memory, newComment: e.target.value } 
          : memory
      )
    );
  };

  const handleAddComment = (e: React.FormEvent, memoryId: string) => {
    e.preventDefault();
    const memory = memories.find(m => m.id === memoryId);
    if (!memory || !memory.newComment.trim()) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      user: 'Current User', // Replace with actual user
      text: memory.newComment,
      timestamp: new Date().toISOString()
    };

    setMemories(memories => 
      memories.map(m => 
        m.id === memoryId 
          ? { 
              ...m, 
              comments: [...m.comments, newComment],
              newComment: '',
              showCommentInput: false
            } 
          : m
      )
    );
  };

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnSocialMedia = (platform: string) => {
    // Implement sharing logic for different platforms
    const url = window.location.href;
    const title = 'Check out this memory on BatchBook!';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, '_blank');
        break;
      default:
        break;
    }
    
    // Close the share menu
    setMemories(memories => 
      memories.map(memory => ({
        ...memory,
        showShareOptions: false
      }))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center text-primary-600 hover:text-primary-800 mb-6 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Home
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Memory Feed</h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          ) : memories.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <FiImage className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No memories yet</h3>
              <p className="text-gray-500">Be the first to share your school memories!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {memories.map((memory) => (
                <motion.div 
                  key={memory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Memory Header */}
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary-600 font-medium text-sm">
                          {memory.uploaderName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{memory.uploaderName}</p>
                        <p className="text-xs text-gray-500">{formatDate(memory.uploadDate)}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button 
                        onClick={(e) => toggleShareOptions(e, memory.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <FiMoreHorizontal />
                      </button>
                      
                      {/* Share Dropdown */}
                      <AnimatePresence>
                        {memory.showShareOptions && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-10 overflow-hidden"
                            ref={shareMenuRef}
                          >
                            <div className="p-2">
                              <CopyToClipboard 
                                text={window.location.href} 
                                onCopy={handleCopyLink}
                              >
                                <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                  {copied ? 'Link Copied!' : 'Copy Link'}
                                </button>
                              </CopyToClipboard>
                              <button 
                                onClick={() => shareOnSocialMedia('facebook')}
                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                              >
                                Share on Facebook
                              </button>
                              <button 
                                onClick={() => shareOnSocialMedia('twitter')}
                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                              >
                                Share on Twitter
                              </button>
                              <button 
                                onClick={() => shareOnSocialMedia('whatsapp')}
                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                              >
                                Share on WhatsApp
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  {/* Memory Content */}
                  <div className="md:flex">
                    <div className="md:flex-shrink-0 md:w-64 h-48 bg-gray-100 relative group overflow-hidden">
                      <motion.img 
                        className="w-full h-full object-cover"
                        src={memory.imageUrl} 
                        alt={`${memory.schoolName} - ${memory.title}`}
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                            <motion.span 
                              className="text-white text-lg font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                            >
                              View Full Image
                            </motion.span>
                          </div>
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <FiMapPin className="mr-1 flex-shrink-0" />
                        <span className="truncate">{memory.schoolName} • {memory.year} Batch</span>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">{memory.title}</h2>
                      <p className="text-gray-600 mb-4">{memory.description}</p>
                      
                      {/* Like and Comment Stats */}
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <div className="flex items-center mr-4">
                          <div className="flex -space-x-1 mr-1">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="w-5 h-5 rounded-full bg-primary-100 border-2 border-white"></div>
                            ))}
                          </div>
                          <span>{memory.likes} likes</span>
                        </div>
                        <div>
                          <span>{memory.comments.length} comments</span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex border-t border-b border-gray-100 py-2">
                        <button 
                          onClick={() => toggleLike(memory.id)}
                          className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-colors ${memory.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                        >
                          <motion.span
                            animate={{ scale: memory.isLiked ? [1, 1.2, 1] : 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {memory.isLiked ? <FaHeart className="mr-2" /> : <FiHeart className="mr-2" />}
                          </motion.span>
                          Like
                        </button>
                        <button 
                          onClick={() => toggleComments(memory.id)}
                          className="flex-1 flex items-center justify-center py-2 text-gray-500 hover:text-primary-600 rounded-lg transition-colors"
                        >
                          <FiMessageSquare className="mr-2" />
                          Comment
                        </button>
                        <button 
                          onClick={(e) => toggleShareOptions(e, memory.id)}
                          className="flex-1 flex items-center justify-center py-2 text-gray-500 hover:text-primary-600 rounded-lg transition-colors relative"
                        >
                          <FiShare2 className="mr-2" />
                          Share
                        </button>
                      </div>
                      
                      {/* Comments Section */}
                      <AnimatePresence>
                        {memory.showComments && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 space-y-3">
                              {memory.comments.length > 0 ? (
                                memory.comments.map(comment => (
                                  <motion.div 
                                    key={comment.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-start space-x-2"
                                  >
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex-shrink-0"></div>
                                    <div className="bg-gray-50 px-3 py-2 rounded-lg flex-1">
                                      <p className="text-sm font-medium">{comment.user}</p>
                                      <p className="text-sm text-gray-700">{comment.text}</p>
                                      <p className="text-xs text-gray-400 mt-1">
                                        {formatDate(comment.timestamp)}
                                      </p>
                                    </div>
                                  </motion.div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                              )}
                            </div>
                            
                            {/* Add Comment */}
                            <motion.form 
                              onSubmit={(e) => handleAddComment(e, memory.id)}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-4 flex items-center"
                            >
                              <input
                                type="text"
                                value={memory.newComment}
                                onChange={(e) => handleCommentChange(e, memory.id)}
                                placeholder="Write a comment..."
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                                ref={el => commentInputRefs.current[memory.id] = el}
                              />
                              <button 
                                type="submit"
                                disabled={!memory.newComment.trim()}
                                className={`ml-2 p-2 rounded-full ${memory.newComment.trim() ? 'text-primary-600 hover:bg-primary-50' : 'text-gray-300'} transition-colors`}
                              >
                                <FiSend />
                              </button>
                            </motion.form>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Add Comment Button (when comments are hidden) */}
                      {!memory.showComments && (
                        <div className="mt-4 flex items-center">
                          <div className="flex-1 h-px bg-gray-100"></div>
                          <button 
                            onClick={() => toggleCommentInput(memory.id)}
                            className="ml-4 text-sm text-gray-500 hover:text-primary-600 transition-colors"
                          >
                            Add a comment...
                          </button>
                          <div className="flex-1 h-px bg-gray-100"></div>
                        </div>
                      )}
                      
                      {/* Add Comment Input (when comments are hidden) */}
                      <AnimatePresence>
                        {!memory.showComments && memory.showCommentInput && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <motion.form 
                              onSubmit={(e) => handleAddComment(e, memory.id)}
                              className="mt-4 flex items-center"
                            >
                              <input
                                type="text"
                                value={memory.newComment}
                                onChange={(e) => handleCommentChange(e, memory.id)}
                                placeholder="Write a comment..."
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                                ref={el => commentInputRefs.current[memory.id] = el}
                              />
                              <button 
                                type="submit"
                                disabled={!memory.newComment.trim()}
                                className={`ml-2 p-2 rounded-full ${memory.newComment.trim() ? 'text-primary-600 hover:bg-primary-50' : 'text-gray-300'} transition-colors`}
                              >
                                <FiSend />
                              </button>
                            </motion.form>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
