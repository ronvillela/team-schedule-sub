'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Copy, Download, ExternalLink, Globe } from 'lucide-react';

export default function Home() {
  const [team, setTeam] = useState('heat');
  const [sport, setSport] = useState('basketball');
  const [league, setLeague] = useState('nba');
  const [copied, setCopied] = useState(false);
  
  const subscriptionUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/schedule?team=${team}&sport=${sport}&league=${league}`;
  
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
    } catch (error) {
      console.error('Error downloading calendar:', error);
      // Fallback to opening in new tab
      window.open(subscriptionUrl, '_blank');
    }
  };

  const sportOptions = [
    { value: 'basketball', label: 'Basketball' },
    { value: 'football', label: 'Football' },
    { value: 'baseball', label: 'Baseball' },
    { value: 'hockey', label: 'Hockey' },
    { value: 'soccer', label: 'Soccer' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'golf', label: 'Golf' },
    { value: 'cricket', label: 'Cricket' },
    { value: 'rugby', label: 'Rugby' },
    { value: 'motorsport', label: 'Motorsport' }
  ];

  const leagueOptions: { [key: string]: { value: string; label: string }[] } = {
    basketball: [
      { value: 'nba', label: 'NBA' },
      { value: 'wnba', label: 'WNBA' },
      { value: 'euroleague', label: 'EuroLeague' }
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
      { value: 'premier-league', label: 'Premier League' },
      { value: 'la-liga', label: 'La Liga' },
      { value: 'bundesliga', label: 'Bundesliga' },
      { value: 'serie-a', label: 'Serie A' },
      { value: 'ligue-1', label: 'Ligue 1' }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Universal Sports Calendar</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Subscribe to any team's schedule from any sport worldwide. 
            Automatically syncs with Apple Calendar, Google Calendar, and more.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
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
                    setLeague(leagueOptions[value]?.[0]?.value || '');
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
                  <Select value={league} onValueChange={setLeague}>
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
                <Input
                  id="team"
                  type="text"
                  value={team}
                  onChange={(e) => setTeam(e.target.value.toLowerCase())}
                  placeholder="e.g., heat, lakers, warriors, manchester united, real madrid"
                  className="bg-white"
                />
                <p className="text-xs text-gray-500">
                  Enter the team name or common abbreviation. Works with teams from major leagues worldwide.
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
                  <p className="text-sm text-gray-600">NBA, WNBA, EuroLeague</p>
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
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">🎾 Other Sports</h4>
                  <p className="text-sm text-gray-600">Tennis, Golf, Cricket, Rugby, Motorsport</p>
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
        </div>
      </div>
    </div>
  );
}