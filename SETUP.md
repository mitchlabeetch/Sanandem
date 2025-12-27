# Sanandem Setup Guide

This guide will help you set up and run the Sanandem platform locally for development or testing.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **npm** or **pnpm** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/mitchlabeetch/Sanandem.git
cd Sanandem
```

### 2. Set Up PostgreSQL Database

#### Option A: Local PostgreSQL

1. Create a new database:
```bash
createdb sanandem
```

2. Create a database user (optional but recommended):
```sql
CREATE USER sanandem_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sanandem TO sanandem_user;
```

#### Option B: Cloud PostgreSQL

You can use services like:
- [Supabase](https://supabase.com/) (Free tier available)
- [Railway](https://railway.app/) (Free tier available)
- [Neon](https://neon.tech/) (Free tier available)
- [ElephantSQL](https://www.elephantsql.com/) (Free tier available)

### 3. Configure Environment Variables

#### For Sanandem (Public Website)

```bash
cd sanandem
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DATABASE_URL="postgres://sanandem_user:your_password@localhost:5432/sanandem"
IP_SALT="$(openssl rand -hex 32)"  # Generate a random salt
NODE_ENV="development"
PORT=5173
```

#### For Sanadmin (Admin Dashboard)

```bash
cd ../sanadmin
cp .env.example .env
```

Edit `.env` with the same database credentials:

```env
DATABASE_URL="postgres://sanandem_user:your_password@localhost:5432/sanandem"
IP_SALT="$(openssl rand -hex 32)"  # Use the same salt as sanandem
NODE_ENV="development"
PORT=5174
```

### 4. Install Dependencies

#### For Sanandem:

```bash
cd sanandem
npm install
```

#### For Sanadmin:

```bash
cd ../sanadmin
npm install
```

### 5. Initialize Database Schema

Run this from either the `sanandem` or `sanadmin` directory:

```bash
npm run db:push
```

This will create all the necessary tables in your PostgreSQL database.

To verify the schema was created:

```bash
npm run db:studio
```

This opens Drizzle Studio where you can view and manage your database.

### 6. Start Development Servers

#### Terminal 1 - Sanandem (Public Website):

```bash
cd sanandem
npm run dev
```

The public website will be available at: http://localhost:5173

#### Terminal 2 - Sanadmin (Admin Dashboard):

```bash
cd sanadmin
npm run dev
```

The admin dashboard will be available at: http://localhost:5174

## Verifying the Setup

1. **Visit Sanandem**: Navigate to http://localhost:5173
   - You should see the homepage with the hero section
   - Try submitting a test report via the "Submit Data" button
   - Check the dashboard to see if your report appears

2. **Visit Sanadmin**: Navigate to http://localhost:5174
   - You should see the admin dashboard
   - Check if any reports appear in the table
   - Try creating a test report from the admin interface

3. **Check Database**: Run `npm run db:studio` to verify data is being stored

## Common Issues

### Database Connection Errors

**Error**: `connection refused` or `could not connect to server`

**Solution**:
- Ensure PostgreSQL is running: `pg_isready`
- Check your DATABASE_URL is correct
- Verify your database exists: `psql -l`

### Port Already in Use

**Error**: `EADDRINUSE: address already in use`

**Solution**:
- Change the PORT in `.env` to a different number
- Or kill the process using the port: `lsof -ti:5173 | xargs kill`

### Module Not Found

**Error**: `Cannot find module` or `MODULE_NOT_FOUND`

**Solution**:
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

### Database Schema Issues

**Error**: Database queries failing or table not found

**Solution**:
- Drop and recreate the database:
  ```bash
  dropdb sanandem
  createdb sanandem
  npm run db:push
  ```

## Development Workflow

### Making Changes

1. Edit files in `src/` directory
2. Changes auto-reload thanks to Vite HMR
3. Check browser console for errors
4. Test functionality thoroughly

### Database Changes

If you modify the schema in `src/lib/server/db/schema.ts`:

```bash
npm run db:push  # Apply changes to database
npm run db:studio  # Verify changes
```

### Code Quality

```bash
npm run lint      # Check code style
npm run format    # Format code
npm run check     # Type checking
```

### Testing

```bash
npm run test:unit  # Run unit tests
npm run test:e2e   # Run end-to-end tests
npm test          # Run all tests
```

## Building for Production

### Sanandem

```bash
cd sanandem
npm run build
npm run preview  # Test production build locally
```

### Sanadmin

```bash
cd sanadmin
npm run build
npm run preview  # Test production build locally
```

## Deployment

### Environment Setup

Create a `.env.production` file with:

```env
DATABASE_URL="your-production-database-url"
IP_SALT="your-production-salt"
NODE_ENV="production"
```

### Recommended Hosting Platforms

- **Vercel** (Recommended for SvelteKit)
- **Netlify**
- **Railway**
- **Fly.io**
- **DigitalOcean App Platform**

### Database Hosting

- **Supabase** (Recommended, includes real-time features)
- **Railway** (Simple setup)
- **Neon** (Serverless Postgres)
- **AWS RDS**

## Seed Data (Optional)

To populate your database with test data for development:

```bash
# Create a seed script (example)
node scripts/seed.js
```

Example seed script:

```javascript
// scripts/seed.js
import { db } from '../src/lib/server/db/index.js';
import { createReport } from '../src/lib/server/db/reports.js';

async function seed() {
  const testReports = [
    {
      medicationName: 'Aspirin',
      sideEffects: ['Headache', 'Nausea'],
      severity: 3,
      age: 35,
      ageGroup: '26-35',
      gender: 'female',
      submissionSource: 'seed'
    },
    {
      medicationName: 'Ibuprofen',
      sideEffects: ['Dizziness', 'Stomach pain'],
      severity: 5,
      age: 42,
      ageGroup: '36-50',
      gender: 'male',
      submissionSource: 'seed'
    }
  ];

  for (const report of testReports) {
    await createReport(report);
  }

  console.log('Database seeded successfully!');
  process.exit(0);
}

seed();
```

## Additional Commands

### Database Management

```bash
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio
npm run db:push      # Push schema changes
```

### Development Tools

```bash
npm run storybook           # Start Storybook for component development
npm run build-storybook     # Build Storybook for deployment
```

## Documentation

- [SvelteKit Documentation](https://kit.svelte.dev/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [ECharts Documentation](https://echarts.apache.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## Getting Help

- Check the [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for current feature status
- Review the [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines
- Open an issue on [GitHub](https://github.com/mitchlabeetch/Sanandem/issues)
- Join discussions on [GitHub Discussions](https://github.com/mitchlabeetch/Sanandem/discussions)

## Next Steps

After successful setup:

1. Read [PHILOSOPHY.md](./PHILOSOPHY.md) to understand the project's goals
2. Check [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for what's implemented
3. Review [CONTRIBUTING.md](./CONTRIBUTING.md) if you want to contribute
4. Explore the codebase and start developing!

## Troubleshooting

### Reset Everything

If you want to start fresh:

```bash
# Remove all dependencies
rm -rf sanandem/node_modules sanadmin/node_modules
rm sanandem/package-lock.json sanadmin/package-lock.json

# Drop and recreate database
dropdb sanandem
createdb sanandem

# Reinstall and reinitialize
cd sanandem && npm install && npm run db:push
cd ../sanadmin && npm install
```

### Check Logs

If something isn't working:

1. Check browser console (F12)
2. Check terminal output
3. Check PostgreSQL logs: `tail -f /var/log/postgresql/postgresql-*.log`

## Security Notes

⚠️ **Important**:
- Never commit `.env` files to Git
- Use strong passwords for production databases
- Generate secure random salts
- Keep dependencies updated: `npm audit`

## Performance Tips

- Use `npm run db:studio` to monitor database queries
- Enable PostgreSQL query logging during development
- Use browser DevTools to profile performance
- Consider adding database indexes for frequently queried fields

---

**Ready to contribute?** See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines!
