import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { BookOpen, Search, Play, Bookmark, Share2 } from 'lucide-react';

const Quran = () => {
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [verses, setVerses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock Surah data - in real implementation, this would come from external API
  useEffect(() => {
    const mockSurahs = [
      { number: 1, name: 'Al-Fatiha', englishName: 'The Opening', verses: 7, revelation: 'Meccan' },
      { number: 2, name: 'Al-Baqarah', englishName: 'The Cow', verses: 286, revelation: 'Medinan' },
      { number: 3, name: 'Ali Imran', englishName: 'The Family of Imran', verses: 200, revelation: 'Medinan' },
      { number: 4, name: 'An-Nisa', englishName: 'The Women', verses: 176, revelation: 'Medinan' },
      { number: 5, name: 'Al-Maidah', englishName: 'The Table', verses: 120, revelation: 'Medinan' },
      { number: 6, name: 'Al-Anam', englishName: 'The Cattle', verses: 165, revelation: 'Meccan' },
      { number: 7, name: 'Al-Araf', englishName: 'The Heights', verses: 206, revelation: 'Meccan' },
      { number: 8, name: 'Al-Anfal', englishName: 'The Spoils of War', verses: 75, revelation: 'Medinan' },
      { number: 9, name: 'At-Tawbah', englishName: 'The Repentance', verses: 129, revelation: 'Medinan' },
      { number: 10, name: 'Yunus', englishName: 'Jonah', verses: 109, revelation: 'Meccan' }
    ];
    setSurahs(mockSurahs);
    setLoading(false);
  }, []);

  const handleSurahClick = (surah) => {
    setSelectedSurah(surah);
    
    // Mock verses - in real implementation, fetch from Quran API
    const mockVerses = [
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
    setVerses(mockVerses);
  };

  const filteredSurahs = surahs.filter(surah =>
    surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.englishName.toLowerCase().includes(searchQuery.toLowerCase())
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
                        className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        data-testid={`surah-${surah.number}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                              {surah.number}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold">{surah.name}</h3>
                            <p className="text-sm text-muted">{surah.englishName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={surah.revelation === 'Meccan' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {surah.revelation}
                          </Badge>
                          <p className="text-xs text-muted mt-1">{surah.verses} verses</p>
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
                        <CardTitle className="flex items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedSurah(null)}
                            className="lg:hidden mr-2"
                          >
                            ←
                          </Button>
                          Surah {selectedSurah.name}
                        </CardTitle>
                        <p className="text-muted">{selectedSurah.englishName} • {selectedSurah.verses} verses</p>
                      </div>
                      <Badge variant={selectedSurah.revelation === 'Meccan' ? 'default' : 'secondary'}>
                        {selectedSurah.revelation}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {verses.map((verse) => (
                        <div key={verse.number} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                          <div className="flex justify-between items-start mb-3">
                            <Badge variant="outline" className="text-xs">
                              Verse {verse.number}
                            </Badge>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Play className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Bookmark className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="text-right mb-4">
                            <p className="text-2xl font-arabic text-gray-800 dark:text-gray-200 leading-loose">
                              {verse.arabic}
                            </p>
                          </div>
                          
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {verse.translation}
                          </p>
                        </div>
                      ))}
                    </div>
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
                      Choose a Surah from the list to read its verses
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