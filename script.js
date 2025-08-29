// Main JavaScript file for Cagayan Tourism Website

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cagayan Tourism Website Loaded!');
    
    // Mobile menu toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObj = {};
            
            formData.forEach((value, key) => {
                formObj[key] = value;
            });
            
            // Basic validation
            if (!formObj.name || !formObj.email || !formObj.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formObj.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission (since we don't have a backend)
            showNotification('Thank you for your inquiry! We will get back to you soon.', 'success');
            
            // Store form data in localStorage (simulating backend storage)
            const submissions = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
            submissions.push({
                ...formObj,
                timestamp: new Date().toISOString(),
                id: Date.now()
            });
            localStorage.setItem('contact_submissions', JSON.stringify(submissions));
            
            // Reset form
            this.reset();
        });
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Intersection Observer for animations
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
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.attraction-card, .activity-item, .gallery-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Gallery lightbox effect (simple click to enlarge)
    const galleryItems = document.querySelectorAll('.gallery-item img');
    galleryItems.forEach(img => {
        img.addEventListener('click', function() {
            createLightbox(this.src, this.alt);
        });
    });
    
    // Attraction cards learn more functionality
    const learnMoreLinks = document.querySelectorAll('.learn-more');
    learnMoreLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const cardTitle = this.closest('.card-content').querySelector('h3').textContent;
            showAttractionDetails(cardTitle);
        });
    });
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        z-index: 10000;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        ${type === 'success' ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : ''}
        ${type === 'error' ? 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;' : ''}
        ${type === 'info' ? 'background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb;' : ''}
    `;
    
    // Add animation keyframes if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .notification-content { display: flex; align-items: center; justify-content: space-between; }
            .notification-close { background: none; border: none; font-size: 20px; cursor: pointer; margin-left: 10px; }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => notification.remove());
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Simple lightbox for gallery images
function createLightbox(src, alt) {
    // Remove existing lightbox
    const existingLightbox = document.querySelector('.lightbox');
    if (existingLightbox) {
        existingLightbox.remove();
    }
    
    // Create lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-overlay">
            <div class="lightbox-content">
                <img src="${src}" alt="${alt}">
                <button class="lightbox-close">&times;</button>
            </div>
        </div>
    `;
    
    // Add styles
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.9);
        animation: fadeIn 0.3s ease-out;
    `;
    
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    lightboxContent.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
    `;
    
    const lightboxImg = lightbox.querySelector('img');
    lightboxImg.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 8px;
    `;
    
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 30px;
        cursor: pointer;
        width: 40px;
        height: 40px;
    `;
    
    // Add fade in animation
    if (!document.querySelector('#lightbox-styles')) {
        const style = document.createElement('style');
        style.id = 'lightbox-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(lightbox);
    
    // Close functionality
    closeBtn.addEventListener('click', () => lightbox.remove());
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.remove();
    });
    
    // ESC key to close
    document.addEventListener('keydown', function escClose(e) {
        if (e.key === 'Escape') {
            lightbox.remove();
            document.removeEventListener('keydown', escClose);
        }
    });
}

// Show attraction details
function showAttractionDetails(attractionName) {
    const attractions = {
        'Callao Cave': {
            description: 'Callao Cave is a limestone cave formation located in Barangay Quibal, Peñablanca, Cagayan. The cave system consists of seven chambers, with the first chamber serving as a natural cathedral featuring a skylight opening that allows sunlight to filter in.',
            highlights: ['Natural skylight opening', 'Seven interconnected chambers', 'Archaeological significance', 'Guided tours available'],
            location: 'Peñablanca, Cagayan',
            bestTime: 'Dry season (November to April)'
        },
        'Cagayan River': {
            description: 'The Cagayan River is the longest river in the Philippines, stretching approximately 505 kilometers. It flows through the Cagayan Valley and is perfect for river cruising, fishing, and water sports.',
            highlights: ['Longest river in the Philippines', 'River cruising opportunities', 'Rich biodiversity', 'Historical significance'],
            location: 'Cagayan Valley Region',
            bestTime: 'Year-round, best during dry season'
        },
        'Aparri Beach': {
            description: 'Aparri Beach is located where the Cagayan River meets the Babuyan Channel. Known for its unique black sand beaches and stunning sunsets, it offers a perfect blend of river and sea experiences.',
            highlights: ['Black sand beaches', 'River meets the sea', 'Spectacular sunsets', 'Fresh seafood'],
            location: 'Aparri, Cagayan',
            bestTime: 'March to May'
        },
        'Tuguegarao Cathedral': {
            description: 'The St. Peter Metropolitan Cathedral, commonly known as Tuguegarao Cathedral, is a historic Catholic church built during the Spanish colonial period. It showcases beautiful architecture and serves as a testament to the region\'s rich religious heritage.',
            highlights: ['Spanish colonial architecture', 'Historical significance', 'Religious heritage', 'Beautiful interior'],
            location: 'Tuguegarao City, Cagayan',
            bestTime: 'Year-round'
        },
        'Sierra Madre Mountains': {
            description: 'The Sierra Madre is the longest mountain range in the Philippines, extending along the eastern coast of Luzon. In Cagayan, it offers pristine forests, diverse wildlife, and excellent hiking opportunities.',
            highlights: ['Longest mountain range in Philippines', 'Biodiversity hotspot', 'Hiking trails', 'Pristine forests'],
            location: 'Eastern Cagayan',
            bestTime: 'Dry season (November to April)'
        },
        'Palaui Island': {
            description: 'Palaui Island is an unspoiled volcanic island located at the northern tip of mainland Luzon. It features pristine beaches, crystal-clear waters, and was featured as a filming location for the reality TV show Survivor.',
            highlights: ['Pristine beaches', 'Crystal-clear waters', 'Survivor filming location', 'Volcanic landscape'],
            location: 'Santa Ana, Cagayan',
            bestTime: 'March to June'
        }
    };
    
    const attraction = attractions[attractionName];
    if (!attraction) return;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'attraction-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${attractionName}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p class="attraction-description">${attraction.description}</p>
                    <div class="attraction-info">
                        <div class="info-item">
                            <strong>Location:</strong> ${attraction.location}
                        </div>
                        <div class="info-item">
                            <strong>Best Time to Visit:</strong> ${attraction.bestTime}
                        </div>
                    </div>
                    <div class="attraction-highlights">
                        <strong>Highlights:</strong>
                        <ul>
                            ${attraction.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.8);
        animation: fadeIn 0.3s ease-out;
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: white;
        border-radius: 15px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        margin: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    `;
    
    const modalHeader = modal.querySelector('.modal-header');
    modalHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 25px;
        border-bottom: 1px solid #eee;
        background: #2c5aa0;
        color: white;
        border-radius: 15px 15px 0 0;
    `;
    
    const modalBody = modal.querySelector('.modal-body');
    modalBody.style.cssText = `
        padding: 25px;
        line-height: 1.6;
    `;
    
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        width: 30px;
        height: 30px;
    `;
    
    document.body.appendChild(modal);
    
    // Close functionality
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    // ESC key to close
    document.addEventListener('keydown', function escClose(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escClose);
        }
    });
}

// Admin panel for viewing contact submissions (accessible via console)
window.viewContactSubmissions = function() {
    const submissions = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
    console.table(submissions);
    return submissions;
};

// Scroll to top functionality
window.addEventListener('scroll', function() {
    // You can add a scroll to top button here if needed
});

// Performance optimization: Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';
                    
                    img.onload = () => {
                        img.style.opacity = '1';
                    };
                    
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
});