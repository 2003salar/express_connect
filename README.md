# Express Connect 🌟

Express Connect is a platform built with Node.js and the Express framework that allows Express.js developers to discuss and share code, as well as troubleshoot and resolve bugs in Express.js. It offers a community space for developers to collaborate and improve their knowledge and skills.

## Table of Contents

- [Features](#features)
- [Setup](#setup)
- [API Routes](#api-routes)
  - [Posts](#posts)
  - [Comments](#comments)
  - [Users and Authentication](#users-and-authentication)
- [Models](#models)
- [Technologies](#technologies)

## Features ✨

- User authentication and session management.
- CRUD operations for discussions (posts) and comments.
- Nested comments (replies to comments).
- Community-driven code sharing and troubleshooting.
- Proper error handling and responses.

## Setup ⚙️

1. Clone this repository:

    ```bash
    git clone https://github.com/2003salar/express_connect.git
    cd express_connect
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root of the project and configure the following environment variables:

    ```plaintext
    PG_USER=<your-postgres-username>
    PG_PASSWORD=<your-postgres-password>
    PG_HOST=<your-postgres-host>
    PG_PORT=<your-postgres-port>
    PG_DATABASE=<your-postgres-database>
    SESSION_SECRET=<your-session-secret>
    PORT=<port-number> # Default is 3000 if not specified
    ```

4. Run the application:

    ```bash
    npm start
    ```

5. The server will start and listen on the specified port (default: `3000`).

## API Routes 🛠️

### Users and Authentication 🛡️

- `POST /register`: Handle user registration, including input validation, password hashing, and creation of a new user.
- `POST /login`: Authenticate the user using Passport's local strategy and provide appropriate responses.
- `GET /logout`: Log out the user by clearing the session and providing a success response.

### Posts 📝

- `GET /posts`: Get all posts, including their associated data such as user details and comments.
- `POST /posts`: Create a new post.
- `GET /posts/:id`: Retrieve a specific post by its ID.
- `PATCH /posts/:id`: Update a specific post by its ID.
- `DELETE /posts/:id`: Delete a specific post by its ID.

### Comments 💬

- `GET /comments/:commentId`: Retrieve a specific comment by its ID.
- `POST /comments/:id`: Add a new comment to a specific post.
- `POST /comments/reply/:postId/:parentId`: Reply to a specific comment.
- `PATCH /comments/:id`: Update a specific comment by its ID.
- `DELETE /comments/:id`: Delete a specific comment by its ID.

## Models 📚

The application uses Sequelize for data models and relationships:

- `Users`: Represents the users in the system.
- `Posts`: Represents the discussions (posts) in the system.
- `Comments`: Represents the comments on posts.
- `Tags`: Represents tags that can be associated with posts.
- `Post_Tags`: Represents the relationship between posts and tags.

## Technologies 🔧

- Node.js
- Express.js
- PostgreSQL
- Sequelize
- Passport.js
- connect-pg-simple

Enjoy using Express Connect and feel free to contribute to the project! 😊
