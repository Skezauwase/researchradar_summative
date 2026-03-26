// ============================================
//  ResearchRadar — trending.js  (Trending page)
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    renderTrending();

    // Mouse glow effect
    const radarGlow = document.querySelector('.radar-glow');
    document.addEventListener('mousemove', (e) => {
        radarGlow.style.left = `${e.clientX}px`;
        radarGlow.style.top  = `${e.clientY}px`;
    });

    // Mobile nav toggle
    document.getElementById('mobile-menu-btn').addEventListener('click', () => {
        document.getElementById('nav-links').classList.toggle('open');
    });
});

// Featured topics — shown large at the top
const featuredTopics = [
    { icon: '🧠', name: 'Large Language Models',   desc: 'Transformer architectures, GPT, BERT, and next-generation AI language systems.' },
    { icon: '🧬', name: 'CRISPR Gene Editing',     desc: 'Precision genome editing techniques and their therapeutic applications.' },
    { icon: '⚛️', name: 'Quantum Computing',       desc: 'Quantum algorithms, error correction, and supremacy experiments.' },
    { icon: '🌍', name: 'Climate Change',           desc: 'Climate modeling, mitigation strategies, and environmental impact research.' },
];

// More topics — shown in a smaller grid
const moreTopics = [
    { icon: '🔬', name: 'Cancer Immunotherapy' },
    { icon: '☀️', name: 'Renewable Energy' },
    { icon: '👁️', name: 'Computer Vision' },
    { icon: '🦠', name: 'Antibiotic Resistance' },
    { icon: '🤖', name: 'Reinforcement Learning' },
    { icon: '💉', name: 'mRNA Vaccines' },
    { icon: '🧲', name: 'Nuclear Fusion' },
    { icon: '🌐', name: 'Blockchain Technology' },
    { icon: '🧪', name: 'Drug Discovery' },
    { icon: '🧫', name: 'Stem Cell Research' },
    { icon: '📡', name: 'Deep Space Exploration' },
    { icon: '🦾', name: 'Robotics & Automation' },
];

function renderTrending() {
    const featuredGrid = document.getElementById('featured-grid');
    const moreGrid     = document.getElementById('more-grid');

    featuredGrid.innerHTML = featuredTopics.map((t, i) => `
        <div class="trending-card trending-card-featured glass-box fade-up"
             style="animation-delay:${i * 0.08}s"
             onclick="goToDiscover('${t.name}')">
            <div class="trending-card-top">
                <span class="trending-icon">${t.icon}</span>
                <span class="trending-explore">Explore →</span>
            </div>
            <h4>${t.name}</h4>
            <p class="trending-card-desc">${t.desc}</p>
        </div>
    `).join('');

    moreGrid.innerHTML = moreTopics.map((t, i) => `
        <div class="trending-card glass-box fade-up"
             style="animation-delay:${i * 0.05}s"
             onclick="goToDiscover('${t.name}')">
            <span class="trending-icon">${t.icon}</span>
            <h4>${t.name}</h4>
            <span class="trending-explore">Explore →</span>
        </div>
    `).join('');
}

// Navigate to the Discover page with the selected topic pre-filled
function goToDiscover(topic) {
    window.location.href = `index.html?q=${encodeURIComponent(topic)}`;
}
