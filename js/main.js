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

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page functionality
    initPage();
    initValidation('#visitor-form');
    initVideoPlaceholders();
    initContactForm();
});

/**
 * Initialize video placeholder click handlers
 */
function initVideoPlaceholders() {
    const videoPlaceholders = document.querySelectorAll('.video-placeholder');
    
    videoPlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            alert('Video would play here in a real implementation.');
        });
    });
}

/**
 * Initialize contact form submission
 */
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            alert('Form submitted! In a real implementation, this would send your message.');
            contactForm.reset();
        });
    }
}