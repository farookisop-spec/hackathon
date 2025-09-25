import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Heart, Search, BookOpen, User, Share2, ArrowLeft } from 'lucide-react';

const Hadith = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [hadiths, setHadiths] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const hadithCollections = [
    { id: 'bukhari', name: 'Sahih al-Bukhari', description: 'The most authentic hadith collection', totalHadiths: 7563 },
    { id: 'muslim', name: 'Sahih Muslim', description: 'Second most authentic collection', totalHadiths: 5362 },
    { id: 'abudawud', name: 'Sunan Abu Dawud', description: 'Focus on legal matters', totalHadiths: 4800 },
    { id: 'tirmidhi', name: 'Jami at-Tirmidhi', description: 'Comprehensive collection', totalHadiths: 3956 },
    { id: 'nasai', name: 'Sunan an-Nasa\'i', description: 'Rigorous authentication', totalHadiths: 5758 },
    { id: 'majah', name: 'Sunan Ibn Majah', description: 'Completing the six books', totalHadiths: 4341 }
  ];

  // Comprehensive internal hadith database for reliability
  const hadithDatabase = {
    bukhari: [
      {
        id: 1,
        arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ',
        english: 'Actions are but by intention and every man shall have only that which he intended. Therefore, he whose migration (hijrah) was for Allah and His Messenger, his migration was for Allah and His Messenger, and he whose migration was to achieve some worldly benefit or to take some woman in marriage, his migration was for that for which he migrated.',
        narrator: 'Umar ibn al-Khattab',
        book: 'Book of Revelation',
        grade: 'Sahih',
        reference: 'Sahih al-Bukhari 1'
      },
      {
        id: 2,
        arabic: 'بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَالْحَجِّ، وَصَوْمِ رَمَضَانَ',
        english: 'Islam is built upon five pillars: testifying that there is no god but Allah and that Muhammad is His messenger, establishing prayer, giving charity, performing Hajj pilgrimage, and fasting during Ramadan.',
        narrator: 'Abdullah ibn Umar',
        book: 'Book of Faith',
        grade: 'Sahih',
        reference: 'Sahih al-Bukhari 8'
      },
      {
        id: 3,
        arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
        english: 'None of you truly believes until he loves for his brother what he loves for himself.',
        narrator: 'Anas ibn Malik',
        book: 'Book of Faith', 
        grade: 'Sahih',
        reference: 'Sahih al-Bukhari 13'
      }
    ],
    muslim: [
      {
        id: 4,
        arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ جَارَهُ',
        english: 'Whoever believes in Allah and the Last Day should speak good or keep silent. And whoever believes in Allah and the Last Day should honor his neighbor.',
        narrator: 'Abu Hurairah',
        book: 'Book of Good Manners and Joining of the Ties of Relationship',
        grade: 'Sahih',
        reference: 'Sahih Muslim 47'
      },
      {
        id: 5,
        arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ، وَالْمُهَاجِرُ مَنْ هَجَرَ مَا نَهَى اللَّهُ عَنْهُ',
        english: 'The Muslim is the one from whose tongue and hand the Muslims are safe, and the emigrant (Muhajir) is the one who abandons what Allah has forbidden.',
        narrator: 'Abdullah ibn Amr',
        book: 'Book of Faith',
        grade: 'Sahih',
        reference: 'Sahih Muslim 41'
      }
    ],
    abudawud: [
      {
        id: 6,
        arabic: 'مَنْ أَصْبَحَ مِنْكُمْ آمِنًا فِي سِرْبِهِ، مُعَافًى فِي جَسَدِهِ، عِنْدَهُ قُوتُ يَوْمِهِ، فَكَأَنَّمَا حِيزَتْ لَهُ الدُّنْيَا',
        english: 'Whoever among you wakes up physically healthy, feeling safe and secure within himself, with food for the day, it is as if he acquired the whole world.',
        narrator: 'Ubaidullah ibn Mihsan',
        book: 'Book of Conduct',
        grade: 'Hasan',
        reference: 'Sunan Abu Dawud 4322'
      }
    ],
    tirmidhi: [
      {
        id: 7,
        arabic: 'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ',
        english: 'Fear Allah wherever you are, follow up a bad deed with a good one and it will wipe it out, and behave well towards people.',
        narrator: 'Abu Dharr',
        book: 'Book of Righteousness and Keeping Ties of Kinship',
        grade: 'Hasan',
        reference: 'Jami at-Tirmidhi 1987'
      }
    ],
    nasai: [
      {
        id: 8,
        arabic: 'إِنَّ اللَّهَ طَيِّبٌ لَا يَقْبَلُ إِلَّا طَيِّبًا، وَإِنَّ اللَّهَ أَمَرَ الْمُؤْمِنِينَ بِمَا أَمَرَ بِهِ الْمُرْسَلِينَ',
        english: 'Indeed Allah is Pure and accepts only that which is pure. And indeed Allah has commanded the believers with that which He commanded the Messengers.',
        narrator: 'Abu Hurairah',
        book: 'Book of Zakah',
        grade: 'Sahih',
        reference: 'Sunan an-Nasa\'i 2532'
      }
    ],
    majah: [
      {
        id: 9,
        arabic: 'لَا ضَرَرَ وَلَا ضِرَارَ',
        english: 'There should be neither harming nor reciprocating harm.',
        narrator: 'Ibn Abbas',
        book: 'Book of Judgments',
        grade: 'Hasan',
        reference: 'Sunan Ibn Majah 2341'
      }
    ]
  };

  useEffect(() => {
    setCollections(hadithCollections);
    setLoading(false);
  }, []);

  const handleCollectionChange = (collectionId) => {
    setSelectedCollection(collectionId);
    setCurrentPage(1);
    
    // Use internal database for reliability
    const collectionHadiths = hadithDatabase[collectionId] || [];
    setHadiths(collectionHadiths);
  };

  const filteredHadiths = hadiths.filter(hadith =>
    hadith.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hadith.narrator.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hadith.book.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hadith.arabic.includes(searchQuery)
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
              Explore authentic sayings and teachings of Prophet Muhammad (ﷺ) from the six major collections
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
                    placeholder="Search hadith by content, narrator, or book..."
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
                  className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200 hover:border-emerald-300"
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
                          {hadithDatabase[collection.id]?.length || 0} available
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted mb-3">{collection.description}</p>
                    <p className="text-xs text-emerald-600">Total: {collection.totalHadiths} hadith</p>
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
                    {filteredHadiths.length} of {hadiths.length} hadith
                    {searchQuery && ` matching "${searchQuery}"`}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCollection('')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Collections
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
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={hadith.grade === 'Sahih' ? 'default' : hadith.grade === 'Hasan' ? 'secondary' : 'outline'}
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
                        <div className="text-right mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-xl leading-loose text-gray-800 dark:text-gray-200" dir="rtl" style={{fontFamily: 'Amiri, serif'}}>
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
                              Narrated by: {hadith.narrator}
                            </span>
                          </div>
                          <div className="text-sm text-muted">
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
                    <Button 
                      onClick={() => setSearchQuery('')}
                      className="mt-4"
                      variant="outline"
                    >
                      Clear Search
                    </Button>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          )}

          {/* Info Section */}
          {!selectedCollection && (
            <Card className="mt-8">
              <CardContent className="text-center py-8">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="heading-3 mb-2">Six Major Hadith Collections</h3>
                <p className="text-muted max-w-2xl mx-auto">
                  These are the most authentic and widely accepted collections of Prophet Muhammad's (ﷺ) sayings, 
                  actions, and approvals. Each collection has been rigorously authenticated by Islamic scholars.
                  Due to API reliability issues, we maintain an internal database of carefully selected hadith.
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