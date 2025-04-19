/**
*   Project:  Project 5
*   Name: Kristian Bowman
*   Submitted: 4/18/2025
*   
*   I declare that the following source code was written by me, or provided
*   by the instructor for this project. I understand that copying source
*   code from any other source, providing source code to another student, 
*   or leaving my code on a public web site constitutes cheating.
*   I acknowledge that  If I am found in violation of this policy this may result
*   in a zero grade, a permanent record on file and possibly immediate failure of the class.
*   
*   Reflection (1-2 paragraphs):  
One of the most significant issues addressed was the mobile responsiveness problem that had been flagged in Project 4. The original design didn't properly adapt to smaller screen sizes. After seeing the issue I was able to create a truly responsive form that maintains functionality and visual appeal across all device sizes.
During the testing phase, I discovered a critical validation error where the visitor form would consistently fail email validation regardless of input. After thorough debugging (including creating more robust logging), I identified that both the existing contact form and the new visitor form were using elements with the same "email" ID, causing DOM conflicts, these should've been unique ID's and this corrected the conflict.


**/

/**
 * Initialize page functionality
 */
function initPage() {
    initNavigation();    
    initSectionSwitching();
    initThemeToggle();
}

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    const expandNavButton = document.querySelector('.expand-nav');
    const navElement = document.querySelector('.nav-expandable');
    
    // Set initial nav state based on viewport
    function setInitialNavState() {
        if (window.innerWidth <= 768) {
            // Mobile: Start collapsed
            navElement.classList.remove('expanded');
            expandNavButton.innerHTML = '<i class="fas fa-bars"></i>';
        } else {
            // Desktop: Start expanded
            navElement.classList.add('expanded');
            expandNavButton.innerHTML = '<i class="fas fa-times"></i>';
        }
    }
    
    // Set initial state
    setInitialNavState();
    
    // Update on window resize
    window.addEventListener('resize', setInitialNavState);
    
    // Toggle navigation on button click
    expandNavButton.addEventListener('click', function() {
        navElement.classList.toggle('expanded');
        
        const icon = this.querySelector('i');
        if (navElement.classList.contains('expanded')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

/**
 * Initialize section switching
 */
function initSectionSwitching() {
    const navLinks = document.querySelectorAll('.nav-expandable a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            
            this.classList.add('active');
            
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
            
            // For mobile, collapse the nav after selection
            if (window.innerWidth <= 768) {
                const navElement = document.querySelector('.nav-expandable');
                const expandNavButton = document.querySelector('.expand-nav');
                
                navElement.classList.remove('expanded');
                const menuIcon = expandNavButton.querySelector('i');
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });
    });
}

/**
 * Show a specific section by ID
 */
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('animate__animated', 'animate__fadeIn');
    });
    
    // Show and animate the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        selectedSection.classList.add('animate__animated', 'animate__fadeIn');
    }
}

/**
 * Initialize theme toggle functionality
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    let darkThemeActive = false;
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            if (!darkThemeActive) {
                // Add dark theme stylesheet
                const darkThemeLink = document.createElement('link');
                darkThemeLink.rel = 'stylesheet';
                darkThemeLink.href = 'css/dark-theme.css';
                darkThemeLink.id = 'dark-theme-css';
                document.head.appendChild(darkThemeLink);
                
                themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Theme';
                darkThemeActive = true;
            } else {
                const darkThemeLink = document.getElementById('dark-theme-css');
                if (darkThemeLink) {
                    document.head.removeChild(darkThemeLink);
                }
                
                themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Theme';
                darkThemeActive = false;
            }
        });
    }
}