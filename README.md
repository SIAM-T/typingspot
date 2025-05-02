# TypingSpot 🚀

A modern, blazing-fast typing test and learning platform built with Next.js, TypeScript, TailwindCSS, and Supabase.

## Features

- 🎯 Accurate WPM & Accuracy Tracking
- ⚡ Real-time Typing Tests
- 🎮 Typing Games & Challenges (Coming Soon)
- 📊 Progress Tracking
- 👥 Multiplayer Racing (Coming Soon)
- 🌙 Dark/Light Theme
- 📱 Mobile Responsive
- 🔊 Customizable Typing Sounds
- 🔐 User Authentication
- 📈 Personal Statistics
- 🏆 Global Leaderboard

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, TailwindCSS, Framer Motion
- **Backend:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Hosting:** Vercel
- **Analytics:** Vercel Analytics

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/typingspot.git
   cd typingspot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. Add sound files:
   Create a `public/sounds` directory and add the following sound files:
   - `keypress.mp3` - A soft keyboard click sound
   - `keyerror.mp3` - An error sound for incorrect keystrokes
   
   You can find free sound effects at:
   - [Freesound](https://freesound.org/)
   - [OpenGameArt](https://opengameart.org/)
   - [ZapSplat](https://www.zapsplat.com/)

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Create the following tables:

### Users Table
```sql
create table public.users (
  id uuid references auth.users not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text not null,
  username text not null,
  avatar_url text,
  constraint username_length check (char_length(username) >= 3)
);

-- Enable Row Level Security
alter table public.users enable row level security;

-- Create policies
create policy "Users can view their own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id);
```

### Typing Results Table
```sql
create table public.typing_results (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references public.users not null,
  wpm integer not null,
  accuracy numeric not null,
  duration integer not null,
  text_type text not null
);

-- Enable Row Level Security
alter table public.typing_results enable row level security;

-- Create policies
create policy "Users can view all typing results" on public.typing_results
  for select using (true);

create policy "Users can insert their own results" on public.typing_results
  for insert with check (auth.uid() = user_id);
```

## Deployment

### Deploy to Vercel

1. Create a new project on [Vercel](https://vercel.com)

2. Connect your GitHub repository

3. Configure environment variables:
   - Add all variables from `.env.local` to your Vercel project settings
   - Set `NEXT_PUBLIC_SITE_URL` to your production domain

4. Deploy:
   ```bash
   npm run build
   vercel --prod
   ```

### Deploy to Other Platforms

The project is configured to work with any platform that supports Node.js:

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

The app will be available on port 3000 by default.

### Production Checklist

Before deploying to production:

1. Update `next.config.ts`:
   - Configure image domains if using external image sources
   - Add security headers
   - Set up redirects if needed

2. Configure Supabase:
   - Review and update RLS policies
   - Set up backups
   - Configure rate limiting

3. Set up monitoring:
   - Enable Vercel Analytics
   - Configure error tracking
   - Set up performance monitoring

4. SEO and Social:
   - Update meta tags in `layout.tsx`
   - Add social media preview images
   - Submit sitemap to search engines

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
