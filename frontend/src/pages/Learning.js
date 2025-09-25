import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  GraduationCap, 
  BookOpen, 
  Play, 
  Clock, 
  Users, 
  Star,
  CheckCircle,
  Calendar,
  Target,
  TrendingUp,
  Lightbulb
} from 'lucide-react';

const Learning = () => {
  const { user } = useContext(AuthContext);
  const [dailyContent, setDailyContent] = useState(null);
  const [learningContent, setLearningContent] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);

  // Mock learning content categories
  const categories = [
    {
      id: 'fiqh',
      name: 'Fiqh',
      description: 'Islamic Jurisprudence',
      icon: '⚖️',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'seerah',
      name: 'Seerah',
      description: 'Life of Prophet Muhammad (ﷺ)',
      icon: '🕌',
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'tafsir',
      name: 'Tafsir',
      description: 'Quranic Commentary',
      icon: '📖',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'hadith',
      name: 'Hadith Studies',
      description: 'Prophetic Traditions',
      icon: '💎',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'history',
      name: 'Islamic History',
      description: 'Islamic Civilization',
      icon: '🏛️',
      color: 'bg-red-100 text-red-800'
    },
    {
      id: 'duas',
      name: 'Duas & Dhikr',
      description: 'Supplications & Remembrance',
      icon: '🤲',
      color: 'bg-indigo-100 text-indigo-800'
    }
  ];

  // Mock learning videos/courses
  const mockLearningContent = [
    {
      id: 1,
      title: 'Understanding Salah - The Five Daily Prayers',
      description: 'Complete guide to performing the five daily prayers correctly',
      category: 'fiqh',
      instructor: 'Sheikh Abdullah Rahman',
      duration: '45 min',
      difficulty: 'Beginner',
      views: 12500,
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=300',
      progress: 0,
      lessons: 8
    },
    {
      id: 2,
      title: 'The Early Life of Prophet Muhammad (ﷺ)',
      description: 'Exploring the birth, childhood and early years of the Prophet',
      category: 'seerah',
      instructor: 'Dr. Aisha Mohamed',
      duration: '60 min',
      difficulty: 'Intermediate',
      views: 8900,
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300',
      progress: 30,
      lessons: 12
    },
    {
      id: 3,
      title: 'Tafsir of Surah Al-Fatiha',
      description: 'Deep dive into the opening chapter of the Quran',
      category: 'tafsir',
      instructor: 'Imam Hassan Ali',
      duration: '90 min',
      difficulty: 'Advanced',
      views: 15600,
      rating: 5.0,
      thumbnail: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=300',
      progress: 80,
      lessons: 15
    },
    {
      id: 4,
      title: 'Authentic Hadith Collection Methods',
      description: 'Learn how Islamic scholars collected and verified hadith',
      category: 'hadith',
      instructor: 'Dr. Omar Suleiman',
      duration: '75 min',
      difficulty: 'Intermediate',
      views: 6700,
      rating: 4.7,
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300',
      progress: 0,
      lessons: 10
    },
    {
      id: 5,
      title: 'The Golden Age of Islam',
      description: 'Explore Islamic contributions to science, philosophy, and arts',
      category: 'history',
      instructor: 'Prof. Fatima Al-Zahra',
      duration: '120 min',
      difficulty: 'Intermediate',
      views: 9800,
      rating: 4.6,
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      progress: 50,
      lessons: 20
    },
    {
      id: 6,
      title: 'Daily Duas for Every Muslim',
      description: 'Essential supplications for morning, evening, and daily activities',
      category: 'duas',
      instructor: 'Sheikh Yasir Qadhi',
      duration: '40 min',
      difficulty: 'Beginner',
      views: 18900,
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=300',
      progress: 100,
      lessons: 6
    }
  ];

  useEffect(() => {
    loadDailyContent();
    loadLearningContent();
  }, []);

  const loadDailyContent = () => {
    // Simulate AI-generated daily content (would use InvokeLLM in real implementation)
    const contentTypes = ['hadith', 'verse', 'dua'];
    const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
    
    const dailyContentSamples = {
      hadith: {
        type: 'Daily Hadith',
        title: 'On Seeking Knowledge',
        arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
        translation: 'Whoever takes a path upon which to obtain knowledge, Allah makes the path to Paradise easy for him.',
        source: 'Sahih Muslim',
        reflection: 'This hadith emphasizes the great reward Allah has promised for those who seek knowledge. Every step taken in pursuit of Islamic knowledge is a step closer to Paradise.'
      },
      verse: {
        type: 'Daily Verse',
        title: 'Quran 20:114',
        arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
        translation: 'And say: "My Lord, increase me in knowledge."',
        source: 'Surah Ta-Ha',
        reflection: 'This beautiful dua teaches us to constantly seek more knowledge. The Prophet (ﷺ) was commanded to ask for increase in knowledge, showing its immense value in Islam.'
      },
      dua: {
        type: 'Daily Dua',
        title: 'Dua for Beneficial Knowledge',
        arabic: 'اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي، وَعَلِّمْنِي مَا يَنْفَعُنِي، وَزِدْنِي عِلْمًا',
        translation: 'O Allah, benefit me with what You have taught me, teach me what will benefit me, and increase me in knowledge.',
        source: 'Sunan Ibn Majah',
        reflection: 'This comprehensive dua asks Allah for beneficial knowledge and the ability to benefit from what we learn.'
      }
    };
    
    setDailyContent(dailyContentSamples[randomType]);
  };

  const loadLearningContent = () => {
    setLearningContent(mockLearningContent);
    
    // Mock user progress
    const progress = {};
    mockLearningContent.forEach(content => {
      progress[content.id] = {
        completed: content.progress === 100,
        progress: content.progress,
        timeSpent: Math.floor(Math.random() * 60) + 10 // 10-70 minutes
      };
    });
    setUserProgress(progress);
    setLoading(false);
  };

  const markContentReflected = () => {
    // In real implementation, this would update user progress in backend
    setDailyContent({
      ...dailyContent,
      reflected: true
    });
  };

  const startCourse = (courseId) => {
    // In real implementation, this would navigate to video player and track progress
    console.log('Starting course:', courseId);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="content-wrapper">
          <div className="container-custom">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const completedCourses = Object.values(userProgress).filter(p => p.completed).length;
  const totalProgress = Object.values(userProgress).reduce((sum, p) => sum + p.progress, 0) / learningContent.length;

  return (
    <div className="page-wrapper">
      <div className="content-wrapper">
        <div className="container-custom">
          {/* Header */}
          <div className="mb-8">
            <h1 className="heading-1 mb-2">Islamic Learning</h1>
            <p className="text-muted">
              Deepen your knowledge of Islam through structured courses and daily content
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Daily Content Card */}
              {dailyContent && (
                <Card className="mb-8 border-l-4 border-l-emerald-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Lightbulb className="h-5 w-5 mr-2" />
                        {dailyContent.type}
                      </CardTitle>
                      <Badge variant="secondary">
                        <Calendar className="h-3 w-3 mr-1" />
                        Today
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">{dailyContent.title}</h3>
                      
                      <div className="text-right p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-xl leading-loose text-gray-800 dark:text-gray-200" dir="rtl" style={{fontFamily: 'Amiri, serif'}}>
                          {dailyContent.arabic}
                        </p>
                      </div>
                      
                      <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                        "{dailyContent.translation}"
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-muted">
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {dailyContent.source}
                        </span>
                      </div>
                      
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                        <h4 className="font-medium text-emerald-800 dark:text-emerald-200 mb-2">Reflection</h4>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300">
                          {dailyContent.reflection}
                        </p>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          onClick={markContentReflected}
                          variant={dailyContent.reflected ? "secondary" : "default"}
                          disabled={dailyContent.reflected}
                          className={dailyContent.reflected ? "" : "bg-emerald-600 hover:bg-emerald-700"}
                        >
                          {dailyContent.reflected ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Reflected
                            </>
                          ) : (
                            <>
                              <Target className="h-4 w-4 mr-2" />
                              Mark as Reflected
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Learning Content Tabs */}
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-7">
                  <TabsTrigger value="all">All</TabsTrigger>
                  {categories.slice(0, 6).map(category => (
                    <TabsTrigger key={category.id} value={category.id}>
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {learningContent.map((content) => (
                      <Card key={content.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                          <div className="relative">
                            <img
                              src={content.thumbnail}
                              alt={content.title}
                              className="w-full h-48 object-cover rounded-t-lg"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop';
                              }}
                            />
                            <div className="absolute top-4 left-4">
                              <Badge className={categories.find(c => c.id === content.category)?.color}>
                                {categories.find(c => c.id === content.category)?.name}
                              </Badge>
                            </div>
                            <div className="absolute top-4 right-4">
                              <Badge className={getDifficultyColor(content.difficulty)}>
                                {content.difficulty}
                              </Badge>
                            </div>
                            <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {content.duration}
                            </div>
                          </div>
                          
                          <div className="p-6">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{content.title}</h3>
                            <p className="text-sm text-muted mb-3 line-clamp-2">{content.description}</p>
                            
                            <div className="flex items-center justify-between text-sm text-muted mb-3">
                              <span>{content.instructor}</span>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                {content.rating}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-muted mb-4">
                              <span className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {content.views.toLocaleString()} views
                              </span>
                              <span>{content.lessons} lessons</span>
                            </div>
                            
                            {content.progress > 0 && (
                              <div className="mb-4">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Progress</span>
                                  <span>{content.progress}%</span>
                                </div>
                                <Progress value={content.progress} className="h-2" />
                              </div>
                            )}
                            
                            <Button 
                              onClick={() => startCourse(content.id)}
                              className="w-full bg-emerald-600 hover:bg-emerald-700"
                            >
                              <Play className="h-4 w-4 mr-2" />
                              {content.progress > 0 ? 'Continue Learning' : 'Start Course'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {categories.map(category => (
                  <TabsContent key={category.id} value={category.id} className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {learningContent
                        .filter(content => content.category === category.id)
                        .map((content) => (
                          <Card key={content.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <h3 className="font-semibold text-lg mb-2">{content.title}</h3>
                              <p className="text-sm text-muted mb-4">{content.description}</p>
                              <Button 
                                onClick={() => startCourse(content.id)}
                                className="w-full bg-emerald-600 hover:bg-emerald-700"
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Start Course
                              </Button>
                            </CardContent>
                          </Card>
                        ))
                      }
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Learning Stats */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Progress</span>
                        <span>{Math.round(totalProgress)}%</span>
                      </div>
                      <Progress value={totalProgress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-emerald-600">{completedCourses}</p>
                        <p className="text-xs text-muted">Completed</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{learningContent.length - completedCourses}</p>
                        <p className="text-xs text-muted">In Progress</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Learning Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                        <span className="text-2xl mr-3">{category.icon}</span>
                        <div>
                          <h4 className="font-medium">{category.name}</h4>
                          <p className="text-xs text-muted">{category.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;