'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Copy, Download, ExternalLink, Globe, Bug, MessageSquare, Heart } from 'lucide-react';

export default function Home() {
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
  
  const subscriptionUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/schedule?team=${team}&sport=${sport}&league=${league}`;
  
  // Track page visit on component mount
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

  // Fetch likes on component mount
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
  
  // Track team searches
  const trackTeamSearch = async (teamName: string, sportType: string, leagueType: string) => {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'team_search',
          data: { team: teamName, sport: sportType, league: leagueType, timestamp: new Date().toISOString() }
        })
      });
    } catch (error) {
      console.error('Failed to track search:', error);
    }
  };
  
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
      // Track download attempt
      await trackTeamSearch(team, sport, league);
      
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
      // Track error
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'download_error',
          data: { team, sport, league, error: error instanceof Error ? error.message : String(error), timestamp: new Date().toISOString() }
        })
      });
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

  const sportOptions = [
    { value: 'basketball', label: 'Basketball' },
    { value: 'football', label: 'Football' },
    { value: 'baseball', label: 'Baseball' },
    { value: 'hockey', label: 'Hockey' },
    { value: 'soccer', label: 'Soccer' }
  ];

  const leagueOptions: { [key: string]: { value: string; label: string }[] } = {
    basketball: [
      { value: 'nba', label: 'NBA' },
      { value: 'wnba', label: 'WNBA' }
    ],
    football: [
      { value: 'nfl', label: 'NFL' },
      { value: 'college', label: 'College Football' }
    ],
    baseball: [
      { value: 'mlb', label: 'MLB' },
      { value: 'milb', label: 'Minor League' }
    ],
    hockey: [
      { value: 'nhl', label: 'NHL' },
      { value: 'ahl', label: 'AHL' }
    ],
    soccer: [
      { value: 'mls', label: 'MLS' },
      { value: 'premier', label: 'Premier League' },
      { value: 'la-liga', label: 'La Liga' },
      { value: 'bundesliga', label: 'Bundesliga' },
      { value: 'serie-a', label: 'Serie A' },
      { value: 'ligue-1', label: 'Ligue 1' }
    ]
  };

  const teamOptions: { [sport: string]: { [league: string]: { value: string; label: string }[] } } = {
    basketball: {
      nba: [
        { value: 'heat', label: 'Miami Heat' },
        { value: 'lakers', label: 'Los Angeles Lakers' },
        { value: 'warriors', label: 'Golden State Warriors' },
        { value: 'celtics', label: 'Boston Celtics' },
        { value: 'nuggets', label: 'Denver Nuggets' },
        { value: 'suns', label: 'Phoenix Suns' },
        { value: 'nets', label: 'Brooklyn Nets' },
        { value: 'knicks', label: 'New York Knicks' },
        { value: 'bulls', label: 'Chicago Bulls' },
        { value: 'cavaliers', label: 'Cleveland Cavaliers' },
        { value: 'pistons', label: 'Detroit Pistons' },
        { value: 'pacers', label: 'Indiana Pacers' },
        { value: 'bucks', label: 'Milwaukee Bucks' },
        { value: 'hawks', label: 'Atlanta Hawks' },
        { value: 'hornets', label: 'Charlotte Hornets' },
        { value: 'magic', label: 'Orlando Magic' },
        { value: 'sixers', label: 'Philadelphia 76ers' },
        { value: 'raptors', label: 'Toronto Raptors' },
        { value: 'wizards', label: 'Washington Wizards' },
        { value: 'mavericks', label: 'Dallas Mavericks' },
        { value: 'rockets', label: 'Houston Rockets' },
        { value: 'grizzlies', label: 'Memphis Grizzlies' },
        { value: 'pelicans', label: 'New Orleans Pelicans' },
        { value: 'spurs', label: 'San Antonio Spurs' },
        { value: 'thunder', label: 'Oklahoma City Thunder' },
        { value: 'blazers', label: 'Portland Trail Blazers' },
        { value: 'jazz', label: 'Utah Jazz' },
        { value: 'kings', label: 'Sacramento Kings' },
        { value: 'clippers', label: 'Los Angeles Clippers' },
        { value: 'timberwolves', label: 'Minnesota Timberwolves' }
      ],
      wnba: [
        { value: 'aces', label: 'Las Vegas Aces' },
        { value: 'liberty', label: 'New York Liberty' },
        { value: 'sun', label: 'Connecticut Sun' },
        { value: 'mystics', label: 'Washington Mystics' },
        { value: 'fever', label: 'Indiana Fever' },
        { value: 'sky', label: 'Chicago Sky' },
        { value: 'dream', label: 'Atlanta Dream' },
        { value: 'storm', label: 'Seattle Storm' },
        { value: 'lynx', label: 'Minnesota Lynx' },
        { value: 'mercury', label: 'Phoenix Mercury' },
        { value: 'sparks', label: 'Los Angeles Sparks' },
        { value: 'wings', label: 'Dallas Wings' }
      ]
    },
    football: {
      nfl: [
        { value: 'dolphins', label: 'Miami Dolphins' },
        { value: 'patriots', label: 'New England Patriots' },
        { value: 'bills', label: 'Buffalo Bills' },
        { value: 'jets', label: 'New York Jets' },
        { value: 'ravens', label: 'Baltimore Ravens' },
        { value: 'bengals', label: 'Cincinnati Bengals' },
        { value: 'browns', label: 'Cleveland Browns' },
        { value: 'steelers', label: 'Pittsburgh Steelers' },
        { value: 'texans', label: 'Houston Texans' },
        { value: 'colts', label: 'Indianapolis Colts' },
        { value: 'jaguars', label: 'Jacksonville Jaguars' },
        { value: 'titans', label: 'Tennessee Titans' },
        { value: 'broncos', label: 'Denver Broncos' },
        { value: 'chiefs', label: 'Kansas City Chiefs' },
        { value: 'raiders', label: 'Las Vegas Raiders' },
        { value: 'chargers', label: 'Los Angeles Chargers' },
        { value: 'cowboys', label: 'Dallas Cowboys' },
        { value: 'giants', label: 'New York Giants' },
        { value: 'eagles', label: 'Philadelphia Eagles' },
        { value: 'commanders', label: 'Washington Commanders' },
        { value: 'bears', label: 'Chicago Bears' },
        { value: 'lions', label: 'Detroit Lions' },
        { value: 'packers', label: 'Green Bay Packers' },
        { value: 'vikings', label: 'Minnesota Vikings' },
        { value: 'falcons', label: 'Atlanta Falcons' },
        { value: 'panthers', label: 'Carolina Panthers' },
        { value: 'saints', label: 'New Orleans Saints' },
        { value: 'buccaneers', label: 'Tampa Bay Buccaneers' },
        { value: 'cardinals', label: 'Arizona Cardinals' },
        { value: 'rams', label: 'Los Angeles Rams' },
        { value: '49ers', label: 'San Francisco 49ers' },
        { value: 'seahawks', label: 'Seattle Seahawks' }
      ],
      college: [
        { value: 'miami', label: 'Miami Hurricanes' },
        { value: 'alabama', label: 'Alabama Crimson Tide' },
        { value: 'georgia', label: 'Georgia Bulldogs' },
        { value: 'ohio state', label: 'Ohio State Buckeyes' },
        { value: 'clemson', label: 'Clemson Tigers' },
        { value: 'notre dame', label: 'Notre Dame Fighting Irish' },
        { value: 'michigan', label: 'Michigan Wolverines' },
        { value: 'texas longhorns', label: 'Texas Longhorns' },
        { value: 'oklahoma sooners', label: 'Oklahoma Sooners' },
        { value: 'florida', label: 'Florida Gators' },
        { value: 'florida state', label: 'Florida State Seminoles' },
        { value: 'lsu tigers', label: 'LSU Tigers' },
        { value: 'auburn tigers', label: 'Auburn Tigers' },
        { value: 'penn state', label: 'Penn State Nittany Lions' },
        { value: 'usc', label: 'USC Trojans' },
        { value: 'ucla', label: 'UCLA Bruins' },
        { value: 'oregon', label: 'Oregon Ducks' },
        { value: 'washington', label: 'Washington Huskies' },
        { value: 'utah', label: 'Utah Utes' },
        { value: 'stanford', label: 'Stanford Cardinal' },
        { value: 'cal', label: 'California Golden Bears' },
        { value: 'arizona state', label: 'Arizona State Sun Devils' },
        { value: 'arizona', label: 'Arizona Wildcats' },
        { value: 'colorado', label: 'Colorado Buffaloes' },
        { value: 'oregon state', label: 'Oregon State Beavers' },
        { value: 'washington state', label: 'Washington State Cougars' },
        { value: 'iowa', label: 'Iowa Hawkeyes' },
        { value: 'wisconsin', label: 'Wisconsin Badgers' },
        { value: 'nebraska', label: 'Nebraska Cornhuskers' },
        { value: 'minnesota', label: 'Minnesota Golden Gophers' },
        { value: 'northwestern', label: 'Northwestern Wildcats' },
        { value: 'purdue', label: 'Purdue Boilermakers' },
        { value: 'illinois', label: 'Illinois Fighting Illini' },
        { value: 'indiana', label: 'Indiana Hoosiers' },
        { value: 'maryland', label: 'Maryland Terrapins' },
        { value: 'rutgers', label: 'Rutgers Scarlet Knights' },
        { value: 'michigan state', label: 'Michigan State Spartans' },
        { value: 'virginia tech', label: 'Virginia Tech Hokies' },
        { value: 'north carolina', label: 'North Carolina Tar Heels' },
        { value: 'duke', label: 'Duke Blue Devils' },
        { value: 'wake forest', label: 'Wake Forest Demon Deacons' },
        { value: 'georgia tech', label: 'Georgia Tech Yellow Jackets' },
        { value: 'virginia cavaliers', label: 'Virginia Cavaliers' },
        { value: 'nc state', label: 'NC State Wolfpack' },
        { value: 'tcu', label: 'TCU Horned Frogs' },
        { value: 'baylor bears', label: 'Baylor Bears' },
        { value: 'texas tech', label: 'Texas Tech Red Raiders' },
        { value: 'oklahoma state', label: 'Oklahoma State Cowboys' },
        { value: 'kansas jayhawks', label: 'Kansas Jayhawks' },
        { value: 'kansas state', label: 'Kansas State Wildcats' },
        { value: 'iowa state', label: 'Iowa State Cyclones' },
        { value: 'west virginia', label: 'West Virginia Mountaineers' },
        { value: 'uconn', label: 'UConn Huskies' }
      ]
    },
    soccer: {
      premier: [
        { value: 'tottenham', label: 'Tottenham Hotspur' },
        { value: 'arsenal', label: 'Arsenal' },
        { value: 'chelsea', label: 'Chelsea' },
        { value: 'manchester united', label: 'Manchester United' },
        { value: 'manchester city', label: 'Manchester City' },
        { value: 'liverpool', label: 'Liverpool' },
        { value: 'newcastle', label: 'Newcastle United' },
        { value: 'west ham', label: 'West Ham United' },
        { value: 'brighton', label: 'Brighton & Hove Albion' },
        { value: 'crystal palace', label: 'Crystal Palace' },
        { value: 'fulham', label: 'Fulham' },
        { value: 'brentford', label: 'Brentford' },
        { value: 'everton', label: 'Everton' },
        { value: 'nottingham forest', label: 'Nottingham Forest' },
        { value: 'leicester', label: 'Leicester City' },
        { value: 'southampton', label: 'Southampton' },
        { value: 'leeds', label: 'Leeds United' },
        { value: 'wolves', label: 'Wolverhampton Wanderers' },
        { value: 'burnley', label: 'Burnley' },
        { value: 'sheffield united', label: 'Sheffield United' },
        { value: 'luton', label: 'Luton Town' }
      ],
      mls: [
        { value: 'inter miami', label: 'Inter Miami CF' },
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
        { value: 'sporting kc', label: 'Sporting Kansas City' },
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
        { value: 'san jose earthquakes', label: 'San Jose Earthquakes' },
        { value: 'seattle sounders', label: 'Seattle Sounders FC' },
        { value: 'st louis city', label: 'St. Louis City SC' },
        { value: 'toronto fc', label: 'Toronto FC' },
        { value: 'vancouver whitecaps', label: 'Vancouver Whitecaps FC' }
      ]
    }
  };

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Universal Sports Calendar",
    "description": "Subscribe to any sports team schedule from any league worldwide. Compatible with Apple Calendar, Google Calendar, and more.",
    "url": "https://team-schedule-sub.vercel.app",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "NBA Schedule Subscription",
      "NFL Schedule Subscription", 
      "MLB Schedule Subscription",
      "NHL Schedule Subscription",
      "College Football Schedule Subscription",
      "Apple Calendar Integration",
      "Google Calendar Integration",
      "Outlook Calendar Integration",
      "Free Sports Calendar Downloads"
    ],
    "screenshot": "https://team-schedule-sub.vercel.app/og-image.png"
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
            <h1 className="text-4xl font-bold text-gray-900">Universal Sports Calendar</h1>
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
          
          {/* Like Button */}
          <div className="flex items-center justify-center gap-2">
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
          </div>
        </header>

        <main className="max-w-2xl mx-auto">
          <section>
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Generate Calendar Subscription
                </CardTitle>
                <CardDescription>
                  Enter team details to generate a calendar subscription URL
                </CardDescription>
              </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="sport" className="text-sm font-medium text-gray-700">
                    Sport
                  </label>
                  <Select value={sport} onValueChange={(value) => {
                    setSport(value);
                    const newLeague = leagueOptions[value]?.[0]?.value || '';
                    setLeague(newLeague);
                    // Set default team for the new sport/league combination
                    const defaultTeam = teamOptions[value]?.[newLeague]?.[0]?.value || '';
                    setTeam(defaultTeam);
                  }}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {sportOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="league" className="text-sm font-medium text-gray-700">
                    League
                  </label>
                  <Select value={league} onValueChange={(value) => {
                    setLeague(value);
                    // Set default team for the new league
                    const defaultTeam = teamOptions[sport]?.[value]?.[0]?.value || '';
                    setTeam(defaultTeam);
                  }}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select league" />
                    </SelectTrigger>
                    <SelectContent>
                      {(leagueOptions[sport] || []).map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="team" className="text-sm font-medium text-gray-700">
                  Team Name
                </label>
                <Select value={team} onValueChange={setTeam}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {(teamOptions[sport]?.[league] || []).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Select your team from the dropdown. Teams are organized by sport and league.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Calendar Subscription URL
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={subscriptionUrl}
                      readOnly
                      className="bg-gray-50 font-mono text-sm"
                    />
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  {copied && (
                    <p className="text-sm text-green-600">✓ Copied to clipboard!</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button onClick={downloadCalendar} className="bg-blue-600 hover:bg-blue-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download Calendar
                  </Button>
                  <Button 
                    onClick={copyToClipboard} 
                    variant="outline"
                    className="border-blue-200 hover:bg-blue-50"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy URL
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  How to Subscribe (Live Sports Data)
                </h3>
                <div className="text-sm text-blue-800 space-y-2">
                  <p><strong>Data Sources:</strong> The Sports DB API, ESPN API, and other sports APIs</p>
                  <p><strong>Apple Calendar:</strong> Copy the URL and add it in Calendar → File → New Calendar Subscription</p>
                  <p><strong>Google Calendar:</strong> Go to "Other calendars" → "+" → "From URL" and paste the link</p>
                  <p><strong>Outlook:</strong> Home → Add Calendar → From Internet and enter the URL</p>
                </div>
              </div>
            </CardContent>
          </Card>
          </section>

          <section>
          <Card className="mt-6 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Supported Sports & Leagues</CardTitle>
              <CardDescription>
                Access schedules from major sports leagues worldwide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">🏀 Basketball</h4>
                  <p className="text-sm text-gray-600">NBA, WNBA</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">🏈 Football</h4>
                  <p className="text-sm text-gray-600">NFL, College Football</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">⚾ Baseball</h4>
                  <p className="text-sm text-gray-600">MLB, Minor League</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">🏒 Hockey</h4>
                  <p className="text-sm text-gray-600">NHL, AHL</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">⚽ Soccer</h4>
                  <p className="text-sm text-gray-600">Premier League, La Liga, Bundesliga, Serie A, MLS</p>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>Global Coverage:</strong> Search for any team by name from supported leagues. 
                  The app will automatically find and fetch their schedule data.
                </p>
              </div>
            </CardContent>
          </Card>
          </section>

          {/* Feedback Form */}
          <section>
          <Card className="mt-6 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Feedback & Error Reporting
              </CardTitle>
              <CardDescription>
                Found a bug or have a suggestion? Let us know!
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showFeedback ? (
                <div className="flex gap-3">
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
                      setFeedbackType('suggestion');
                      setShowFeedback(true);
                    }}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Make Suggestion
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Feedback Type
                    </label>
                    <Select value={feedbackType} onValueChange={setFeedbackType}>
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bug">🐛 Bug Report</SelectItem>
                        <SelectItem value="suggestion">💡 Suggestion</SelectItem>
                        <SelectItem value="error">❌ Error Report</SelectItem>
                        <SelectItem value="general">💬 General Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      placeholder="Describe the issue or your suggestion..."
                      className="w-full p-3 border border-gray-300 rounded-md bg-white resize-none"
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={submitFeedback}
                      disabled={!feedbackMessage.trim() || feedbackSubmitted}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {feedbackSubmitted ? '✓ Submitted!' : 'Submit Feedback'}
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
                  
                  {feedbackSubmitted && (
                    <p className="text-sm text-green-600">
                      Thank you for your feedback! We'll look into this.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          </section>
        </main>
      </div>
    </div>
    </>
  );
}