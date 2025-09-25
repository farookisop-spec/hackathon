import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Heart, Search, Star, Copy, Share2, BookOpen } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Duas = () => {
  const [duas, setDuas] = useState([]);
  const [filteredDuas, setFilteredDuas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const categories = [
    'Morning', 'Evening', 'Prayer', 'Travel', 'Eating', 'Sleep', 
    'Protection', 'Forgiveness', 'Gratitude', 'Health', 'General'
  ];

  // Mock dua data
  const mockDuas = [
    {
      id: '1',
      title: 'Morning Dua',
      category: 'Morning',
      arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ',
      transliteration: 'Asbahna wa asbahal mulku lillah, walhamdu lillah',
      translation: 'We have reached the morning and with it Allah\'s dominion. All praise is for Allah.',
      reference: 'Recorded by Muslim',
      benefits: 'Reciting this dua in the morning brings blessings and protection for the day.',
      isFavorite: false
    },
    {
      id: '2',
      title: 'Before Eating',
      category: 'Eating',
      arabic: 'بِسْمِ اللَّهِ',
      transliteration: 'Bismillah',
      translation: 'In the name of Allah.',
      reference: 'Recorded by Abu Dawud and At-Tirmidhi',
      benefits: 'Saying Bismillah before eating brings blessings to the food.',
      isFavorite: false
    },
    {
      id: '3',
      title: 'After Eating',
      category: 'Eating',
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
      transliteration: 'Alhamdu lillahil-ladhi at\'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah',
      translation: 'All praise is for Allah, who fed me this and provided it for me without any might nor power from myself.',
      reference: 'Recorded by Abu Dawud, At-Tirmidhi and Ibn Majah',
      benefits: 'This dua expresses gratitude to Allah for His provision.',
      isFavorite: false
    },
    {
      id: '4',
      title: 'Before Sleep',
      category: 'Sleep',
      arabic: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنبِي، وَبِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا',
      transliteration: 'Bismika rabbi wada\'tu janbi, wa bika arfa\'uh, in amsakta nafsi farhamha',
      translation: 'In Your name my Lord, I lie down and in Your name I rise, so if You take my soul then have mercy upon it.',
      reference: 'Recorded by Al-Bukhari and Muslim',
      benefits: 'Seeking Allah\'s protection and mercy before sleep.',
      isFavorite: false
    },
    {
      id: '5',
      title: 'Seeking Forgiveness',
      category: 'Forgiveness',
      arabic: 'رَبِّ اغْفِرْ لِي ذَنبِي وَخَطَئِي وَجَهْلِي',
      transliteration: 'Rabbighfir li dhanbi wa khata\'i wa jahli',
      translation: 'My Lord, forgive me my sin, my error and my ignorance.',
      reference: 'Recorded by Al-Bukhari and Muslim',
      benefits: 'A comprehensive dua for seeking Allah\'s forgiveness.',
      isFavorite: false
    }
  ];

  useEffect(() => {
    // Load duas and favorites from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('favoriteDuas') || '[]');
    const duasWithFavorites = mockDuas.map(dua => ({
      ...dua,
      isFavorite: savedFavorites.includes(dua.id)
    }));
    
    setDuas(duasWithFavorites);
    setFilteredDuas(duasWithFavorites);
    setFavorites(savedFavorites);
    setLoading(false);
  }, []);

  useEffect(() => {
    filterDuas();
  }, [searchQuery, selectedCategory, duas]);

  const filterDuas = () => {
    let filtered = duas;

    if (selectedCategory) {
      filtered = filtered.filter(dua => dua.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(dua =>
        dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dua.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dua.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dua.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDuas(filtered);
  };

  const toggleFavorite = (duaId) => {
    const updatedFavorites = favorites.includes(duaId)
      ? favorites.filter(id => id !== duaId)
      : [...favorites, duaId];
    
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteDuas', JSON.stringify(updatedFavorites));
    
    setDuas(duas.map(dua => ({
      ...dua,
      isFavorite: updatedFavorites.includes(dua.id)
    })));

    toast({
      title: favorites.includes(duaId) ? "Removed from favorites" : "Added to favorites",
      description: favorites.includes(duaId) ? "Dua removed from your favorites" : "Dua added to your favorites",
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Dua text has been copied to clipboard",
    });
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

  return (
    <div className="page-wrapper">
      <div className="content-wrapper">
        <div className="container-custom">
          {/* Header */}
          <div className="mb-8">
            <h1 className="heading-1 mb-2">Islamic Duas</h1>
            <p className="text-muted">
              Collection of authentic duas (supplications) for daily life
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Find Duas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search duas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                    data-testid="dua-search-input"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger data-testid="category-select">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory('');
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </Button>
              </div>

              {/* Category Quick Filters */}
              <div className="flex flex-wrap gap-2 mt-4">
                {categories.slice(0, 6).map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'secondary'}
                    className="cursor-pointer hover:bg-emerald-100"
                    onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Duas List */}
          {filteredDuas.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-muted">
                  {filteredDuas.length} duas found
                  {selectedCategory && ` in ${selectedCategory}`}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {filteredDuas.map((dua) => (
                  <Card key={dua.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{dua.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {dua.category}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(dua.id)}
                            className={dua.isFavorite ? 'text-red-500' : 'text-gray-400'}
                          >
                            <Star className={`h-4 w-4 ${dua.isFavorite ? 'fill-current' : ''}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(dua.arabic + '\n\n' + dua.translation)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Arabic Text */}
                      <div className="text-right mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-2xl font-arabic text-gray-800 dark:text-gray-200 leading-loose">
                          {dua.arabic}
                        </p>
                      </div>

                      {/* Transliteration */}
                      <div className="mb-4">
                        <h4 className="font-medium text-sm text-emerald-600 mb-2">Transliteration:</h4>
                        <p className="text-gray-600 dark:text-gray-300 italic">
                          {dua.transliteration}
                        </p>
                      </div>

                      {/* Translation */}
                      <div className="mb-4">
                        <h4 className="font-medium text-sm text-emerald-600 mb-2">Translation:</h4>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          "{dua.translation}"
                        </p>
                      </div>

                      {/* Benefits */}
                      <div className="mb-4">
                        <h4 className="font-medium text-sm text-emerald-600 mb-2">Benefits:</h4>
                        <p className="text-sm text-muted">
                          {dua.benefits}
                        </p>
                      </div>

                      {/* Reference */}
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center text-sm text-muted">
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span>{dua.reference}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="heading-3 mb-2">No duas found</h3>
                <p className="text-muted mb-4">
                  Try adjusting your search terms or category filter
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Favorites Section */}
          {favorites.length > 0 && !searchQuery && !selectedCategory && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Your Favorite Duas ({favorites.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {duas
                    .filter(dua => favorites.includes(dua.id))
                    .map((dua) => (
                      <div
                        key={dua.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => {
                          document.getElementById(`dua-${dua.id}`)?.scrollIntoView({
                            behavior: 'smooth'
                          });
                        }}
                      >
                        <h4 className="font-medium mb-1">{dua.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {dua.category}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Duas;