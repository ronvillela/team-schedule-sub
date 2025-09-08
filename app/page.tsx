'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Copy, Download, ExternalLink, Globe, Bug, MessageSquare, Heart } from 'lucide-react';
import { VisitorCounter } from '@/components/visitor-counter';

// Constants
const SPORT_OPTIONS = [
  { value: 'basketball', label: 'Basketball' },
  { value: 'football', label: 'Football' },
  { value: 'baseball', label: 'Baseball' },
  { value: 'hockey', label: 'Hockey' },
  { value: 'soccer', label: 'Soccer' }
];

const LEAGUE_OPTIONS: { [key: string]: { value: string; label: string }[] } = {
  basketball: [
    { value: 'nba', label: 'NBA' },
    { value: 'wnba', label: 'WNBA' }
  ],
  football: [
    { value: 'nfl', label: 'NFL' },
    { value: 'college', label: 'College Football' }
  ],
  baseball: [
    { value: 'mlb', label: 'MLB' }
  ],
  hockey: [
    { value: 'nhl', label: 'NHL' }
  ],
  soccer: [
    { value: 'mls', label: 'MLS' }
  ]
};

const TEAM_OPTIONS: { [sport: string]: { [league: string]: { value: string; label: string }[] } } = {
  basketball: {
    nba: [
      { value: 'hawks', label: 'Atlanta Hawks' },
      { value: 'celtics', label: 'Boston Celtics' },
      { value: 'nets', label: 'Brooklyn Nets' },
      { value: 'hornets', label: 'Charlotte Hornets' },
      { value: 'bulls', label: 'Chicago Bulls' },
      { value: 'cavaliers', label: 'Cleveland Cavaliers' },
      { value: 'mavericks', label: 'Dallas Mavericks' },
      { value: 'nuggets', label: 'Denver Nuggets' },
      { value: 'pistons', label: 'Detroit Pistons' },
      { value: 'warriors', label: 'Golden State Warriors' },
      { value: 'rockets', label: 'Houston Rockets' },
      { value: 'pacers', label: 'Indiana Pacers' },
      { value: 'clippers', label: 'Los Angeles Clippers' },
      { value: 'lakers', label: 'Los Angeles Lakers' },
      { value: 'grizzlies', label: 'Memphis Grizzlies' },
      { value: 'heat', label: 'Miami Heat' },
      { value: 'bucks', label: 'Milwaukee Bucks' },
      { value: 'timberwolves', label: 'Minnesota Timberwolves' },
      { value: 'pelicans', label: 'New Orleans Pelicans' },
      { value: 'knicks', label: 'New York Knicks' },
      { value: 'thunder', label: 'Oklahoma City Thunder' },
      { value: 'magic', label: 'Orlando Magic' },
      { value: 'sixers', label: 'Philadelphia 76ers' },
      { value: 'suns', label: 'Phoenix Suns' },
      { value: 'blazers', label: 'Portland Trail Blazers' },
      { value: 'sacramento kings', label: 'Sacramento Kings' },
      { value: 'spurs', label: 'San Antonio Spurs' },
      { value: 'raptors', label: 'Toronto Raptors' },
      { value: 'jazz', label: 'Utah Jazz' },
      { value: 'wizards', label: 'Washington Wizards' }
    ],
    wnba: [
      { value: 'dream', label: 'Atlanta Dream' },
      { value: 'sky', label: 'Chicago Sky' },
      { value: 'sun', label: 'Connecticut Sun' },
      { value: 'wings', label: 'Dallas Wings' },
      { value: 'fever', label: 'Indiana Fever' },
      { value: 'aces', label: 'Las Vegas Aces' },
      { value: 'sparks', label: 'Los Angeles Sparks' },
      { value: 'lynx', label: 'Minnesota Lynx' },
      { value: 'liberty', label: 'New York Liberty' },
      { value: 'mercury', label: 'Phoenix Mercury' },
      { value: 'storm', label: 'Seattle Storm' },
      { value: 'mystics', label: 'Washington Mystics' }
    ]
  },
  football: {
    nfl: [
      { value: 'az cardinals', label: 'Arizona Cardinals' },
      { value: 'falcons', label: 'Atlanta Falcons' },
      { value: 'ravens', label: 'Baltimore Ravens' },
      { value: 'bills', label: 'Buffalo Bills' },
      { value: 'carolina panthers', label: 'Carolina Panthers' },
      { value: 'bears', label: 'Chicago Bears' },
      { value: 'bengals', label: 'Cincinnati Bengals' },
      { value: 'browns', label: 'Cleveland Browns' },
      { value: 'cowboys', label: 'Dallas Cowboys' },
      { value: 'broncos', label: 'Denver Broncos' },
      { value: 'lions', label: 'Detroit Lions' },
      { value: 'packers', label: 'Green Bay Packers' },
      { value: 'texans', label: 'Houston Texans' },
      { value: 'colts', label: 'Indianapolis Colts' },
      { value: 'jaguars', label: 'Jacksonville Jaguars' },
      { value: 'chiefs', label: 'Kansas City Chiefs' },
      { value: 'raiders', label: 'Las Vegas Raiders' },
      { value: 'chargers', label: 'Los Angeles Chargers' },
      { value: 'rams', label: 'Los Angeles Rams' },
      { value: 'dolphins', label: 'Miami Dolphins' },
      { value: 'vikings', label: 'Minnesota Vikings' },
      { value: 'patriots', label: 'New England Patriots' },
      { value: 'saints', label: 'New Orleans Saints' },
      { value: 'ny giants', label: 'New York Giants' },
      { value: 'jets', label: 'New York Jets' },
      { value: 'eagles', label: 'Philadelphia Eagles' },
      { value: 'steelers', label: 'Pittsburgh Steelers' },
      { value: '49ers', label: 'San Francisco 49ers' },
      { value: 'seahawks', label: 'Seattle Seahawks' },
      { value: 'buccaneers', label: 'Tampa Bay Buccaneers' },
      { value: 'titans', label: 'Tennessee Titans' },
      { value: 'commanders', label: 'Washington Commanders' }
    ],
    college: [
      { value: 'alabama', label: 'Alabama Crimson Tide' },
      { value: 'auburn', label: 'Auburn Tigers' },
      { value: 'florida', label: 'Florida Gators' },
      { value: 'florida state', label: 'Florida State Seminoles' },
      { value: 'georgia', label: 'Georgia Bulldogs' },
      { value: 'lsu', label: 'LSU Tigers' },
      { value: 'miami hurricanes', label: 'Miami Hurricanes' },
      { value: 'michigan', label: 'Michigan Wolverines' },
      { value: 'ohio state', label: 'Ohio State Buckeyes' },
      { value: 'oklahoma', label: 'Oklahoma Sooners' },
      { value: 'oregon', label: 'Oregon Ducks' },
      { value: 'texas', label: 'Texas Longhorns' },
      { value: 'usc', label: 'USC Trojans' },
      { value: 'ucla', label: 'UCLA Bruins' },
      { value: 'notre dame', label: 'Notre Dame Fighting Irish' }
    ]
  },
  baseball: {
    mlb: [
      { value: 'diamondbacks', label: 'Arizona Diamondbacks' },
      { value: 'braves', label: 'Atlanta Braves' },
      { value: 'orioles', label: 'Baltimore Orioles' },
      { value: 'red sox', label: 'Boston Red Sox' },
      { value: 'cubs', label: 'Chicago Cubs' },
      { value: 'white sox', label: 'Chicago White Sox' },
      { value: 'reds', label: 'Cincinnati Reds' },
      { value: 'guardians', label: 'Cleveland Guardians' },
      { value: 'rockies', label: 'Colorado Rockies' },
      { value: 'tigers', label: 'Detroit Tigers' },
      { value: 'astros', label: 'Houston Astros' },
      { value: 'royals', label: 'Kansas City Royals' },
      { value: 'angels', label: 'Los Angeles Angels' },
      { value: 'dodgers', label: 'Los Angeles Dodgers' },
      { value: 'marlins', label: 'Miami Marlins' },
      { value: 'brewers', label: 'Milwaukee Brewers' },
      { value: 'twins', label: 'Minnesota Twins' },
      { value: 'mets', label: 'New York Mets' },
      { value: 'yankees', label: 'New York Yankees' },
      { value: 'athletics', label: 'Oakland Athletics' },
      { value: 'phillies', label: 'Philadelphia Phillies' },
      { value: 'pirates', label: 'Pittsburgh Pirates' },
      { value: 'padres', label: 'San Diego Padres' },
      { value: 'giants', label: 'San Francisco Giants' },
      { value: 'mariners', label: 'Seattle Mariners' },
      { value: 'cardinals', label: 'St. Louis Cardinals' },
      { value: 'rays', label: 'Tampa Bay Rays' },
      { value: 'rangers', label: 'Texas Rangers' },
      { value: 'blue jays', label: 'Toronto Blue Jays' },
      { value: 'nationals', label: 'Washington Nationals' }
    ]
  },
  hockey: {
    nhl: [
      { value: 'ducks', label: 'Anaheim Ducks' },
      { value: 'coyotes', label: 'Arizona Coyotes' },
      { value: 'bruins', label: 'Boston Bruins' },
      { value: 'sabres', label: 'Buffalo Sabres' },
      { value: 'flames', label: 'Calgary Flames' },
      { value: 'hurricanes', label: 'Carolina Hurricanes' },
      { value: 'blackhawks', label: 'Chicago Blackhawks' },
      { value: 'avalanche', label: 'Colorado Avalanche' },
      { value: 'blue jackets', label: 'Columbus Blue Jackets' },
      { value: 'stars', label: 'Dallas Stars' },
      { value: 'red wings', label: 'Detroit Red Wings' },
      { value: 'oilers', label: 'Edmonton Oilers' },
      { value: 'panthers', label: 'Florida Panthers' },
      { value: 'kings', label: 'Los Angeles Kings' },
      { value: 'wild', label: 'Minnesota Wild' },
      { value: 'canadiens', label: 'Montreal Canadiens' },
      { value: 'predators', label: 'Nashville Predators' },
      { value: 'devils', label: 'New Jersey Devils' },
      { value: 'islanders', label: 'New York Islanders' },
      { value: 'rangers', label: 'New York Rangers' },
      { value: 'senators', label: 'Ottawa Senators' },
      { value: 'flyers', label: 'Philadelphia Flyers' },
      { value: 'penguins', label: 'Pittsburgh Penguins' },
      { value: 'sharks', label: 'San Jose Sharks' },
      { value: 'kraken', label: 'Seattle Kraken' },
      { value: 'blues', label: 'St. Louis Blues' },
      { value: 'lightning', label: 'Tampa Bay Lightning' },
      { value: 'maple leafs', label: 'Toronto Maple Leafs' },
      { value: 'canucks', label: 'Vancouver Canucks' },
      { value: 'golden knights', label: 'Vegas Golden Knights' },
      { value: 'capitals', label: 'Washington Capitals' },
      { value: 'jets', label: 'Winnipeg Jets' }
    ]
  },
  soccer: {
    mls: [
      { value: 'atlanta united', label: 'Atlanta United FC' },
      { value: 'austin fc', label: 'Austin FC' },
      { value: 'charlotte fc', label: 'Charlotte FC' },
      { value: 'chicago fire', label: 'Chicago Fire FC' },
      { value: 'fc cincinnati', label: 'FC Cincinnati' },
      { value: 'colorado rapids', label: 'Colorado Rapids' },
      { value: 'columbus crew', label: 'Columbus Crew' },
      { value: 'dc united', label: 'D.C. United' },
      { value: 'fc dallas', label: 'FC Dallas' },
      { value: 'houston dynamo', label: 'Houston Dynamo FC' },
      { value: 'inter miami', label: 'Inter Miami CF' },
      { value: 'la galaxy', label: 'LA Galaxy' },
      { value: 'lafc', label: 'Los Angeles FC' },
      { value: 'minnesota united', label: 'Minnesota United FC' },
      { value: 'cf montreal', label: 'CF Montréal' },
      { value: 'nashville sc', label: 'Nashville SC' },
      { value: 'new england revolution', label: 'New England Revolution' },
      { value: 'nycfc', label: 'New York City FC' },
      { value: 'new york red bulls', label: 'New York Red Bulls' },
      { value: 'orlando city', label: 'Orlando City SC' },
      { value: 'philadelphia union', label: 'Philadelphia Union' },
      { value: 'portland timbers', label: 'Portland Timbers' },
      { value: 'real salt lake', label: 'Real Salt Lake' },
      { value: 'san diego fc', label: 'San Diego FC' },
      { value: 'seattle sounders', label: 'Seattle Sounders FC' },
      { value: 'sporting kc', label: 'Sporting Kansas City' },
      { value: 'st louis city', label: 'St. Louis City SC' },
      { value: 'toronto fc', label: 'Toronto FC' },
      { value: 'vancouver whitecaps', label: 'Vancouver Whitecaps FC' }
    ]
  }
};

export default function Home() {
  // State
  const [team, setTeam] = useState('heat');
  const [sport, setSport] = useState('basketball');
  const [league, setLeague] = useState('nba');
  const [copied, setCopied] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('bug');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [likesLoading, setLikesLoading] = useState(false);
  
  // Computed values
  const subscriptionUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/schedule?team=${team}&sport=${sport}&league=${league}`;
  
  // Effects
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'page_visit',
            data: { page: 'home', timestamp: new Date().toISOString() }
          })
        });
      } catch (error) {
        console.error('Failed to track visit:', error);
      }
    };
    trackVisit();
  }, []);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch('/api/likes');
        if (response.ok) {
          const data = await response.json();
          setTotalLikes(data.totalLikes);
        }
      } catch (error) {
        console.error('Failed to fetch likes:', error);
      }
    };
    fetchLikes();
  }, []);
  
  // Handlers
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(subscriptionUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadCalendar = async () => {
    try {
      const response = await fetch(subscriptionUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch calendar');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${team}-${sport}-schedule.ics`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Track successful download
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'calendar_download',
          data: { team, sport, league, timestamp: new Date().toISOString() }
        })
      });
    } catch (error) {
      console.error('Error downloading calendar:', error);
      // Fallback to opening in new tab
      window.open(subscriptionUrl, '_blank');
    }
  };
  
  const submitFeedback = async () => {
    if (!feedbackMessage.trim()) return;
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: feedbackType,
          message: feedbackMessage,
          team,
          sport,
          league,
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      });
      
      if (response.ok) {
        setFeedbackSubmitted(true);
        setFeedbackMessage('');
        setTimeout(() => {
          setFeedbackSubmitted(false);
          setShowFeedback(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const handleLike = async () => {
    if (likesLoading) return;
    
    setLikesLoading(true);
    try {
      const action = hasLiked ? 'unlike' : 'like';
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      
      if (response.ok) {
        const data = await response.json();
        setTotalLikes(data.totalLikes);
        setHasLiked(data.hasLiked);
        
        // Track like action for analytics
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'like_action',
            data: { action, timestamp: new Date().toISOString() }
          })
        });
      }
    } catch (error) {
      console.error('Failed to handle like:', error);
    } finally {
      setLikesLoading(false);
    }
  };

  // SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Sports Team Calendar Sync",
    "description": "Subscribe to any team's schedule from any sport worldwide. Automatically syncs with Apple Calendar, Google Calendar, and more.",
    "url": typeof window !== 'undefined' ? window.location.origin : '',
    "applicationCategory": "SportsApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "NBA Team Schedules",
      "NFL Team Schedules", 
      "MLB Team Schedules",
      "NHL Team Schedules",
      "MLS Team Schedules",
      "College Football Schedules",
      "Calendar Integration",
      "Free Service"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-12">
          <header className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Globe className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Sports Team Calendar Sync</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              Subscribe to any team's schedule from any sport worldwide. 
              Automatically syncs with Apple Calendar, Google Calendar, and more.
            </p>
            <div className="text-sm text-gray-500 max-w-3xl mx-auto mb-6">
              <p>Get free sports calendar subscriptions for NBA, NFL, MLB, NHL, college football, and more. 
              Download team schedules for Miami Heat, Miami Dolphins, Miami Hurricanes, Lakers, Warriors, 
              Patriots, Cowboys, and hundreds of other teams worldwide.</p>
            </div>
            
            {/* Like Button and Visitor Counter */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={handleLike}
                disabled={likesLoading}
                variant="outline"
                className={`flex items-center gap-2 transition-all duration-200 ${
                  hasLiked 
                    ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <Heart 
                  className={`h-4 w-4 transition-all duration-200 ${
                    hasLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'
                  }`} 
                />
                <span className="font-medium">
                  {likesLoading ? '...' : totalLikes.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">
                  {totalLikes === 1 ? 'like' : 'likes'}
                </span>
              </Button>
              
              <VisitorCounter />
            </div>
          </header>

          <main className="max-w-2xl mx-auto">
            <section>
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Calendar className="h-6 w-6 text-blue-600" />
                    Choose Your Team
                  </CardTitle>
                  <CardDescription>
                    Select your favorite team to get their complete schedule
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sport
                      </label>
                      <Select value={sport} onValueChange={setSport}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sport" />
                        </SelectTrigger>
                        <SelectContent>
                          {SPORT_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        League
                      </label>
                      <Select value={league} onValueChange={setLeague}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select league" />
                        </SelectTrigger>
                        <SelectContent>
                          {LEAGUE_OPTIONS[sport]?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Team
                      </label>
                      <Select value={team} onValueChange={setTeam}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team" />
                        </SelectTrigger>
                        <SelectContent>
                          {TEAM_OPTIONS[sport]?.[league]?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calendar URL
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={subscriptionUrl}
                        readOnly
                        className="flex-1 bg-white"
                      />
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={downloadCalendar}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Calendar
                    </Button>
                    <Button
                      onClick={() => window.open(subscriptionUrl, '_blank')}
                      variant="outline"
                      className="flex-1"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in New Tab
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="mt-12">
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    Feedback & Support
                  </CardTitle>
                  <CardDescription>
                    Help us improve by sharing your feedback or reporting issues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!showFeedback ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={() => setShowFeedback(true)}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Bug className="h-4 w-4" />
                        Report Issue
                      </Button>
                      <Button
                        onClick={() => {
                          setShowFeedback(true);
                          setFeedbackType('feedback');
                        }}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Share Feedback
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type
                        </label>
                        <Select value={feedbackType} onValueChange={setFeedbackType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bug">Bug Report</SelectItem>
                            <SelectItem value="feedback">General Feedback</SelectItem>
                            <SelectItem value="feature">Feature Request</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message
                        </label>
                        <textarea
                          value={feedbackMessage}
                          onChange={(e) => setFeedbackMessage(e.target.value)}
                          placeholder="Tell us what's on your mind..."
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={4}
                        />
                      </div>
                      
                      <div className="flex gap-3">
                        <Button
                          onClick={submitFeedback}
                          disabled={!feedbackMessage.trim() || feedbackSubmitted}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {feedbackSubmitted ? 'Thank you!' : 'Submit'}
                        </Button>
                        <Button
                          onClick={() => {
                            setShowFeedback(false);
                            setFeedbackMessage('');
                            setFeedbackSubmitted(false);
                          }}
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            <section className="mt-12">
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Supported Sports & Leagues</CardTitle>
                  <CardDescription>
                    We support schedules for all major sports leagues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Basketball</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• NBA (30 teams)</li>
                        <li>• WNBA (12 teams)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Football</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• NFL (32 teams)</li>
                        <li>• College Football (15 teams)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Baseball</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• MLB (30 teams)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Hockey</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• NHL (32 teams)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Soccer</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• MLS (29 teams)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}