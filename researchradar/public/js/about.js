// ============================================
//  ResearchRadar — about.js  (About page)
// ============================================

document.addEventListener('DOMContentLoaded', () => {
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
