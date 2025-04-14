# API Documentation

## Authentication Changes

### Previous Implementation vs. New Token-Based System

**Previous Implementation (Old Backend):**

- The original FastAPI backend used standard cookie-based session authentication
- Authentication was handled automatically via cookies and session middleware
- Frontend didn't need to manually manage tokens or authentication headers
- Session state was maintained on the server side
- API endpoints didn't require explicit token headers
- The `/docs` endpoint was secured with a lock icon, using FastAPI's built-in security
- All security was handled by the FastAPI framework internally

**New Token-Based Implementation:**

- The new FastAPI backend uses JWT (JSON Web Token) authentication
- The token is returned upon successful login and must be stored by the frontend
- All authenticated API requests must include the token in the Token header
- The backend uses the token to identify the user and their permissions
- Tokens have an expiration time (set to 20000 minutes in this implementation)
- The `/docs` endpoint doesn't show the lock icon, as it's secured differently
- The token must be passed as a header: `Token: <token>`

### Why Were These Changes Made?

The app team implemented these changes to:

1. **Improve Scalability**: Token-based authentication is more scalable as it doesn't require server-side session storage
2. **Enable Microservices**: JWT tokens can be validated across different services without shared session stores
3. **Support Mobile Apps**: Token-based auth works better for mobile applications and multiple clients
4. **Enhance Security**: JWTs can be configured with expiration times and validation rules
5. **Simplify Backend**: Removing session management simplifies the backend architecture

### Frontend Changes Made to Support Token Authentication

We updated the frontend to work with the new token-based authentication system:

1. **API Service Layer**:

   ```typescript
   // Created a centralized API service with token interceptors
   api.interceptors.request.use((config) => {
     const token = localStorage.getItem("accessToken");
     if (token) {
       config.headers.Token = token;
     }
     return config;
   });
   ```

2. **Token Storage**:

   - Token is stored in `localStorage.accessToken` after login
   - User information is stored in `localStorage.userInfo`
   - The login component was updated to store the token from the response:

   ```typescript
   localStorage.setItem("accessToken", response.data.access_token);
   ```

3. **Login Flow Updates**:

   - Updated the login component to use proper OAuth2 password flow with URLSearchParams
   - Changed from standard form submission to the OAuth2 format:

   ```typescript
   const formData = new URLSearchParams();
   formData.append("username", email.trim().toLowerCase());
   formData.append("password", password);
   ```

4. **Protected Routes**:

   - Protected routes now verify token validity by making an authenticated request
   - A central `ProtectedRoute` component handles auth status checking
   - Routes redirect to login if the token is missing or invalid
   - ⚠️ **Important Note**: User lookup is done through `/users/all_users` endpoint and filtering client-side:

   ```typescript
   // Get all users and find the matching user by email
   const response = await api.get("/users/all_users");
   const user = response.data.find((u) => u.mail === userInfo.email);
   ```

5. **Error Handling**:
   - Added comprehensive token error handling for 401 Unauthorized responses
   - The system automatically redirects to the login page when a token expires
   - User-friendly messages are shown when authentication issues occur

### How to Use the Token System

**For Frontend Developers:**

- Use the `api` service from `src/services/api.ts` for all API calls
- No need to manually add the token to requests - it's handled by the interceptor
- Handle 401 errors appropriately (usually by redirecting to login)
- Remember that tokens expire after a certain time period

**For Backend Developers:**

- All authenticated endpoints require the `Token` header with the token
- Use the `get_current_user` dependency to verify and extract user information from the token
- Return appropriate 401 errors for invalid or expired tokens

### Token Authentication Implementation (Updated)

Based on the specific requirements of the FastAPI backend:

1. **Token Format**:

   - We use JWT (JSON Web Token) authentication
   - Tokens are stored in localStorage WITHOUT the 'Bearer' prefix: `localStorage.setItem("accessToken", token)`
   - The backend expects raw tokens in the Token header

2. **API Service with Interceptors**:

   ```typescript
   api.interceptors.request.use((config) => {
     const token = localStorage.getItem("accessToken");
     if (token) {
       // IMPORTANT: The backend expects the raw token - DO NOT add 'Bearer ' prefix
       config.headers.Token = token;
     }
     return config;
   });
   ```

3. **Direct API Calls**:

   When making direct API calls with axios outside of the api service:

   ```typescript
   const token = localStorage.getItem("accessToken");
   const response = await axios.post(`${apiBaseUrl}/endpoint`, payload, {
     headers: {
       Token: token, // DO NOT add 'Bearer ' prefix
     },
   });
   ```

4. **Important**: The backend implementation expects tokens to be sent directly in the Token header WITHOUT the 'Bearer' prefix. This is different from the common practice of using 'Bearer ' prefix, so be careful when modifying code.

5. **Skills Management**:

   - For mentee profiles, skills are updated in a separate API call after profile creation/update
   - The `/mentee/mentee/skills` endpoint requires a specific payload format:

   ```json
   {
     "skills": [{ "skill_name": "JavaScript" }, { "skill_name": "Python" }]
   }
   ```

   - Skills updating is handled with error handling and logging

6. **Backend Requirements**:
   - The FastAPI backend expects tokens to be sent directly in the Token header WITHOUT the Bearer prefix
   - Modifying this behavior requires backend changes, which we've avoided

## Authentication

### Login

- **Endpoint**: `/authentication/login`
- **Method**: POST
- **Input**:
  ```json
  {
    "username": "user@example.com",
    "password": "password123"
  }
  ```
- **Output**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer",
    "role": "mentor",
    "user_name": "John Doe",
    "status_code": 200,
    "profile_status": false
  }
  ```

### User Registration

- **Endpoint**: `/users/register/User`
- **Method**: POST
- **Input**:
  ```json
  {
    "name": "John Doe",
    "mail": "user@example.com",
    "pwd": "password123",
    "role": "mentor" // or "mentee"
  }
  ```
- **Output**:
  ```json
  {
    "Message": "User Created",
    "status_code": 200
  }
  ```

## User Management

### Get All Users

- **Endpoint**: `/users/all_users`
- **Method**: GET
- **Authentication**: Requires Token header
- **Input**: No query parameters
- **Output**:
  ```json
  [
    {
      "id": 1,
      "name": "John Doe",
      "mail": "john@example.com",
      "role": "mentor"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "mail": "jane@example.com",
      "role": "mentee"
    }
  ]
  ```

### Get User Information

- **Note**: The backend does not provide a direct endpoint to get a user by email. Instead, use the `/users/all_users` endpoint and filter the results on the client-side:
  ```typescript
  const response = await api.get("/users/all_users");
  const user = response.data.find((u) => u.mail === email);
  ```

## Mentor Profile

### Get Mentor Profile

- **Endpoint**: `/users/mentor/profile`
- **Method**: GET
- **Authentication**: Requires Token header
- **Input**: No query parameters (uses token for authentication)
- **Output**:
  ```json
  {
    "name": "John Doe",
    "mail": "mentor@example.com",
    "role": "mentor",
    "exp": 5,
    "designation": "Senior Developer",
    "contact": "1234567890",
    "Skill set": [
      {
        "name": "JavaScript",
        "proficiency": 5
      }
    ]
  }
  ```

### Update Mentor Profile

- **Endpoint**: `/users/mentor/profile_creation`
- **Method**: PUT
- **Authentication**: Requires Token header
- **Input**:
  ```json
  {
    "name": "John Doe",
    "designation": "Senior Developer",
    "exp": 5,
    "contact": "1234567890"
  }
  ```
- **Output**:
  ```json
  {
    "Message": "Mentor profile updated",
    "status_code": 200
  }
  ```

## Mentee Profile

### Get Mentee Profile

- **Endpoint**: `/mentee/mentee/profile`
- **Method**: GET
- **Authentication**: Requires Token header
- **Input**: No query parameters (uses token for authentication)
- **Output**:
  ```json
  {
    "name": "Jane Smith",
    "mail": "mentee@example.com",
    "role": "mentee",
    "contact": "1234567890",
    "Skill set": [
      {
        "name": "JavaScript"
      }
    ]
  }
  ```

### Update Mentee Profile

- **Endpoint**: `/mentee/mentee/profile_creation`
- **Method**: PUT
- **Authentication**: Requires Token header
- **Input**:
  ```json
  {
    "name": "Jane Smith",
    "contact": "1234567890",
    "designation": "Student"
  }
  ```
- **Output**:
  ```json
  {
    "message": "Profile updated successfully"
  }
  ```

## Mentorship

### Get Approved Mentees

- **Endpoint**: `/users/approved_mentees`
- **Method**: GET
- **Authentication**: Requires Token header
- **Input**: No query parameters
- **Output**:
  ```json
  [
    {
      "id": 2,
      "name": "Jane Smith",
      "mail": "jane@example.com",
      "role": "mentee"
    }
  ]
  ```

### Get Approved Mentors

- **Endpoint**: `/users/approved_mentors`
- **Method**: GET
- **Authentication**: Requires Token header
- **Input**: No query parameters
- **Output**:
  ```json
  [
    {
      "id": 1,
      "name": "John Doe",
      "mail": "john@example.com",
      "role": "mentor"
    }
  ]
  ```

### Get Mentor Requests

- **Endpoint**: `/users/mentor_requests`
- **Method**: GET
- **Authentication**: Requires Token header
- **Input**: No query parameters
- **Output**:
  ```json
  [
    {
      "id": 3,
      "name": "Bob Johnson",
      "mail": "bob@example.com",
      "role": "mentor",
      "status": "pending"
    }
  ]
  ```

### Get Mentee Requests

- **Endpoint**: `/users/mentee_requests`
- **Method**: GET
- **Authentication**: Requires Token header
- **Input**: No query parameters
- **Output**:
  ```json
  [
    {
      "id": 4,
      "name": "Alice Brown",
      "mail": "alice@example.com",
      "role": "mentee",
      "status": "pending"
    }
  ]
  ```

### Approve Mentor

- **Endpoint**: `/users/approve_mentor/{mentor_id}`
- **Method**: PUT
- **Authentication**: Requires Token header
- **Input**: No request body
- **Output**:
  ```json
  {
    "message": "Mentor approved successfully"
  }
  ```

### Approve Mentee

- **Endpoint**: `/users/approve_mentee/{mentee_id}`
- **Method**: PUT
- **Authentication**: Requires Token header
- **Input**: No request body
- **Output**:
  ```json
  {
    "message": "Mentee approved successfully"
  }
  ```

### Reject Mentor

- **Endpoint**: `/users/reject_mentor/{mentor_id}`
- **Method**: PUT
- **Authentication**: Requires Token header
- **Input**: No request body
- **Output**:
  ```json
  {
    "message": "Mentor rejected successfully"
  }
  ```

### Reject Mentee

- **Endpoint**: `/users/reject_mentee/{mentee_id}`
- **Method**: PUT
- **Authentication**: Requires Token header
- **Input**: No request body
- **Output**:
  ```json
  {
    "message": "Mentee rejected successfully"
  }
  ```

## Skills Management

### Update Mentor Skills

- **Endpoint**: `/users/mentor/skills`
- **Method**: POST
- **Authentication**: Requires Token header
- **Input**:
  ```json
  {
    "skills": [
      {
        "skill_name": "Python",
        "proficiency": 3
      },
      {
        "skill_name": "JavaScript",
        "proficiency": 2
      }
    ]
  }
  ```
- **Output**:
  ```json
  {
    "message": "Skills updated successfully",
    "status_code": 200
  }
  ```

### Update Mentee Skills

- **Endpoint**: `/mentee/mentee/skills`
- **Method**: POST
- **Authentication**: Requires Token header
- **Input**:
  ```json
  {
    "skills": [
      {
        "skill_name": "Python"
      },
      {
        "skill_name": "JavaScript"
      }
    ]
  }
  ```
- **Output**:
  ```json
  {
    "message": "Skills updated successfully",
    "status_code": 200
  }
  ```

### Get Mentor Skills

- **Endpoint**: `/users/mentor/get-skills`
- **Method**: GET
- **Authentication**: Requires Token header
- **Input**: No query parameters (uses token for authentication)
- **Output**:
  ```json
  {
    "skills": [
      {
        "skill_name": "JavaScript",
        "proficiency": 3
      },
      {
        "skill_name": "Python",
        "proficiency": 4
      }
    ],
    "status_code": 200
  }
  ```

### Get Mentee Skills

- **Endpoint**: `/mentee/mentee/get-skills`
- **Method**: GET
- **Authentication**: Requires Token header
- **Input**: No query parameters (uses token for authentication)
- **Output**:
  ```json
  {
    "skills": [
      {
        "skill_name": "JavaScript"
      },
      {
        "skill_name": "React"
      }
    ],
    "status_code": 200
  }
  ```

## Matching and Recommendations

### Find Mentors

- **Endpoint**: `/mentee/find-mentors`
- **Method**: GET
- **Authentication**: Requires Token header
- **Input**: No query parameters (uses token for authentication - matches based on mentee skills)
- **Output**:
  ```json
  {
    "mentors": [
      {
        "id": 1,
        "name": "John Doe",
        "mail": "mentor@example.com",
        "contact": "1234567890",
        "designation": "Senior Developer",
        "exp": 5,
        "skills": [
          {
            "skill_name": "JavaScript",
            "proficiency": 5
          }
        ]
      }
    ],
    "status_code": 200
  }
  ```

### Request Mentorship

- **Endpoint**: `/mentee/send-request`
- **Method**: POST
- **Authentication**: Requires Token header
- **Input**:
  ```json
  {
    "mentor_id": 1
  }
  ```
- **Output**:
  ```json
  {
    "message": "Request sent successfully",
    "status_code": 200
  }
  ```

## Course Management

### Get Course Progress

- **Endpoint**: `/mentee/course-progress`
- **Method**: GET
- **Authentication**: Requires Token header
- **Input**: No query parameters (uses token for authentication)
- **Output**:
  ```json
  {
    "course_progress": 35,
    "completed_modules": [
      {
        "module_id": 1,
        "name": "Introduction",
        "completion_date": "2023-10-25T14:30:00"
      }
    ],
    "status_code": 200
  }
  ```

### Update Course Progress

- **Endpoint**: `/mentee/update-progress`
- **Method**: POST
- **Authentication**: Requires Token header
- **Input**:
  ```json
  {
    "module_id": 2,
    "completed": true
  }
  ```
- **Output**:
  ```json
  {
    "message": "Progress updated successfully",
    "status_code": 200
  }
  ```

## Analytics and Reporting

### Get Mentor Dashboard Stats

- **Endpoint**: `/mentor/dashboard-stats`
- **Method**: GET
- **Authentication**: Requires Token header
- **Input**: No query parameters (uses token for authentication)
- **Output**:
  ```json
  {
    "total_mentees": 5,
    "active_mentees": 3,
    "pending_requests": 2,
    "average_mentee_progress": 45,
    "status_code": 200
  }
  ```

### Get Mentee Dashboard Stats

- **Endpoint**: `/mentee/dashboard-stats`
- **Method**: GET
- **Authentication**: Requires Token header
- **Input**: No query parameters (uses token for authentication)
- **Output**:
  ```json
  {
    "course_progress": 35,
    "mentor_name": "John Doe",
    "mentor_email": "mentor@example.com",
    "days_active": 14,
    "status_code": 200
  }
  ```

## Error Responses

All endpoints may return the following error responses:

- **401 Unauthorized**:

  ```json
  {
    "detail": "Invalid token"
  }
  ```

- **404 Not Found**:

  ```json
  {
    "detail": "Resource not found"
  }
  ```

- **422 Unprocessable Entity**:
  ```json
  {
    "detail": "Validation error",
    "errors": {
      "field": ["error message"]
    }
  }
  ```

## Troubleshooting

### CORS Issues

If you encounter CORS errors when making requests from the frontend to the backend, please ensure:

1. **Backend CORS Configuration:**

   - The FastAPI backend has CORS middleware configured in `main.py` to allow requests from:
     - `http://localhost:3000`
     - `http://127.0.0.1:3000`
   - All methods are allowed: GET, POST, PUT, DELETE, OPTIONS, PATCH
   - All headers are allowed: `allow_headers=["*"]`

2. **Preflight Requests:**

   - Some endpoints have explicit OPTIONS handlers to properly handle preflight requests
   - This is particularly important for registration and login endpoints
   - If you encounter CORS errors on a specific endpoint, check if it needs an OPTIONS handler

3. **Debugging CORS Issues:**

   - Check browser console for detailed error messages
   - Verify the request is being sent to the correct URL and port
   - Look for "Access-Control-Allow-Origin" errors which indicate CORS configuration issues
   - Ensure credentials are properly handled with `withCredentials: true` for cross-origin requests

4. **Registration Endpoint CORS Handling:**

   - The user registration endpoint has special CORS handling
   - If registration fails with CORS errors, check the network tab for the preflight request

5. **CORS Error Example:**

   ```
   Access to fetch at 'http://localhost:8000/users/register/User' from origin 'http://localhost:3000'
   has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
   ```

6. **Solutions:**
   - Ensure the backend is running on the expected port (8000)
   - Check that the frontend is running on a port the backend allows (3000)
   - Use the browser's Network tab to inspect the failed request and response headers
   - If specific endpoints still have CORS issues, they may need explicit OPTIONS handlers

### Authentication Troubleshooting

If you encounter issues with authentication tokens, such as "Token header missing" errors:

### Common Token Errors

1. **"Token header missing" or "Token is None"**:

   - The token is not being sent in the request headers
   - The token is not properly stored in localStorage
   - The interceptor is not correctly adding the token to headers

2. **"Invalid token" or JWT decode errors**:
   - The token format is incorrect
   - The token has expired
   - The token signature is invalid

### How to Fix Token Issues

1. **Verify token storage**:

   ```javascript
   // Check token in browser console
   console.log("Token:", localStorage.getItem("accessToken"));
   ```

   The token should be a long string without the 'Bearer ' prefix.

2. **Force token in requests**:

   ```javascript
   // Add explicit token to individual requests
   const token = localStorage.getItem("accessToken");
   const response = await api.get("/some/endpoint", {
     headers: {
       Token: token,
     },
   });
   ```

3. **Refresh token by logging out and back in**:

   - Clear localStorage and cookies
   - Log out and log in again to get a fresh token

4. **Check network requests**:
   - Use browser developer tools to verify the Token header is being sent
   - Check if preflight OPTIONS request is succeeding
   - Verify the correct endpoint URLs are being used

### Backend Debugging

1. **Look for these logs on the server**:

   - "Token is None - Token header missing"
   - "Missing mail or user_id in token payload"
   - "JWT Error: [error details]"

2. **Important**: The backend expects the raw token in the Token header, without the "Bearer " prefix.

## Frontend-Backend Field Mapping

### Recent Updates to Profile Components

We've recently updated the profile components to match the exact field requirements of the backend API. This ensures smooth data flow and prevents errors when sending data to the backend.

#### MenteeProfile Component Changes

The MenteeProfile component has been simplified to include only fields that are supported by the backend:

1. **Removed Fields**:

   - `gender`: This field is not stored by the backend
   - `github_id`: This field is not stored by the backend
   - `exp`: This field is not used for mentees

2. **Current Fields**:

   - `name`: Mentee's full name
   - `mail`: Mentee's email (read-only)
   - `contact`: 10-digit contact number
   - `Skill set`: Array of skills (each with a name property)

3. **API Endpoints Used**:
   - GET `/mentee/mentee/profile`: Retrieves the mentee profile
   - PUT `/mentee/mentee/profile_creation`: Updates the mentee profile with `name` and `contact`
   - POST `/mentee/mentee/skills`: Updates the mentee's skills

#### Field Mapping

| Frontend Field | Backend Field | Notes                                     |
| -------------- | ------------- | ----------------------------------------- |
| `name`         | `name`        | Required for profile creation             |
| `contact`      | `contact`     | Required for profile creation             |
| `Skill set`    | `Skill set`   | Skills are updated in a separate API call |

### Handling Missing Fields

If you need to display or collect additional fields that are not supported by the current backend:

1. Create new backend endpoints or update existing ones to support the additional fields
2. Update the profile component interfaces and state
3. Add the fields to the API request payloads

Never send fields to the backend that it doesn't expect, as this can cause validation errors.

## CORS Workarounds

### Registration Endpoint CORS Fix

The registration endpoint (`/users/register/User`) has a special implementation that doesn't handle OPTIONS preflight requests correctly. To work around this CORS issue, we've implemented the following solution:

1. **Use URL-encoded Form Data Instead of JSON:**

   ```typescript
   // Instead of sending JSON data (which triggers preflight):
   const userData = {
     name: "John",
     mail: "john@example.com",
     pwd: "password",
     role: "mentor",
   };
   api.post("/users/register/User", userData);

   // Use URL-encoded form data (avoids preflight):
   const formData = new URLSearchParams();
   formData.append("name", "John");
   formData.append("mail", "john@example.com");
   formData.append("pwd", "password");
   formData.append("role", "mentor");

   axios.post("http://localhost:8000/users/register/User", formData, {
     headers: {
       "Content-Type": "application/x-www-form-urlencoded",
     },
   });
   ```

2. **Why This Works:**

   - Simple requests (using application/x-www-form-urlencoded) don't trigger preflight OPTIONS requests
   - The backend processes form data the same way it would process JSON
   - This bypasses the CORS preflight check that was failing

3. **Direct API Call:**
   - We use axios directly instead of the api service to ensure complete control over headers
   - This approach is only needed for the registration endpoint

### Other CORS Best Practices

1. **For Normal POST Requests:**

   - Use JSON format with proper Content-Type headers
   - Ensure the backend properly handles OPTIONS preflight requests

2. **For File Uploads:**

   - Use FormData with multipart/form-data Content-Type
   - May still require OPTIONS handling on the backend

3. **For Authenticated Requests:**
   - Follow the token guidelines in the Authentication section
   - Remember that adding custom headers will trigger preflight requests

## CORS Troubleshooting

If you encounter CORS errors when making requests from the frontend to the backend:

### Common CORS Errors

The most common error is: "Access to XMLHttpRequest at 'http://localhost:8000/endpoint' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource."

### Immediate Solutions:

1. **Restart both servers:**
   - Restart the FastAPI backend server to ensure CORS middleware is properly applied
   - Restart the React development server
2. **Clear browser cache:**

   - Try incognito/private browsing mode
   - Clear browser cache and cookies
   - Use developer tools to "Disable Cache" while DevTools is open

3. **Check token settings:**
   - Ensure your token is being sent correctly in the Token header
   - Check browser console to verify the token is present in localStorage
   - Verify the token hasn't expired

### Backend Settings (FastAPI):

The CORS middleware should be configured directly in `main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)
```

Make sure this middleware is added BEFORE including any routers.

### Frontend Settings (React):

The axios instance should be configured with:

```typescript
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Critical for CORS with credentials
});
```

### CORS Workarounds for Specific Endpoints

#### Registration Endpoint CORS Fix

The registration endpoint (`/users/register/User`) has a special implementation that doesn't handle OPTIONS preflight requests correctly. To work around this CORS issue, we've implemented the following solution:

1. **Use URL-encoded Form Data Instead of JSON:**

   ```typescript
   // Instead of sending JSON data (which triggers preflight):
   const userData = {
     name: "John",
     mail: "john@example.com",
     pwd: "password",
     role: "mentor",
   };
   api.post("/users/register/User", userData);

   // Use URL-encoded form data (avoids preflight):
   const formData = new URLSearchParams();
   formData.append("name", "John");
   formData.append("mail", "john@example.com");
   formData.append("pwd", "password");
   formData.append("role", "mentor");

   axios.post("http://localhost:8000/users/register/User", formData, {
     headers: {
       "Content-Type": "application/x-www-form-urlencoded",
     },
   });
   ```

2. **Why This Works:**

   - Simple requests (using application/x-www-form-urlencoded) don't trigger preflight OPTIONS requests
   - The backend processes form data the same way it would process JSON
   - This bypasses the CORS preflight check that was failing

3. **Direct API Call:**
   - We use axios directly instead of the api service to ensure complete control over headers
   - This approach is only needed for the registration endpoint

### Testing CORS Settings:

1. Use a simple endpoint like `/users/all_users` to test if CORS is working
2. Check network tab in developer tools to see if OPTIONS preflight requests succeed
3. Verify that response headers include appropriate CORS headers

Remember that CORS is enforced by browsers, not by the API clients. Server responses must include appropriate CORS headers for browser-based requests to succeed.

## CORS Proxy Server Solution

To solve the CORS issues without modifying the FastAPI backend, we've implemented a CORS proxy server that sits between the frontend and backend.

### How the Proxy Works

1. The proxy server runs on port 3001 (`http://localhost:3001`)
2. All frontend API requests are sent to the proxy instead of directly to the backend
3. The proxy adds CORS headers to all responses and handles preflight OPTIONS requests
4. The proxy forwards requests to the backend at `http://localhost:8000`

### Running the Proxy Server

1. Start the proxy server with:
   ```
   npm run proxy
   ```
2. Start the frontend development server with:
   ```
   npm run dev
   ```
3. Both servers need to be running simultaneously

### Implementation Details

- The proxy is implemented using Express.js and http-proxy-middleware
- It automatically adds the required CORS headers to all responses
- It handles preflight OPTIONS requests properly
- The frontend API service automatically uses the proxy server in development mode

### Configuration

- In development mode, the API_BASE_URL is set to the proxy server URL
- In production mode, the API_BASE_URL should be set to the actual backend URL
- This configuration happens automatically based on your environment

### Manual API Calls

If you need to make API calls directly (not using the api service), use:

```typescript
// In development (using proxy)
axios.post("http://localhost:3001/users/register/User", data);

// In production (direct to backend)
axios.post("http://actual-backend-url/users/register/User", data);
```

## Docker Deployment Guide

This section provides instructions for deploying the application using Docker, which will help DevOps teams easily set up the environment.

### Prerequisites

- Docker and Docker Compose installed
- Git repository access

### Docker Deployment Steps

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd [project-directory]
   ```

2. Create a `docker-compose.yml` file in the project root:

   ```yaml
   version: "3.8"

   services:
     frontend:
       build:
         context: ./Frontend
         dockerfile: Dockerfile
       ports:
         - "3000:80"
       environment:
         - VITE_API_URL=http://api:8000
       depends_on:
         - api

     api:
       build:
         context: ./FastAPI for login and mentor profile
         dockerfile: Dockerfile
       ports:
         - "8000:8000"
       environment:
         - DATABASE_URL=postgresql://postgres:password@db:5432/postgres
       depends_on:
         - db

     db:
       image: postgres:15
       environment:
         - POSTGRES_PASSWORD=password
         - POSTGRES_USER=postgres
         - POSTGRES_DB=postgres
       volumes:
         - postgres_data:/var/lib/postgresql/data

   volumes:
     postgres_data:
   ```

3. Create a `Dockerfile` in the Frontend directory:

   ```Dockerfile
   # Build stage
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   # Production stage
   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

4. Create `nginx.conf` in the Frontend directory:

   ```
   server {
     listen 80;

     location / {
       root /usr/share/nginx/html;
       index index.html;
       try_files $uri $uri/ /index.html;
     }
   }
   ```

5. Create a `Dockerfile` in the FastAPI directory:

   ```Dockerfile
   FROM python:3.9-slim

   WORKDIR /app

   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt

   COPY . .

   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

6. Create a `.dockerignore` file in both Frontend and FastAPI directories:

   ```
   node_modules
   dist
   .env
   .env.local
   .git
   .gitignore
   ```

7. Start the containers:
   ```bash
   docker-compose up -d
   ```

### Environment Variables

The application uses the following environment variables:

#### Frontend (Vite/React)

| Variable     | Description     | Default               |
| ------------ | --------------- | --------------------- |
| VITE_API_URL | Backend API URL | http://localhost:3001 |

These variables can be set in:

- `.env` file for local development
- Docker compose environment section
- CI/CD pipeline for production deployments

#### Backend (FastAPI)

| Variable                    | Description                  | Default                                                |
| --------------------------- | ---------------------------- | ------------------------------------------------------ |
| DATABASE_URL                | PostgreSQL connection string | postgresql://postgres:password@localhost:5432/postgres |
| SECRET_KEY                  | JWT secret key               | Your-Secret-Key-Here                                   |
| ALGORITHM                   | JWT algorithm                | HS256                                                  |
| ACCESS_TOKEN_EXPIRE_MINUTES | Token expiration             | 30                                                     |

### Troubleshooting Deployment

1. **CORS Issues**: Ensure the backend has proper CORS headers for production domain.
2. **Database Connection**: Verify database credentials and connection string in environment variables.
3. **API Connectivity**: Check if frontend can reach the backend API using the correct URL.
4. **Container Logs**: Use `docker-compose logs service_name` to check for errors.

For local development, continue using the proxy server approach. For production, properly configure CORS headers on the backend to allow requests from the frontend domain.

## Important Notes on Backend API Requirements

### Form Data for Authentication Endpoints

The FastAPI backend requires form-urlencoded data for authentication endpoints, not JSON. This is a critical aspect of the implementation to be aware of:

1. **Login Endpoint**: `/authentication/login`

   - Requires `application/x-www-form-urlencoded` content type
   - Must use URLSearchParams or equivalent to format data
   - Correct approach:

   ```typescript
   const formData = new URLSearchParams();
   formData.append("username", email.trim().toLowerCase());
   formData.append("password", password);

   axios.post("/authentication/login", formData, {
     headers: {
       "Content-Type": "application/x-www-form-urlencoded",
     },
   });
   ```

2. **Registration Endpoint**: `/users/register/User`

   - Also requires `application/x-www-form-urlencoded` content type
   - Correct approach:

   ```typescript
   const formData = new URLSearchParams();
   formData.append("name", userData.name.trim());
   formData.append("mail", userData.mail.trim().toLowerCase());
   formData.append("pwd", userData.pwd);
   formData.append("role", userData.role);

   axios.post("/users/register/User", formData, {
     headers: {
       "Content-Type": "application/x-www-form-urlencoded",
     },
   });
   ```

3. **Why This Matters**:
   - The FastAPI backend uses OAuth2PasswordRequestForm dependency for login
   - This requires form data, not JSON payload
   - Sending JSON will result in 422 Unprocessable Content errors
   - This also helps avoid CORS preflight requests for simple endpoints

**For Developers**:

- Use the `apiService.login()` and `apiService.register()` functions in `api.ts` for these specific endpoints
- These functions properly format the data as form-urlencoded
- This approach is required due to the specific backend implementation
- Other API endpoints continue to use standard JSON formatting

## Profile Completion Workflow

The application enforces a profile completion step for new users. This section explains how the profile completion workflow is implemented and how it works.

### How Profile Completion Works

1. **Login Status Check**: When a user logs in, the backend returns their profile completion status (`is_profile_complete`).

2. **Local Storage**: The profile completion status is stored in `localStorage` with the key `profile_status`. Possible values are:

   - `complete`: User has completed their profile
   - `incomplete`: User needs to complete their profile

3. **Profile Completion Redirect**: New users or users with incomplete profiles are automatically redirected to the profile completion page after login.

4. **Protected Routes**: All dashboard and profile pages are protected and require profile completion. Users trying to access these pages without completing their profile will be redirected to the profile completion page.

5. **View Profile Button**: When a user clicks "View Profile" in the navbar, the application checks their profile status first:
   - If the profile is incomplete, they're redirected to the profile completion page with a message
   - If the profile is complete, they're taken to their profile page based on their role

### Key Components Involved

- **ProtectedRoute**: Guards routes and checks profile completion status
- **DashboardLayout**: Contains an additional check for profile completion before rendering dashboard components
- **ProfileCompletion**: Handles the profile completion form and API interactions
- **Navbar**: Contains logic to check profile completion before allowing profile access

### Implementation Details

For developers, here are some important notes on the implementation:

1. **Profile Completion Check**:

   ```typescript
   const profileStatus = localStorage.getItem("profile_status");
   if (profileStatus !== "complete") {
     // Redirect to profile completion
     navigate("/profile-completion");
   }
   ```

2. **After Profile Completion**:
   Once the profile is successfully completed via the API, the status is updated in localStorage:

   ```typescript
   localStorage.setItem("profile_status", "complete");
   ```

3. **Error Handling**:
   The application has fallback mechanisms to handle backend issues, ensuring that users are always directed to the correct next step even if the backend is temporarily unavailable.

### Troubleshooting

If you encounter issues with the profile completion workflow:

1. Check browser localStorage values, especially `profile_status` and `accessToken`
2. Verify the API response includes `is_profile_complete` field
3. Check the browser console for helpful debugging logs about profile status checks
4. If a user can't access their profile, try clearing localStorage and logging in again
