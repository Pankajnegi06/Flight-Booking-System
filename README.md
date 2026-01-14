# SkyBook - Flight Booking Application

SkyBook is a modern, full-stack flight booking application built with the MERN stack (MongoDB, Express.js, React, Node.js). It offers a premium user interface, real-time surge pricing, and a seamless booking experience.

## 🚀 Features

### Core Functionality
-   **Flight Search:** Search for flights by Departure and Arrival cities.
-   **Booking System:** Book flights with real-time wallet balance updates.
-   **User Authentication:** Secure Login and Registration with JWT.
-   **Wallet System:** Users get a starting balance of ₹50,000.
-   **Booking History:** View past bookings with PNR and ticket details.
-   **Ticket Generation:** Automated PDF ticket generation.

### Advanced Features
-   **Surge Pricing:** Dynamic pricing model with visual indicators.
-   **Countdown Timer:** Real-time countdown for surge pricing expiration.
-   **Sorting & Filtering:**
    -   Sort by Price (Low to High / High to Low).
    -   Filter by Airline.
-   **Duplicate Booking Prevention:** Prevents users from booking the same flight twice.

### UI/UX
-   **Premium Design:** Glassmorphism effects, gradients, and smooth transitions.
-   **Responsive Layout:** Fully responsive design for all screen sizes.
-   **Interactive Elements:** Hover effects, loading states, and toast notifications.

## 🛠️ Tech Stack

-   **Frontend:** React, Redux Toolkit, Tailwind CSS, React Router, React Icons.
-   **Backend:** Node.js, Express.js, Mongoose.
-   **Database:** MongoDB (Cloud/Atlas).
-   **Storage:** Cloudinary (Ticket PDF storage).
-   **DevOps:** Docker, Docker Compose.

## 🏁 Getting Started

### Prerequisites
-   Node.js (v18+)
-   Docker & Docker Compose (optional, for containerized run)
-   MongoDB Atlas URI
-   Cloudinary Account

### Option 1: Run with Docker (Recommended)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Pankajnegi06/Flight-Booking-System.git
    cd XtechOn
    ```

2.  **Configure Environment:**
    Create a `.env` file in the root directory:
    ```env
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster.url/dbname
    PORT=5000
    JWT_SECRET=your_super_secret_key
    JWT_EXPIRE=30d
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

3.  **Run the Application:**
    ```bash
    docker-compose up --build
    ```
    -   Frontend: `http://localhost:5173`
    -   Backend: `http://localhost:5000`

### Option 2: Run Locally

1.  **Backend Setup:**
    ```bash
    # Install dependencies
    npm install

    # Start server
    npm run dev
    ```

2.  **Frontend Setup:**
    ```bash
    cd frontend

    # Install dependencies
    npm install

    # Start React app
    npm run dev
    ```

## 📂 Project Structure

```
XtechOn/
├── frontend/           # React Frontend
│   ├── src/
│   │   ├── components/ # Reusable components (Navbar, etc.)
│   │   ├── features/   # Feature-based modules (Auth, Flights, Bookings)
│   │   └── ...
│   └── Dockerfile
├── src/                # Node.js Backend
│   ├── config/         # DB Connection
│   ├── controllers/    # Request Handlers
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # API Routes
│   └── ...
├── Dockerfile          # Backend Dockerfile
├── docker-compose.yml  # Docker Compose Config
└── README.md           # Project Documentation
```

## 🔐 Environment Variables

| Variable | Description | Example |
| :--- | :--- | :--- |
| `MONGODB_URI` | Connection string for MongoDB | `mongodb+srv://...` |
| `PORT` | Server port | `5000` |
| `JWT_SECRET` | Secret key for JWT signing | `secret123` |
| `JWT_EXPIRE` | Token expiration time | `30d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | `mycloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `abcdef12345` |

## 👨‍💻 Author

Developed by [Your Name]
