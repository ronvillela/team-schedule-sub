// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

import { sendErrorNotification } from '@/lib/email';

// Team timezone mapping
const teamTimezones: { [key: string]: string } = {
  // NBA Teams
  'sacramento kings': 'America/Los_Angeles', // Sacramento Kings
  'lakers': 'America/Los_Angeles', // Los Angeles Lakers
  'clippers': 'America/Los_Angeles', // Los Angeles Clippers
  'warriors': 'America/Los_Angeles', // Golden State Warriors
  'spurs': 'America/Chicago', // San Antonio Spurs
  'mavericks': 'America/Chicago', // Dallas Mavericks
  'rockets': 'America/Chicago', // Houston Rockets
  'grizzlies': 'America/Chicago', // Memphis Grizzlies
  'pelicans': 'America/Chicago', // New Orleans Pelicans
  'thunder': 'America/Chicago', // Oklahoma City Thunder
  'heat': 'America/New_York', // Miami Heat
  'magic': 'America/New_York', // Orlando Magic
  'hawks': 'America/New_York', // Atlanta Hawks
  'hornets': 'America/New_York', // Charlotte Hornets
  'wizards': 'America/New_York', // Washington Wizards
  'celtics': 'America/New_York', // Boston Celtics
  'nets': 'America/New_York', // Brooklyn Nets
  'knicks': 'America/New_York', // New York Knicks
  'sixers': 'America/New_York', // Philadelphia 76ers
  'raptors': 'America/Toronto', // Toronto Raptors
  'cavaliers': 'America/New_York', // Cleveland Cavaliers
  'pistons': 'America/New_York', // Detroit Pistons
  'pacers': 'America/New_York', // Indiana Pacers
  'bucks': 'America/Chicago', // Milwaukee Bucks
  'bulls': 'America/Chicago', // Chicago Bulls
  'timberwolves': 'America/Chicago', // Minnesota Timberwolves
  'nuggets': 'America/Denver', // Denver Nuggets
  'jazz': 'America/Denver', // Utah Jazz
  'blazers': 'America/Los_Angeles', // Portland Trail Blazers
  'suns': 'America/Phoenix', // Phoenix Suns
  
  // NFL Teams
  'raiders': 'America/Los_Angeles', // Las Vegas Raiders
  'rams': 'America/Los_Angeles', // Los Angeles Rams
  'chargers': 'America/Los_Angeles', // Los Angeles Chargers
  '49ers': 'America/Los_Angeles', // San Francisco 49ers
  'seahawks': 'America/Los_Angeles', // Seattle Seahawks
  'az cardinals': 'America/Phoenix', // Arizona Cardinals
  'broncos': 'America/Denver', // Denver Broncos
  'chiefs': 'America/Chicago', // Kansas City Chiefs
  'cowboys': 'America/Chicago', // Dallas Cowboys
  'texans': 'America/Chicago', // Houston Texans
  'colts': 'America/New_York', // Indianapolis Colts
  'jaguars': 'America/New_York', // Jacksonville Jaguars
  'titans': 'America/Chicago', // Tennessee Titans
  'falcons': 'America/New_York', // Atlanta Falcons
  'carolina panthers': 'America/New_York', // Carolina Panthers
  'saints': 'America/Chicago', // New Orleans Saints
  'buccaneers': 'America/New_York', // Tampa Bay Buccaneers
  'dolphins': 'America/New_York', // Miami Dolphins
  'patriots': 'America/New_York', // New England Patriots
  'bills': 'America/New_York', // Buffalo Bills
  'ny jets': 'America/New_York', // New York Jets
  'ny giants': 'America/New_York', // New York Giants
  'eagles': 'America/New_York', // Philadelphia Eagles
  'commanders': 'America/New_York', // Washington Commanders
  'ravens': 'America/New_York', // Baltimore Ravens
  'bengals': 'America/New_York', // Cincinnati Bengals
  'browns': 'America/New_York', // Cleveland Browns
  'steelers': 'America/New_York', // Pittsburgh Steelers
  'bears': 'America/Chicago', // Chicago Bears
  'lions': 'America/New_York', // Detroit Lions
  'packers': 'America/Chicago', // Milwaukee Packers
  'vikings': 'America/Chicago', // Minnesota Vikings
  
  // College Football Teams (major programs)
  'usc': 'America/Los_Angeles', // USC Trojans
  'ucla': 'America/Los_Angeles', // UCLA Bruins
  'stanford': 'America/Los_Angeles', // Stanford Cardinal
  'cal': 'America/Los_Angeles', // California Golden Bears
  'oregon': 'America/Los_Angeles', // Oregon Ducks
  'oregon state': 'America/Los_Angeles', // Oregon State Beavers
  'washington': 'America/Los_Angeles', // Washington Huskies
  'washington state': 'America/Los_Angeles', // Washington State Cougars
  'utah': 'America/Denver', // Utah Utes
  'colorado': 'America/Denver', // Colorado Buffaloes
  'arizona': 'America/Phoenix', // Arizona Wildcats
  'arizona state': 'America/Phoenix', // Arizona State Sun Devils
  'texas longhorns': 'America/Chicago', // Texas Longhorns
  'oklahoma sooners': 'America/Chicago', // Oklahoma Sooners
  'oklahoma state': 'America/Chicago', // Oklahoma State Cowboys
  'tcu': 'America/Chicago', // TCU Horned Frogs
  'baylor bears': 'America/Chicago', // Baylor Bears
  'texas tech': 'America/Chicago', // Texas Tech Red Raiders
  'kansas jayhawks': 'America/Chicago', // Kansas Jayhawks
  'kansas state': 'America/Chicago', // Kansas State Wildcats
  'iowa state': 'America/Chicago', // Iowa State Cyclones
  'nebraska': 'America/Chicago', // Nebraska Cornhuskers
  'iowa': 'America/Chicago', // Iowa Hawkeyes
  'wisconsin': 'America/Chicago', // Wisconsin Badgers
  'minnesota': 'America/Chicago', // Minnesota Golden Gophers
  'northwestern': 'America/Chicago', // Northwestern Wildcats
  'illinois': 'America/Chicago', // Illinois Fighting Illini
  'purdue': 'America/New_York', // Purdue Boilermakers
  'indiana': 'America/New_York', // Indiana Hoosiers
  'michigan': 'America/New_York', // Michigan Wolverines
  'michigan state': 'America/New_York', // Michigan State Spartans
  'ohio state': 'America/New_York', // Ohio State Buckeyes
  'penn state': 'America/New_York', // Penn State Nittany Lions
  'rutgers': 'America/New_York', // Rutgers Scarlet Knights
  'maryland': 'America/New_York', // Maryland Terrapins
  'miami': 'America/New_York', // Miami Hurricanes
  'florida': 'America/New_York', // Florida Gators
  'florida state': 'America/New_York', // Florida State Seminoles
  'lsu tigers': 'America/Chicago', // LSU Tigers
  'auburn tigers': 'America/Chicago', // Auburn Tigers
  'alabama': 'America/Chicago', // Alabama Crimson Tide
  'georgia': 'America/New_York', // Georgia Bulldogs
  'clemson': 'America/New_York', // Clemson Tigers
  'south carolina': 'America/New_York', // South Carolina Gamecocks
  'tennessee': 'America/New_York', // Tennessee Volunteers
  'kentucky': 'America/New_York', // Kentucky Wildcats
  'vanderbilt': 'America/Chicago', // Vanderbilt Commodores
  'missouri': 'America/Chicago', // Missouri Tigers
  'arkansas': 'America/Chicago', // Arkansas Razorbacks
  'ole miss': 'America/Chicago', // Ole Miss Rebels
  'mississippi state': 'America/Chicago', // Mississippi State Bulldogs
  'virginia tech': 'America/New_York', // Virginia Tech Hokies
  'virginia cavaliers': 'America/New_York', // Virginia Cavaliers
  'north carolina': 'America/New_York', // North Carolina Tar Heels
  'duke': 'America/New_York', // Duke Blue Devils
  'nc state': 'America/New_York', // NC State Wolfpack
  'wake forest': 'America/New_York', // Wake Forest Demon Deacons
  'georgia tech': 'America/New_York', // Georgia Tech Yellow Jackets
  'notre dame': 'America/New_York', // Notre Dame Fighting Irish
  'west virginia': 'America/New_York', // West Virginia Mountaineers
  'uconn': 'America/New_York', // UConn Huskies
  
  // Soccer Teams
  'lafc': 'America/Los_Angeles', // Los Angeles FC
  'la galaxy': 'America/Los_Angeles', // LA Galaxy
  'seattle sounders': 'America/Los_Angeles', // Seattle Sounders FC
  'portland timbers': 'America/Los_Angeles', // Portland Timbers
  'vancouver whitecaps': 'America/Los_Angeles', // Vancouver Whitecaps FC
  'real salt lake': 'America/Denver', // Real Salt Lake
  'colorado rapids': 'America/Denver', // Colorado Rapids
  'sporting kc': 'America/Chicago', // Sporting Kansas City
  'fc dallas': 'America/Chicago', // FC Dallas
  'houston dynamo': 'America/Chicago', // Houston Dynamo FC
  'austin fc': 'America/Chicago', // Austin FC
  'minnesota united': 'America/Chicago', // Minnesota United FC
  'chicago fire': 'America/Chicago', // Chicago Fire FC
  'st louis city': 'America/Chicago', // St. Louis City SC
  'nashville sc': 'America/Chicago', // Nashville SC
  'atlanta united': 'America/New_York', // Atlanta United FC
  'orlando city': 'America/New_York', // Orlando City SC
  'inter miami': 'America/New_York', // Inter Miami CF
  'tampa bay': 'America/New_York', // Tampa Bay Rowdies
  'dc united': 'America/New_York', // D.C. United
  'philadelphia union': 'America/New_York', // Philadelphia Union
  'new york red bulls': 'America/New_York', // New York Red Bulls
  'nycfc': 'America/New_York', // New York City FC
  'new england revolution': 'America/New_York', // New England Revolution
  'toronto fc': 'America/Toronto', // Toronto FC
  'cf montreal': 'America/Toronto', // CF Montréal
  'columbus crew': 'America/New_York', // Columbus Crew
  'fc cincinnati': 'America/New_York', // FC Cincinnati
  'charlotte fc': 'America/New_York', // Charlotte FC
  'san jose earthquakes': 'America/Los_Angeles', // San Jose Earthquakes
  
  // WNBA Teams
  'aces': 'America/Los_Angeles', // Las Vegas Aces
  'liberty': 'America/New_York', // New York Liberty
  'sun': 'America/New_York', // Connecticut Sun
  'mystics': 'America/New_York', // Washington Mystics
  'fever': 'America/New_York', // Indiana Fever
  'sky': 'America/Chicago', // Chicago Sky
  'dream': 'America/New_York', // Atlanta Dream
  'storm': 'America/Los_Angeles', // Seattle Storm
  'lynx': 'America/Chicago', // Minnesota Lynx
  'mercury': 'America/Phoenix', // Phoenix Mercury
  'sparks': 'America/Los_Angeles', // Los Angeles Sparks
  'wings': 'America/Chicago', // Dallas Wings
  
  // MLB Teams
  'diamondbacks': 'America/Phoenix', // Arizona Diamondbacks
  'braves': 'America/New_York', // Atlanta Braves
  'orioles': 'America/New_York', // Baltimore Orioles
  'red sox': 'America/New_York', // Boston Red Sox
  'cubs': 'America/Chicago', // Chicago Cubs
  'white sox': 'America/Chicago', // Chicago White Sox
  'reds': 'America/New_York', // Cincinnati Reds
  'guardians': 'America/New_York', // Cleveland Guardians
  'rockies': 'America/Denver', // Colorado Rockies
  'tigers': 'America/New_York', // Detroit Tigers
  'astros': 'America/Chicago', // Houston Astros
  'royals': 'America/Chicago', // Kansas City Royals
  'angels': 'America/Los_Angeles', // Los Angeles Angels
  'dodgers': 'America/Los_Angeles', // Los Angeles Dodgers
  'marlins': 'America/New_York', // Miami Marlins
  'brewers': 'America/Chicago', // Milwaukee Brewers
  'twins': 'America/Chicago', // Minnesota Twins
  'mets': 'America/New_York', // New York Mets
  'yankees': 'America/New_York', // New York Yankees
  'athletics': 'America/Los_Angeles', // Oakland Athletics
  'phillies': 'America/New_York', // Philadelphia Phillies
  'pirates': 'America/New_York', // Pittsburgh Pirates
  'padres': 'America/Los_Angeles', // San Diego Padres
  'giants': 'America/Los_Angeles', // San Francisco Giants
  'mariners': 'America/Los_Angeles', // Seattle Mariners
  'cardinals': 'America/Chicago', // St. Louis Cardinals
  'rays': 'America/New_York', // Tampa Bay Rays
  'texas rangers': 'America/Chicago', // Texas Rangers
  'blue jays': 'America/New_York', // Toronto Blue Jays
  'nationals': 'America/New_York', // Washington Nationals
  
  // NHL Teams
  'ducks': 'America/Los_Angeles', // Anaheim Ducks
  'coyotes': 'America/Phoenix', // Arizona Coyotes
  'bruins': 'America/New_York', // Boston Bruins
  'sabres': 'America/New_York', // Buffalo Sabres
  'flames': 'America/Denver', // Calgary Flames
  'hurricanes': 'America/New_York', // Carolina Hurricanes
  'blackhawks': 'America/Chicago', // Chicago Blackhawks
  'avalanche': 'America/Denver', // Colorado Avalanche
  'blue jackets': 'America/New_York', // Columbus Blue Jackets
  'stars': 'America/Chicago', // Dallas Stars
  'red wings': 'America/New_York', // Detroit Red Wings
  'oilers': 'America/Edmonton', // Edmonton Oilers
  'panthers': 'America/New_York', // Florida Panthers
  'kings': 'America/Los_Angeles', // Los Angeles Kings
  'wild': 'America/Chicago', // Minnesota Wild
  'canadiens': 'America/Toronto', // Montreal Canadiens
  'predators': 'America/Chicago', // Nashville Predators
  'devils': 'America/New_York', // New Jersey Devils
  'islanders': 'America/New_York', // New York Islanders
  'rangers': 'America/New_York', // New York Rangers
  'senators': 'America/Toronto', // Ottawa Senators
  'flyers': 'America/New_York', // Philadelphia Flyers
  'penguins': 'America/New_York', // Pittsburgh Penguins
  'sharks': 'America/Los_Angeles', // San Jose Sharks
  'kraken': 'America/Los_Angeles', // Seattle Kraken
  'blues': 'America/Chicago', // St. Louis Blues
  'lightning': 'America/New_York', // Tampa Bay Lightning
  'maple leafs': 'America/Toronto', // Toronto Maple Leafs
  'canucks': 'America/Vancouver', // Vancouver Canucks
  'golden knights': 'America/Los_Angeles', // Vegas Golden Knights
  'capitals': 'America/New_York', // Washington Capitals
  'jets': 'America/Winnipeg' // Winnipeg Jets
};

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
    
    // Send error notification email
    try {
      const { searchParams } = new URL(request.url);
      const team = searchParams.get('team');
      const sport = searchParams.get('sport') || 'basketball';
      const league = searchParams.get('league') || 'nba';
      
      await sendErrorNotification(error, {
        team,
        sport,
        league,
        url: request.url,
        userAgent: request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
      });
    } catch (emailError) {
      console.error('Failed to send error notification email:', emailError);
    }
    
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
    
    // Sport-specific API routing for better reliability
    if (!scheduleData) {
      switch (sport) {
        case 'football':
          if (league === 'college') {
            // For college football, try TheSportsDB first (more reliable team IDs)
            scheduleData = await fetchFromSportsDB(team, sport, league);
            if (!scheduleData || scheduleData.length === 0) {
              scheduleData = await fetchFromESPN(team, sport, league);
            }
          } else {
            // For NFL, try ESPN first
            scheduleData = await fetchFromESPN(team, sport, league);
            if (!scheduleData || scheduleData.length === 0) {
              scheduleData = await fetchFromSportsDB(team, sport, league);
            }
          }
          break;
          
        case 'basketball':
          if (league === 'nba') {
            // For NBA, try ESPN first, then SportsDB for comprehensive data
            scheduleData = await fetchFromESPN(team, sport, league);
            if (!scheduleData || scheduleData.length < 20) {
              // If ESPN doesn't have enough games, try SportsDB as supplement
              const sportsDBData = await fetchFromSportsDB(team, sport, league);
              if (sportsDBData && sportsDBData.length > 0) {
                if (scheduleData) {
                  // Combine both datasets and remove duplicates
                  const combinedData = [...scheduleData, ...sportsDBData];
                  const uniqueData = combinedData.filter((game, index, self) => 
                    index === self.findIndex(g => g && game && (g.id === game.id || 
                      (g.date === game.date && g.opponent === game.opponent)))
                  );
                  scheduleData = uniqueData;
                } else {
                  scheduleData = sportsDBData;
                }
              }
            }
          } else if (league === 'wnba') {
            // For WNBA, use ESPN API only (SportsDB doesn't have reliable WNBA data)
            scheduleData = await fetchFromESPN(team, sport, league);
          } else {
            // For college basketball, try TheSportsDB first
            scheduleData = await fetchFromSportsDB(team, sport, league);
            if (!scheduleData || scheduleData.length === 0) {
              scheduleData = await fetchFromESPN(team, sport, league);
            }
          }
          break;
          
        case 'soccer':
          if (league === 'premier') {
            // For Premier League, try TheSportsDB first (better soccer data)
            scheduleData = await fetchFromSportsDB(team, sport, league);
            if (!scheduleData || scheduleData.length === 0) {
              scheduleData = await fetchFromESPN(team, sport, league);
            }
          } else {
            // For MLS, try ESPN first
            scheduleData = await fetchFromESPN(team, sport, league);
            if (!scheduleData || scheduleData.length === 0) {
              scheduleData = await fetchFromSportsDB(team, sport, league);
            }
          }
          break;
          
        case 'baseball':
        case 'hockey':
        default:
          // For other sports, try ESPN first, then TheSportsDB
          scheduleData = await fetchFromESPN(team, sport, league);
          if (!scheduleData || scheduleData.length === 0) {
            scheduleData = await fetchFromSportsDB(team, sport, league);
          }
          break;
      }
    }
    
    // If all APIs fail, return mock data
    if (!scheduleData) {
      console.log('All APIs failed, using mock data for', team);
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
    // Use known team IDs for better reliability
    const knownTeamIds = getSportsDBTeamId(team, sport, league);
    if (knownTeamIds) {
      // Try each known team ID until we find one with data
      for (const teamId of knownTeamIds) {
        try {
          const scheduleData = await fetchSportsDBSchedule(teamId, sport, league, team);
          if (scheduleData && scheduleData.length > 0) {
            return scheduleData;
          }
        } catch (error) {
          continue;
        }
      }
    }
    
    // Fallback to search if no known team IDs
    let searchQuery = team;
    if (sport === 'football' && league === 'college') {
      // Add "university" or "college" to the search to get college teams
      if (!team.toLowerCase().includes('university') && !team.toLowerCase().includes('college')) {
        searchQuery = `${team} university`;
      }
    }
    
    // First, search for the team to get team ID
    const teamSearchUrl = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(searchQuery)}`;
    const teamResponse = await fetch(teamSearchUrl);
    
    if (!teamResponse.ok) {
      throw new Error(`SportsDB team search failed: ${teamResponse.status}`);
    }
    
    const teamData = await teamResponse.json();
    
    if (!teamData.teams || teamData.teams.length === 0) {
      throw new Error(`Team "${team}" not found in SportsDB`);
    }
    
    // Filter teams to get the most relevant one
    let teamInfo = teamData.teams[0];
    
    // For college football, prefer teams with "university" or "college" in the name
    if (sport === 'football' && league === 'college') {
      const collegeTeams = teamData.teams.filter((t: any) => 
        t.strTeam?.toLowerCase().includes('university') || 
        t.strTeam?.toLowerCase().includes('college') ||
        t.strLeague?.toLowerCase().includes('college') ||
        t.strLeague?.toLowerCase().includes('ncaa')
      );
      
      if (collegeTeams.length > 0) {
        teamInfo = collegeTeams[0];
      }
    }
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
      'basketball': league === 'wnba' ? 'basketball/wnba' : 'basketball/nba',
      'football': league === 'college' ? 'football/college-football' : 'football/nfl',
      'baseball': 'baseball/mlb',
      'hockey': 'hockey/nhl',
      'soccer': league === 'premier' ? 'soccer/eng.1' : 'soccer/usa.1'
    };
    
    const espnSport = espnSportMap[sport];
    if (!espnSport) {
      throw new Error(`ESPN doesn't support sport: ${sport}`);
    }
    
    const teamId = getESPNTeamId(team, sport, league);
    if (!teamId) {
      throw new Error(`Team "${team}" not found in ESPN ${sport} data`);
    }
    
    // Try to get the 2025-26 regular season schedule first
    const url = `https://site.api.espn.com/apis/site/v2/sports/${espnSport}/teams/${teamId}/schedule?seasontype=2`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TeamScheduleApp/1.0',
      },
    });
    
    if (!response.ok) {
      throw new Error(`ESPN API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`ESPN API response for ${team} (${sport}/${league}):`, {
      url,
      teamId,
      eventsCount: data.events?.length || 0,
      scheduleEventsCount: data.schedule?.events?.length || 0,
      hasEvents: !!data.events,
      hasSchedule: !!data.schedule
    });
    
    // ESPN API returns events in different structures depending on the endpoint
    let events = [];
    if (data.events) {
      events = data.events;
    } else if (data.schedule && data.schedule.events) {
      events = data.schedule.events;
    } else if (Array.isArray(data)) {
      events = data;
    }
    
    const transformedData = transformESPNData(events, team);
    console.log(`Transformed ESPN data for ${team}:`, {
      originalEventsCount: events.length,
      transformedEventsCount: transformedData.length,
      sampleEvent: transformedData[0]
    });
    
    // If we got no events or only preseason games, try to get comprehensive schedule data
    if (transformedData.length === 0 || (events.length > 0 && events.every((event: any) => 
      event.seasonType && event.seasonType.name && event.seasonType.name.toLowerCase() === 'preseason'))) {
      
      console.log(`No regular season games found for ${team}, trying comprehensive schedule...`);
      
      // Try to get all games (preseason + regular season + playoffs)
      const comprehensiveUrl = `https://site.api.espn.com/apis/site/v2/sports/${espnSport}/teams/${teamId}/schedule?seasontype=1,2,3`;
      try {
        const comprehensiveResponse = await fetch(comprehensiveUrl, {
          headers: { 'User-Agent': 'TeamScheduleApp/1.0' },
        });
        
        if (comprehensiveResponse.ok) {
          const comprehensiveData = await comprehensiveResponse.json();
          let comprehensiveEvents = [];
          if (comprehensiveData.events) {
            comprehensiveEvents = comprehensiveData.events;
          } else if (comprehensiveData.schedule && comprehensiveData.schedule.events) {
            comprehensiveEvents = comprehensiveData.schedule.events;
          }
          
          if (comprehensiveEvents.length > 0) {
            const comprehensiveTransformed = transformESPNData(comprehensiveEvents, team);
            console.log(`Found ${comprehensiveTransformed.length} comprehensive games for ${team}`);
            return comprehensiveTransformed;
          }
        }
      } catch (error) {
        console.log(`Failed to get comprehensive data for ${team}:`, error);
      }
    }
    
    return transformedData;
  } catch (error) {
    console.error('ESPN API error:', error);
    return null;
  }
}

function transformSportsDBData(events: any[], team: string, teamInfo: any) {
  return events.map((event: any) => {
    let eventDate: string;
    
    try {
      if (event.dateEvent && event.strTime) {
        // Format: YYYY-MM-DDTHH:MM:SSZ
        eventDate = `${event.dateEvent}T${event.strTime}:00Z`;
        
        // Validate the date
        const testDate = new Date(eventDate);
        if (isNaN(testDate.getTime())) {
          console.error('Invalid SportsDB date format:', event.dateEvent, event.strTime);
          eventDate = new Date().toISOString();
        }
      } else {
        eventDate = new Date().toISOString();
      }
    } catch (error) {
      console.error('Error parsing SportsDB date:', error);
      eventDate = new Date().toISOString();
    }
    
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
    try {
      // Handle different ESPN API response structures
      let competition, homeTeam, awayTeam;
      
      if (event.competitions && event.competitions[0]) {
        // Standard ESPN schedule API structure
        competition = event.competitions[0];
        homeTeam = competition.competitors.find((c: any) => c.homeAway === 'home');
        awayTeam = competition.competitors.find((c: any) => c.homeAway === 'away');
      } else if (event.competitors) {
        // Direct competitors structure
        competition = event;
        homeTeam = event.competitors.find((c: any) => c.homeAway === 'home');
        awayTeam = event.competitors.find((c: any) => c.homeAway === 'away');
      } else {
        console.error('Unknown ESPN event structure:', event);
        return null;
      }
      
      if (!homeTeam || !awayTeam) {
        console.error('Missing home or away team in ESPN data:', event);
        return null;
      }
      
      // Better team matching with null safety
      const homeTeamName = homeTeam.team?.displayName?.toLowerCase() || '';
      const awayTeamName = awayTeam.team?.displayName?.toLowerCase() || '';
      const searchTeam = team.toLowerCase();
      
      // Check if our team is home or away
      const isHome = homeTeamName.includes(searchTeam) || 
                     (homeTeam.team?.abbreviation?.toLowerCase() === searchTeam) ||
                     (homeTeam.team?.name?.toLowerCase() === searchTeam);
      
      const opponent = isHome ? (awayTeam.team?.displayName || 'TBD') : (homeTeam.team?.displayName || 'TBD');
      
      // Validate and format the date
      let eventDate: string;
      try {
        if (event.date) {
          // ESPN dates are usually in ISO format, but let's validate
          const testDate = new Date(event.date);
          if (isNaN(testDate.getTime())) {
            console.error('Invalid ESPN date format:', event.date);
            eventDate = new Date().toISOString();
          } else {
            eventDate = event.date;
          }
        } else {
          eventDate = new Date().toISOString();
        }
      } catch (error) {
        console.error('Error parsing ESPN date:', error);
        eventDate = new Date().toISOString();
      }
      
      return {
        id: event.id || Math.random().toString(),
        date: eventDate,
        opponent: opponent,
        isHome: isHome,
        venue: competition.venue?.fullName || 'TBD',
        city: competition.venue?.address?.city ? 
          `${competition.venue.address.city}, ${competition.venue.address.state}` : 'TBD'
      };
    } catch (error) {
      console.error('Error transforming ESPN event:', error, event);
      return null;
    }
  }).filter(event => event !== null);
}

function getSportsDBTeamId(team: string, sport: string, league: string): string[] | null {
  const teamMaps: { [sport: string]: { [league: string]: { [team: string]: string[] } } } = {
    football: {
      college: {
        'tcu': ['136955'],
        'texas christian': ['136955'],
        'texas christian university': ['136955'],
        'horned frogs': ['136955']
      },
      nfl: {
        'miami dolphins': ['136013'],
        'dolphins': ['136013'],
        'new england patriots': ['136014'],
        'patriots': ['136014'],
        'buffalo bills': ['136015'],
        'bills': ['136015'],
        'new york jets': ['136016'],
        'jets': ['136016']
      }
    },
    basketball: {
      nba: {
        'san antonio spurs': ['136017'],
        'spurs': ['136017'],
        'miami heat': ['136018'],
        'heat': ['136018'],
        'los angeles lakers': ['136019'],
        'lakers': ['136019'],
        'boston celtics': ['136020'],
        'celtics': ['136020']
      }
    },
    soccer: {
      premier: {
        'tottenham hotspur': ['133616'],
        'tottenham': ['133616'],
        'spurs': ['133616'],
        'hotspur': ['133616'],
        'arsenal': ['136022'],
        'gunners': ['136022'],
        'chelsea': ['136023'],
        'blues': ['136023'],
        'manchester united': ['136024'],
        'man united': ['136024'],
        'man u': ['136024'],
        'united': ['136024'],
        'manchester city': ['136025'],
        'man city': ['136025'],
        'city': ['136025'],
        'liverpool': ['136026'],
        'reds': ['136026']
      }
    }
  };
  
  const sportMap = teamMaps[sport];
  if (!sportMap) return null;
  
  const leagueMap = sportMap[league];
  if (!leagueMap) return null;
  
  const teamLower = team.toLowerCase();
  return leagueMap[teamLower] || null;
}

async function fetchSportsDBSchedule(teamId: string, sport: string, league: string, teamName: string) {
  try {
    const currentYear = new Date().getFullYear();
    const allEvents: any[] = [];
    
    // Fetch current season
    const currentYearUrl = `https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=${teamId}&s=${currentYear}`;
    const currentResponse = await fetch(currentYearUrl);
    
    if (currentResponse.ok) {
      const currentData = await currentResponse.json();
      if (currentData.events && currentData.events.length > 0) {
        allEvents.push(...currentData.events);
      }
    }
    
    // Fetch next season
    const nextYear = currentYear + 1;
    const nextYearUrl = `https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=${teamId}&s=${nextYear}`;
    const nextResponse = await fetch(nextYearUrl);
    
    if (nextResponse.ok) {
      const nextData = await nextResponse.json();
      if (nextData.events && nextData.events.length > 0) {
        allEvents.push(...nextData.events);
      }
    }
    
    // Fetch previous season (for teams that might have games from last season)
    const prevYear = currentYear - 1;
    const prevYearUrl = `https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=${teamId}&s=${prevYear}`;
    const prevResponse = await fetch(prevYearUrl);
    
    if (prevResponse.ok) {
      const prevData = await prevResponse.json();
      if (prevData.events && prevData.events.length > 0) {
        allEvents.push(...prevData.events);
      }
    }
    
    // If we still don't have enough events, try recent events
    if (allEvents.length < 10) {
      const recentUrl = `https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${teamId}`;
      const recentResponse = await fetch(recentUrl);
      
      if (recentResponse.ok) {
        const recentData = await recentResponse.json();
        if (recentData.results && recentData.results.length > 0) {
          allEvents.push(...recentData.results);
        }
      }
    }
    
    // Remove duplicates and sort by date
    const uniqueEvents = allEvents.filter((event, index, self) => 
      index === self.findIndex(e => e.idEvent === event.idEvent)
    );
    
    // Sort by date (most recent first, then future games)
    uniqueEvents.sort((a, b) => {
      const dateA = new Date(a.dateEvent || a.strDate || '');
      const dateB = new Date(b.dateEvent || b.strDate || '');
      return dateA.getTime() - dateB.getTime();
    });
    
    return transformSportsDBData(uniqueEvents, teamName, null);
  } catch (error) {
    console.error('Error fetching SportsDB schedule:', error);
    throw error;
  }
}

function getESPNTeamId(teamName: string, sport: string, league: string): string | null {
  const teamMaps: { [sport: string]: { [league: string]: { [team: string]: string } } } = {
    basketball: {
      'nba': {
        'warriors': '9', 'golden state warriors': '9', 'lakers': '13', 'los angeles lakers': '13', 
        'celtics': '2', 'boston celtics': '2', 'heat': '14', 'miami heat': '14', 'nuggets': '7', 'denver nuggets': '7',
        'suns': '21', 'phoenix suns': '21', 'nets': '17', 'brooklyn nets': '17', 'knicks': '18', 'new york knicks': '18', 
        'bulls': '4', 'chicago bulls': '4', 'cavaliers': '5', 'cleveland cavaliers': '5',
        'pistons': '8', 'detroit pistons': '8', 'pacers': '11', 'indiana pacers': '11', 'bucks': '15', 'milwaukee bucks': '15', 
        'hawks': '1', 'atlanta hawks': '1', 'hornets': '30', 'charlotte hornets': '30',
        'magic': '19', 'orlando magic': '19', 'sixers': '20', 'philadelphia 76ers': '20', 'raptors': '28', 'toronto raptors': '28', 
        'wizards': '27', 'washington wizards': '27', 'mavericks': '6', 'dallas mavericks': '6',
        'rockets': '10', 'houston rockets': '10', 'grizzlies': '29', 'memphis grizzlies': '29', 'pelicans': '3', 'new orleans pelicans': '3', 
        'spurs': '24', 'san antonio spurs': '24', 'thunder': '25', 'oklahoma city thunder': '25',
        'blazers': '22', 'portland trail blazers': '22', 'jazz': '26', 'utah jazz': '26', 'sacramento kings': '23', 
        'clippers': '12', 'los angeles clippers': '12', 'timberwolves': '16', 'minnesota timberwolves': '16'
      },
      'wnba': {
        'aces': '17', 'las vegas aces': '17',
        'liberty': '9', 'new york liberty': '9',
        'sun': '18', 'connecticut sun': '18',
        'mystics': '16', 'washington mystics': '16',
        'fever': '5', 'indiana fever': '5',
        'sky': '19', 'chicago sky': '19',
        'dream': '20', 'atlanta dream': '20',
        'storm': '14', 'seattle storm': '14',
        'lynx': '8', 'minnesota lynx': '8',
        'mercury': '11', 'phoenix mercury': '11',
        'sparks': '6', 'los angeles sparks': '6',
        'wings': '3', 'dallas wings': '3'
      }
    },
    football: {
      'nfl': {
        'patriots': '17', 'new england patriots': '17', 'bills': '2', 'buffalo bills': '2',
        'ny jets': '20', 'new york jets': '20', 'dolphins': '15', 'miami dolphins': '15',
        'steelers': '23', 'pittsburgh steelers': '23', 'ravens': '33', 'baltimore ravens': '33',
        'browns': '5', 'cleveland browns': '5', 'bengals': '4', 'cincinnati bengals': '4',
        'titans': '10', 'tennessee titans': '10', 'colts': '11', 'indianapolis colts': '11',
        'texans': '34', 'houston texans': '34', 'jaguars': '30', 'jacksonville jaguars': '30',
        'chiefs': '12', 'kansas city chiefs': '12', 'chargers': '24', 'los angeles chargers': '24',
        'raiders': '13', 'las vegas raiders': '13', 'broncos': '7', 'denver broncos': '7',
        'cowboys': '6', 'dallas cowboys': '6', 'ny giants': '19', 'new york giants': '19',
        'eagles': '21', 'philadelphia eagles': '21', 'commanders': '28', 'washington commanders': '28',
        'packers': '9', 'green bay packers': '9', 'bears': '3', 'chicago bears': '3',
        'lions': '8', 'detroit lions': '8', 'vikings': '16', 'minnesota vikings': '16',
        'saints': '18', 'new orleans saints': '18', 'falcons': '1', 'atlanta falcons': '1',
        'carolina panthers': '29', 'buccaneers': '27', 'tampa bay buccaneers': '27',
        '49ers': '25', 'san francisco 49ers': '25', 'seahawks': '26', 'seattle seahawks': '26',
        'rams': '14', 'los angeles rams': '14', 'az cardinals': '22', 'arizona cardinals': '22'
      },
      'college': {
        'miami': '2390', 'university of miami': '2390', 'miami hurricanes': '2390',
        'alabama': '333', 'alabama crimson tide': '333',
        'georgia': '61', 'georgia bulldogs': '61',
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
        'washington state': '265', 'washington state cougars': '265',
        'connecticut': '41', 'university of connecticut': '41', 'uconn': '41', 'uconn huskies': '41',
        'boston college': '103', 'bc': '103', 'bc eagles': '103',
        'syracuse': '183', 'syracuse orange': '183',
        'pittsburgh': '221', 'pitt': '221', 'pitt panthers': '221',
        'louisville': '97', 'louisville cardinals': '97',
        'virginia tech': '259', 'vt': '259', 'hokies': '259',
        'north carolina': '153', 'unc': '153', 'tar heels': '153',
        'duke': '150', 'duke blue devils': '150',
        'wake forest': '154', 'wake forest demon deacons': '154',
        'georgia tech': '59', 'yellow jackets': '59',
        'virginia': '258', 'virginia cavaliers': '258',
        'nc state': '152', 'north carolina state': '152', 'wolfpack': '152',
        'tcu': '262', 'texas christian': '262', 'texas christian university': '262', 'horned frogs': '262',
        'baylor': '239', 'baylor bears': '239',
        'texas tech': '264', 'texas tech red raiders': '264',
        'oklahoma state': '197', 'oklahoma state cowboys': '197',
        'kansas': '2305', 'kansas jayhawks': '2305',
        'kansas state': '2306', 'kansas state wildcats': '2306',
        'iowa state': '66', 'iowa state cyclones': '66',
        'west virginia': '277', 'west virginia mountaineers': '277',
        'rutgers': '164', 'rutgers scarlet knights': '164', 'university of rutgers': '164',
        'wisconsin': '275', 'wisconsin badgers': '275',
        'iowa': '2294', 'iowa hawkeyes': '2294',
        'nebraska': '158', 'nebraska cornhuskers': '158',
        'michigan state': '127', 'michigan state spartans': '127',
        'indiana': '84', 'indiana hoosiers': '84',
        'purdue': '2509', 'purdue boilermakers': '2509',
        'northwestern': '77', 'northwestern wildcats': '77',
        'illinois': '356', 'illinois fighting illini': '356',
        'minnesota': '135', 'minnesota golden gophers': '135',
        'maryland': '120', 'maryland terrapins': '120'
      }
    },
    soccer: {
      'premier': {
        'tottenham': '367', 'tottenham spurs': '367', 'tottenham hotspur': '367', 'hotspur': '367',
        'arsenal': '359', 'gunners': '359',
        'chelsea': '363', 'blues': '363',
        'manchester united': '360', 'man united': '360', 'man u': '360', 'united': '360',
        'manchester city': '362', 'man city': '362', 'city': '362',
        'liverpool': '364', 'reds': '364',
        'newcastle': '361', 'newcastle united': '361', 'magpies': '361',
        'west ham': '371', 'west ham united': '371', 'hammers': '371',
        'brighton': '331', 'brighton & hove albion': '331', 'seagulls': '331',
        'crystal palace': '354', 'palace': '354', 'crystal palace eagles': '354',
        'fulham': '355', 'cottagers': '355',
        'brentford': '337', 'bees': '337',
        'everton': '368', 'toffees': '368',
        'nottingham forest': '351', 'forest': '351', 'tricky trees': '351',
        'leicester': '375', 'leicester city': '375', 'foxes': '375',
        'southampton': '376', 'southampton saints': '376',
        'leeds': '357', 'leeds united': '357', 'whites': '357',
        'wolves': '370', 'wolverhampton': '370', 'wolverhampton wanderers': '370',
        'burnley': '328', 'clarets': '328',
        'sheffield united': '356', 'blades': '356',
        'luton': '389', 'luton town': '389', 'hatters': '389',
        'ipswich': '349', 'ipswich town': '349', 'tractor boys': '349'
      },
      'mls': {
        'la galaxy': '4671', 'galaxy': '4671',
        'la fc': '4672', 'los angeles fc': '4672',
        'seattle sounders': '4634', 'sounders': '4634',
        'portland timbers': '4633', 'timbers': '4633',
        'vancouver whitecaps': '4635', 'whitecaps': '4635',
        'real salt lake': '4632', 'rsl': '4632',
        'colorado rapids': '4627', 'rapids': '4627',
        'sporting kc': '4631', 'sporting kansas city': '4631', 'sporting': '4631',
        'houston dynamo': '4628', 'dynamo': '4628',
        'fc dallas': '4626', 'dallas': '4626',
        'austin fc': '4625', 'austin': '4625',
        'minnesota united': '4630', 'minnesota': '4630', 'loons': '4630',
        'chicago fire': '4624', 'fire': '4624',
        'columbus crew': '4623', 'crew': '4623',
        'dc united': '4622', 'dc': '4622',
        'atlanta united': '4621', 'atlanta': '4621',
        'inter miami': '4629', 'miami': '4629',
        'orlando city': '4636', 'orlando': '4636',
        'new york city fc': '4637', 'nyc fc': '4637', 'nycfc': '4637',
        'new york red bulls': '4638', 'red bulls': '4638', 'ny red bulls': '4638',
        'philadelphia union': '4639', 'union': '4639',
        'new england revolution': '4640', 'revolution': '4640', 'revs': '4640',
        'toronto fc': '4641', 'toronto': '4641',
        'montreal impact': '4642', 'montreal': '4642', 'cf montreal': '4642',
        'nashville sc': '4643', 'nashville': '4643',
        'cincinnati': '4644', 'fc cincinnati': '4644',
        'charlotte fc': '4645', 'charlotte': '4645',
        'st louis city': '4646', 'st louis': '4646'
      }
    },
    baseball: {
      'mlb': {
        'diamondbacks': '29', 'arizona diamondbacks': '29',
        'braves': '15', 'atlanta braves': '15',
        'orioles': '1', 'baltimore orioles': '1',
        'red sox': '2', 'boston red sox': '2',
        'cubs': '16', 'chicago cubs': '16',
        'white sox': '4', 'chicago white sox': '4',
        'reds': '17', 'cincinnati reds': '17',
        'guardians': '5', 'cleveland guardians': '5', 'cleveland indians': '5',
        'rockies': '27', 'colorado rockies': '27',
        'tigers': '6', 'detroit tigers': '6',
        'astros': '18', 'houston astros': '18',
        'royals': '7', 'kansas city royals': '7',
        'angels': '3', 'los angeles angels': '3', 'anaheim angels': '3',
        'dodgers': '19', 'los angeles dodgers': '19',
        'marlins': '28', 'miami marlins': '28', 'florida marlins': '28',
        'brewers': '8', 'milwaukee brewers': '8',
        'twins': '9', 'minnesota twins': '9',
        'mets': '21', 'new york mets': '21',
        'yankees': '10', 'new york yankees': '10',
        'athletics': '11', 'oakland athletics': '11', 'oakland a\'s': '11',
        'phillies': '22', 'philadelphia phillies': '22',
        'pirates': '23', 'pittsburgh pirates': '23',
        'padres': '25', 'san diego padres': '25',
        'giants': '26', 'san francisco giants': '26',
        'mariners': '12', 'seattle mariners': '12',
        'cardinals': '24', 'st louis cardinals': '24',
        'rays': '30', 'tampa bay rays': '30', 'tampa bay devil rays': '30',
        'texas rangers': '13',
        'blue jays': '14', 'toronto blue jays': '14',
        'nationals': '20', 'washington nationals': '20'
      }
    },
    hockey: {
      'nhl': {
        'ducks': '25', 'anaheim ducks': '25',
        'coyotes': '53', 'arizona coyotes': '53', 'phoenix coyotes': '53',
        'bruins': '1', 'boston bruins': '1',
        'sabres': '2', 'buffalo sabres': '2',
        'flames': '20', 'calgary flames': '20',
        'hurricanes': '7', 'carolina hurricanes': '7',
        'blackhawks': '4', 'chicago blackhawks': '4',
        'avalanche': '21', 'colorado avalanche': '21',
        'blue jackets': '29', 'columbus blue jackets': '29',
        'stars': '25', 'dallas stars': '25',
        'red wings': '17', 'detroit red wings': '17',
        'oilers': '22', 'edmonton oilers': '22',
        'panthers': '26', 'florida panthers': '26',
        'kings': '26', 'los angeles kings': '26',
        'wild': '30', 'minnesota wild': '30',
        'canadiens': '8', 'montreal canadiens': '8', 'montreal habs': '8',
        'predators': '18', 'nashville predators': '18',
        'devils': '1', 'new jersey devils': '1',
        'islanders': '2', 'new york islanders': '2',
        'rangers': '3', 'new york rangers': '3',
        'senators': '9', 'ottawa senators': '9',
        'flyers': '4', 'philadelphia flyers': '4',
        'penguins': '5', 'pittsburgh penguins': '5',
        'sharks': '28', 'san jose sharks': '28',
        'kraken': '28', 'seattle kraken': '28',
        'blues': '19', 'st louis blues': '19',
        'lightning': '14', 'tampa bay lightning': '14',
        'maple leafs': '10', 'toronto maple leafs': '10', 'toronto leafs': '10',
        'canucks': '23', 'vancouver canucks': '23',
        'golden knights': '54', 'vegas golden knights': '54', 'vegas knights': '54',
        'capitals': '15', 'washington capitals': '15',
        'jets': '52', 'winnipeg jets': '52'
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

function capitalizeTeamName(team: string): string {
  // Handle special cases for common team names
  const teamMappings: { [key: string]: string } = {
    'heat': 'Miami Heat',
    'dolphins': 'Miami Dolphins',
    'miami dolphins': 'Miami Dolphins',
    'patriots': 'New England Patriots',
    'bills': 'Buffalo Bills',
    'jets': 'New York Jets',
    'steelers': 'Pittsburgh Steelers',
    'ravens': 'Baltimore Ravens',
    'browns': 'Cleveland Browns',
    'bengals': 'Cincinnati Bengals',
    'titans': 'Tennessee Titans',
    'colts': 'Indianapolis Colts',
    'texans': 'Houston Texans',
    'jaguars': 'Jacksonville Jaguars',
    'chiefs': 'Kansas City Chiefs',
    'chargers': 'Los Angeles Chargers',
    'raiders': 'Las Vegas Raiders',
    'broncos': 'Denver Broncos',
    'cowboys': 'Dallas Cowboys',
    'giants': 'New York Giants',
    'eagles': 'Philadelphia Eagles',
    'commanders': 'Washington Commanders',
    'packers': 'Green Bay Packers',
    'bears': 'Chicago Bears',
    'lions': 'Detroit Lions',
    'vikings': 'Minnesota Vikings',
    'saints': 'New Orleans Saints',
    'falcons': 'Atlanta Falcons',
    'panthers': 'Carolina Panthers',
    'buccaneers': 'Tampa Bay Buccaneers',
    '49ers': 'San Francisco 49ers',
    'seahawks': 'Seattle Seahawks',
    'rams': 'Los Angeles Rams',
    'cardinals': 'Arizona Cardinals',
    'warriors': 'Golden State Warriors',
    'lakers': 'Los Angeles Lakers',
    'celtics': 'Boston Celtics',
    'bulls': 'Chicago Bulls',
    'knicks': 'New York Knicks',
    'nets': 'Brooklyn Nets',
    'sixers': 'Philadelphia 76ers',
    'raptors': 'Toronto Raptors',
    'wizards': 'Washington Wizards',
    'hawks': 'Atlanta Hawks',
    'hornets': 'Charlotte Hornets',
    'magic': 'Orlando Magic',
    'pistons': 'Detroit Pistons',
    'pacers': 'Indiana Pacers',
    'bucks': 'Milwaukee Bucks',
    'cavaliers': 'Cleveland Cavaliers',
    'mavericks': 'Dallas Mavericks',
    'rockets': 'Houston Rockets',
    'grizzlies': 'Memphis Grizzlies',
    'pelicans': 'New Orleans Pelicans',
    'spurs': 'San Antonio Spurs',
    'thunder': 'Oklahoma City Thunder',
    'blazers': 'Portland Trail Blazers',
    'jazz': 'Utah Jazz',
    'kings': 'Sacramento Kings',
    'clippers': 'LA Clippers',
    'suns': 'Phoenix Suns',
    'nuggets': 'Denver Nuggets',
    'timberwolves': 'Minnesota Timberwolves',
    'miami': 'Miami Hurricanes',
    'university of miami': 'University of Miami',
    'miami hurricanes': 'Miami Hurricanes',
    'alabama': 'Alabama Crimson Tide',
    'georgia': 'Georgia Bulldogs',
    'ohio state': 'Ohio State Buckeyes',
    'clemson': 'Clemson Tigers',
    'notre dame': 'Notre Dame Fighting Irish',
    'michigan': 'Michigan Wolverines',
    'texas': 'Texas Longhorns',
    'oklahoma': 'Oklahoma Sooners',
    'florida': 'Florida Gators',
    'florida state': 'Florida State Seminoles',
    'lsu': 'LSU Tigers',
    'auburn': 'Auburn Tigers',
    'tennessee': 'Tennessee Volunteers',
    'penn state': 'Penn State Nittany Lions',
    'usc': 'USC Trojans',
    'oregon': 'Oregon Ducks',
    'washington': 'Washington Huskies',
    'utah': 'Utah Utes',
    'ucla': 'UCLA Bruins',
    'stanford': 'Stanford Cardinal',
    'california': 'California Bears',
    'arizona state': 'Arizona State Sun Devils',
    'arizona': 'Arizona Wildcats',
    'colorado': 'Colorado Buffaloes',
    'oregon state': 'Oregon State Beavers',
    'washington state': 'Washington State Cougars',
    'connecticut': 'Connecticut Huskies',
    'university of connecticut': 'University of Connecticut',
    'uconn': 'UConn Huskies',
    'uconn huskies': 'UConn Huskies',
    'boston college': 'Boston College Eagles',
    'bc': 'Boston College Eagles',
    'bc eagles': 'Boston College Eagles',
    'syracuse': 'Syracuse Orange',
    'syracuse orange': 'Syracuse Orange',
    'pittsburgh': 'Pittsburgh Panthers',
    'pitt': 'Pittsburgh Panthers',
    'pitt panthers': 'Pittsburgh Panthers',
    'louisville': 'Louisville Cardinals',
    'louisville cardinals': 'Louisville Cardinals',
    'virginia tech': 'Virginia Tech Hokies',
    'vt': 'Virginia Tech Hokies',
    'hokies': 'Virginia Tech Hokies',
    'north carolina': 'North Carolina Tar Heels',
    'unc': 'North Carolina Tar Heels',
    'tar heels': 'North Carolina Tar Heels',
    'duke': 'Duke Blue Devils',
    'duke blue devils': 'Duke Blue Devils',
    'wake forest': 'Wake Forest Demon Deacons',
    'wake forest demon deacons': 'Wake Forest Demon Deacons',
    'georgia tech': 'Georgia Tech Yellow Jackets',
    'yellow jackets': 'Georgia Tech Yellow Jackets',
    'virginia': 'Virginia Cavaliers',
    'virginia cavaliers': 'Virginia Cavaliers',
    'nc state': 'NC State Wolfpack',
    'north carolina state': 'NC State Wolfpack',
    'wolfpack': 'NC State Wolfpack',
    'tcu': 'TCU Horned Frogs',
    'texas christian': 'TCU Horned Frogs',
    'texas christian university': 'TCU Horned Frogs',
    'horned frogs': 'TCU Horned Frogs',
    'baylor': 'Baylor Bears',
    'baylor bears': 'Baylor Bears',
    'texas longhorns': 'Texas Longhorns',
    'texas tech': 'Texas Tech Red Raiders',
    'texas tech red raiders': 'Texas Tech Red Raiders',
    'oklahoma sooners': 'Oklahoma Sooners',
    'oklahoma state': 'Oklahoma State Cowboys',
    'oklahoma state cowboys': 'Oklahoma State Cowboys',
    'kansas': 'Kansas Jayhawks',
    'kansas jayhawks': 'Kansas Jayhawks',
    'kansas state': 'Kansas State Wildcats',
    'kansas state wildcats': 'Kansas State Wildcats',
    'iowa state': 'Iowa State Cyclones',
    'iowa state cyclones': 'Iowa State Cyclones',
    'west virginia': 'West Virginia Mountaineers',
    'west virginia mountaineers': 'West Virginia Mountaineers',
    // Soccer teams
    'tottenham': 'Tottenham Hotspur',
    'tottenham spurs': 'Tottenham Hotspur',
    'tottenham hotspur': 'Tottenham Hotspur',
    'hotspur': 'Tottenham Hotspur',
    'arsenal': 'Arsenal',
    'gunners': 'Arsenal',
    'chelsea': 'Chelsea',
    'blues': 'Chelsea',
    'manchester united': 'Manchester United',
    'man united': 'Manchester United',
    'man u': 'Manchester United',
    'united': 'Manchester United',
    'manchester city': 'Manchester City',
    'man city': 'Manchester City',
    'city': 'Manchester City',
    'liverpool': 'Liverpool',
    'reds': 'Liverpool',
    'newcastle': 'Newcastle United',
    'newcastle united': 'Newcastle United',
    'magpies': 'Newcastle United',
    'west ham': 'West Ham United',
    'west ham united': 'West Ham United',
    'hammers': 'West Ham United',
    'brighton': 'Brighton & Hove Albion',
    'brighton & hove albion': 'Brighton & Hove Albion',
    'seagulls': 'Brighton & Hove Albion',
    'crystal palace': 'Crystal Palace',
    'palace': 'Crystal Palace',
    'crystal palace eagles': 'Crystal Palace',
    'fulham': 'Fulham',
    'cottagers': 'Fulham',
    'brentford': 'Brentford',
    'bees': 'Brentford',
    'everton': 'Everton',
    'toffees': 'Everton',
    'nottingham forest': 'Nottingham Forest',
    'forest': 'Nottingham Forest',
    'tricky trees': 'Nottingham Forest',
    'leicester': 'Leicester City',
    'leicester city': 'Leicester City',
    'foxes': 'Leicester City',
    'southampton': 'Southampton',
    'southampton saints': 'Southampton',
    'leeds': 'Leeds United',
    'leeds united': 'Leeds United',
    'whites': 'Leeds United',
    'wolves': 'Wolverhampton Wanderers',
    'wolverhampton': 'Wolverhampton Wanderers',
    'wolverhampton wanderers': 'Wolverhampton Wanderers',
    'burnley': 'Burnley',
    'clarets': 'Burnley',
    'sheffield united': 'Sheffield United',
    'blades': 'Sheffield United',
    'luton': 'Luton Town',
    'luton town': 'Luton Town',
    'hatters': 'Luton Town',
    'ipswich': 'Ipswich Town',
    'ipswich town': 'Ipswich Town',
    'tractor boys': 'Ipswich Town',
    
    // WNBA Teams
    'aces': 'Las Vegas Aces',
    'liberty': 'New York Liberty',
    'sun': 'Connecticut Sun',
    'mystics': 'Washington Mystics',
    'fever': 'Indiana Fever',
    'sky': 'Chicago Sky',
    'dream': 'Atlanta Dream',
    'storm': 'Seattle Storm',
    'lynx': 'Minnesota Lynx',
    'mercury': 'Phoenix Mercury',
    'sparks': 'Los Angeles Sparks',
    'wings': 'Dallas Wings'
  };

  // Check if we have a specific mapping
  const lowerTeam = team.toLowerCase();
  if (teamMappings[lowerTeam]) {
    return teamMappings[lowerTeam];
  }

  // Default capitalization: capitalize first letter of each word
  return team.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function generateICSContent(schedule: any[], team: string, sport: string) {
  const teamName = capitalizeTeamName(team);
  const sportName = sport.charAt(0).toUpperCase() + sport.slice(1);
  
  // Get team timezone, default to America/Los_Angeles if not found
  const teamTimezone = teamTimezones[team.toLowerCase()] || 'America/Los_Angeles';
  
  let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Team Schedule App//Team Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${teamName} ${sportName} Schedule
X-WR-CALDESC:${teamName} ${sport} game schedule
X-WR-TIMEZONE:${teamTimezone}
`;

  schedule.forEach(game => {
    try {
      // Validate and parse the date
      let startDate: Date;
      
      if (!game.date) {
        console.error('Missing date for game:', game);
        return; // Skip this game
      }
      
      // Try to parse the date
      startDate = new Date(game.date);
      
      // Check if the date is valid
      if (isNaN(startDate.getTime())) {
        console.error('Invalid date for game:', game.date, game);
        return; // Skip this game
      }
      
      const endDate = new Date(startDate.getTime() + (3 * 60 * 60 * 1000)); // 3 hours later
      
      const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };
      
      const summary = game.isHome 
        ? `${teamName} vs ${game.opponent || 'TBD'}`
        : `${game.opponent || 'TBD'} vs ${teamName}`;
      
      const description = `${summary}\\nVenue: ${game.venue || 'TBD'}\\nLocation: ${game.city || 'TBD'}\\nTimezone: ${teamTimezone}`;
      
      ics += `BEGIN:VEVENT
UID:${game.id}-${team}-${sport}@teamschedule.app
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${game.venue || 'TBD'}, ${game.city || 'TBD'}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
`;
    } catch (error) {
      console.error('Error processing game for ICS:', error, game);
      // Continue with other games
    }
  });

  ics += 'END:VCALENDAR';
  
  return ics;
}