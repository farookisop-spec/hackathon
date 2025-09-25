import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Heart, Search, BookOpen, User, Share2 } from 'lucide-react';

const Hadith = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [hadiths, setHadiths] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const hadithCollections = [
    { id: 'bukhari', name: 'Sahih al-Bukhari', description: 'The most authentic hadith collection' },
    { id: 'muslim', name: 'Sahih Muslim', description: 'Second most authentic collection' },
    { id: 'abudawud', name: 'Sunan Abu Dawud', description: 'Focus on legal matters' },
    { id: 'tirmidhi', name: 'Jami at-Tirmidhi', description: 'Comprehensive collection' },
    { id: 'nasai', name: 'Sunan an-Nasa\'i', description: 'Rigorous authentication' },
    { id: 'majah', name: 'Sunan Ibn Majah', description: 'Completing the six books' }
  ];

  // Mock hadith data
  const mockHadiths = {
    bukhari: [
      {
        id: 1,
        arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
        english: 'Actions are but by intention and every man shall have only that which he intended.',
        narrator: 'Umar ibn al-Khattab',
        book: 'Book of Revelation',
        grade: 'Sahih',
        reference: 'Bukhari 1'
      },
      {
        id: 2,
        arabic: 'بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ',
        english: 'Islam is built upon five pillars: testifying that there is no god but Allah and that Muhammad is His messenger...',
        narrator: 'Abdullah ibn Umar',
        book: 'Book of Faith',
        grade: 'Sahih',
        reference: 'Bukhari 8'
      }
    ],
    muslim: [
      {
        id: 3,
        arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
        english: 'Whoever believes in Allah and the Last Day should speak good or keep silent.',
        narrator: 'Abu Hurairah',
        book: 'Book of Good Manners',
        grade: 'Sahih',
        reference: 'Muslim 47'
      }
    ]
  };

  useEffect(() => {
    setCollections(hadithCollections);
    setLoading(false);
  }, []);

  const handleCollectionChange = (collectionId) => {
    setSelectedCollection(collectionId);
    setHadiths(mockHadiths[collectionId] || []);
  };

  const filteredHadiths = hadiths.filter(hadith =>
    hadith.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hadith.narrator.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hadith.book.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h1 className="heading-1 mb-2">Hadith Collections</h1>
            <p className="text-muted">
              Explore authentic sayings and teachings of Prophet Muhammad (ﷺ)
            </p>
          </div>

          {/* Controls */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Browse Hadith
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={selectedCollection} onValueChange={handleCollectionChange}>
                  <SelectTrigger data-testid="collection-select">
                    <SelectValue placeholder="Select a collection" />
                  </SelectTrigger>
                  <SelectContent>
                    {collections.map((collection) => (
                      <SelectItem key={collection.id} value={collection.id}>
                        {collection.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search hadith..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                    data-testid="hadith-search-input"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collections Grid */}
          {!selectedCollection && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {collections.map((collection) => (
                <Card
                  key={collection.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleCollectionChange(collection.id)}
                  data-testid={`collection-${collection.id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mr-4">
                        <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{collection.name}</h3>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {mockHadiths[collection.id]?.length || 0} hadith
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted">{collection.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Hadith Display */}
          {selectedCollection && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="heading-2">
                    {collections.find(c => c.id === selectedCollection)?.name}
                  </h2>
                  <p className="text-muted">
                    {filteredHadiths.length} hadith found
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCollection('')}
                >
                  ← Back to Collections
                </Button>
              </div>

              {filteredHadiths.length > 0 ? (
                <div className="space-y-6">
                  {filteredHadiths.map((hadith) => (
                    <Card key={hadith.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <Badge variant="outline" className="text-xs">
                            {hadith.reference}
                          </Badge>
                          <div className="flex space-x-2">
                            <Badge 
                              variant={hadith.grade === 'Sahih' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {hadith.grade}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Arabic Text */}
                        <div className="text-right mb-4">
                          <p className="text-xl font-arabic text-gray-800 dark:text-gray-200 leading-loose">
                            {hadith.arabic}
                          </p>
                        </div>

                        {/* English Translation */}
                        <div className="mb-4">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                            "{hadith.english}"
                          </p>
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-4 text-sm text-muted">
                            <span className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {hadith.narrator}
                            </span>
                            <span className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              {hadith.book}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : selectedCollection ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="heading-3 mb-2">No hadith found</h3>
                    <p className="text-muted">
                      Try adjusting your search terms or select a different collection
                    </p>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          )}

          {/* Empty State */}
          {!selectedCollection && (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Explore Hadith Collections
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Select a collection above to begin reading authentic hadith
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hadith;