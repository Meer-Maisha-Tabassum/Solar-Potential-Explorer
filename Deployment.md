# Full-Stack Deployment Guide

This guide provides step-by-step instructions for deploying the full-stack Solar Potential Explorer application. We will deploy the backend API to **Render** and the frontend application to **Netlify**. Both services offer excellent free tiers suitable for this project.

---

### **Part 1: Pushing Your Code to GitHub**

Before deploying, you need to ensure all your local code is on the GitHub repository you created.

1.  **Open your terminal** and navigate to the root directory of your project (`solar-potential-explorer`).
2.  **Initialize Git:** If you haven't already, initialize a git repository.
    ```bash
    git init
    ```
3.  **Add all your files** to be tracked by Git.
    ```bash
    git add .
    ```
4.  **Make your first commit:**
    ```bash
    git commit -m "Initial commit of the full-stack application"
    ```
5.  **Connect your local repository to the remote one on GitHub:**
    ```bash
    git remote add origin https://github.com/Meer-Maisha-Tabassum/Solar-Potential-Explorer.git
    ```
6.  **Push your code** to the `main` branch on GitHub:
    ```bash
    git push -u origin main
    ```

---

### **Part 2: Deploying the Backend API to Render**

First, we need to get your backend server live on the internet.

#### **Step 1: Set Up Render**
1.  **Create an Account:** Sign up for a free account at [render.com](https://render.com) using your GitHub account.
2.  **Create a New Web Service:**
    * On your Render dashboard, click **"New +"** and select **"Web Service"**.
    * Connect your GitHub account and select your `Solar-Potential-Explorer` repository.
3.  **Configure the Backend Service:**
    * **Name:** Give it a unique name, for example, `solar-explorer-backend`.
    * **Root Directory:** Set this to `backend`. This tells Render to only look inside your backend folder.
    * **Runtime:** Render should automatically detect `Node`.
    * **Build Command:** `npm install && npx prisma generate && npm run build`
    * **Start Command:** `npm start`
4.  **Add Environment Variables:**
    * Scroll down to the "Environment" section.
    * Click **"Add Environment Variable"** for each of the keys from your local `.env` file (`DATABASE_URL`, `RESEND_API_KEY`, `GEMINI_API_KEY`, etc.) and paste in the corresponding values. **This is a crucial step.**
5.  **Deploy:**
    * Choose the **Free** instance type.
    * Click **"Create Web Service"**. Render will now start building and deploying your backend. This might take a few minutes.
6.  **Get Your Live URL:**
    * Once deployed, Render will provide you with the live URL for your backend at the top of the page. It will look something like `https://solar-explorer-backend.onrender.com`.
    * **Copy this URL.** You will need it for the next part.

---

### **Part 3: Deploying the Frontend to Netlify**

Now we'll deploy your React application and connect it to the live backend.

#### **Step 1: Create the Netlify Configuration File**
1.  In your project on your local machine, go into the `frontend` folder.
2.  Create a new file named `netlify.toml`.
3.  **IMPORTANT:** In the `netlify.toml` file, replace the placeholder `https://your-backend-url.onrender.com` with the actual live URL of your backend that you copied from Render.
4.  Save the file, and commit and push this new file to your GitHub repository.

#### **Step 2: Set Up Netlify**
1.  **Create an Account:** Sign up for a free account at [netlify.com](https://netlify.com) using your GitHub account.
2.  **Create a New Site:**
    * On your Netlify dashboard, click **"Add new site"** and choose **"Import an existing project"**.
    * Connect to GitHub and select your `Solar-Potential-Explorer` repository.
3.  **Configure the Frontend Site:**
    * Netlify should automatically detect the settings from your `netlify.toml` file:
        * **Base directory:** `frontend`
        * **Build command:** `npm run build`
        * **Publish directory:** `frontend/dist`
    * If it doesn't, you can enter them manually.
4.  **Deploy:**
    * Click **"Deploy site"**. Netlify will now build and deploy your frontend.
5.  **Access Your Site:**
    * Once deployed, Netlify will provide you with a live URL (e.g., `https://some-name.netlify.app`). You can visit this URL to see your live application.

The application is now live! The frontend on Netlify will automatically proxy any API requests to your backend running on Render.
