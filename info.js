// Default blog posts
// Default blog data
const defaultBlogs = [
{
title: "Understanding Pandemic Preparedness",
content: "Learn about essential steps for pandemic preparedness...",
image: "11.jpg",
date: "2024-03-15"
},
{
title: "Immunity Boosting Foods",
content: "Discover natural ways to strengthen your immune system...",
image: "22.jpg",
date: "2024-03-14"
},
{
title: "Mental Health During Crisis",
content: "Tips for maintaining mental wellness during challenging times...",
image: "33.jpg",
date: "2024-03-13"
}
];

// Blog display function
function displayBlogs() {
const blogGrid = document.getElementById('blogGrid');
blogGrid.innerHTML = defaultBlogs.map(blog => `
<div class="content-card">
    <img src="${blog.image}" alt="${blog.title}" class="content-image">
    <div class="content-info">
        <h3>${blog.title}</h3>
        <p>${blog.content}</p>
        <div class="content-meta">
            <i class="fas fa-calendar"></i>
            <span>${blog.date}</span>
        </div>
    </div>
</div>
`).join('');
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
displayBlogs();
});

// YouTube API Integration
function loadYouTubeVideos() {
    const API_KEY = 'YOUR_YOUTUBE_API_KEY';
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=emergency+kit+tutorial&type=video&key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            const videoContainer = document.getElementById('videoContainer');
            data.items.forEach(item => {
                videoContainer.innerHTML += `
                    <iframe width="100%" height="315"
                        src="https://www.youtube.com/embed/${item.id.videoId}"
                        frameborder="0" allowfullscreen>
                    </iframe>
                `;
            });
        });
}


// News API Integration

const NEWS_API_KEY = '20d94ce043114cd68374776da96f8b69';
const MEDICAL_KEYWORDS = 'medical OR healthcare OR disease OR treatment OR medicine OR hospital OR doctor OR clinic OR patient OR diagnosis OR vaccine OR pandemic OR epidemic';

async function loadNews() {
const newsGrid = document.getElementById('newsGrid');
newsGrid.innerHTML = '<div class="loading">Loading medical news...</div>';

try {
const response = await fetch(`https://newsapi.org/v2/everything?` + 
    `q=${MEDICAL_KEYWORDS}&` +
    `language=en&` +
    `sortBy=publishedAt&` +
    `apiKey=${NEWS_API_KEY}`);

const data = await response.json();

if (data.articles && data.articles.length > 0) {
    const medicalNews = data.articles
        .filter(article => 
            article.title?.toLowerCase().match(/medical|health|disease|treatment|doctor|hospital|clinic|medicine|vaccine|pandemic|epidemic/g)
        )
        .slice(0, 6);

    newsGrid.innerHTML = medicalNews.map(article => `
        <div class="card">
            <img src="${article.urlToImage || 'medical-placeholder.jpg'}" 
                 alt="${article.title}"
                 onerror="this.src='medical-placeholder.jpg'">
            <div class="card-content">
                <h3>${article.title}</h3>
                <div class="news-meta">
                    <span>
                        <i class="fas fa-calendar"></i>
                        ${new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                    <a href="${article.url}" target="_blank" class="read-more">
                        Read →
                    </a>
                </div>
            </div>
        </div>
    `).join('');
} else {
    throw new Error('No medical news found');
}
} catch (error) {
console.error('Error loading news:', error);
newsGrid.innerHTML = `
    <div class="error">
        <i class="fas fa-exclamation-circle"></i>
        Unable to load medical news. Please try again later.
    </div>`;
}
}

async function refreshNews() {
const refreshBtn = document.querySelector('.refresh-btn');
refreshBtn.classList.add('spinning');
await loadNews();
refreshBtn.classList.remove('spinning');
}

// Load news on page load
window.addEventListener('DOMContentLoaded', loadNews);

// mythbuster
async function checkMyth() {
const mythInput = document.getElementById('mythInput').value;
const resultDiv = document.getElementById('mythResult');
const button = document.querySelector('.myth-checker button');

if (!mythInput.trim()) return;

// Show loading state
button.disabled = true;
button.innerHTML = 'Verifying...';
resultDiv.innerHTML = '<div class="loading">Analyzing claim...</div>';
resultDiv.classList.add('show');

try {
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAP5Wdm2CiiGZymRnxzEokkXJQ7ZnlFa5w`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        contents: [{
            parts: [{
                text: `Act as a medical fact checker. Verify this health claim and provide a detailed analysis with scientific evidence: "${mythInput}". Format response with Verdict (True/False/Partially True), Explanation, and Scientific Sources.`
            }]
        }]
    })
});

const data = await response.json();
const analysis = data.candidates[0].content.parts[0].text;

resultDiv.innerHTML = `
    <div class="myth-analysis">
        ${analysis.replace(/\n/g, '<br>')}
    </div>
`;
} catch (error) {
resultDiv.innerHTML = '<div class="error">Sorry, verification failed. Please try again.</div>';
} finally {
button.disabled = false;
button.innerHTML = 'Verify Claim';
}
}
function switchTab(tabName) {
// Hide all content
document.querySelectorAll('.tab-content').forEach(content => {
content.style.display = 'none';
});

// Remove active class from all tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
btn.classList.remove('active');
});

// Show selected content and activate tab
document.getElementById(tabName).style.display = 'grid';
document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
}
