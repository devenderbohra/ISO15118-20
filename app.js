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
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // FAQ accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const faqAnswer = faqItem.querySelector('.faq-answer');
            
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
            
            // Send to your email (replace with actual endpoint)
            fetch('mailto:dbohr001@ucr.edu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                alert('Thank you! Your message has been sent.');
                contactForm.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Sorry, there was an error sending your message. Please try again.');
            });
        });
    }

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            // Add to newsletter list
            console.log('Newsletter signup:', email);
            alert('Thank you for subscribing to our newsletter!');
            this.reset();
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

    // Observe cards and stats
    document.querySelectorAll('.card, .stat-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Google Sheets Blog Integration (for future use)
const SHEET_URL = ''; // Add your Google Sheets API endpoint here

async function loadBlogPosts() {
    if (!SHEET_URL) return;
    
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.json();
        
        if (data && data.length > 0) {
            renderBlogPosts(data);
        }
    } catch (error) {
        console.error('Error loading blog posts:', error);
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
                    ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        blogGrid.appendChild(postCard);
    });
}

// Initialize blog loading
if (document.querySelector('.blog-grid')) {
    loadBlogPosts();
}
