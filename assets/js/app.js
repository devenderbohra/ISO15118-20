// ISO15118-20.com - Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // FAQ accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const faqAnswer = faqItem.querySelector('.faq-answer');

            // Close other FAQ items
            faqQuestions.forEach(otherQuestion => {
                const otherItem = otherQuestion.parentElement;
                if (otherItem !== faqItem && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                }
            });

            // Toggle current FAQ item
            faqItem.classList.toggle('active');

            if (faqItem.classList.contains('active')) {
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
            } else {
                faqAnswer.style.maxHeight = '0';
            }
        });
    });

    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Show success message
            alert('Thank you! Your message has been sent to our team.');
            contactForm.reset();
        });
    }

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = this.querySelector('input[type="email"]').value;

            if (email) {
                alert('Thank you for subscribing to our newsletter!');
                this.reset();
            }
        });
    }

    // Blog search functionality
    const blogSearch = document.querySelector('#blog-search');
    if (blogSearch) {
        blogSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const blogCards = document.querySelectorAll('.blog-card');

            blogCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const excerpt = card.querySelector('p').textContent.toLowerCase();

                if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards and stats for animation
    document.querySelectorAll('.card, .stat-item, .blog-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Auto-inject advertisement slots
    const mainContent = document.querySelector('main, .main-content');
    if (mainContent) {
        const adSlot = document.createElement('div');
        adSlot.className = 'ad-slot header';
        adSlot.textContent = 'Advertisement Space Available - Contact Us for Rates';

        // Insert ad slot before the footer
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.parentNode.insertBefore(adSlot, footer);
        }
    }

    // Details/summary polyfill for better browser support
    const detailsElements = document.querySelectorAll('details');
    detailsElements.forEach(details => {
        const summary = details.querySelector('summary');
        if (summary) {
            summary.addEventListener('click', function(e) {
                // Let the browser handle the details functionality
                setTimeout(() => {
                    if (details.open) {
                        const content = details.querySelector('.details-content');
                        if (content) {
                            content.style.animation = 'slideDown 0.3s ease';
                        }
                    }
                }, 10);
            });
        }
    });
});

// Google Sheets Blog Integration (for future use)
const SHEET_URL = ''; // Add your Google Sheets API endpoint here

async function loadBlogPosts() {
    if (!SHEET_URL) {
        console.log('Google Sheets URL not configured - using static blog posts');
        return;
    }

    try {
        const response = await fetch(SHEET_URL);
        const data = await response.json();

        if (data && data.length > 0) {
            renderBlogPosts(data);
        }
    } catch (error) {
        console.error('Error loading blog posts from Google Sheets:', error);
        console.log('Falling back to static blog posts');
    }
}

function renderBlogPosts(posts) {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;

    blogGrid.innerHTML = '';

    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'blog-card';
        postCard.innerHTML = `
            <div class="blog-card-content">
                <div class="blog-meta">${post.date} • by ${post.author}</div>
                <h3><a href="blog/${post.slug}.html">${post.title}</a></h3>
                <p>${post.excerpt}</p>
                <div class="blog-tags">
                    ${post.tags ? post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('') : ''}
                </div>
            </div>
        `;
        blogGrid.appendChild(postCard);
    });
}

// Initialize blog loading on blog page
if (document.querySelector('.blog-grid')) {
    loadBlogPosts();
}

// Utility functions
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('active');
}

// Add CSS animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .nav.active {
        display: block;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 1rem;
    }

    @media (max-width: 768px) {
        .nav.active ul {
            flex-direction: column;
            gap: 1rem;
        }
    }
`;
document.head.appendChild(style);