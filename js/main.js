// Initialize Lenis
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('iconify-icon');
        if (navLinks.classList.contains('active')) {
            icon.setAttribute('icon', 'lucide:x');
        } else {
            icon.setAttribute('icon', 'lucide:menu');
        }
    });

    // Close menu when clicking links
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.querySelector('iconify-icon').setAttribute('icon', 'lucide:menu');
        });
    });
}

// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const htmlElement = document.documentElement;

function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
        themeIcon.setAttribute('icon', 'lucide:sun');
    } else {
        themeIcon.setAttribute('icon', 'lucide:moon');
    }
}

// Use saved theme preference, default to dark if none exists
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

// Hero Entrance Animation - REVERTED TO SIMPLE
const heroTl = gsap.timeline();
const heroMediaSelector = document.getElementById('bg-video') ? '#bg-video' : '.hero-media img';
heroTl.from(heroMediaSelector, {
    scale: 1.06,
    opacity: 0,
    duration: 2,
    ease: "power2.out"
})
.from('.hero h1', {
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: "power4.out"
}, "-=1.5")
.from('.hero-tag', {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
}, "-=1")
.from('.hero-desc', {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
}, "-=0.8")
.from('.hero-btns', {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
}, "-=0.6")
;

// Background rotating words for 'marketing / board / tech' vibe
(function initHeroWords(){
    const words = ['MARKETING', 'BOARDROOM', 'STRATEGY', 'TECH', 'VISION'];
    const el = document.getElementById('hero-word');
    if (!el) return;
    let i = 0;
    function showWord(){
        el.classList.remove('show');
        setTimeout(() => {
            el.textContent = words[i];
            el.classList.add('show');
            i = (i + 1) % words.length;
        }, 220);
    }
    showWord();
    setInterval(showWord, 3200);
})();

// Video fallback: if the video fails to load or can't play, replace it with a fallback image
(function setupVideoFallback(){
    const vid = document.getElementById('bg-video');
    const container = document.querySelector('.hero-media');
    if (!vid || !container) return;

    let handled = false;

    function useFallback(){
        if (handled) return;
        handled = true;
        // Remove video element
        try { vid.pause(); } catch(e){}
        vid.remove();
        // Create an img as fallback
        const img = document.createElement('img');
        img.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop';
        img.alt = 'Hero Background';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.className = 'hero-bg-fallback';
        container.insertBefore(img, container.querySelector('.hero-bg-words'));
    }

    // If the video errors or no sources can play
    vid.addEventListener('error', useFallback);
    vid.addEventListener('stalled', useFallback);

    // If the browser reports it can't play through, fallback
    vid.addEventListener('loadedmetadata', () => {
        // Some browsers block autoplay policies — check if it's actually playing
        setTimeout(() => {
            if (vid.paused) {
                // Try to play programmatically (may still be blocked)
                const p = vid.play();
                if (p && p.catch) p.catch(useFallback);
            }
        }, 100);
    });

    // As a final guard, if nothing happened after 2.5s, fallback
    setTimeout(() => {
        if (!handled && (vid.readyState < 2 || vid.paused)) {
            useFallback();
        }
    }, 2500);
})();



// Marquee Speed Control on Scroll
const marqueeInner = document.querySelector('.marquee-inner');
if (marqueeInner) {
    ScrollTrigger.create({
        trigger: '.marquee-v2',
        onUpdate: (self) => {
            const speed = self.getVelocity() / 100;
            gsap.to(marqueeInner, {
                timeScale: 1 + Math.abs(speed),
                duration: 0.5
            });
        }
    });
}

// Work Grid Animations
gsap.utils.toArray('.work-item').forEach((item, i) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: "top 90%",
            toggleActions: "play none none none"
        },
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: i % 2 * 0.2
    });
    
    // Image Parallax within item
    const img = item.querySelector('img');
    if (img) {
        gsap.to(img, {
            y: -40,
            scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }
});

// Service Row Reveal & Background Parallax
gsap.utils.toArray('.service-row').forEach(row => {
    gsap.from(row, {
        scrollTrigger: {
            trigger: row,
            start: "top 90%",
        },
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    const bg = row.querySelector('.service-bg img');
    if (bg) {
        gsap.to(bg, {
            y: 50,
            scrollTrigger: {
                trigger: row,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }
});

// Phase Cards Animation - Individual Reveal
gsap.utils.toArray('.phase-card').forEach((card) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none"
        },
        y: 30,
        // Removed opacity: 0 to ensure columns are always clearly visible
        duration: 0.8,
        ease: "power3.out"
    });
});

// Testimonial motion and photo float
gsap.to('.testimonial-card', {
    y: 16,
    repeat: -1,
    yoyo: true,
    duration: 6,
    ease: 'sine.inOut',
    stagger: 0.15,
    paused: false
});
gsap.to('.testimonial-profile img', {
    y: 8,
    repeat: -1,
    yoyo: true,
    duration: 7,
    ease: 'sine.inOut',
    stagger: 0.12,
    paused: false
});

// Full Width Image Scale
const teamImg = document.querySelector('section img[alt="Team"]');
if (teamImg) {
    gsap.to(teamImg, {
        scale: 1,
        scrollTrigger: {
            trigger: teamImg,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
}

// Refresh ScrollTrigger on Lenis Scroll
lenis.on('scroll', ScrollTrigger.update);

ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    return arguments.length ? lenis.scrollTo(value, { immediate: true }) : lenis.scroll;
  },
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
  }
});

// Refresh ScrollTrigger on Resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});
