# RPP Generator

Application for generating Rencana Pelaksanaan Pembelajaran (RPP), Kisi-Kisi, and Soal documents.

## Environment Setup

The application uses different environment configurations for development and production:

### Environment Files

- `.env`: Default configuration used in all environments
- `.env.development`: Development-specific settings (used with `npm run dev`)
- `.env.production`: Production settings (used with `npm run build` and `npm start`)
- `.env.local`: Local overrides (not committed to git, takes precedence over other files)

### Setting Up for Development

1. Copy `.env.development` to `.env.local` if you need to override any settings:
   ```bash
   cp .env.development .env.local
   ```

2. Modify `.env.local` with your specific configuration needs

### Setting Up for Production

When deploying to production, ensure the production environment variables are set correctly:

1. If using a platform like Vercel or Netlify, configure the environment variables in their dashboard
2. For manual deployment, ensure `.env.production` is properly configured

## Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Run production build
npm start
```
