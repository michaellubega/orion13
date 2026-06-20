// ============================================
// ORION13 TECHNOLOGIES - JAVASCRIPT
// ============================================

// Throttle for scroll/resize (performance)
function throttle(fn, ms) {
    let last = 0, tid = 0;
    return function () {
        const now = Date.now();
        clearTimeout(tid);
        if (now - last >= ms) {
            last = now;
            fn.apply(this, arguments);
        } else {
            tid = setTimeout(() => { last = Date.now(); fn.apply(this, arguments); }, ms - (now - last));
        }
    };
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', navMenu.classList.contains('active'));
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) hamburger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll (throttled, passive)
const navbar = document.querySelector('.navbar');
function onNavScroll() {
    if (!navbar) return;
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 14, 39, 0.98)';
        navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.background = 'rgba(10, 14, 39, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    }
}
window.addEventListener('scroll', throttle(onNavScroll, 100), { passive: true });

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

// Elements to observe
const animatedElements = document.querySelectorAll(
    '.service-card, .feature-item, .contact-item, .portfolio-item, .testimonial-card, .process-step, .section-title, .section-subtitle, .hero-badge, .hero-trust'
);

animatedElements.forEach((el, index) => {
    el.classList.add('fade-in-up');
    // Add staggered delay based on index within its container
    if (el.parentElement && (
        el.parentElement.classList.contains('services-grid') || 
        el.parentElement.classList.contains('portfolio-grid') ||
        el.parentElement.classList.contains('testimonials-grid') ||
        el.parentElement.classList.contains('process-steps')
    )) {
        const siblings = Array.from(el.parentElement.children);
        const indexInParent = siblings.indexOf(el);
        el.style.transitionDelay = `${indexInParent * 0.15}s`;
    }
    observer.observe(el);
});

// Add parallax effect to hero section (throttled, passive; skip on mobile)
const hero = document.querySelector('.hero');
if (hero && window.innerWidth > 768) {
    const onParallax = () => {
        hero.style.transform = `translateY(${window.pageYOffset * 0.5}px)`;
    };
    window.addEventListener('scroll', throttle(onParallax, 50), { passive: true });
}

// Add typing effect to hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize animations on page load
window.addEventListener('load', () => {
    // Add loaded class to body for CSS transitions
    document.body.classList.add('loaded');
    
    // Animate hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }
});

// Add click tracking for analytics (optional)
document.querySelectorAll('a[href^="https://wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
        // You can add analytics tracking here
        console.log('WhatsApp link clicked');
    });
});

// Performance optimization: Lazy load images (if any are added later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Scroll Progress Indicator (throttled, passive)
const scrollProgress = document.querySelector('.scroll-progress');
if (scrollProgress) {
    const onProgress = () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        scrollProgress.style.width = windowHeight ? `${(window.scrollY / windowHeight) * 100}%` : '0%';
    };
    window.addEventListener('scroll', throttle(onProgress, 80), { passive: true });
}

// Back to Top Button (throttled, passive)
const backToTopButton = document.querySelector('.back-to-top');
if (backToTopButton) {
    const onBackToTopScroll = () => {
        backToTopButton.classList.toggle('visible', window.scrollY > 300);
    };
    window.addEventListener('scroll', throttle(onBackToTopScroll, 100), { passive: true });
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Active Navigation Highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

function highlightActiveSection() {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', throttle(highlightActiveSection, 150), { passive: true });

// Enhanced device mockup animations (throttled, passive)
const laptop = document.querySelector('.laptop');
const phone = document.querySelector('.phone');
if (laptop && phone) {
    const onMockupScroll = () => {
        if (window.innerWidth <= 768) return;
        const scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
            const rate = scrolled * 0.3;
            laptop.style.transform = `translateX(calc(-50% - 40px)) translateY(${rate}px) rotateX(${rate * 0.1}deg)`;
            phone.style.transform = `translateY(${rate * 0.5}px) rotateX(${-rate * 0.1}deg)`;
        }
    };
    window.addEventListener('scroll', throttle(onMockupScroll, 80), { passive: true });
}

// Add stagger animation to service cards
document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Enhanced contact item animations
document.querySelectorAll('.contact-item').forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.15}s`;
});

// Smooth reveal animation for sections
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    sectionObserver.observe(section);
});

// Hero transform reset on mobile (parallax skipped above when <=768)
if (document.querySelector('.hero') && window.innerWidth <= 768) {
    document.querySelector('.hero').style.transform = 'none';
}

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// ========== Chat: Hugging Face + FAQ fallback (no server) ==========
// Set your token at https://huggingface.co/settings/tokens (use "Read" scope).
// Leave empty to use only the FAQ bot. Do not commit the token if the repo is public.
var HUGGING_FACE_TOKEN = typeof window.HF_TOKEN !== 'undefined' ? window.HF_TOKEN : '';

(function () {
    const toggle = document.querySelector('.chat-widget-toggle');
    const panel = document.querySelector('.chat-widget-panel');
    const closeBtn = document.querySelector('.chat-widget-close');
    const messagesEl = document.querySelector('.chat-widget-messages');
    const inputEl = document.querySelector('.chat-widget-input');
    const sendBtn = document.querySelector('.chat-widget-send');

    if (!toggle || !panel || !messagesEl || !inputEl) return;

    var welcomeShown = false;
    var HF_MODEL = 'google/flan-t5-small';

    var faq = [
        { keywords: ['what do you do', 'services', 'what do you build', 'what do you offer', 'who are you'], answer: 'We build Android, iOS, desktop and web apps, and offer cheap AI solutions. We also do school management systems, POS, and custom software. We manage your software from idea to launch.' },
        { keywords: ['contact', 'email', 'phone', 'whatsapp', 'reach', 'how to contact', 'call'], answer: 'You can reach us on WhatsApp +256 758 141 994, email contact@orion13.us, or call +256 758 141 994. We\'re happy to give a free quote.' },
        { keywords: ['price', 'cost', 'quote', 'how much', 'pricing', 'fee'], answer: 'We offer free quotes. Contact us on WhatsApp or email (contact@orion13.us) and we\'ll give you a quote with no obligation.' },
        { keywords: ['android', 'ios', 'mobile', 'app', 'phone app'], answer: 'We build native and cross-platform mobile apps for business, dashboards, and more. Tell us your idea and we\'ll manage the rest.' },
        { keywords: ['ai', 'chatbot', 'automation', 'artificial intelligence'], answer: 'We offer cheap AI solutions: chatbots, automation, smart forms, and AI-powered features tailored to your budget.' },
        { keywords: ['school', 'pos', 'desktop', 'web', 'website'], answer: 'We do school management systems, POS and sales systems, desktop apps, and web apps. One team manages it all.' },
        { keywords: ['hello', 'hi', 'hey'], answer: 'Hi! I can answer questions about our services, contact info, and how to get a quote. Try: "What do you do?" or "How can I contact you?"' }
    ];

    var defaultAnswer = 'I can answer questions about our services, contact info, and how to get a quote. Try: "What do you do?" or "How can I contact you?" or "Do you do mobile apps?"';

    var siteContext = 'Orion13 Technologies is a software company. We build Android, iOS, desktop and web apps, and offer cheap AI solutions. We also do school management systems, POS, and custom software. Contact: WhatsApp +256 758 141 994, email contact@orion13.us. We offer free quotes.';

    function getAnswer(text) {
        var t = text.toLowerCase().trim();
        if (!t) return defaultAnswer;
        for (var i = 0; i < faq.length; i++) {
            for (var j = 0; j < faq[i].keywords.length; j++) {
                if (t.indexOf(faq[i].keywords[j]) !== -1) return faq[i].answer;
            }
        }
        return defaultAnswer;
    }

    function appendMsg(text, isUser, isTyping) {
        var div = document.createElement('div');
        div.className = 'chat-widget-msg ' + (isUser ? 'user' : 'bot') + (isTyping ? ' chat-widget-typing' : '');
        div.textContent = text;
        if (isTyping) div.setAttribute('aria-live', 'polite');
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return div;
    }

    function fetchHuggingFace(userText) {
        if (!HUGGING_FACE_TOKEN || !userText.trim()) return Promise.resolve(null);
        var prompt = 'Context: ' + siteContext + ' Question: ' + userText.trim() + ' Answer in one or two short sentences:';
        var url = 'https://api-inference.huggingface.co/models/' + HF_MODEL;
        return fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + HUGGING_FACE_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 80, temperature: 0.4 } })
        })
            .then(function (res) {
                if (!res.ok) return null;
                return res.json();
            })
            .then(function (data) {
                if (!data || !Array.isArray(data) || !data[0] || typeof data[0].generated_text !== 'string') return null;
                var text = data[0].generated_text.trim();
                return text.length > 0 ? text : null;
            })
            .catch(function () { return null; });
    }

    function send() {
        var text = (inputEl.value || '').trim();
        if (!text) return;
        inputEl.value = '';
        appendMsg(text, true);
        var typingEl = appendMsg('...', false, true);
        sendBtn.disabled = true;

        fetchHuggingFace(text).then(function (hfReply) {
            typingEl.remove();
            var reply = (hfReply && hfReply.length > 0) ? hfReply : getAnswer(text);
            appendMsg(reply, false);
        }).catch(function () {
            typingEl.remove();
            appendMsg(getAnswer(text), false);
        }).then(function () {
            sendBtn.disabled = false;
        });
    }

    function openPanel() {
        panel.removeAttribute('hidden');
        if (!welcomeShown) {
            welcomeShown = true;
            appendMsg('Hi! Ask me about our services, contact info, or how to get a free quote.', false);
        }
        inputEl.focus();
    }

    function closePanel() {
        panel.setAttribute('hidden', '');
    }

    toggle.addEventListener('click', openPanel);
    if (closeBtn) closeBtn.addEventListener('click', closePanel);
    sendBtn.addEventListener('click', send);
    inputEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); send(); }
    });
})();
