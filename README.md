# Zohar Media Backend API

A comprehensive GraphQL API backend for Zohar Media Admin application, built with Node.js, TypeScript, Sequelize, and Apollo Server.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd zohar-media-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   NODE_ENV=development
   PORT=4000
   JWT_SECRET=your-super-secret-jwt-key-here

   # Database Configuration
   DB_HOST=localhost
   DB_NAME=zohar_media
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_PORT=3306
   ```

4. **Database Setup**

   ```bash
   # Create database
   mysql -u root -p -e "CREATE DATABASE zohar_media;"

   # Run migrations
   npm run db:migrate

   # Generate GraphQL schema
   npm run generate
   ```

5. **Start the server**

   ```bash
   # Development
   npm run start:dev

   # Production
   npm run start:prod
   ```

The server will be available at `http://localhost:4000/graphql`

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=4000
JWT_SECRET=your-production-jwt-secret
DB_HOST=your-production-db-host
DB_NAME=zohar_media_prod
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
DB_PORT=3306
```

### Build for Production

```bash
npm run build
npm start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]
```

## 📝 API Rate Limiting

- **Authentication:** 5 requests per minute per IP
- **General API:** 100 requests per minute per authenticated user
- **File Upload:** 10 requests per minute per authenticated user

## 🛠️ Development Scripts

```bash
# Start development server
npm run start:dev

# Start production server
npm run start:prod

# Run database migrations
npm run db:migrate

# Generate GraphQL schema
npm run generate

# Seed database with sample data
npm run db:seed

# Build for production
npm run build

# Type checking
npm run type-check
```

## 📞 Support

For questions or issues:

- Create an issue in the repository
- Contact the development team
- Check the GraphQL playground for API exploration

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
