# ResearchRadar 🔭

> A free academic paper discovery tool built for students — search millions of research papers without paywalls, sign-ups, or API keys.

**Live App:** http://lb-01.skeza.tech

---

## What is ResearchRadar?

ResearchRadar helps you find academic research papers quickly. Instead of getting stuck behind paywalls or having to create accounts on expensive platforms, you can search through **250 million+ scholarly works** for free, right from your browser.

It was built as a web infrastructure project using two free public APIs that require zero authentication.

---

## What Can You Do With It?

- 🔍 **Search** for any research topic, author name, or institution
- 🎛️ **Filter** results by year, open access, author country, and citation count
- 📊 **Sort** by most relevant, most cited, newest, or oldest
- 📄 **Click any paper** to see its full abstract, authors, and citation stats
- ⬇️ **Download PDFs** directly when a paper is open access
- 🌍 **Explore trending topics** like AI, Climate Change, CRISPR, and more
- 📱 **Works on phone, tablet, and desktop**

---

## APIs Used

This project uses **two completely free APIs** — no sign-up, no API key, nothing to configure.

### 1. OpenAlex API
- **What it does:** Powers all the paper search, filtering, and sorting
- **Website:** https://openalex.org
- **Docs:** https://docs.openalex.org
- **Cost:** Free forever, no account needed
- **Credit:** Priem, J., Piwowar, H., & Orr, R. (2022). *OpenAlex: A fully-open index of the world's research literature.* arXiv. https://arxiv.org/abs/2205.01833

### 2. REST Countries API
- **What it does:** Fills the "Author Country" dropdown filter with all country names
- **Website:** https://restcountries.com
- **Cost:** Free forever, no account needed
- **Credit:** Fayder Rojas and contributors

> ⚠️ There are **no API keys** in this project. Both APIs are fully public. The `.gitignore` is included as good practice but there are no secrets to hide.

---

## How to Run It Locally

### What You Need First
- [Node.js](https://nodejs.org) version 18 or higher
- npm (comes with Node.js)

### Steps

**1. Clone the repo**
```bash
git clone https://github.com/Skezauwase/web_imfrastructure_summative.git
cd web_imfrastructure_summative/researchradar
```

**2. Install dependencies**
```bash
npm install
```

**3. Start the server**
```bash
npm start
```

**4. Open your browser and go to:**
```
http://localhost:3000
```

That's it! The app is running locally.

> Want the server to auto-restart when you edit files? Run `npm run dev` instead of `npm start`.

---

## Project Structure

Here's what each file/folder does:

```
researchradar/
│
├── public/                   ← Everything the browser sees
│   ├── index.html            ← Discover page (search + results)
│   ├── trending.html         ← Trending research topics page
│   ├── about.html            ← About page
│   │
│   ├── css/
│   │   └── style.css         ← All the styles (shared by all pages)
│   │
│   └── js/
│       ├── app.js            ← Main logic: API calls, search, filters, modal
│       ├── trending.js       ← Trending page logic
│       └── about.js          ← About page (mouse glow + mobile nav)
│
├── scripts/
│   ├── deploy-web.sh         ← Script to set up Web01 and Web02
│   └── deploy-lb.sh          ← Script to set up the load balancer
│
├── server.js                 ← Simple Express server that serves the files
├── package.json              ← Project info and dependencies
└── README.md                 ← This file
```

---

## Deployment

The app is deployed on **two web servers** sitting behind a **load balancer**. Here's the setup:

```
You (browser)
      ↓
  lb-01.skeza.tech  ← Load Balancer (splits traffic between both servers)
      ↓         ↓
  Web01        Web02   ← Both run the same app
```

This means if one server crashes, the other one keeps the app alive for users.

### Server Details

| Server | IP Address | Role |
|--------|-----------|------|
| Web01 | 54.166.88.241 | Runs the Node.js app |
| Web02 | 3.80.189.90 | Runs the Node.js app |
| Load Balancer | 13.218.49.63 / lb-01.skeza.tech | Distributes traffic |

---

### How I Deployed It (Step by Step)

#### Step 1 — Set up Web01 and Web02

SSH into each server, clone the repo, and run the setup script:

```bash
# Connect to Web01
ssh ubuntu@54.166.88.241

# Clone the project
git clone https://github.com/Skezauwase/web_imfrastructure_summative.git ~/app
cd ~/app/researchradar

# Run the setup script
bash scripts/deploy-web.sh
```

Repeat the exact same steps for Web02 (`ssh ubuntu@3.80.189.90`).

The script automatically:
1. Installs **Node.js 18** and **Nginx**
2. Installs **PM2** — a tool that keeps the app running even after server reboots
3. Starts the app on port **3000**
4. Configures **Nginx** to forward traffic from port 80 → port 3000
5. Makes everything start automatically on server restart

#### Step 2 — Set up the Load Balancer

```bash
# Connect to the load balancer
ssh ubuntu@13.218.49.63

# Clone and run the LB setup script
git clone https://github.com/Skezauwase/web_imfrastructure_summative.git ~/app
cd ~/app/researchradar
bash scripts/deploy-lb.sh
```

This sets up Nginx on the load balancer to split incoming requests between Web01 and Web02 using **round-robin** (request 1 goes to Web01, request 2 goes to Web02, request 3 goes to Web01, and so on).

The load balancer config looks like this:

```nginx
upstream researchradar_backend {
    server 54.166.88.241:80;   # Web01
    server 3.80.189.90:80;     # Web02
}
```

If one server goes down, Nginx automatically sends all traffic to the other — no downtime for users.

#### Step 3 — Test Everything Works

```bash
# Test the load balancer domain
curl http://lb-01.skeza.tech

# Test each server directly
curl http://54.166.88.241
curl http://3.80.189.90

# Check the health endpoint (should return "ok")
curl http://lb-01.skeza.tech/health
```

---

## Error Handling

The app handles problems gracefully instead of just crashing or showing a blank screen:

| What Goes Wrong | What the User Sees |
|----------------|-------------------|
| No internet connection | "You appear to be offline. Check your internet connection." |
| Search takes too long (>10s) | "Request timed out. The server took too long to respond." |
| Too many requests sent | "Too many requests. Please wait a moment and try again." |
| OpenAlex API is down | "The OpenAlex API is temporarily unavailable." |
| Unexpected server error | "Server error. Please try again." |
| No papers match the search | Empty state with tips to adjust filters or keywords |

---

## Challenges I Faced

**1. Weird abstract format**
OpenAlex doesn't store abstracts as normal text. Instead they use an "inverted index" — a dictionary where each word maps to a list of positions it appears in. I had to write a decoder that rebuilds the sentence by sorting all the word positions.

**2. Pagination limit**
OpenAlex only supports up to 200 pages of results. I had to cap the pagination buttons so users can't accidentally request page 201 (which would return an error).

**3. Mobile filters**
On small screens, showing a sidebar next to results doesn't fit. I converted the filters panel to a slide-in drawer that opens when you tap a button — using CSS and a small JavaScript toggle.

---

## Security

- Every piece of text from the API is passed through an `escHtml()` function before being shown on screen. This prevents **XSS attacks** (where malicious scripts could be injected through API data).
- There are no API keys or passwords anywhere in this project — both APIs are 100% public.

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| HTML, CSS, JavaScript | Frontend (no frameworks) |
| Node.js + Express | Serves the static files |
| PM2 | Keeps the app alive on servers |
| Nginx | Reverse proxy + load balancer |
| OpenAlex API | Paper search data |
| REST Countries API | Country filter data |
| Google Fonts (Outfit) | Typography |
