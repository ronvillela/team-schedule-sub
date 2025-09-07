# 🏀 Universal Sports Calendar

A modern web application that allows users to subscribe to any sports team's schedule from any league worldwide. Generate calendar subscription URLs that work with Apple Calendar, Google Calendar, Outlook, and more.

![Universal Sports Calendar](https://img.shields.io/badge/Next.js-13.5.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.3-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- 🏆 **Multi-Sport Support**: Basketball, Football, Baseball, Hockey, Soccer
- 🌍 **Global Leagues**: NBA, NFL, MLB, NHL, Premier League, La Liga, Bundesliga, Serie A, MLS, and more
- 📅 **Universal Calendar Compatibility**: Works with Apple Calendar, Google Calendar, Outlook, and any calendar app that supports .ics files
- 🎨 **Modern UI**: Beautiful, responsive design built with Tailwind CSS and shadcn/ui
- ⚡ **Real-time Data**: Integrates with The Sports DB API and ESPN API for live schedule data
- 🔄 **Auto-sync**: Calendar subscriptions automatically update when schedules change
- 📱 **Mobile Responsive**: Works perfectly on desktop, tablet, and mobile devices

## 🚀 Live Demo

[View Live App](https://team-schedule-sub.vercel.app) *(Deploy to see your live URL)*

## 🛠️ Tech Stack

- **Framework**: Next.js 13.5.1 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **APIs**: The Sports DB API, ESPN API
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ronvillela/team-schedule-sub.git
   cd team-schedule-sub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Use

1. **Select Sport**: Choose from Basketball, Football, Baseball, Hockey, Soccer, and more
2. **Pick League**: Select the specific league (NBA, NFL, MLB, etc.)
3. **Enter Team**: Type your team name (e.g., "warriors", "lakers", "manchester united")
4. **Generate URL**: Get your calendar subscription URL
5. **Subscribe**: Add to your calendar app:
   - **Apple Calendar**: File → New Calendar Subscription
   - **Google Calendar**: Other calendars → + → From URL
   - **Outlook**: Home → Add Calendar → From Internet

## 🏆 Supported Sports & Leagues

### Basketball
- NBA, WNBA, EuroLeague

### Football
- NFL, College Football

### Baseball
- MLB, Minor League

### Hockey
- NHL, AHL

### Soccer
- MLS, Premier League, La Liga, Bundesliga, Serie A, Ligue 1

### Other Sports

## 🔧 API Endpoints

### GET `/api/schedule`
Generates a calendar subscription (.ics file) for a team's schedule.

**Parameters:**
- `team` (required): Team name or abbreviation
- `sport` (optional): Sport type (default: basketball)
- `league` (optional): League name (default: nba)

**Example:**
```
/api/schedule?team=warriors&sport=basketball&league=nba
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (already done!)
2. **Go to [vercel.com](https://vercel.com)**
3. **Import your repository**
4. **Deploy automatically**

### Deploy to Netlify

1. **Go to [netlify.com](https://netlify.com)**
2. **Connect GitHub**
3. **Select repository**
4. **Deploy**

### Deploy to Railway

1. **Go to [railway.app](https://railway.app)**
2. **Connect GitHub**
3. **Deploy with one click**

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
├── app/
│   ├── api/schedule/route.ts    # Calendar API endpoint
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/ui/               # Reusable UI components
├── lib/utils.ts                 # Utility functions
└── hooks/                       # Custom React hooks
```

## 🔌 API Integration

The app integrates with multiple sports APIs:

- **The Sports DB API**: Primary source for team schedules
- **ESPN API**: Backup source for major leagues
- **Fallback**: Mock data when APIs are unavailable

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [The Sports DB](https://www.thesportsdb.com/) for providing free sports data
- [ESPN API](https://site.api.espn.com/) for additional sports data
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Next.js](https://nextjs.org/) for the amazing framework
- [Vercel](https://vercel.com/) for seamless deployment

## 📞 Support

If you have any questions or need help:

1. Check the [Issues](https://github.com/ronvillela/team-schedule-sub/issues) page
2. Create a new issue if your problem isn't already reported
3. For urgent issues, contact [your-email@example.com]

---

**Made with ❤️ for sports fans worldwide**

*Subscribe to any team, any sport, anywhere!*
