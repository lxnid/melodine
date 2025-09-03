# Melodine

A modern, elegant music streaming web application powered by the Spotify API. Melodine provides a beautiful interface to explore your music library, discover new tracks, and manage your playlists with a sleek, responsive design.

## Features

- 🎵 **Spotify Integration** - Full access to your Spotify library and playlists
- 🎨 **Modern UI** - Beautiful, responsive design with smooth animations
- 🔍 **Music Discovery** - Search for tracks, artists, albums, and playlists
- 📱 **Mobile Responsive** - Optimized for all device sizes
- 🎭 **Personalized Experience** - View your top artists, recent plays, and recommendations
- 🔐 **Secure Authentication** - OAuth integration with Spotify
- ⚡ **Fast Performance** - Built with Next.js 15 and modern web technologies

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: NextAuth.js with Spotify OAuth
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Animations**: Framer Motion
- **Package Manager**: pnpm
- **Deployment**: Docker, GitHub Actions

## Prerequisites

Before running this project, make sure you have:

- Node.js 20 or higher
- pnpm (recommended) or npm
- A Spotify Developer Account
- Docker (for containerized deployment)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/lxnid/melodine.git
cd melodine
```

### 2. Navigate to the App Directory

```bash
cd app
```

### 3. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 4. Set Up Environment Variables

Create a `.env.local` file in the `app` directory with the following variables:

```env
# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key
```

### 5. Configure Spotify App

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app or use an existing one
3. Add `http://localhost:3000/api/auth/callback/spotify` to your app's redirect URIs
4. Copy your Client ID and Client Secret to the `.env.local` file

## Usage

### Development

Start the development server:

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
pnpm build
pnpm start
# or
npm run build
npm start
```

### Docker Deployment

Build and run with Docker:

```bash
# Build the image
docker build -t melodine .

# Run the container
docker run -p 3000:3000 \
  -e SPOTIFY_CLIENT_ID=your_client_id \
  -e SPOTIFY_CLIENT_SECRET=your_client_secret \
  -e NEXTAUTH_URL=https://your-domain.com \
  -e NEXTAUTH_SECRET=your_secret \
  melodine
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|---------|
| `SPOTIFY_CLIENT_ID` | Your Spotify app's client ID | Yes |
| `SPOTIFY_CLIENT_SECRET` | Your Spotify app's client secret | Yes |
| `NEXTAUTH_URL` | The canonical URL of your site | Yes |
| `NEXTAUTH_SECRET` | Secret key for NextAuth.js | Yes |

### Spotify Scopes

The application requests the following Spotify scopes:

- `user-read-email` - Access to user's email
- `user-read-private` - Access to user's profile information
- `user-read-playback-state` - Read access to user's playback state
- `user-modify-playback-state` - Write access to user's playback state
- `user-read-currently-playing` - Read access to currently playing track
- `user-read-recently-played` - Access to recently played tracks
- `user-top-read` - Access to top artists and tracks
- `playlist-read-private` - Access to private playlists
- `playlist-modify-private` - Write access to private playlists
- `playlist-modify-public` - Write access to public playlists
- `user-library-read` - Access to user's saved tracks and albums

### Deployment Configuration

For production deployment:

1. Set `NEXTAUTH_URL` to your production domain
2. Update Spotify app redirect URIs to include your production callback URL
3. Use a secure `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)

## Project Structure

```
app/
├── src/
│   ├── app/
│   │   ├── (protected)/        # Protected routes requiring authentication
│   │   │   └── dashboard/       # Main dashboard and music features
│   │   ├── api/                # API routes
│   │   │   └── auth/           # NextAuth.js authentication
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   └── lib/
│       └── auth.ts             # Authentication configuration
├── public/                     # Static assets
├── Dockerfile                  # Docker configuration
├── package.json               # Dependencies and scripts
└── tailwind.config.js         # Tailwind CSS configuration
```

## Contributing

We welcome contributions to Melodine! Here's how you can help:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests and linting: `pnpm lint` and `pnpm type-check`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add TypeScript types for new features
- Test your changes thoroughly
- Update documentation as needed

### Code Style

- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Use Tailwind CSS for styling
- Maintain consistent file and component naming

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | Run TypeScript type checking |

## Deployment

### Automatic Deployment

The project includes GitHub Actions workflows for:

- **Docker Build & Push**: Automatically builds and pushes Docker images to GitHub Container Registry
- **GitHub Pages**: Serves a redirect page to the main application

### Manual Deployment

1. **Render.com** (Recommended):
   - Connect your GitHub repository
   - Set environment variables
   - Deploy automatically on push to main

2. **Vercel**:
   ```bash
   npx vercel --prod
   ```

3. **Docker**:
   ```bash
   docker build -t melodine .
   docker run -p 3000:3000 melodine
   ```

## Troubleshooting

### Common Issues

1. **Spotify Authentication Fails**
   - Verify your Spotify app credentials
   - Check redirect URIs in Spotify Developer Dashboard
   - Ensure `NEXTAUTH_URL` matches your domain

2. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`
   - Check Node.js version (requires 20+)

3. **API Rate Limits**
   - Spotify API has rate limits; implement proper error handling
   - Consider caching strategies for production

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) for music data
- [Next.js](https://nextjs.org/) for the React framework
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/lxnid/melodine/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Live Demo**: [https://melodine.onrender.com](https://melodine.onrender.com)

**GitHub**: [https://github.com/lxnid/melodine](https://github.com/lxnid/melodine)
