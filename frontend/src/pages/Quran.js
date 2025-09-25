import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { BookOpen, Search, Play, Bookmark, Share2, ArrowLeft } from 'lucide-react';

const Quran = () => {
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [verses, setVerses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [versesLoading, setVersesLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSurahs();
  }, []);

  const fetchSurahs = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.alquran.cloud/v1/surah');
      const data = await response.json();
      
      if (data.code === 200) {
        setSurahs(data.data);
      } else {
        // Fallback data
        setSurahs([
          { number: 1, name: 'الفاتحة', englishName: 'Al-Fatiha', englishNameTranslation: 'The Opening', numberOfAyahs: 7, revelationType: 'Meccan' },
          { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', englishNameTranslation: 'The Cow', numberOfAyahs: 286, revelationType: 'Medinan' },
          { number: 3, name: 'آل عمران', englishName: 'Ali \'Imran', englishNameTranslation: 'Family of Imran', numberOfAyahs: 200, revelationType: 'Medinan' },
          { number: 4, name: 'النساء', englishName: 'An-Nisa', englishNameTranslation: 'The Women', numberOfAyahs: 176, revelationType: 'Medinan' },
          { number: 5, name: 'المائدة', englishName: 'Al-Ma\'idah', englishNameTranslation: 'The Table Spread', numberOfAyahs: 120, revelationType: 'Medinan' }
        ]);
        toast({
          title: "Using offline data",
          description: "Could not connect to Quran API, showing sample data",
        });
      }
    } catch (error) {
      console.error('Error fetching surahs:', error);
      // Use fallback data
      setSurahs([
        { number: 1, name: 'الفاتحة', englishName: 'Al-Fatiha', englishNameTranslation: 'The Opening', numberOfAyahs: 7, revelationType: 'Meccan' },
        { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', englishNameTranslation: 'The Cow', numberOfAyahs: 286, revelationType: 'Medinan' },
        { number: 3, name: 'آل عمران', englishName: 'Ali \'Imran', englishNameTranslation: 'Family of Imran', numberOfAyahs: 200, revelationType: 'Medinan' }
      ]);
      toast({
        title: "Connection error",
        description: "Using offline Quran data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSurahClick = async (surah) => {
    setSelectedSurah(surah);
    setVersesLoading(true);
    
    try {
      // Fetch Arabic text
      const arabicResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surah.number}`);
      const arabicData = await arabicResponse.json();
      
      // Fetch English translation
      const englishResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/en.asad`);
      const englishData = await englishResponse.json();
      
      if (arabicData.code === 200 && englishData.code === 200) {
        const combinedVerses = arabicData.data.ayahs.map((ayah, index) => ({
          number: ayah.numberInSurah,
          arabic: ayah.text,
          translation: englishData.data.ayahs[index]?.text || 'Translation not available'
        }));
        setVerses(combinedVerses);
      } else {
        // Fallback verses
        const fallbackVerses = [
          {
            number: 1,
            arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
            translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.'
          },
          {
            number: 2,
            arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
            translation: '[All] praise is [due] to Allah, Lord of the worlds -'
          },
          {
            number: 3,
            arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
            translation: 'The Entirely Merciful, the Especially Merciful,'
          }
        ];
        setVerses(fallbackVerses);
        toast({
          title: "API Error",
          description: "Showing sample verses - API may be unavailable",
        });
      }
    } catch (error) {
      console.error('Error fetching verses:', error);
      // Show sample verses
      setVerses([
        {
          number: 1,
          arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
          translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.'
        }
      ]);
      toast({
        title: "Connection error",
        description: "Could not load verses from API",
        variant: "destructive",
      });
    } finally {
      setVersesLoading(false);
    }
  };

  const filteredSurahs = surahs.filter(surah =>
    surah.name.includes(searchQuery) ||
    surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase())
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Surah List */}
            <div className={selectedSurah ? 'hidden lg:block' : 'block'}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Holy Quran
                  </CardTitle>
                  <p className="text-sm text-muted">Select a Surah to read verses</p>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search Surahs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                      data-testid="surah-search-input"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredSurahs.map((surah) => (
                      <div
                        key={surah.number}
                        onClick={() => handleSurahClick(surah)}
                        className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-emerald-200"
                        data-testid={`surah-${surah.number}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                              {surah.number}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-lg" dir="rtl">{surah.name}</h3>
                            </div>
                            <p className="text-sm text-muted">{surah.englishName}</p>
                            <p className="text-xs text-muted">{surah.englishNameTranslation}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={surah.revelationType === 'Meccan' ? 'default' : 'secondary'}
                            className="text-xs mb-1"
                          >
                            {surah.revelationType}
                          </Badge>
                          <p className="text-xs text-muted">{surah.numberOfAyahs} verses</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Verses Display */}
            <div className={`lg:col-span-2 ${selectedSurah ? 'block' : 'hidden lg:block'}`}>
              {selectedSurah ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedSurah(null)}
                            className="lg:hidden mr-2"
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                          <CardTitle className="flex items-center">
                            <span className="mr-2" dir="rtl">{selectedSurah.name}</span>
                            <span className="text-lg">({selectedSurah.englishName})</span>
                          </CardTitle>
                        </div>
                        <p className="text-muted">{selectedSurah.englishNameTranslation} • {selectedSurah.numberOfAyahs} verses</p>
                      </div>
                      <Badge variant={selectedSurah.revelationType === 'Meccan' ? 'default' : 'secondary'}>
                        {selectedSurah.revelationType}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {versesLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                        <span className="ml-2 text-muted">Loading verses...</span>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {verses.map((verse) => (
                          <div key={verse.number} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                            <div className="flex justify-between items-start mb-3">
                              <Badge variant="outline" className="text-xs">
                                Verse {verse.number}
                              </Badge>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm" title="Play audio">
                                  <Play className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" title="Bookmark">
                                  <Bookmark className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" title="Share">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="text-right mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <p className="text-2xl leading-loose text-gray-800 dark:text-gray-200" dir="rtl" style={{fontFamily: 'Amiri, serif'}}>
                                {verse.arabic}
                              </p>
                            </div>
                            
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                              {verse.translation}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Select a Surah
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Choose a Surah from the list to read its verses with Arabic text and English translation
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quran;