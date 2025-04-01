# LetterFlow

A comprehensive application for real estate professionals to organize property data and generate personalized letters.

## Features

- **CSV Data Processing**: Upload and process property data from CSV files
- **Neighborhood Organization**: Organize properties into neighborhoods for targeted marketing
- **Letter Generation**: Create personalized letters using customizable templates
- **Template Management**: Create, edit, and save templates for future use
- **Analytics Dashboard**: Track campaign performance and response rates

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Prisma with SQLite (easily upgradable to PostgreSQL/MySQL)

## Getting Started

1. Clone the repository
   ```
   git clone https://github.com/mikespacek/letterflow.git
   cd letterflow
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up the database
   ```
   npx prisma db push
   npx prisma db seed
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Pricing Plans

LetterFlow offers three pricing tiers:

- **Free**: For individuals just getting started
- **Starter ($29/month)**: For growing real estate businesses
- **Pro ($49/month)**: For professional investors and teams

## License

[MIT](LICENSE) 