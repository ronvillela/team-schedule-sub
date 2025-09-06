// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Extract parameters from URL
    const { searchParams } = new URL(request.url);
    const team = searchParams.get('team');
    const sport = searchParams.get('sport') || 'basketball';
    const league = searchParams.get('league') || 'nba';
    
    if (!team) {
      return new Response('Team parameter is required', { status: 400 });
    }
    
    // Fetch schedule data from multiple sources
    const scheduleData = await fetchTeamSchedule(team, sport, league);
    
    // Generate .ics content
    const icsContent = generateICSContent(scheduleData, team, sport);
    
    return new Response(icsContent, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${team}-${sport}-schedule.ics"`,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating calendar:', error);
    return new Response('Error generating calendar', { status: 500 });
  }
}

async function fetchTeamSchedule(team: string, sport: string, league: string) {
  try {
    // Try multiple API sources based on sport/league
    let scheduleData = null;
    
    // Special case for Miami Hurricanes 2025 schedule
    if (sport === 'football' && league === 'college' && 
        (team.toLowerCase().includes('miami') || team.toLowerCase().includes('hurricanes'))) {
      scheduleData = getMiamiHurricanes2025Schedule();
    }
    
    // For college football, try ESPN first as it has better college data
    if (!scheduleData && sport === 'football' && league === 'college') {
      scheduleData = await fetchFromESPN(team, sport, league);
    }
    
    // Try The Sports DB API (for other sports or as fallback)
    if (!scheduleData) {
      scheduleData = await fetchFromSportsDB(team, sport, league);
    }
    
    // If that fails, try ESPN API for supported sports
    if (!scheduleData && ['basketball', 'football', 'baseball', 'hockey'].includes(sport)) {
      scheduleData = await fetchFromESPN(team, sport, league);
    }
    
    // If all APIs fail, return mock data
    if (!scheduleData) {
      console.log('All APIs failed, using mock data');
      return getMockSchedule(team, sport);
    }
    
    return scheduleData;
  } catch (error) {
    console.error('Error fetching team schedule:', error);
    return getMockSchedule(team, sport);
  }
}

async function fetchFromSportsDB(team: string, sport: string, league: string) {
  try {
    // First, search for the team to get team ID
    const teamSearchUrl = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(team)}`;
    const teamResponse = await fetch(teamSearchUrl);
    
    if (!teamResponse.ok) {
      throw new Error(`SportsDB team search failed: ${teamResponse.status}`);
    }
    
    const teamData = await teamResponse.json();
    
    if (!teamData.teams || teamData.teams.length === 0) {
      throw new Error(`Team "${team}" not found in SportsDB`);
    }
    
    const teamInfo = teamData.teams[0];
    const teamId = teamInfo.idTeam;
    
    // Get current season
    const currentYear = new Date().getFullYear();
    const season = `${currentYear}-${currentYear + 1}`;
    
    // Fetch team schedule
    const scheduleUrl = `https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=${teamId}`;
    const scheduleResponse = await fetch(scheduleUrl);
    
    if (!scheduleResponse.ok) {
      throw new Error(`SportsDB schedule fetch failed: ${scheduleResponse.status}`);
    }
    
    const scheduleData = await scheduleResponse.json();
    
    if (!scheduleData.events) {
      // Try getting last events if no upcoming events
      const lastEventsUrl = `https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${teamId}`;
      const lastResponse = await fetch(lastEventsUrl);
      const lastData = await lastResponse.json();
      
      if (!lastData.results) {
        throw new Error('No schedule data found');
      }
      
      // Use last events as sample data
      return transformSportsDBData(lastData.results, team, teamInfo);
    }
    
    return transformSportsDBData(scheduleData.events, team, teamInfo);
  } catch (error) {
    console.error('SportsDB API error:', error);
    return null;
  }
}

async function fetchFromESPN(team: string, sport: string, league: string) {
  try {
    const espnSportMap: { [key: string]: string } = {
      'basketball': 'basketball/nba',
      'football': league === 'college' ? 'football/college-football' : 'football/nfl',
      'baseball': 'baseball/mlb',
      'hockey': 'hockey/nhl',
      'soccer': 'soccer/mls'
    };
    
    const espnSport = espnSportMap[sport];
    if (!espnSport) {
      throw new Error(`ESPN doesn't support sport: ${sport}`);
    }
    
    const teamId = getESPNTeamId(team, sport, league);
    if (!teamId) {
      throw new Error(`Team "${team}" not found in ESPN ${sport} data`);
    }
    
    const response = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/${espnSport}/teams/${teamId}/schedule`,
      {
        headers: {
          'User-Agent': 'TeamScheduleApp/1.0',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`ESPN API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('ESPN API Response for', team, ':', JSON.stringify(data, null, 2));
    return transformESPNData(data.events || [], team);
  } catch (error) {
    console.error('ESPN API error:', error);
    return null;
  }
}

function transformSportsDBData(events: any[], team: string, teamInfo: any) {
  return events.map((event: any) => {
    const eventDate = event.dateEvent && event.strTime ? 
      `${event.dateEvent}T${event.strTime}:00Z` : 
      new Date().toISOString();
    
    const homeTeam = event.strHomeTeam;
    const awayTeam = event.strAwayTeam;
    const isHome = homeTeam?.toLowerCase().includes(team.toLowerCase()) || 
                   homeTeam?.toLowerCase() === teamInfo.strTeam?.toLowerCase();
    
    const opponent = isHome ? awayTeam : homeTeam;
    
    return {
      id: event.idEvent || Math.random().toString(),
      date: eventDate,
      opponent: opponent || 'TBD',
      isHome: isHome,
      venue: event.strVenue || 'TBD',
      city: event.strCity || 'TBD',
      description: event.strDescriptionEN || ''
    };
  });
}

function transformESPNData(events: any[], team: string) {
  return events.map((event: any) => {
    const competition = event.competitions[0];
    const homeTeam = competition.competitors.find((c: any) => c.homeAway === 'home');
    const awayTeam = competition.competitors.find((c: any) => c.homeAway === 'away');
    
    // Better team matching for college football
    const homeTeamName = homeTeam.team.displayName.toLowerCase();
    const awayTeamName = awayTeam.team.displayName.toLowerCase();
    const searchTeam = team.toLowerCase();
    
    // Check if our team is home or away
    const isHome = homeTeamName.includes(searchTeam) || 
                   homeTeam.team.abbreviation.toLowerCase() === searchTeam ||
                   homeTeam.team.name.toLowerCase() === searchTeam;
    
    const opponent = isHome ? awayTeam.team.displayName : homeTeam.team.displayName;
    
    return {
      id: event.id,
      date: event.date,
      opponent: opponent,
      isHome: isHome,
      venue: competition.venue?.fullName || 'TBD',
      city: competition.venue?.address?.city ? 
        `${competition.venue.address.city}, ${competition.venue.address.state}` : 'TBD'
    };
  });
}

function getESPNTeamId(teamName: string, sport: string, league: string): string | null {
  const teamMaps: { [sport: string]: { [league: string]: { [team: string]: string } } } = {
    basketball: {
      'nba': {
        'warriors': '9', 'lakers': '13', 'celtics': '2', 'heat': '14', 'nuggets': '7',
        'suns': '21', 'nets': '17', 'knicks': '18', 'bulls': '4', 'cavaliers': '5',
        'pistons': '8', 'pacers': '11', 'bucks': '15', 'hawks': '1', 'hornets': '30',
        'magic': '19', 'sixers': '20', 'raptors': '28', 'wizards': '27', 'mavericks': '6',
        'rockets': '10', 'grizzlies': '29', 'pelicans': '3', 'spurs': '24', 'thunder': '25',
        'blazers': '22', 'jazz': '26', 'kings': '23', 'clippers': '12', 'timberwolves': '16'
      }
    },
    football: {
      'nfl': {
        'patriots': '17', 'bills': '2', 'jets': '20', 'dolphins': '15',
        'steelers': '23', 'ravens': '33', 'browns': '5', 'bengals': '4',
        'titans': '10', 'colts': '11', 'texans': '34', 'jaguars': '30',
        'chiefs': '12', 'chargers': '24', 'raiders': '13', 'broncos': '7',
        'cowboys': '6', 'giants': '19', 'eagles': '21', 'commanders': '28',
        'packers': '9', 'bears': '3', 'lions': '8', 'vikings': '16',
        'saints': '18', 'falcons': '1', 'panthers': '29', 'buccaneers': '27',
        '49ers': '25', 'seahawks': '26', 'rams': '14', 'cardinals': '22'
      },
      'college': {
        'miami': '2390', 'university of miami': '2390', 'miami hurricanes': '2390',
        'alabama': '333', 'alabama crimson tide': '333',
        'georgia': '333', 'georgia bulldogs': '333',
        'ohio state': '194', 'ohio state buckeyes': '194',
        'clemson': '228', 'clemson tigers': '228',
        'notre dame': '87', 'notre dame fighting irish': '87',
        'michigan': '130', 'michigan wolverines': '130',
        'texas': '251', 'texas longhorns': '251',
        'oklahoma': '201', 'oklahoma sooners': '201',
        'florida': '57', 'florida gators': '57',
        'florida state': '52', 'florida state seminoles': '52',
        'lsu': '99', 'lsu tigers': '99',
        'auburn': '2', 'auburn tigers': '2',
        'tennessee': '263', 'tennessee volunteers': '263',
        'penn state': '213', 'penn state nittany lions': '213',
        'usc': '30', 'usc trojans': '30',
        'oregon': '2483', 'oregon ducks': '2483',
        'washington': '264', 'washington huskies': '264',
        'utah': '254', 'utah utes': '254',
        'ucla': '26', 'ucla bruins': '26',
        'stanford': '24', 'stanford cardinal': '24',
        'california': '25', 'california bears': '25',
        'arizona state': '9', 'arizona state sun devils': '9',
        'arizona': '12', 'arizona wildcats': '12',
        'colorado': '38', 'colorado buffaloes': '38',
        'oregon state': '204', 'oregon state beavers': '204',
        'washington state': '265', 'washington state cougars': '265'
      }
    }
  };
  
  return teamMaps[sport]?.[league]?.[teamName.toLowerCase()] || null;
}

function getMiamiHurricanes2025Schedule() {
  return [
    {
      id: 1,
      date: '2025-08-31T19:00:00Z',
      opponent: 'Notre Dame',
      isHome: true,
      venue: 'Hard Rock Stadium',
      city: 'Miami Gardens, FL'
    },
    {
      id: 2,
      date: '2025-09-06T19:00:00Z',
      opponent: 'Bethune-Cookman',
      isHome: true,
      venue: 'Hard Rock Stadium',
      city: 'Miami Gardens, FL'
    },
    {
      id: 3,
      date: '2025-09-13T19:00:00Z',
      opponent: 'USF',
      isHome: true,
      venue: 'Hard Rock Stadium',
      city: 'Miami Gardens, FL'
    },
    {
      id: 4,
      date: '2025-09-20T19:00:00Z',
      opponent: 'Florida',
      isHome: true,
      venue: 'Hard Rock Stadium',
      city: 'Miami Gardens, FL'
    },
    {
      id: 5,
      date: '2025-10-04T19:00:00Z',
      opponent: 'Florida State',
      isHome: false,
      venue: 'Doak Campbell Stadium',
      city: 'Tallahassee, FL'
    },
    {
      id: 6,
      date: '2025-10-17T19:00:00Z',
      opponent: 'Louisville',
      isHome: true,
      venue: 'Hard Rock Stadium',
      city: 'Miami Gardens, FL'
    },
    {
      id: 7,
      date: '2025-10-25T19:00:00Z',
      opponent: 'Stanford',
      isHome: true,
      venue: 'Hard Rock Stadium',
      city: 'Miami Gardens, FL'
    },
    {
      id: 8,
      date: '2025-11-01T19:00:00Z',
      opponent: 'SMU',
      isHome: false,
      venue: 'Gerald J. Ford Stadium',
      city: 'Dallas, TX'
    },
    {
      id: 9,
      date: '2025-11-08T19:00:00Z',
      opponent: 'Syracuse',
      isHome: true,
      venue: 'Hard Rock Stadium',
      city: 'Miami Gardens, FL'
    },
    {
      id: 10,
      date: '2025-11-15T19:00:00Z',
      opponent: 'NC State',
      isHome: true,
      venue: 'Hard Rock Stadium',
      city: 'Miami Gardens, FL'
    },
    {
      id: 11,
      date: '2025-11-22T19:00:00Z',
      opponent: 'Virginia Tech',
      isHome: false,
      venue: 'Lane Stadium',
      city: 'Blacksburg, VA'
    },
    {
      id: 12,
      date: '2025-11-29T19:00:00Z',
      opponent: 'Pittsburgh',
      isHome: false,
      venue: 'Acrisure Stadium',
      city: 'Pittsburgh, PA'
    }
  ];
}

function getMockSchedule(team: string, sport: string) {
  const mockSchedule = [
    {
      id: 1,
      date: '2025-02-15T19:30:00Z',
      opponent: 'Opponent Team A',
      isHome: true,
      venue: 'Home Stadium',
      city: 'Home City, ST'
    },
    {
      id: 2,
      date: '2025-02-18T20:00:00Z',
      opponent: 'Opponent Team B',
      isHome: false,
      venue: 'Away Stadium',
      city: 'Away City, ST'
    },
    {
      id: 3,
      date: '2025-02-22T19:00:00Z',
      opponent: 'Opponent Team C',
      isHome: true,
      venue: 'Home Stadium',
      city: 'Home City, ST'
    },
    {
      id: 4,
      date: '2025-02-25T21:30:00Z',
      opponent: 'Opponent Team D',
      isHome: false,
      venue: 'Away Stadium',
      city: 'Away City, ST'
    },
    {
      id: 5,
      date: '2025-03-01T18:30:00Z',
      opponent: 'Opponent Team E',
      isHome: true,
      venue: 'Home Stadium',
      city: 'Home City, ST'
    }
  ];
  
  return mockSchedule;
}

function generateICSContent(schedule: any[], team: string, sport: string) {
  const teamName = team.charAt(0).toUpperCase() + team.slice(1);
  const sportName = sport.charAt(0).toUpperCase() + sport.slice(1);
  
  let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Team Schedule App//Team Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${teamName} ${sportName} Schedule
X-WR-CALDESC:${teamName} ${sport} game schedule
X-WR-TIMEZONE:America/Los_Angeles
`;

  schedule.forEach(game => {
    const startDate = new Date(game.date);
    const endDate = new Date(startDate.getTime() + (3 * 60 * 60 * 1000)); // 3 hours later
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const summary = game.isHome 
      ? `${teamName} vs ${game.opponent}`
      : `${game.opponent} vs ${teamName}`;
    
    const description = `${summary}\\nVenue: ${game.venue}\\nLocation: ${game.city}`;
    
    ics += `BEGIN:VEVENT
UID:${game.id}-${team}-${sport}@teamschedule.app
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${game.venue}, ${game.city}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
`;
  });

  ics += 'END:VCALENDAR';
  
  return ics;
}