# 🌏 GI Visualizer: Interactive Map of India's Geographical Treasures

![React](https://img.shields.io/badge/React-19.1.1-lightblue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.14-teal)
![Vite](https://img.shields.io/badge/Vite-7.1.7-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![GitHub Stars](https://img.shields.io/github/stars/vrobbin3247/Visualizing-India-s-Geographical-Indications?style=social)
![Forks](https://img.shields.io/github/forks/vrobbin3247/Visualizing-India-s-Geographical-Indications?style=social)
![Last Commit](https://img.shields.io/github/last-commit/vrobbin3247/Visualizing-India-s-Geographical-Indications)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/vrobbin3247/Visualizing-India-s-Geographical-Indications/blob/main/LICENSE)

---

### 🧭 Overview

**GI Visualizer** is an interactive web app that explores India’s Geographical Indications (GIs) from Darjeeling Tea to Kancheepuram Silk showcasing where heritage meets geography.  
It transforms official GI data into an engaging, visual storytelling experience.

👉 **[Explore the Live App](https://gi-visualiser.vercel.app/)**

---

### 🎯 Vision

The project aims to make India’s GI landscape **accessible and visual**, offering insight into the craftsmanship, culture, and identity behind every product.  
It’s built for anyone curious about India’s regional diversity from students to researchers.

---

### ⚙️ Key Features

#### 🗺️ **Interactive Map:** Color-coded view of GI density across Indian states.

![Interactive Map View](https://raw.githubusercontent.com/vrobbin3247/hosted-media/main/gi/map.gif)

#### 📜 **Detailed Info Panels:** Click to read about origin, category, and history.

![Detail Panel View](https://raw.githubusercontent.com/vrobbin3247/hosted-media/main/gi/details.gif)

#### 🎛️ **Smart Filtering:** Search or filter by product category (Handicraft, Agricultural, etc.).

![Filtering System](https://raw.githubusercontent.com/vrobbin3247/hosted-media/main/gi/filter.gif)

#### 💻 **Responsive Design:** Built with React + Tailwind for smooth use on all devices.

![Responsive Design](https://raw.githubusercontent.com/vrobbin3247/hosted-media/main/gi/mobile.gif)

---

### 🧩 Data Pipeline

1. **From PDF to CSV:** Official GI list extracted from the _Geographical Indications Registry of India_.
2. **Structuring:** Data cleaned and converted to JSON with approximate coordinates.
3. **AI Enrichment:** Google’s **Gemini** model adds stories, precise locations, and metadata.

---

### 🛠️ Tech Stack

| Layer                | Tools & Frameworks                 |
| -------------------- | ---------------------------------- |
| **Frontend**         | React, TypeScript, Vite            |
| **Mapping**          | Leaflet, React-Leaflet             |
| **Styling**          | Tailwind CSS                       |
| **Data Enhancement** | Gemini AI                          |
| **Map Tiles**        | Esri National Geographic World Map |

---

### 🚀 Getting Started

**Clone the repo:**

```bash
git clone https://github.com/vrobbin3247/Visualizing-India-s-Geographical-Indications.git
cd Visualizing-India-s-Geographical-Indications
npm install
npm run dev
```
