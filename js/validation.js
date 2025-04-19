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

// Regex's for validation
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
const zipRegex = /^\d{5}(-\d{4})?$/;
const stateAbbreviations = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

/**
 * Initialize form validation
 */
function initValidation(formId) {
    const form = document.querySelector(formId);
    
    if (!form) {
        console.error(`Form with ID ${formId} not found`);
        return;
    }
    
    form.setAttribute('novalidate', true);
    
    
    const errorSummary = document.createElement('div');
    errorSummary.className = 'form-error-summary';
    errorSummary.style.display = 'none';
    form.insertBefore(errorSummary, form.firstChild);
    
    // Set up input validation on various events
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Validate on input 
        input.addEventListener('input', function() {
            validateField(this);
        });
        
        // Handle autofill by checking field value periodically
        let previousValue = input.value;
        const checkAutofill = setInterval(() => {
            if (input.value !== previousValue) {
                previousValue = input.value;
                validateField(input);
            }
        }, 100);
        
        
        setTimeout(() => clearInterval(checkAutofill), 5000);
    });
    
    // Set up form validation on submit
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isValid = validateForm(this);
        console.log('Form validation result:', isValid);
        
        if (isValid) {
            console.log('Form is valid, showing thank you message');
            showThankYouMessage();
        } else {
            console.log('Form is invalid, showing error summary');
            showErrorSummary(this);
        }
    });
}

/**
 * Show error summary at the top of the form
 */
function showErrorSummary(form) {
    const errorSummary = form.querySelector('.form-error-summary');
    if (!errorSummary) return;
    
    // Collect all error messages
    const errors = [];
    form.querySelectorAll('.errorMsg').forEach(errorElement => {
        if (errorElement.textContent) {
            const fieldLabel = errorElement.parentElement.querySelector('label');
            const fieldName = fieldLabel ? fieldLabel.textContent : 'Field';
            errors.push(`${fieldName}: ${errorElement.textContent}`);
        }
    });
    
    if (errors.length > 0) {
        errorSummary.innerHTML = `
            <div class="error-icon"><i class="fas fa-exclamation-circle"></i></div>
            <div class="error-content">
                <h4>Please fix the following errors:</h4>
                <ul>
                    ${errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            </div>
        `;
        errorSummary.style.display = 'flex';
        
        errorSummary.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        errorSummary.style.display = 'none';
    }
}

/**
 * Validate the entire form
 */
function validateForm(form) {
    let isValid = true;
    let invalidFields = [];
    
    console.log('Starting form validation');
    
    // Validate all required text inputs
    form.querySelectorAll('input[required], textarea[required], select[required]').forEach(field => {
        console.log('Validating required field:', field.id);
        if (!validateField(field)) {
            isValid = false;
            invalidFields.push(field.id);
        }
    });
    
    // Validate non-required fields that have values
    form.querySelectorAll('input:not([required]), textarea:not([required]), select:not([required])').forEach(field => {
        if (field.value.trim() !== '') {
            console.log('Validating non-required field with value:', field.id);
            if (!validateField(field)) {
                isValid = false;
                invalidFields.push(field.id);
            }
        }
    });
    
    // Validate the checkbox group
    const findMethod = form.querySelector('#find-method-group');
    if (findMethod) {
        const findOptions = findMethod.querySelectorAll('input[type="checkbox"]');
        
        const oneChecked = Array.from(findOptions).some(checkbox => checkbox.checked);
        
        if (!oneChecked) {
            setElementValidity('find-method-group', false, 'Please select at least one option');
            isValid = false;
            invalidFields.push('find-method-group');
        } else {
            setElementValidity('find-method-group', true, '');
        }
    }
    
    console.log('Form validation complete:', {
        isValid,
        invalidFields
    });
    
    return isValid;
}

/**
 * Validate a specific form field
 */
function validateField(field) {
    // Skip fields that aren't inputs or are disabled
    if (!field.tagName.match(/^(INPUT|SELECT|TEXTAREA)$/i) || field.disabled) {
        return true;
    }
    
    const id = field.id;
    const value = field.value.trim();
    
    console.log('Validating field:', {
        id,
        name: field.name,
        value,
        required: field.hasAttribute('required'),
        type: field.type,
        elementHtml: field.outerHTML
    });
    
    // Check for required fields
    if (field.hasAttribute('required') && value === '') {
        console.log('Field is required but empty');
        return checkRequired(id || field.name, 'This field is required');
    }
    
    // Skip validation for empty non-required fields
    if (!field.hasAttribute('required') && value === '') {
        console.log('Field is not required and empty, skipping validation');
        setElementValidity(id || field.name, true, '');
        return true;
    }
    
    // Validate special fields
    if (field.type === 'email' || id === 'visitor-email' || id === 'contact-email') {
        console.log('Validating email field:', value);
        return checkFormat(id || field.name, 'Please enter a valid email address', emailRegex);
    } else if (id === 'phone') {
        return checkFormat(id, 'Please enter a valid phone number', phoneRegex);
    } else if (id === 'zip') {
        return checkFormat(id, 'Please enter a valid ZIP code (12345 or 12345-6789)', zipRegex);
    } else if (id === 'state') {
        return validateState(id, 'Please enter a valid two-letter state code');
    } else {
        setElementValidity(id || field.name, true, '');
        return true;
    }
}

/**
 * Check if a required field has a value
 */
function checkRequired(fieldId, message) {
    const field = document.getElementById(fieldId);
    
    if (!field) {
        console.error(`Field with ID ${fieldId} not found`);
        return false;
    }
    
    const valid = field.value.trim() !== '';
    setElementValidity(fieldId, valid, message);
    
    return valid;
}

/**
 * Check if a field matches specific format using regex
 */
function checkFormat(fieldId, message, regex) {
    let field = document.getElementById(fieldId);
    
    if (!field) {
        console.error(`Field with ID ${fieldId} not found`);
        const altField = document.querySelector(`input[name="${fieldId}"], input[type="email"]`);
        if (altField) {
            console.log('Found field by alternate selector:', altField);
            field = altField;
        } else {
            return false;
        }
    }
    
    const value = field.value.trim();
    const valid = regex.test(value);
    
    // Debug email validation
    if (field.type === 'email') {
        console.log('Email validation details:', {
            fieldId,
            fieldName: field.name,
            fieldType: field.type,
            value,
            valid,
            regex: regex.toString(),
            required: field.hasAttribute('required'),
            elementFound: !!field,
            elementHtml: field.outerHTML
        });
    }
    
    setElementValidity(fieldId, valid, message);
    return valid;
}

/**
 * Validate state field against the list of state abbreviations
 */
function validateState(fieldId, message) {
    const field = document.getElementById(fieldId);
    
    if (!field) {
        console.error(`Field with ID ${fieldId} not found`);
        return false;
    }
    
    const stateCode = field.value.trim().toUpperCase();
    const valid = stateAbbreviations.includes(stateCode);
    
    setElementValidity(fieldId, valid, message);
    
    return valid;
}

/**
 * Set the  state of an element
 */
function setElementValidity(id, valid, message) {
    let element = document.getElementById(id);
    
    if (!element) {
        element = document.querySelector(`[name="${id}"]`);
        if (!element) {
            console.error(`Element with ID/name ${id} not found`);
            return;
        }
    }
    
    if (!element.tagName.match(/^(INPUT|SELECT|TEXTAREA)$/i)) {
        const errorMsg = element.querySelector('.errorMsg');
        if (errorMsg) {
            errorMsg.textContent = valid ? '' : message;
            errorMsg.style.display = valid ? 'none' : 'block';
        }
        element.classList.toggle('invalid', !valid);
        return;
    }
    
    element.classList.add('was-validated');
    
    element.setCustomValidity(valid ? '' : message);
    
    const errorElement = element.nextElementSibling;
    if (errorElement && errorElement.classList.contains('errorMsg')) {
        errorElement.textContent = valid ? '' : message;
        errorElement.style.display = valid ? 'none' : 'block';
    }
}

function showThankYouMessage() {
    const form = document.querySelector('#visitor-form');
    const thankYouMessage = document.querySelector('#thank-you-message');
    
    if (form) {
        form.style.display = 'none';
    }
    
    if (thankYouMessage) {
        thankYouMessage.style.display = 'block';
    }
}