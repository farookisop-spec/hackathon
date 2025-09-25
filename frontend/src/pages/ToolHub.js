import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { useToast } from '../hooks/use-toast';
import { 
  Calculator, 
  Heart, 
  Navigation, 
  DollarSign, 
  PiggyBank,
  TrendingUp,
  Plus,
  Minus,
  RotateCcw,
  Compass,
  Target,
  Calendar,
  Coins
} from 'lucide-react';

const ToolHub = () => {
  const [activeModal, setActiveModal] = useState(null);
  const { toast } = useToast();

  // Zakat Calculator State
  const [zakatData, setZakatData] = useState({
    cash: 0,
    gold: 0,
    silver: 0,
    investments: 0,
    receivables: 0,
    liabilities: 0
  });

  // Digital Tasbih State
  const [tasbihCount, setTasbihCount] = useState(0);
  const [tasbihText, setTasbihText] = useState('سُبْحَانَ اللَّهِ');

  // Qibla Compass State
  const [location, setLocation] = useState(null);
  const [qiblaDirection, setQiblaDirection] = useState(null);

  // Savings Goals State
  const [savingsGoals, setSavingsGoals] = useState([
    { id: 1, name: 'Hajj Fund', target: 8000, current: 2400, deadline: '2025-12-31' },
    { id: 2, name: 'Emergency Fund', target: 5000, current: 3200, deadline: '2024-06-30' },
    { id: 3, name: 'Charity Fund', target: 1000, current: 850, deadline: '2024-03-31' }
  ]);

  // Nisab thresholds (approximate values in USD)
  const nisabThresholds = {
    gold: 4340, // 85 grams of gold
    silver: 305  // 595 grams of silver
  };

  const tools = [
    {
      id: 'zakat',
      title: 'Zakat Calculator',
      description: 'Calculate your annual Zakat obligation',
      icon: Calculator,
      category: 'finance',
      color: 'bg-emerald-100 text-emerald-700'
    },
    {
      id: 'tasbih',
      title: 'Digital Tasbih',
      description: 'Count your dhikr and remembrance of Allah',
      icon: Heart,
      category: 'worship',
      color: 'bg-pink-100 text-pink-700'
    },
    {
      id: 'qibla',
      title: 'Qibla Compass',
      description: 'Find the direction of Kaaba from your location',
      icon: Navigation,
      category: 'worship',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'sadaqa',
      title: 'Sadaqa Tracker',
      description: 'Track your charitable donations',
      icon: Heart,
      category: 'finance',
      color: 'bg-purple-100 text-purple-700'
    },
    {
      id: 'murabaha',
      title: 'Murabaha Calculator',
      description: 'Calculate Islamic financing installments',
      icon: DollarSign,
      category: 'finance',
      color: 'bg-orange-100 text-orange-700'
    },
    {
      id: 'savings',
      title: 'Savings Goals',
      description: 'Set and track halal savings goals',
      icon: PiggyBank,
      category: 'finance',
      color: 'bg-green-100 text-green-700'
    },
    {
      id: 'investment',
      title: 'Investment Tracker',
      description: 'Monitor Shariah-compliant investments',
      icon: TrendingUp,
      category: 'finance',
      color: 'bg-indigo-100 text-indigo-700'
    }
  ];

  const calculateZakat = () => {
    const totalAssets = Object.values(zakatData).reduce((sum, val) => sum + (parseFloat(val) || 0), 0) - (parseFloat(zakatData.liabilities) || 0);
    const nisab = Math.min(nisabThresholds.gold, nisabThresholds.silver);
    
    if (totalAssets >= nisab) {
      const zakatAmount = totalAssets * 0.025; // 2.5%
      return { amount: zakatAmount, eligible: true, totalAssets, nisab };
    }
    
    return { amount: 0, eligible: false, totalAssets, nisab };
  };

  const incrementTasbih = () => {
    setTasbihCount(prev => prev + 1);
    
    // Auto-change dhikr at certain milestones
    if ((tasbihCount + 1) % 33 === 0) {
      const dhikrTexts = ['سُبْحَانَ اللَّهِ', 'الْحَمْدُ لِلَّهِ', 'اللَّهُ أَكْبَرُ'];
      const currentIndex = dhikrTexts.indexOf(tasbihText);
      const nextIndex = (currentIndex + 1) % dhikrTexts.length;
      setTasbihText(dhikrTexts[nextIndex]);
    }
  };

  const resetTasbih = () => {
    setTasbihCount(0);
    setTasbihText('سُبْحَانَ اللَّهِ');
  };

  const getQiblaDirection = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          
          // Calculate Qibla direction (simplified calculation)
          // Kaaba coordinates: 21.4225° N, 39.8262° E
          const kaabaLat = 21.4225;
          const kaabaLng = 39.8262;
          
          const dLng = (kaabaLng - longitude) * Math.PI / 180;
          const lat1 = latitude * Math.PI / 180;
          const lat2 = kaabaLat * Math.PI / 180;
          
          const y = Math.sin(dLng) * Math.cos(lat2);
          const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
          
          let bearing = Math.atan2(y, x) * 180 / Math.PI;
          bearing = (bearing + 360) % 360;
          
          setQiblaDirection(Math.round(bearing));
          
          toast({
            title: "Qibla direction found!",
            description: `Qibla is ${Math.round(bearing)}° from North`,
          });
        },
        (error) => {
          toast({
            title: "Location access denied",
            description: "Please enable location access to use Qibla compass",
            variant: "destructive",
          });
        }
      );
    }
  };

  const renderTool = (tool) => {
    const Icon = tool.icon;
    
    return (
      <Dialog key={tool.id} open={activeModal === tool.id} onOpenChange={() => setActiveModal(activeModal === tool.id ? null : tool.id)}>
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveModal(tool.id)}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${tool.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{tool.title}</h3>
                  <Badge variant="secondary" className="text-xs mt-1 capitalize">
                    {tool.category}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted">{tool.description}</p>
            </CardContent>
          </Card>
        </DialogTrigger>

        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Icon className="h-5 w-5 mr-2" />
              {tool.title}
            </DialogTitle>
            <DialogDescription>{tool.description}</DialogDescription>
          </DialogHeader>

          {/* Tool-specific content */}
          {tool.id === 'zakat' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cash">Cash & Bank Savings ($)</Label>
                  <Input
                    id="cash"
                    type="number"
                    value={zakatData.cash}
                    onChange={(e) => setZakatData({...zakatData, cash: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="gold">Gold Value ($)</Label>
                  <Input
                    id="gold"
                    type="number"
                    value={zakatData.gold}
                    onChange={(e) => setZakatData({...zakatData, gold: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="investments">Investments ($)</Label>
                  <Input
                    id="investments"
                    type="number"
                    value={zakatData.investments}
                    onChange={(e) => setZakatData({...zakatData, investments: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="liabilities">Liabilities ($)</Label>
                  <Input
                    id="liabilities"
                    type="number"
                    value={zakatData.liabilities}
                    onChange={(e) => setZakatData({...zakatData, liabilities: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              {(() => {
                const result = calculateZakat();
                return (
                  <Card className={result.eligible ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200'}>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h3 className="font-semibold text-lg mb-2">Zakat Calculation</h3>
                        <p className="text-sm text-muted mb-4">
                          Total Assets: ${result.totalAssets.toFixed(2)} | Nisab: ${result.nisab.toFixed(2)}
                        </p>
                        {result.eligible ? (
                          <div>
                            <p className="text-2xl font-bold text-emerald-600 mb-2">
                              ${result.amount.toFixed(2)}
                            </p>
                            <p className="text-sm text-emerald-700">Zakat Due (2.5%)</p>
                            <div className="mt-4 p-3 bg-white rounded border">
                              <p className="text-xs text-gray-600 mb-2">Suggested Charities:</p>
                              <div className="text-xs space-y-1">
                                <p>• Islamic Relief Worldwide</p>
                                <p>• Muslim Aid</p>
                                <p>• Local Mosque & Community Center</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-lg font-medium text-gray-600">No Zakat Due</p>
                            <p className="text-sm text-gray-500">Your assets are below the Nisab threshold</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}
            </div>
          )}

          {tool.id === 'tasbih' && (
            <div className="text-center space-y-6">
              <div className="p-8 bg-emerald-50 rounded-lg">
                <p className="text-3xl mb-4" dir="rtl" style={{fontFamily: 'Amiri, serif'}}>
                  {tasbihText}
                </p>
                <p className="text-sm text-muted">
                  {tasbihText === 'سُبْحَانَ اللَّهِ' ? 'SubhanAllah (Glory be to Allah)' :
                   tasbihText === 'الْحَمْدُ لِلَّهِ' ? 'Alhamdulillah (All praise to Allah)' :
                   'Allahu Akbar (Allah is the Greatest)'}
                </p>
              </div>
              
              <div className="text-6xl font-bold text-emerald-600 mb-6">
                {tasbihCount}
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={incrementTasbih}
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 px-8 py-4 text-lg"
                >
                  <Plus className="h-6 w-6 mr-2" />
                  Count
                </Button>
                <Button
                  onClick={resetTasbih}
                  variant="outline"
                  size="lg"
                  className="px-8 py-4"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <Button
                  variant={tasbihText === 'سُبْحَانَ اللَّهِ' ? 'default' : 'outline'}
                  onClick={() => setTasbihText('سُبْحَانَ اللَّهِ')}
                  className="p-2"
                >
                  SubhanAllah
                </Button>
                <Button
                  variant={tasbihText === 'الْحَمْدُ لِلَّهِ' ? 'default' : 'outline'}
                  onClick={() => setTasbihText('الْحَمْدُ لِلَّهِ')}
                  className="p-2"
                >
                  Alhamdulillah
                </Button>
                <Button
                  variant={tasbihText === 'اللَّهُ أَكْبَرُ' ? 'default' : 'outline'}
                  onClick={() => setTasbihText('اللَّهُ أَكْبَرُ')}
                  className="p-2"
                >
                  Allahu Akbar
                </Button>
              </div>
            </div>
          )}

          {tool.id === 'qibla' && (
            <div className="text-center space-y-6">
              <div className="p-8 bg-blue-50 rounded-lg">
                <Compass className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold text-lg mb-2">Qibla Direction</h3>
                {qiblaDirection !== null ? (
                  <div>
                    <p className="text-3xl font-bold text-blue-600 mb-2">{qiblaDirection}°</p>
                    <p className="text-sm text-blue-700">from North</p>
                    {location && (
                      <p className="text-xs text-muted mt-2">
                        Your location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted">Click the button below to find Qibla direction</p>
                )}
              </div>
              
              <Button 
                onClick={getQiblaDirection}
                className="bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <Navigation className="h-5 w-5 mr-2" />
                Find Qibla Direction
              </Button>
              
              <div className="text-xs text-muted p-4 bg-gray-50 rounded">
                <p className="mb-2">📍 This tool uses your device's location to calculate the direction to the Kaaba in Mecca.</p>
                <p>🧭 Make sure to enable location permissions and calibrate your device's compass for accurate results.</p>
              </div>
            </div>
          )}

          {tool.id === 'savings' && (
            <div className="space-y-6">
              <div className="grid gap-4">
                {savingsGoals.map((goal) => {
                  const progress = (goal.current / goal.target) * 100;
                  const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <Card key={goal.id} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{goal.name}</h4>
                          <p className="text-sm text-muted">${goal.current} of ${goal.target}</p>
                        </div>
                        <Badge variant={progress >= 100 ? 'default' : daysLeft < 30 ? 'destructive' : 'secondary'}>
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                        </Badge>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-emerald-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-muted">
                        <span>Target: {new Date(goal.deadline).toLocaleDateString()}</span>
                        <span>${goal.target - goal.current} remaining</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
              
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Savings Goal
              </Button>
            </div>
          )}

          {/* Placeholder content for other tools */}
          {['sadaqa', 'murabaha', 'investment'].includes(tool.id) && (
            <div className="text-center py-8">
              <Icon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {tool.title}
              </h3>
              <p className="text-gray-500 mb-4">
                This tool is coming soon! We're working on bringing you comprehensive Islamic finance tools.
              </p>
              <Button variant="outline">
                Request Early Access
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="page-wrapper">
      <div className="content-wrapper">
        <div className="container-custom">
          {/* Header */}
          <div className="mb-8">
            <h1 className="heading-1 mb-2">Islamic Tool Hub</h1>
            <p className="text-muted">
              Essential tools for Islamic finance, worship, and daily Muslim life
            </p>
          </div>

          {/* Tool Categories */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Tools</TabsTrigger>
              <TabsTrigger value="finance">Islamic Finance</TabsTrigger>
              <TabsTrigger value="worship">Worship & Spiritual</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map(renderTool)}
              </div>
            </TabsContent>

            <TabsContent value="finance" className="mt-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Islamic Finance Tools</h2>
                <p className="text-muted">
                  Manage your finances according to Islamic principles with our Shariah-compliant tools
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.filter(tool => tool.category === 'finance').map(renderTool)}
              </div>
            </TabsContent>

            <TabsContent value="worship" className="mt-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Worship & Spiritual Tools</h2>
                <p className="text-muted">
                  Enhance your worship and spiritual practice with these helpful tools
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.filter(tool => tool.category === 'worship').map(renderTool)}
              </div>
            </TabsContent>
          </Tabs>

          {/* Featured Section */}
          <Card className="mt-12 bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">More Tools Coming Soon!</h3>
              <p className="text-muted mb-6 max-w-2xl mx-auto">
                We're continuously developing new tools to help Muslims manage their spiritual and financial lives 
                according to Islamic principles. Stay tuned for more features!
              </p>
              <div className="flex justify-center space-x-4">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Request a Tool
                </Button>
                <Button variant="outline">
                  Join Beta Testing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ToolHub;