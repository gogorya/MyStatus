# MyStatus

MyStatus is a web application for monitoring the status of various services. It provides a public status page for each service, displaying the uptime and downtime statistics for the last 30 days.

## Features

- Public status page for each service
- Displays uptime and downtime statistics for the last 30 days
- Dark mode support
- Responsive design

## Technologies Used

- Next.js
- React
- Tailwind CSS
- MongoDB
- Clerk for authentication
- Agenda for job scheduling
- Axios for HTTP requests

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

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

3. Create a `.env` file in the root directory and add your MongoDB URI and Clerk API keys:

   ```env
   MONGODB_URI=mongodb://localhost:27017/yourdbname
   CLERK_FRONTEND_API=your-clerk-frontend-api
   CLERK_API_KEY=your-clerk-api-key
   ```

4. Run the development server:

   ```sh
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Contains the Next.js pages and components
- backend: Contains the backend services, controllers, and routes
- `components/`: Contains the UI components
- `lib/`: Contains the API endpoints and utility functions
- `models/`: Contains the Mongoose models
- `public/`: Contains the static assets
- `styles/`: Contains the global styles
- `jobs/`: Contains the job scheduling logic using Agenda

## Scripts

- `npm run dev`: Runs the development server
- `npm run build`: Builds the application for production
- `npm start`: Starts the production server

## API Endpoints

- `GET /api/get-status-page-data`: Fetches the status page data for the given slug

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Clerk](https://clerk.dev/)
- [Agenda](https://github.com/agenda/agenda)
- [Axios](https://axios-http.com/)

## To do
- Integrating Incident and Maintenance
- Socket for live status updates
- Fix ui/ux
- Improving code readability and db design
- Deploy

## Known Issues
- Edit dropdown menu remains open
```

### Explanation:
1. **Features and Technologies Used**: Lists the main features and technologies used in the project.
2. **Getting Started**: Provides instructions for setting up the project locally, including prerequisites, installation steps, and how to run the development server.
3. **Project Structure**: Describes the main directories and their purposes.
4. **Scripts**: Lists the available npm scripts for development and production.
5. **API Endpoints, Contributing, License, and Acknowledgements**: Describes the available API endpoints, encourages contributions, specifies the project's license, and credits the main technologies and libraries used in the project.