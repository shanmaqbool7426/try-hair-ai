# HairTry AI

An AI-powered mobile app built with Expo (React Native) where users can upload a selfie and preview realistic hairstyles, haircuts, beard styles, and hair colors.

## Tech Stack

- **Frontend**: React Native + Expo (SDK 53), TypeScript, Expo Router
- **UI**: Linear gradients, blur effects, dark glassmorphism design
- **State**: React Context + AsyncStorage for persistence
- **Fonts**: Poppins (400/500/600/700)

## Structure

```
app/
  _layout.tsx              # Root layout with providers
  (tabs)/
    _layout.tsx            # Tab bar layout (4 tabs)
    index.tsx              # Try-On screen (main)
    discover.tsx           # Trending styles gallery
    history.tsx            # Saved looks / favorites
    profile.tsx            # Settings & subscription
  result.tsx               # Before/After result modal
components/
  ErrorBoundary.tsx
  BeforeAfterSlider.tsx    # Drag comparison slider
  HairstyleCard.tsx        # Style selection grid card
  CategoryPill.tsx         # Filter pill button
  GenerationLoader.tsx     # AI processing animation
constants/colors.ts        # Design tokens (dark theme)
contexts/AppContext.tsx    # Global state + AsyncStorage
data/hairstyles.ts         # Hairstyle catalog (male/female, colors, beards)
lib/query-client.ts        # React Query + API setup
```

## Workflows

- **Start Frontend**: `npx expo start --port 8081`
- **Start Backend**: Express server on port 5000 (future)

## User Preferences

- Dark mode first, premium futuristic design
- Glassmorphism + electric purple/cyan color palette
- Mobile-native patterns, minimal text, icon-first UI
