const cardMeanings = {
    fool: {
        title: "The Fool",
        message: "The Fool represents a new beginning, pure innocence, and spontaneity. In the past position, it suggests you've taken a leap of faith or started a significant journey with an open heart. This card reminds you of a time when you embraced new opportunities without fear.",
        keywords: "New beginnings • Spontaneity • Faith"
    },
    magician: {
        title: "The Magician",
        message: "The Magician symbolizes manifestation, resourcefulness, and power. In your present position, it indicates you have all the tools and skills needed to achieve your goals. This is a time of taking action and harnessing your personal power.",
        keywords: "Manifestation • Power • Action"
    },
    priestess: {
        title: "The High Priestess",
        message: "The High Priestess represents intuition, mystery, and inner knowledge. In the future position, she suggests that trusting your intuition will lead you to profound insights. Listen to your inner voice and pay attention to your dreams.",
        keywords: "Intuition • Mystery • Inner voice"
    }
};

let flippedCards = [];
let readingInProgress = false;

function flipCard(card) {
    // Check if reading is already complete
    if (readingInProgress) return;
    
    // Check if we already have 3 cards flipped
    const flippedCount = document.querySelectorAll('.card.flipped').length;
    if (flippedCount >= 3 && !card.classList.contains('flipped')) return;
    
    // Toggle the flipped state
    if (!card.classList.contains('flipped')) {
        card.classList.add('flipped');
        flippedCards.push(card);
        
        // Check if we've flipped all three cards
        if (flippedCards.length === 3) {
            readingInProgress = true;
            setTimeout(showReading, 1000);
        }
    }
}

function showReading() {
    const readingMessage = document.getElementById('reading-message');
    let readingHTML = `
        <h3>Your Three Card Reading</h3>
        <div class="reading-cards">
    `;
    
    const positions = ['Past', 'Present', 'Future'];
    flippedCards.forEach((card, index) => {
        const cardType = card.getAttribute('data-card');
        const meaning = cardMeanings[cardType];
        
        readingHTML += `
            <div class="reading-card">
                <h4>${positions[index]} - ${meaning.title}</h4>
                <p class="keywords">${meaning.keywords}</p>
                <p class="message">${meaning.message}</p>
            </div>
        `;
    });

    readingHTML += `
        </div>
        <button onclick="resetReading()" class="submit-button">New Reading</button>
    `;

    readingMessage.innerHTML = readingHTML;
    readingMessage.classList.add('visible');
}

function resetReading() {
    readingInProgress = false;
    flippedCards.forEach(card => {
        card.classList.remove('flipped');
    });
    flippedCards = [];
    
    const readingMessage = document.getElementById('reading-message');
    readingMessage.classList.remove('visible');
    setTimeout(() => {
        readingMessage.innerHTML = '';
    }, 500);
}

function scrollToAppointment() {
    document.getElementById('appointment').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Enhanced Card Flipping Functionality
function flipCard(card) {
    if (!card.classList.contains('flipped')) {
        // Only flip if not already flipped
        card.classList.add('flipped');
        updateReadingMessage();
    }
}

function updateReadingMessage() {
    const cards = document.querySelectorAll('.card.flipped');
    const messageElement = document.getElementById('reading-message');
    
    const messages = [];

    // Past Card Message
    const pastCard = document.querySelector('.card[data-card="fool"].flipped');
    if (pastCard) {
        messages.push("Your past shows new beginnings and taking a leap of faith. This suggests you've been embracing change and stepping into the unknown.");
    }

    // Present Card Message
    const presentCard = document.querySelector('.card[data-card="magician"].flipped');
    if (presentCard) {
        messages.push("Your present is about manifesting your desires and taking action. This indicates you have the tools and resources to create your reality.");
    }

    // Future Card Message
    const futureCard = document.querySelector('.card[data-card="priestess"].flipped');
    if (futureCard) {
        messages.push("Your future suggests trusting your intuition and inner wisdom. This points to a need to look within for answers and trust your instincts.");
    }

    // Generate comprehensive message
    if (messages.length > 0) {
        messageElement.innerHTML = `
            <h3>Your Reading:</h3>
            <ul>
                ${messages.map(msg => `<li>${msg}</li>`).join('')}
            </ul>
        `;
    } else {
        messageElement.innerHTML = '';
    }
}

// Reset functionality
document.addEventListener('click', function(event) {
    if (!event.target.closest('.card')) {
        const cards = document.querySelectorAll('.card.flipped');
        cards.forEach(card => {
            card.classList.remove('flipped');
        });
        updateReadingMessage();
    }
});

// Initialize date picker
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    const form = document.getElementById('bookingForm');
    
    // Initialize flatpickr
    flatpickr(dateInput, {
        dateFormat: "d M Y",
        minDate: "today",
        maxDate: new Date().fp_incr(30), // Allow booking up to 30 days in advance
        disable: [
            function(date) {
                // Disable past dates
                return date < new Date().setHours(0,0,0,0);
            }
        ],
        locale: {
            firstDayOfWeek: 1
        },
        onChange: function(selectedDates, dateStr) {
            // Reset time selection when date changes
            timeSelect.value = '';
            Array.from(timeSelect.options).forEach(option => {
                option.disabled = false;
                option.textContent = option.textContent.replace(' (Booked)', '');
            });
            
            // Update available time slots
            if (selectedDates[0]) {
                updateAvailableTimeSlots(dateStr);
            }
        }
    });

    // Form validation
    form.addEventListener('submit', function(e) {
        if (!validateForm()) {
            e.preventDefault();
            return false;
        }
    });

    // Add validation messages
    addValidationMessages();
});

// Function to add validation messages
function addValidationMessages() {
    const fields = {
        'name': 'Please enter your name',
        'email': 'Please enter a valid email address',
        'phone': 'Please enter a 10-digit phone number',
        'date': 'Please select a date',
        'time': 'Please select a time',
        'readingType': 'Please select a reading type'
    };

    for (const [id, message] of Object.entries(fields)) {
        const field = document.getElementById(id);
        if (field) {
            const validationSpan = document.createElement('span');
            validationSpan.className = 'validation-message';
            validationSpan.textContent = message;
            field.parentNode.appendChild(validationSpan);
        }
    }
}

// Function to validate form
function validateForm() {
    const form = document.getElementById('bookingForm');
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const date = form.date.value;
    const time = form.time.value;
    const readingType = form.querySelector('input[name="readingType"]:checked')?.value;

    if (!name || name.length < 2) {
        showFormError('Please enter your name (at least 2 characters)');
        return false;
    }

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        showFormError('Please enter a valid email address');
        return false;
    }

    if (!phone || !phone.match(/^\d{10}$/)) {
        showFormError('Please enter a valid 10-digit phone number');
        return false;
    }

    if (!date) {
        showFormError('Please select a date for your reading');
        return false;
    }

    if (!time) {
        showFormError('Please select a time for your reading');
        return false;
    }

    if (!readingType) {
        showFormError('Please select a reading type');
        return false;
    }

    return true;
}

// Function to update available time slots
async function updateAvailableTimeSlots(selectedDate) {
    const timeSelect = document.getElementById('time');
    timeSelect.parentNode.classList.add('loading');
    
    try {
        // Convert the date to YYYY-MM-DD format for the API
        const apiDate = new Date(selectedDate).toISOString().split('T')[0];
        const response = await fetch(`/api/bookings/available-slots/${apiDate}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch available time slots');
        }
        
        const data = await response.json();
        
        // Get all option elements except the first one (placeholder)
        const options = Array.from(timeSelect.options).slice(1);
        
        options.forEach(option => {
            const timeValue = option.value;
            const isAvailable = data.availableSlots.includes(timeValue);
            
            option.disabled = !isAvailable;
            option.textContent = option.textContent.replace(' (Booked)', '');
            
            if (!isAvailable) {
                option.textContent += ' (Booked)';
            }
        });
    } catch (error) {
        console.error('Error fetching available time slots:', error);
        showFormError('Unable to fetch available time slots. Please try again.');
    } finally {
        timeSelect.parentNode.classList.remove('loading');
    }
}

async function bookAppointment(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const form = event.target;
    form.classList.add('loading');
    
    try {
        const formData = new FormData(form);
        const bookingData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            date: formData.get('date'),
            time: formData.get('time'),
            readingType: formData.get('readingType')
        };

        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Booking failed');
        }

        showBookingConfirmation(bookingData);
    } catch (error) {
        console.error('Error:', error);
        showFormError(error.message || 'There was an error processing your booking. Please try again.');
    } finally {
        form.classList.remove('loading');
    }
}

function showBookingConfirmation(booking) {
    const form = document.getElementById('bookingForm');
    const confirmation = document.getElementById('booking-confirmation');
    const details = confirmation.querySelector('.confirmation-details');
    
    // Format the reading type for display
    const readingTypeDisplay = {
        'celestial': 'Celestial Journey',
        'spiritual': 'Spiritual Guidance',
        'quick': 'Crystal Clear Insight'
    }[booking.readingType];

    // Format the date
    const dateObj = new Date(booking.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Format the time
    const timeObj = new Date(`2000-01-01T${booking.time}`);
    const formattedTime = timeObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });
    
    // Update confirmation details
    details.textContent = `Your ${readingTypeDisplay} is scheduled for ${formattedDate} at ${formattedTime}.`;
    
    // Hide the form with fade out
    form.style.opacity = '0';
    form.style.transition = 'opacity 0.6s ease-out';
    
    // Show confirmation with animation
    setTimeout(() => {
        form.style.display = 'none';
        confirmation.style.display = 'block';
        
        // Scroll to confirmation
        confirmation.scrollIntoView({ behavior: 'smooth' });
    }, 600);
}

function showFormError(message) {
    const errorDiv = document.getElementById('booking-error');
    const errorMessage = errorDiv.querySelector('.error-message');
    const form = document.getElementById('bookingForm');
    
    // Update error message
    errorMessage.textContent = message;
    
    // Hide form and show error
    form.style.opacity = '0';
    form.style.transition = 'opacity 0.6s ease-out';
    
    setTimeout(() => {
        form.style.display = 'none';
        errorDiv.style.display = 'block';
        
        // Scroll to error
        errorDiv.scrollIntoView({ behavior: 'smooth' });
    }, 600);
}

function resetBookingForm() {
    const form = document.getElementById('bookingForm');
    const confirmation = document.getElementById('booking-confirmation');
    const error = document.getElementById('booking-error');
    
    // Reset form
    form.reset();
    
    // Hide confirmation/error and show form
    confirmation.style.display = 'none';
    error.style.display = 'none';
    form.style.display = 'block';
    form.style.opacity = '1';
    
    // Reset time options
    const timeSelect = document.getElementById('time');
    Array.from(timeSelect.options).forEach(option => {
        option.disabled = false;
        option.textContent = option.textContent.replace(' (Booked)', '');
    });
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth' });
}

// Add smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add active class to nav items on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add touch support
document.querySelectorAll('.card').forEach(card => {
    // Remove any existing event listeners
    card.removeEventListener('touchstart', null);
    card.removeEventListener('click', null);
    
    // Add touch event
    card.addEventListener('touchstart', function(e) {
        e.preventDefault();
        flipCard(this);
    });
    
    // Add click event
    card.addEventListener('click', function(e) {
        e.preventDefault();
        flipCard(this);
    });
});

// Form field animations
document.querySelectorAll('.form-field input').forEach(input => {
    // Add focus animations
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('field-active');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('field-active');
        }
    });
    
    // Add floating label animation
    input.addEventListener('input', function() {
        if (this.value) {
            this.parentElement.classList.add('field-filled');
        } else {
            this.parentElement.classList.remove('field-filled');
        }
    });
});

// Reading option hover effects
document.querySelectorAll('.reading-option').forEach(option => {
    option.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.crystal-icon');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(45deg)';
        }
    });
    
    option.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.crystal-icon');
        if (icon) {
            icon.style.transform = 'none';
        }
    });
});

// Add smooth scrolling for pricing buttons
document.addEventListener('DOMContentLoaded', function() {
    const pricingButtons = document.querySelectorAll('.book-now-btn');
    
    pricingButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the reading type from the button's parent card
            const card = this.closest('.pricing-card');
            const readingType = card.querySelector('h3').textContent.toLowerCase().split(' ')[0];
            
            // Find the corresponding radio button in the booking form
            const radioButton = document.querySelector(`input[type="radio"][value="${readingType}"]`);
            if (radioButton) {
                radioButton.checked = true;
            }
            
            // Scroll to the booking section
            const bookingSection = document.getElementById('appointment');
            bookingSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
});

// Add floating symbols
document.addEventListener('DOMContentLoaded', function() {
    const symbols = document.querySelectorAll('.floating-symbols span');
    
    symbols.forEach((symbol, index) => {
        symbol.style.left = `${Math.random() * 100}vw`;
        symbol.style.top = `${Math.random() * 100}vh`;
        symbol.style.animationDelay = `${Math.random() * 5}s`;
    });

    // Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Header scroll effect and mobile menu
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.header nav');
    const navLinks = document.querySelectorAll('.header nav a');

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenuBtn.textContent = nav.classList.contains('active') ? '✕' : '☰';
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            mobileMenuBtn.textContent = '☰';
        });
    });

    // Active link highlight
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
});
