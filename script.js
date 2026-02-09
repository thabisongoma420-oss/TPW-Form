// Form handling and validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('applicationForm');
    const pages = document.querySelectorAll('.page');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    const pageNumber = document.getElementById('page-number');
    const successMessage = document.getElementById('successMessage');
    const referenceNumber = document.getElementById('referenceNumber');
    
    let currentPage = 0;
    
    // Calculate age from date of birth
    const dobInput = document.getElementById('dob');
    const ageInput = document.getElementById('age');
    
    dobInput.addEventListener('change', calculateAge);
    
    function calculateAge() {
        if (dobInput.value) {
            const birthDate = new Date(dobInput.value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            ageInput.value = age;
        }
    }
    
    // Show/hide conditional fields
    const incomeRadios = document.querySelectorAll('input[name="incomeSource"]');
    const otherIncomeField = document.getElementById('otherIncomeField');
    
    incomeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            otherIncomeField.classList.toggle('hidden', this.value !== 'Other');
        });
    });
    
    const liveWithOtherCheckbox = document.getElementById('liveWithOther');
    const otherLiveWithField = document.getElementById('otherLiveWithField');
    
    liveWithOtherCheckbox.addEventListener('change', function() {
        otherLiveWithField.classList.toggle('hidden', !this.checked);
    });
    
    const employedRadios = document.querySelectorAll('input[name="employed"]');
    const employedDetailsField = document.getElementById('employedDetailsField');
    
    employedRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            employedDetailsField.classList.toggle('hidden', this.value !== 'Yes');
        });
    });
    
    const employmentSupportRadios = document.querySelectorAll('input[name="employmentSupport"]');
    const employmentSupportField = document.getElementById('employmentSupportField');
    
    employmentSupportRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            employmentSupportField.classList.toggle('hidden', this.value !== 'Yes');
        });
    });
    
    const medicalSupportRadios = document.querySelectorAll('input[name="medicalSupport"]');
    const medicalSupportField = document.getElementById('medicalSupportField');
    
    medicalSupportRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            medicalSupportField.classList.toggle('hidden', this.value === 'None');
        });
    });
    
    // Support Type Dropdown Handler
    const supportTypeDropdown = document.getElementById('supportType');
    const supportDetailsField = document.getElementById('supportDetailsField');
    const supportDetailsTextarea = document.getElementById('supportDetails');
    
    supportTypeDropdown.addEventListener('change', function() {
        // Show/hide support details field
        if (this.value && this.value !== 'None' && this.value !== '') {
            supportDetailsField.classList.remove('hidden');
        } else {
            supportDetailsField.classList.add('hidden');
            supportDetailsTextarea.value = '';
        }
    });
    
    // Navigation between pages
    nextBtn.addEventListener('click', function() {
        if (validatePage(currentPage)) {
            pages[currentPage].classList.remove('active');
            currentPage++;
            pages[currentPage].classList.add('active');
            updatePageIndicator();
        }
    });
    
    prevBtn.addEventListener('click', function() {
        pages[currentPage].classList.remove('active');
        currentPage--;
        pages[currentPage].classList.add('active');
        updatePageIndicator();
    });
    
    function updatePageIndicator() {
        pageNumber.textContent = `Page ${currentPage + 1} of ${pages.length}`;
    }
    
    // Form validation
    function validatePage(pageIndex) {
        let isValid = true;
        const page = pages[pageIndex];
        const requiredFields = page.querySelectorAll('[required]');
        
        // Clear previous errors
        page.querySelectorAll('.error').forEach(error => {
            error.style.display = 'none';
        });
        
        // Validate each required field
        for (let field of requiredFields) {
            let errorId = field.id ? field.id + '-error' : '';
            let errorElement = document.getElementById(errorId);
            
            if (!field.value && !isRadioOrCheckboxValid(field)) {
                isValid = false;
                if (errorElement) {
                    errorElement.style.display = 'block';
                }
                field.style.borderColor = '#e74c3c';
            } else {
                field.style.borderColor = '#ddd';
            }
            
            // Special validation for conditional fields
            if (field.name === 'otherIncome' && !otherIncomeField.classList.contains('hidden')) {
                if (!field.value.trim()) {
                    isValid = false;
                    document.getElementById('otherIncome-error').style.display = 'block';
                    field.style.borderColor = '#e74c3c';
                }
            }
            
            // Special validation for support details
            if (field.name === 'supportDetails' && !supportDetailsField.classList.contains('hidden')) {
                if (!field.value.trim()) {
                    isValid = false;
                    document.getElementById('supportDetails-error').style.display = 'block';
                    field.style.borderColor = '#e74c3c';
                }
            }
        }
        
        return isValid;
    }
    
    function isRadioOrCheckboxValid(field) {
        if (field.type === 'radio') {
            const name = field.name;
            return document.querySelector(`input[name="${name}"]:checked`) !== null;
        }
        if (field.type === 'checkbox') {
            const name = field.name;
            return document.querySelector(`input[name="${name}"]:checked`) !== null;
        }
        return true;
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate the current page (page 2)
        if (!validatePage(currentPage)) {
            alert('Please fill in all required fields on this page.');
            return;
        }
        
        // Collect form data
        const formData = new FormData(form);
        const data = {};
        
        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            if (key === 'liveWith') {
                if (!data[key]) data[key] = [];
                data[key].push(value);
            } else {
                data[key] = value;
            }
        }
        
        // Convert arrays to strings for storage
        if (Array.isArray(data.liveWith)) {
            data.liveWith = data.liveWith.join(', ');
        }
        
        // Generate unique reference number
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 10000);
        data.referenceNumber = `APP-${timestamp}-${randomNum}`;
        
        // Create text file content
        const fileContent = generateTextFileContent(data);
        
        // Download the file
        downloadTextFile(fileContent, data.referenceNumber);
        
        // Show success message
        form.style.display = 'none';
        referenceNumber.textContent = data.referenceNumber;
        successMessage.style.display = 'block';
        
        // Reset form after 5 seconds
        setTimeout(() => {
            form.reset();
            form.style.display = 'block';
            successMessage.style.display = 'none';
            
            // Reset to page 1
            if (pages[currentPage]) {
                pages[currentPage].classList.remove('active');
            }
            currentPage = 0;
            pages[currentPage].classList.add('active');
            updatePageIndicator();
            
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Application';
        }, 5000);
    });
    
    // Generate formatted text file content
    function generateTextFileContent(data) {
        const separator = '='.repeat(60);
        const subSeparator = '-'.repeat(60);
        
        let content = '';
        content += separator + '\n';
        content += 'APPLICATION FORM SUBMISSION\n';
        content += separator + '\n\n';
        
        // Add submission details
        content += `REFERENCE NUMBER: ${data.referenceNumber}\n`;
        content += `SUBMISSION DATE: ${new Date().toLocaleString()}\n`;
        content += subSeparator + '\n\n';
        
        // Personal Information Section
        content += 'PERSONAL INFORMATION\n';
        content += subSeparator + '\n';
        content += `First Name: ${data.name || 'N/A'}\n`;
        content += `Surname: ${data.surname || 'N/A'}\n`;
        content += `Contact Number: ${data.contact || 'N/A'}\n`;
        content += `Alternative Contact: ${data.altContact || 'N/A'}\n`;
        content += `Email: ${data.email || 'N/A'}\n`;
        content += `Date of Birth: ${data.dob || 'N/A'}\n`;
        content += `Age: ${data.age || 'N/A'}\n`;
        content += `Gender: ${data.gender || 'N/A'}\n`;
        content += `ID/Passport Number: ${data.idNumber || 'N/A'}\n`;
        content += `Ethnic Group: ${data.ethnicGroup || 'N/A'}\n`;
        content += `Home Language: ${data.homeLanguage || 'N/A'}\n`;
        content += `Highest Grade Completed: ${data.highestGrade || 'N/A'}\n`;
        content += `Preferred Contact Method: ${data.contactMethod || 'N/A'}\n`;
        content += subSeparator + '\n\n';
        
        // Residential Address
        content += 'RESIDENTIAL ADDRESS\n';
        content += subSeparator + '\n';
        content += `${data.address || 'N/A'}\n`;
        content += subSeparator + '\n\n';
        
        // Income Information
        content += 'INCOME INFORMATION\n';
        content += subSeparator + '\n';
        content += `Source of Income: ${data.incomeSource || 'N/A'}\n`;
        if (data.otherIncome) {
            content += `Other Income Source: ${data.otherIncome}\n`;
        }
        content += subSeparator + '\n\n';
        
        // Household Information Section
        content += 'HOUSEHOLD INFORMATION\n';
        content += subSeparator + '\n';
        content += `Number of Dependants: ${data.dependants || 'N/A'}\n`;
        content += `Lives With: ${data.liveWith || 'N/A'}\n`;
        if (data.otherLiveWith) {
            content += `Other Living Arrangement: ${data.otherLiveWith}\n`;
        }
        content += `Employment in Household: ${data.employed || 'N/A'}\n`;
        if (data.employedDetails) {
            content += `Employment Details:\n${data.employedDetails}\n`;
        }
        content += subSeparator + '\n\n';
        
        // Support Section
        content += 'SUPPORT REQUIREMENTS\n';
        content += subSeparator + '\n';
        content += `Type of Support Needed: ${data.supportType || 'N/A'}\n`;
        if (data.supportDetails) {
            content += `Support Details:\n${data.supportDetails}\n`;
        }
        content += subSeparator + '\n\n';
        
        content += 'END OF APPLICATION FORM\n';
        content += separator + '\n';
        
        return content;
    }
    
    // Download text file
    function downloadTextFile(content, referenceNumber) {
        const element = document.createElement('a');
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        
        // Use the reference number in the filename
        const filename = `Application_${referenceNumber}.txt`;
        element.setAttribute('download', filename);
        
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
        // Also log the data to browser console for verification
        console.log('Application Data:', content);
    }
    
    // Word count for text areas
    const textAreas = document.querySelectorAll('textarea[maxlength="1000"]');
    textAreas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            const words = this.value.trim().split(/\s+/);
            if (words.length > 100) {
                this.value = words.slice(0, 100).join(' ');
            }
        });
    });
});