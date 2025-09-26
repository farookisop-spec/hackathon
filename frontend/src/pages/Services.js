import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Compass, Sun, Moon, Star } from 'lucide-react';
import axios from 'axios';

// --- Asma ul Husna Component ---
const AsmaUlHusna = () => {
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const response = await axios.get('/api/asma-ul-husna');
        // The API seems to return the data directly, let's check if it's in a 'data' property
        const namesData = response.data.data || response.data;
        setNames(namesData.slice(0, 99)); // Ensure we only show 99 names
      } catch (err) {
        setError('Could not fetch the names of Allah. The API may be temporarily unavailable.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNames();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Star className="h-6 w-6 mr-3 text-primary" />
          <div>
            <CardTitle>Asma ul Husna</CardTitle>
            <CardDescription>The 99 Beautiful Names of Allah</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-muted-foreground">Loading names...</p>}
        {error && <p className="text-destructive">{error}</p>}
        {names.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
            {names.map((name) => (
              <div key={name.number} className="p-3 bg-secondary rounded-lg">
                <p className="font-semibold text-primary">{name.transliteration}</p>
                <p className="text-muted-foreground">{name.en}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// --- Prayer Times Component ---
const PrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder coordinates (e.g., Mecca)
    const lat = 21.4225;
    const lng = 39.8262;

    const fetchPrayerTimes = async () => {
      try {
        const response = await axios.get(`/api/prayer-times?lat=${lat}&lng=${lng}`);
        setPrayerTimes(response.data.times);
      } catch (error) {
        console.error("Could not fetch prayer times", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrayerTimes();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Sun className="h-6 w-6 mr-3 text-primary" />
          <div>
            <CardTitle>Prayer Times</CardTitle>
            <CardDescription>Based on placeholder location (Mecca)</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && <p>Loading prayer times...</p>}
        {prayerTimes && (
          <div className="space-y-3">
            {Object.entries(prayerTimes).map(([name, time]) => (
              <div key={name} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                <span className="font-semibold text-primary">{name}</span>
                <span className="text-muted-foreground font-mono">{time}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// --- Qibla Direction Component ---
const QiblaDirection = () => {
  const [qibla, setQibla] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder coordinates
    const lat = 51.5074; // London
    const lng = -0.1278;

    const fetchQibla = async () => {
      try {
        const response = await axios.get(`/api/qibla?lat=${lat}&lng=${lng}`);
        setQibla(response.data.direction);
      } catch (error) {
        console.error("Could not fetch Qibla direction", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQibla();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Compass className="h-6 w-6 mr-3 text-primary" />
          <div>
            <CardTitle>Qibla Direction</CardTitle>
            <CardDescription>From placeholder location (London)</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-center">
        {loading && <p>Loading Qibla direction...</p>}
        {qibla !== null && (
          <div>
            <div
              className="mx-auto my-4 h-24 w-24 rounded-full bg-secondary flex items-center justify-center"
              style={{ transform: `rotate(${qibla}deg)` }}
            >
              <Compass className="h-12 w-12 text-primary transition-transform duration-500" />
            </div>
            <p className="text-3xl font-bold font-mono text-primary">{qibla.toFixed(2)}°</p>
            <p className="text-muted-foreground">from North</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


const Services = () => {
  return (
    <div className="page-wrapper">
      <div className="content-wrapper">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="heading-1 mb-2">Islamic Services</h1>
            <p className="text-muted">
              Essential tools for daily Islamic life, powered by UmmahAPI.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AsmaUlHusna />
            </div>
            <div className="space-y-8">
              <PrayerTimes />
              <QiblaDirection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;