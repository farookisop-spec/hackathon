import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { BookOpen, ExternalLink } from 'lucide-react';

const hadithCollections = [
  {
    name: 'Sahih al-Bukhari',
    count: '7563 hadith',
    url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/arabic/bukhari.json',
    description: 'Considered the most authentic collection of hadith.'
  },
  {
    name: 'Sahih Muslim',
    count: '5362 hadith',
    url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/arabic/muslim.json',
    description: 'The second most authentic collection, after Sahih al-Bukhari.'
  },
  {
    name: 'Sunan Abu Dawud',
    count: '4800 hadith',
    url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/arabic/abudawud.json',
    description: 'A collection known for its focus on legal (fiqh) hadith.'
  },
  {
    name: 'Jami at-Tirmidhi',
    count: '3956 hadith',
    url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/arabic/tirmidhi.json',
    description: 'A comprehensive collection that includes hadith on a wide range of topics.'
  },
  {
    name: 'Sunan an-Nasa’i',
    count: '5758 hadith',
    url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/arabic/nasai.json',
    description: 'Known for its rigorous authentication and detailed section on narrators.'
  },
  {
    name: 'Sunan Ibn Majah',
    count: '4341 hadith',
    url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/arabic/ibnmajah.json',
    description: 'One of the six major hadith collections, completing the Kutub al-Sittah.'
  }
];

const Hadith = () => {
  return (
    <div className="page-wrapper">
      <div className="content-wrapper">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="heading-1 mb-2">Hadith Collections</h1>
            <p className="text-muted">
              Explore the major collections of the sayings and teachings of Prophet Muhammad (ﷺ). Each link provides access to the raw JSON data for developers and researchers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hadithCollections.map((collection) => (
              <a href={collection.url} target="_blank" rel="noopener noreferrer" key={collection.name} className="block hover:no-underline">
                <Card className="h-full hover:shadow-lg transition-shadow duration-200 ease-in-out border-border hover:border-primary">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <BookOpen className="h-8 w-8 text-primary" />
                      <ExternalLink className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardTitle className="pt-4">{collection.name}</CardTitle>
                    <CardDescription>{collection.count}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{collection.description}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hadith;