import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { 
  Building, 
  Search, 
  MapPin, 
  Phone, 
  Globe, 
  Star,
  Filter,
  ExternalLink,
  Check,
  Heart
} from 'lucide-react';

const Directory = () => {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = [
    'Restaurant', 'Grocery', 'Halal Meat', 'Islamic Books', 'Mosque', 
    'Islamic School', 'Clinic', 'Lawyer', 'Real Estate', 'Clothing',
    'Financial Services', 'Travel Agency', 'Event Planning', 'Consulting'
  ];

  // Mock business data
  const mockBusinesses = [
    {
      id: '1',
      name: 'Al-Barakah Halal Restaurant',
      description: 'Authentic Middle Eastern cuisine with certified halal ingredients. Family-friendly atmosphere with traditional dishes.',
      category: 'Restaurant',
      contact_info: {
        phone: '+1 (555) 123-4567',
        email: 'info@albarakahrestaurant.com',
        website: 'www.albarakahrestaurant.com'
      },
      address: '123 Islamic Center Blvd, Toronto, ON M1S 2A3',
      is_halal_certified: true,
      is_verified: true,
      rating: 4.8,
      reviews_count: 127,
      created_at: new Date().toISOString()
    },
    {
      id: '2', 
      name: 'Green Crescent Grocery',
      description: 'Complete halal grocery store with fresh produce, halal meat, and international Islamic products.',
      category: 'Grocery',
      contact_info: {
        phone: '+1 (555) 234-5678',
        email: 'contact@greencrescent.com',
        website: 'www.greencrescent.com'
      },
      address: '456 Community Ave, Mississauga, ON L5B 3K4',
      is_halal_certified: true,
      is_verified: true,
      rating: 4.6,
      reviews_count: 89,
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Islamic Finance Solutions',
      description: 'Shariah-compliant banking and investment services. Expert guidance on Islamic finance principles.',
      category: 'Financial Services',
      contact_info: {
        phone: '+1 (555) 345-6789',
        email: 'info@islamicfinance.ca',
        website: 'www.islamicfinancesolutions.ca'
      },
      address: '789 Finance St, Suite 200, Toronto, ON M5H 2N5',
      is_halal_certified: true,
      is_verified: true,
      rating: 4.9,
      reviews_count: 56,
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Dar Al-Kutub Islamic Bookstore',
      description: 'Largest collection of Islamic books, Qurans, and educational materials in multiple languages.',
      category: 'Islamic Books',
      contact_info: {
        phone: '+1 (555) 456-7890',
        email: 'books@daralkutub.com',
        website: 'www.daralkutub.com'
      },
      address: '321 Knowledge Lane, Richmond Hill, ON L4C 1B2',
      is_halal_certified: false,
      is_verified: true,
      rating: 4.7,
      reviews_count: 73,
      created_at: new Date().toISOString()
    },
    {
      id: '5',
      name: 'Al-Noor Islamic Academy',
      description: 'Full-time Islamic elementary and high school with integrated Islamic and Ontario curriculum.',
      category: 'Islamic School',
      contact_info: {
        phone: '+1 (555) 567-8901',
        email: 'admissions@alnooracademy.org',
        website: 'www.alnooracademy.org'
      },
      address: '654 Education Dr, Markham, ON L3R 5K8',
      is_halal_certified: false,
      is_verified: true,
      rating: 4.9,
      reviews_count: 45,
      created_at: new Date().toISOString()
    },
    {
      id: '6',
      name: 'Madinah Travels',
      description: 'Hajj and Umrah packages, Islamic tour services, and halal travel arrangements worldwide.',
      category: 'Travel Agency',
      contact_info: {
        phone: '+1 (555) 678-9012',
        email: 'pilgrimage@madinahtravels.com',
        website: 'www.madinahtravels.com'
      },
      address: '987 Pilgrimage Way, Scarborough, ON M1X 1A1',
      is_halal_certified: true,
      is_verified: false,
      rating: 4.4,
      reviews_count: 92,
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    loadBusinesses();
  }, []);

  useEffect(() => {
    filterBusinesses();
  }, [searchQuery, selectedCategory, businesses]);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      // In real implementation: const response = await axios.get('/businesses');
      setBusinesses(mockBusinesses);
    } catch (error) {
      console.error('Error loading businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBusinesses = () => {
    let filtered = businesses;

    if (selectedCategory) {
      filtered = filtered.filter(business => business.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBusinesses(filtered);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Restaurant': return '🍽️';
      case 'Grocery': return '🛒';
      case 'Halal Meat': return '🥩';
      case 'Islamic Books': return '📚';
      case 'Mosque': return '🕌';
      case 'Islamic School': return '🎓';
      case 'Clinic': return '🏥';
      case 'Lawyer': return '⚖️';
      case 'Real Estate': return '🏠';
      case 'Clothing': return '👕';
      case 'Financial Services': return '💰';
      case 'Travel Agency': return '✈️';
      case 'Event Planning': return '🎉';
      default: return '🏢';
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

  return (
    <div className="page-wrapper">
      <div className="content-wrapper">
        <div className="container-custom">
          {/* Header */}
          <div className="mb-8">
            <h1 className="heading-1 mb-2">Halal Business Directory</h1>
            <p className="text-muted">
              Discover verified halal businesses and services in your community
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Find Businesses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search businesses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                    data-testid="business-search-input"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {getCategoryIcon(category)} {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>

              {/* Quick Category Filters */}
              <div className="flex flex-wrap gap-2 mt-4">
                {categories.slice(0, 8).map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'secondary'}
                    className="cursor-pointer hover:bg-emerald-100"
                    onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
                  >
                    {getCategoryIcon(category)} {category}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {filteredBusinesses.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {filteredBusinesses.length} Business{filteredBusinesses.length !== 1 ? 'es' : ''} Found
                </h2>
                {searchQuery && (
                  <p className="text-muted">
                    Results for "{searchQuery}"
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredBusinesses.map((business) => (
                  <Card key={business.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="text-3xl">
                            {getCategoryIcon(business.category)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{business.name}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {business.category}
                              </Badge>
                              {business.is_halal_certified && (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  <Check className="h-3 w-3 mr-1" />
                                  Halal Certified
                                </Badge>
                              )}
                              {business.is_verified && (
                                <Badge className="bg-blue-100 text-blue-800 text-xs">
                                  ✓ Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {business.rating && (
                          <div className="text-right">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="font-medium">{business.rating}</span>
                            </div>
                            <p className="text-xs text-muted">({business.reviews_count} reviews)</p>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted mb-4 line-clamp-2">
                        {business.description}
                      </p>

                      {/* Address */}
                      <div className="flex items-start mb-4 text-sm">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                        <span className="text-gray-600">{business.address}</span>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2 mb-4">
                        {business.contact_info.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 mr-2 text-gray-500" />
                            <a 
                              href={`tel:${business.contact_info.phone}`}
                              className="text-emerald-600 hover:text-emerald-700"
                            >
                              {business.contact_info.phone}
                            </a>
                          </div>
                        )}
                        
                        {business.contact_info.website && (
                          <div className="flex items-center text-sm">
                            <Globe className="h-4 w-4 mr-2 text-gray-500" />
                            <a 
                              href={`https://${business.contact_info.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700"
                            >
                              {business.contact_info.website}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2 pt-4 border-t border-gray-200">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`https://${business.contact_info.website}`, '_blank')}
                          className="flex-1"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Visit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="heading-3 mb-2">No businesses found</h3>
                <p className="text-muted mb-4">
                  No businesses match your search criteria. Try different keywords or browse all categories.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Browse All Businesses
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Submit Business */}
          <Card className="mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
            <CardContent className="p-6 text-center">
              <Building className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Own a Halal Business?</h3>
              <p className="text-muted mb-4">
                List your business in our directory to reach thousands of Muslim customers
              </p>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Submit Your Business
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Directory;