# Job Application Tracker

A backend REST API for tracking job applications throughout the hiring process.  
Built to deepen my skills in **Java**, **Spring Boot**, and backend development.  
The frontend was provided separately and consumes this API.

---

## What I Built

A complete job tracking system where users can:
- Register and log in securely
- Add, edit, and delete job applications
- Track application status (Sent → Interview → Offer / Rejected)
- Upload a CV per application (stored on Cloudinary)
- Export all applications to Excel
- View a personal dashboard with stats and weekly charts

Every user sees only their own data — full isolation between accounts.

---

## Tech Stack

### Backend (main focus)
| Technology | Usage |
|---|---|
| **Java 21** | Core language |
| **Spring Boot 3.5** | Application framework |
| **Spring Security** | Authentication & authorization |
| **JWT (jjwt)** | Stateless token-based auth |
| **Spring Data JPA** | ORM / database access |
| **MySQL** | Relational database |
| **Apache POI** | Excel file generation |
| **Cloudinary SDK** | CV file upload & storage |
| **Lombok** | Boilerplate reduction |
| **Maven** | Build & dependency management |

### Frontend (provided separately)
| Technology | Usage |
|---|---|
| React + Vite | UI framework |
| Tailwind CSS | Styling |
| Axios | HTTP client with JWT headers |
| React Router | Protected navigation |
| Recharts | Dashboard charts |

---

## What I Learned

### Spring Security & JWT
Implemented a full stateless authentication flow from scratch:
- Custom `JwtFilter` that intercepts every request, validates the token, and sets the security context
- Password hashing and user registration via `AuthService`
- Route-level protection — unauthenticated requests return 401
- CORS configuration for cross-origin frontend access

### Spring Data JPA
- Designed entity models with JPA annotations (`@Entity`, `@Table`, `@Id`, `@GeneratedValue`)
- Wrote custom repository queries (`findByUserEmail`) to scope data per user
- Used Hibernate's `ddl-auto=update` for schema management

### RESTful API Design
- Built a clean REST API with proper HTTP methods (GET, POST, PUT, DELETE)
- Handled multipart file uploads (`MultipartFile`) for CV attachment
- Returned appropriate response types including binary blobs for Excel download

### File Handling & External Services
- Integrated Cloudinary SDK to upload and store CV files
- Used Apache POI to generate `.xlsx` Excel exports dynamically from database records

### Security Best Practices
- Separated credentials from source code using `application-local.properties` (gitignored)
- Used environment variable placeholders in `application.properties` for deployment readiness

---

## Project Structure

```
src/
└── main/java/com/jobtracker/jobtracker/
    ├── ApplicationController.java   # REST endpoints
    ├── ApplicationService.java      # Business logic
    ├── ApplicationRepository.java   # DB queries
    ├── Application.java             # JPA entity
    ├── AuthController.java          # Register / Login
    ├── AuthService.java             # JWT generation & auth
    ├── JwtFilter.java               # Security filter
    ├── JwtService.java              # Token validation
    ├── SecurityConfig.java          # Spring Security + CORS
    ├── FileUploadService.java       # Cloudinary integration
    └── ExcelService.java            # Apache POI export

frontend/src/
    ├── pages/                       # Login, Applications, Dashboard
    ├── components/                  # Layout, Modal, ProtectedRoute
    ├── api/axios.js                 # Axios with JWT interceptor
    └── context/AuthContext.jsx      # Auth state management
```

---

## API Endpoints

### Auth (public)
```
POST /api/auth/register    { name, email, password } → JWT token
POST /api/auth/login       { email, password }        → JWT token
```

### Applications (JWT required)
```
GET    /api/applications          → list user's applications
POST   /api/applications          → create application
PUT    /api/applications/{id}     → update application
DELETE /api/applications/{id}     → delete application
POST   /api/applications/{id}/upload-cv   → upload CV file
GET    /api/applications/export   → download Excel file
```

---

## Running Locally

**Prerequisites:** Java 21, Maven, MySQL

```bash
# 1. Clone the repo
git clone https://github.com/NoamCohen12/jobtracker.git
cd jobtracker

# 2. Create the database
mysql -u root -p
CREATE DATABASE jobtracker;

# 3. Create local config (not committed)
# src/main/resources/application-local.properties
DB_URL=jdbc:mysql://localhost:3306/jobtracker
DB_USERNAME=root
DB_PASSWORD=your_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# 4. Run the backend
./mvnw spring-boot:run

# 5. Run the frontend
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## Author

**Noam Cohen**  
B.Sc. Computer Science — Ariel University  
[LinkedIn](https://www.linkedin.com/in/noam-cohen-a7802b275/) | [GitHub](https://github.com/NoamCohen12)
