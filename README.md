# UnB Course Monitor

A web application to monitor and track course information at University of Brasília (UnB).

## Project Overview

This project consists of two main components:

1. **Web Application** (T3 Stack)

- Frontend: User interface to register desired courses and related information in the database
- Backend: Database storing user information and API endpoints for user and Python script interactions

2. **Data Collection**

- Python web scraping script to monitor course availability and send email alerts to users
- Periodic execution for real-time course data collection
- Automated email notifications when tracked courses become available

## Tech Stack

### Web Application

- [Next.js](https://nextjs.org) - React framework
- [Prisma](https://prisma.io) - Database ORM - PostgreSQL (production) and MySQL (dev)
- [NextAuth.js](https://next-auth.js.org) - Authentication
- [Tailwind CSS](https://tailwindcss.com) - Styling

### Data Collection

- Python
- Selenium (Webscraping)
- MIMEText (Email sender)

## Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
cd webscraping
pip install -r requirements.txt  # Depends on which Python environment manager you use
```

3. Configure environment variables for Web and Python Script
4. Run the development server:

```bash
npm run dev
```

5. To run the Python Script:

```bash
cd webscraping
python main.py
```
