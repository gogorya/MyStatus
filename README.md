# MyStatus

MyStatus is a web application for monitoring the status of various web services. It provides the ability to create public status pages and a Dashboard to manage your services and status pages.

## Features

- Public status page
- Multi tenant design
- Live service monitoring
- Clerk Authentication
- Dashboard to manage services
- Dark mode support
- Responsive design

## Technologies Used

- Next.js/React
- Tailwind CSS
- MongoDB
- Clerk for authentication
- agenda for job scheduling
- axios for HTTP requests
- cors, helmet
- shadcn/ui

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Clerk keys and Create Org permission enabled

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/gogorya/mystatus.git
   cd mystatus
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the frontend and backend directories and add the following keys:

- Frontend

  ```env
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-public-key
  CLERK_SECRET_KEY=your-clerk-api-key
  NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
  NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
  API_HOST=your-api-host
  ```

- Backend (Svix key only needed if setting up clerk Webhooks)
  ```env
  MONGODB_URI=mongodb://localhost:27017/your-db-name
  CLERK_PUBLISHABLE_KEY=your-clerk-public-key
  CLERK_SECRET_KEY=your-clerk-api-key
  SVIX_WEBHOOK_SECRET=your-svix-webhook-key
  ```

4. Run the development server:

- Frontend

  ```sh
  npm run dev
  ```

  Running on [http://localhost:3000](http://localhost:3000).

- Backend

  ```sh
  npm run dev
  ```

  Running on [http://localhost:8080](http://localhost:8080).

## Project Structure

- frontend: Contains the frontend pages, components, and functions
- `app/`: Contains the Next.js pages
- `components/`: Contains the UI components
- `lib/`: Contains the API endpoints and utility functions
- backend: Contains the backend services, controllers, and routes
- `models/`: Contains the Mongoose models
- `jobs/`: Contains the jobs and scheduling logic using Agenda
- `services/`: Contains business logic and functions that handle data processing

## Scripts

- `npm run dev`: Runs the development server (Frontend & Backend)
- `npm run build`: Builds the application for production (Frontend)
- `npm start`: Starts the production server (Frontend & Backend)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

<!-- ## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Clerk](https://clerk.dev/)
- [Agenda](https://github.com/agenda/agenda)
- [Axios](https://axios-http.com/) -->

## To do

- Automatic Incident creation when a service is down.
- Socket connection for live updates.
- Display UTC time on public status page.
- Send all active Incidents on public status page and separate them.
- Email subscription to provide updates on services.
- Improve UI & responsiveness on mobile devices.
- Finding and improving edge cases and other minor bugs.

## Known Issues

- Dropdown menu for Editing remains open.
- Hover card does not work on mobile.
- Theme toggle is not working on Firefox mobile.
- Dashboard doesn't load on signing in when using 'npm run dev'.
- CORS header is not appearing on the frontend.

<!-- ### Explanation:

1. **Features and Technologies Used**: Lists the main features and technologies used in the project.
2. **Getting Started**: Provides instructions for setting up the project locally, including prerequisites, installation steps, and how to run the development server.
3. **Project Structure**: Describes the main directories and their purposes.
4. **Scripts**: Lists the available npm scripts for development and production.
5. **Contributing, License, and Acknowledgements**: Encourages contributions, specifies the project's license, and credits the main technologies and libraries used in the project. -->
