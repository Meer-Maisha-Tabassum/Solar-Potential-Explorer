# Solar Potential Explorer - Full-Stack Application

## 1. Project Overview

The Solar Potential Explorer is a production-ready, full-stack web application designed to serve as a powerful sales and data visualization tool for Rooftop Energy. It transforms complex solar projection data into an intuitive, interactive dashboard, allowing potential customers in Malaysia to clearly understand the financial and environmental benefits of installing a solar system.

The application follows modern software architecture principles, featuring a "fat" backend that handles all business logic and a "thin" frontend that focuses purely on presenting the data. This separation of concerns makes the application scalable, maintainable, and secure.

---

## 2. Core Features Explained

The application is built around a central dashboard that tells a compelling data story, supported by several key interactive and innovative features.

### 2.1. Dynamic Hero Section

- **Description:** The first element users see is a visually engaging hero section with the headline "Precision. Power. Progress." It uses an animated, abstract gradient background to be unique and eye-catching, immediately capturing user attention.
- **Functionality:** It provides clear calls-to-action, guiding users to either explore the data dashboard or get in touch via the contact form.

### 2.2. Data Dashboard

- **Description:** The dashboard is the heart of the application. It has been professionally organized to guide the user logically from a high-level summary down to granular details, making the data easy to understand.
- **Data Storytelling Layout:**
    1. **At-a-Glance KPIs:** An immediate summary of the project's value (Annual Production, Lifetime Value, ROI, Environmental Impact).
    2. **Primary Financial Chart:** The most important decision-making tool, the "Long-Term Financial Projections" chart, is featured prominently.
    3. **Monthly Performance:** Paired charts ("Energy Mix" and "Bill Comparison") provide tangible proof of monthly savings.
    4. **Deeper Analysis:** A dedicated section for more detailed charts.
    5. **Forecasting & Resources:** Grouped charts for the "7-Day Forecast" and "Peak Sun Hours" build trust in the technology's reliability.
    6. **Impact & Engagement:** The "Environmental Impact" and interactive "Savings Goal Challenge" widgets provide a powerful summary.

### 2.3. Interactive Financial Modeling

- **Description:** Users can toggle between two distinct financial models: Power Purchase Agreement (PPA) and Upfront Purchase.
- **Functionality:** All relevant charts and KPIs instantly update to reflect the selected model, allowing for a direct and easy comparison of long-term savings versus return on investment.

### 2.4. Personalized Live Weather-Based Forecasting

- **Description:** The "7-Day Solar Generation Forecast" is personalized to the user. Upon loading the page, the browser will ask for permission to access the user's current location.
- **Functionality:**
  - If permission is granted, the application sends the user's coordinates to the backend, which fetches a hyper-local 7-day weather forecast.
  - If permission is denied or the location cannot be found, the application gracefully falls back to providing the forecast for the default location, Kuala Lumpur.
  - The chart's description dynamically updates to show which location's forecast is being displayed.

### 2.5. AI-Powered Chatbot

- **Description:** An integrated AI assistant, "Sunny," is available to answer user questions in natural language.
- **Functionality:** The frontend sends user prompts to a secure backend endpoint. The backend then communicates with the Google Gemini API, ensuring the API key is never exposed in the browser. The chatbot is pre-prompted with knowledge about the PPA and Upfront models to provide helpful, context-aware answers.

### 2.6. Fully Functional Contact Form

- **Description:** A standard contact form that allows users to send inquiries directly.
- **Functionality:** The form submission is handled by a backend API that integrates with the Resend email service to send a real, formatted email to a pre-configured address, ensuring reliable communication.

### 2.7. Dark Mode & Responsive Design

- **Description:** The entire application is built with a modern, professional aesthetic that includes a fully functional dark mode.
- **Functionality:** The UI is fully responsive, ensuring that all components, including the complex data charts, are perfectly usable and readable on any device, from mobile phones to desktops.

---

## 3. About the Data & APIs

The application's intelligence comes from its ability to process source data and integrate with powerful external services.

### 3.1. Source Data: `RoofTopData.txt`

- **Description:** This core file contains a JSON array with two large objects, each representing a detailed financial model for a potential solar installation.
- **PPA (Power Purchase Agreement) Model:** This model is characterized by zero upfront cost. The data includes projected annual savings, monthly energy production, and detailed bill comparisons.
- **Upfront Purchase Model:** This model involves an initial project cost. The data focuses on the long-term Return on Investment (ROI), showing the point at which the initial investment is paid back and begins to generate profit.
- **Backend Processing:** The backend's `seed` script reads this file once and stores the data in the PostgreSQL database. The API then reads from the database, calculates all necessary metrics (like KPIs and chart data points), and serves them to the frontend.

### 3.2. External APIs

- **Open-Meteo API:** A free, open-source weather forecasting service. Our backend calls this API to get a 7-day forecast for Kuala Lumpur, specifically requesting the `cloudcover_mean` data, which is crucial for predicting solar generation.
- **Resend API:** A transactional email service. When a user submits the contact form, our backend sends the form data to the Resend API, which then handles the delivery of a formatted email to the designated company inbox.
- **Google Gemini API:** A powerful large language model from Google. Our backend securely sends user queries from the chatbot to the Gemini API to generate intelligent, context-aware responses.

---

## 4. Technology Stack & Libraries

This project uses a modern, robust technology stack. The `npm install` command in each directory will install all necessary packages from the `package.json` files.

### 4.1. Backend (Node.js / Express)

These are the main libraries (`dependencies`) required to run the backend server.

| Library | Version | Purpose |
| :--- | :--- | :--- |
| **@prisma/client**| `^6.12.0` | Type-safe database client generated from the Prisma schema. |
| **axios** | `^1.11.0` | A promise-based HTTP client for making API calls to external services. |
| **cors** | `^2.8.5` | A middleware to enable Cross-Origin Resource Sharing, allowing the frontend to call the backend API. |
| **dotenv** | `^17.2.1` | Manages environment variables from the `.env` file. |
| **express** | `^5.1.0` | The core web server framework for creating the API and handling routes. |
| **resend** | `^4.7.0` | The official library for the Resend email service to send emails from the contact form. |

The backend also includes several `devDependencies` for development, such as **TypeScript**, **Prisma CLI**, and **ts-node-dev**.

### 4.2. Frontend (React)

These are the main libraries (`dependencies`) required to run the frontend application.

| Library | Version | Purpose |
| :--- | :--- | :--- |
| **react** | `^18.2.0` | The core JavaScript library for building the user interface. |
| **react-dom** | `^18.2.0` | Serves as the entry point to the DOM and renders the React components. |
| **recharts** | `^2.12.7` | A composable charting library used for all data visualizations. |
| **lucide-react** | `^0.383.0` | A library of simply beautiful and consistent icons. |

The frontend also includes several `devDependencies` for development, such as **Vite**, **Tailwind CSS**, **PostCSS**, **Autoprefixer**, and **ESLint**.
---

## 5. Setup Guide

Follow these steps precisely to get the entire full-stack application running on your local machine.

### Step 1: Prerequisites (Software Installation)

Before you begin, ensure you have the following software installed on your computer:

- **Node.js**: Version 18.x or later. This includes `npm` (Node Package Manager). You can download it from [nodejs.org](https://nodejs.org/).
- **Git**: A version control system for cloning the project. You can download it from [git-scm.com](https://git-scm.com/).
- **A Code Editor**: Visual Studio Code (VS Code) is highly recommended. Download it from [code.visualstudio.com](https://code.visualstudio.com/).

### Step 2: Clone the Project Repository

1. Open your terminal (Command Prompt, PowerShell, or Terminal on Mac/Linux).
2. Navigate to the directory where you want to store the project (e.g., `D:\Downloads`).
3. Clone the repository using Git:

    ```bash
    git clone <repository_url>
    cd solar-potential-explorer
    ```

### Step 3: Set Up the PostgreSQL Database (Supabase)

We will use Supabase for a free, cloud-hosted PostgreSQL database.

1. **Create a Supabase Account**: Go to [supabase.com](https://supabase.com) and sign up for a free account.
2. **Create a New Project**: In your dashboard, click **"New project"**. Give it a name and create a strong **Database Password**. Save this password securely.
3. **Get the Connection String**:
    - Once the project is ready, go to **Project Settings** (gear icon) > **Database**.
    - Scroll to **Connection string** and select the **Prisma** tab.
    - This is your **Direct connection** URL. Click **Copy**.

### Step 4: Configure and Install Backend Dependencies

1. **Navigate to the Backend**: In your terminal, go into the `backend` directory:

    ```bash
    cd backend
    ```

2. **Create the Environment File**: Copy the example file to create your local configuration file.

    ```bash
    cp .env.example .env
    ```

3. **Edit the `.env` File**: Open the newly created `.env` file and fill in all the variables:
    - `DATABASE_URL`: Paste the connection string from Supabase. **Crucially, replace `[YOUR-PASSWORD]` with the actual password you created.**
    - `RESEND_API_KEY`: Sign up for a free account at [resend.com](https://resend.com), create an API key, and paste it here.
    - `GEMINI_API_KEY`: Get a free API key from [Google AI Studio](https://aistudio.google.com/) and paste it here.
    - `CONTACT_FORM_EMAIL_TO`: The email address where you want to receive contact form submissions.
    - `CONTACT_FORM_EMAIL_FROM`: This **must be `onboarding@resend.dev`** for the Resend free plan to work.
4. **Install Backend Libraries**: Run the following command to download all the necessary Node.js packages listed in `package.json`.

    ```bash
    npm install
    ```

    *Note: This single command installs all `dependencies` and `devDependencies` needed to run and develop the backend.*

### Step 5: Set Up the Database Tables and Data

1. **Run the Database Migration**: While still in the `backend` directory, run this command. It connects to your Supabase database and creates the `FinancialModel` table.

    ```bash
    npx prisma migrate dev
    ```

    *When prompted, enter a name for the migration, like `initial_setup`.*
2. **Seed the Database**: After the migration is complete, run this command to populate the new table with the data from `RoofTopData.txt`.

    ```bash
    npx prisma db seed
    ```

### Step 6: Configure and Install Frontend Dependencies

1. **Navigate to the Frontend**: In your terminal, go into the `frontend` directory:

    ```bash
    cd ../frontend
    ```

2. **Install Frontend Libraries**: Run the following command to download all the necessary React packages listed in `package.json`.

    ```bash
    npm install
    ```

    *Note: This single command installs all `dependencies` and `devDependencies` needed to run and develop the frontend.*
3. **(Optional) VS Code Linter Fix**: If you see warnings in `index.css` about `@tailwind`, install the **Tailwind CSS IntelliSense** extension in VS Code.

### Step 7: Run the Application

You will need two separate terminals to run both the backend and frontend servers simultaneously.

1. **Start the Backend Server**:
    - In your first terminal, ensure you are in the `backend` directory.
    - Run the command:

      ```bash
      npm run dev
      ```

    - The backend API will now be running on `http://localhost:5050`.

2. **Start the Frontend Server**:
    - Open a **second terminal**.
    - Navigate to the `frontend` directory.
    - Run the command:

      ```bash
      npm run dev
      ```

    - The frontend application will now be running on `http://localhost:4321`.

3. **View the Application**: Open your web browser and go to **`http://localhost:4321`**. The full application should be running.
