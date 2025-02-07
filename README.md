##  **My K-Drama Hub**   

[![Watch the Demo]([https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg](https://drive.google.com/file/d/1w2ZyMyaU0jy35BGOhXl59PERvuDMU2Uv/view?usp=sharing))](https://drive.google.com/file/d/1DGY4nXVmgCma3LeznRj2Za5PsoLTY9KF/view?usp=sharing)

###  **Motivation**  
I've always wanted a place where I could **store and review** the K-Dramas I've watched. While music streaming services like **Spotify Wrapped** give you insights into your listening habits, I wished for something similar—but for the TV shows I binge!  

This project is my attempt at building a **personalized K-Drama Wrapped**, where I can:  
✓ Track the **K-Dramas** I’ve watched  
✓ Visualize my **watching trends** over time  
✓ See my **most-watched genres**  
✓ Find my **highest-rated** shows  

---

## **Project Structure**  

This project is built using **Next.js (React-based framework)** with Tailwind CSS for styling and Chart.js for data visualization. It consists of **three main pages**:

### 1️. **Home Page (`/`)**  
The homepage serves as a **landing page** with:  
- A welcoming introduction  
- A **typing effect** that cycles through my thoughts on K-Dramas  
- Two **navigation buttons**:
  -  `"my ratings"` → Goes to the page where I track my reviews  
  -  `"my wrapped"` → Displays my year-in-review for K-Dramas  

### 2️. **My Wrapped Page (`/wrapped`)**  
This page is inspired by **Spotify Wrapped**, providing visual breakdowns of my watching habits. It includes:  
✓ **Total K-Dramas Watched**  
✓ **Binge-Watch Record (Most Episodes Watched in a Day)**  
✓ **Most Watched Show**  
✓ **Visualizations** using Chart.js:  
   -  **Genre Distribution (Pie Chart)**  
   -  **Rating Distribution (Histogram)**  
   -  **Total Minutes Watched**  

**Key Components:**
- `StatCard.tsx` → Displays individual wrapped stats  
- `GenrePieChart.tsx` → Pie chart for **most-watched genres**  
- `RatingHistogram.tsx` → Histogram of **ratings**  
- `TotalMinutesWatched.tsx` → Shows total watch time  

### 3️. **My Ratings Page (`/ratings`)**  
This page displays **personal reviews** of K-Dramas I’ve watched.  
- Sorted by **rating**  
- Shows **posters, titles, and descriptions**  
- Pulls data from my **K-Drama CSV file**  

---

## **Data Sources & CSV Files**  

This project pulls data from **two Google Sheets**:  
1. **Netflix Watch History** (Sheet 1) → Logs my K-Drama watch history from Netflix.  
   - **Source:** [Netflix Watch Data](https://docs.google.com/spreadsheets/d/1U6aiNORQKHIb_tmPDxwH9gjPjaz-6AvOOfIRnCFyfVQ/edit?gid=0#gid=0)  
   - Includes: **Title, Date Watched, Episodes, Duration, Rating**  

2. **Personal K-Drama List** (Sheet 2) → My curated list of dramas I’ve seen.  
   - **Source:** [K-Drama Database](https://docs.google.com/spreadsheets/d/1U6aiNORQKHIb_tmPDxwH9gjPjaz-6AvOOfIRnCFyfVQ/edit?gid=856476277#gid=856476277)  
   - Includes: **Title, Year, Genre, Tags, Ratings, Reviews, Image URL**  

These sheets are parsed dynamically using `fetchKDramaData.ts` (a **utility function** in `/utils`).

---

## **Future Features & Contributions**  

**K-Drama Recommendation System**  
- Personalized suggestions based on **watching trends & ratings**  
- Machine Learning-based recommendations  

**Community & Forum Aspect**  
- Users can **discuss** K-Dramas in a **community space**  
- Allow **comments & discussions**  

**Adding K-Dramas Directly (Instead of CSV Editing)**  
- Implement a **UI for adding dramas** (no need to edit a CSV!)  
- **Login system** to allow multiple users to track their own watches  

---

### **Built With**  
- **Next.js** (Frontend Framework)  
- **React & TypeScript**  
- **Tailwind CSS** (Styling)  
- **Chart.js** (Data Visualizations)  
- **Google Sheets API** (Data Source)  

---
