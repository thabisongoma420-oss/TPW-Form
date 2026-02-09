# Assets Folder Guide

This folder contains images used in your form application.

## Required Images

### 1. logo.png
- **Location**: `assets/logo.png`
- **Purpose**: Organization or church logo displayed at the top of the form
- **Recommended Size**: 150px x 150px (will be responsive)
- **Format**: PNG (supports transparency) or JPG

### 2. background.jpg
- **Location**: `assets/background.jpg`
- **Purpose**: Background image for the entire form page
- **Recommended Size**: 1920x1080px or larger (high resolution recommended)
- **Format**: JPG (for better compression) or PNG

## How to Add Your Images

1. **For the Logo**: 
   - Add your organization/church logo file and rename it to `logo.png`
   - Place it directly in this `assets` folder
   
2. **For the Background**:
   - Add your background image and rename it to `background.jpg`
   - Place it directly in this `assets` folder

## CSS Configuration

The images are referenced in `css/styles.css`:
- Logo: `<img src="assets/logo.png" alt="Organization Logo" class="logo">` (in form.html)
- Background: `background-image: url('../assets/background.jpg');` (in styles.css)

If you want to use different image names or paths, update the references in:
- **form.html** (line with logo img tag)
- **css/styles.css** (body background-image property)
