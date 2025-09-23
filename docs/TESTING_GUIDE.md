# 🧪 Testing Guide & Credentials

Comprehensive testing scenarios and credentials for Canva API submission.

## 🎯 Testing Overview

This document provides all necessary testing scenarios, credentials, and validation procedures required for Canva API approval.

## 👤 Test User Credentials

### Primary Test Account
```
Email: canva.md.converter.test@gmail.com
Password: CanvaTest2025!
Team: Canva MD Converter Test Team
Role: Admin
```

### Secondary Test Account
```
Email: canva.md.converter.demo@gmail.com
Password: CanvaDemo2025!
Team: Canva MD Converter Demo Team
Role: Member
```

### Test Data Files
```
Location: /examples/test-presentations/
- simple-test.md (Basic markdown test)
- complex-test.md (Advanced features test)
- ocean-theme-test.md (Marine research demo)
- collaboration-test.md (Team features demo)
```

## 🔄 Authentication Test Scenarios

### Scenario 1: New User Signup Flow
**Description**: Test the complete new user registration process

**Steps**:
1. Visit application homepage
2. Click "Connect to Canva"
3. Select "Sign up for Canva" (if not logged in)
4. Complete Canva registration form
5. Authorize application permissions
6. Verify redirect to success page
7. Test markdown conversion functionality

**Expected Results**:
- User successfully creates Canva account
- OAuth permissions granted correctly
- Application receives valid access token
- User can convert markdown files

### Scenario 2: Existing User Login
**Description**: Test login flow for existing Canva users

**Steps**:
1. Visit application homepage
2. Click "Connect to Canva"
3. Enter test credentials (see above)
4. Authorize application permissions
5. Verify redirect to dashboard
6. Test core functionality

**Expected Results**:
- Successful authentication
- User dashboard loads correctly
- Access to user's Canva workspace
- Full functionality available

### Scenario 3: Active Session Flow
**Description**: Test when user already has active Canva session

**Steps**:
1. Log into Canva directly (canva.com)
2. In new tab, visit our application
3. Click "Connect to Canva"
4. Should auto-authorize without login prompt
5. Test functionality immediately

**Expected Results**:
- No additional login required
- Seamless authorization
- Immediate access to features

### Scenario 4: Session Expiry Handling
**Description**: Test handling of expired tokens/sessions

**Steps**:
1. Complete normal authentication
2. Wait for token expiry (or manually expire)
3. Attempt to use application features
4. Verify automatic re-authentication
5. Test functionality after re-auth

**Expected Results**:
- Graceful handling of expired tokens
- Automatic token refresh
- No data loss during re-authentication
- Continued functionality

## 📝 Functionality Test Cases

### Test Case 1: Basic Markdown Conversion
**File**: `examples/test-presentations/simple-test.md`

```markdown
---
title: "Basic Test Presentation"
template: "professional-blue"
---

# Introduction
Welcome to our test presentation.

---

# Key Points
- Point one
- Point two
- Point three

---

# Conclusion
Thank you for your attention.
```

**Expected Output**:
- 3 slides created in Canva
- Professional blue template applied
- Proper text formatting
- Team sharing enabled

### Test Case 2: Ocean Theme Conversion
**File**: `examples/test-presentations/ocean-theme-test.md`

```markdown
---
title: "Marine Research Demo"
template: "ocean-pastel"
collaboration:
  teamShare: true
  permissions: "edit"
  folder: "Test Projects"
---

# Marine Conservation Analysis
## Ocean Wave Styling Demo

---

# Key Findings
- 🌊 Ocean theme applied correctly
- 🐟 Marine research optimized
- 📊 Statistical visualizations
- 🤝 Team collaboration ready

---

# Visual Elements
## Color Palette Testing
- Primary: Sky blue gradients
- Secondary: Ocean motifs
- Accent: Wave decorations
- Background: Soft pastels
```

**Expected Output**:
- Ocean wave theme correctly applied
- Marine-appropriate color scheme
- Professional statistical layouts
- Team collaboration enabled
- Proper folder organization

### Test Case 3: Complex Features Test
**File**: `examples/test-presentations/complex-test.md`

```markdown
---
title: "Advanced Features Demo"
template: "modern-gradient"
collaboration:
  teamShare: true
  permissions: "comment"
  folder: "Advanced Tests"
  notifyTeam: true
---

# Advanced Features Demo
## Testing Complex Markdown

---

# Statistics Overview
- **150+ operations** analyzed
- **$100M+ revenue** impact
- **1,500+ jobs** affected
- **Real-time collaboration** enabled

---

# Geographic Data
## Central Coast Analysis
- Zone coordinates: 52.80°N, 128.40°W
- Active facilities: 15+ salmon farms
- Economic impact: $50M annually

## North Coast Analysis
- Charter operations: 35+ companies
- Tourism value: International destination
- Seasonal employment: 200+ positions

---

# Team Collaboration
## Features Tested
- Edit permissions configured
- Team notifications enabled
- Folder organization active
- Real-time updates working
```

**Expected Output**:
- Modern gradient template applied
- Complex statistical data formatted
- Geographic coordinates preserved
- Comment permissions set correctly
- Team notifications sent

## 🔒 Security Test Scenarios

### Security Test 1: CSRF Protection
**Description**: Verify protection against Cross-Site Request Forgery

**Steps**:
1. Initiate OAuth flow
2. Capture state parameter
3. Attempt to replay request with different state
4. Verify rejection of tampered request

**Expected Result**: Request rejected with security error

### Security Test 2: Token Security
**Description**: Verify secure token handling

**Steps**:
1. Complete authentication flow
2. Inspect network requests for token exposure
3. Verify tokens are encrypted in storage
4. Test token expiry handling

**Expected Result**: Tokens never exposed in plain text

### Security Test 3: Input Validation
**Description**: Test protection against malicious input

**Test Input**:
```markdown
---
title: "<script>alert('xss')</script>"
template: "../../etc/passwd"
---

# <iframe src="javascript:alert('xss')"></iframe>

<script>
  document.location = 'http://evil.com';
</script>
```

**Expected Result**: Malicious content sanitized or rejected

## 🚀 Performance Test Scenarios

### Performance Test 1: Load Time
**Measurement**: Initial page load performance

**Acceptance Criteria**:
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- First Input Delay < 100ms

### Performance Test 2: Conversion Speed
**Measurement**: Markdown to Canva conversion time

**Test Cases**:
- Small file (< 1KB): < 3 seconds
- Medium file (1-10KB): < 5 seconds
- Large file (10-50KB): < 10 seconds

### Performance Test 3: Concurrent Users
**Measurement**: Multiple simultaneous conversions

**Test Scenario**:
- 10 concurrent users
- Each converts medium-sized presentation
- Monitor response times and error rates

**Acceptance Criteria**:
- 95% success rate
- Average response time < 8 seconds
- No memory leaks or crashes

## 🤝 Team Collaboration Tests

### Collaboration Test 1: Real-time Editing
**Scenario**: Multiple users editing same presentation

**Steps**:
1. User A creates presentation via our app
2. User B receives notification and opens in Canva
3. User B makes edits in Canva editor
4. User A sees changes in real-time
5. Both users can edit simultaneously

**Expected Result**: Changes sync correctly between users

### Collaboration Test 2: Permission Levels
**Scenario**: Different permission levels working correctly

**Test Matrix**:
- **Edit**: Full editing capabilities in Canva
- **Comment**: Can add comments but not edit
- **View**: Read-only access to presentation

### Collaboration Test 3: Team Notifications
**Scenario**: Team notification system working

**Steps**:
1. Create presentation with notifyTeam: true
2. Verify team members receive notification
3. Team members can access shared presentation
4. Permissions are correctly applied

## 📊 Error Handling Tests

### Error Test 1: Network Failures
**Scenarios**:
- Timeout during Canva API call
- Network disconnection during conversion
- Rate limit exceeded

**Expected Behavior**:
- Graceful error messages
- Retry mechanism for transient errors
- No data corruption

### Error Test 2: Invalid Input
**Test Cases**:
- Empty markdown file
- Malformed YAML frontmatter
- Unsupported template name
- File size exceeding limits

**Expected Behavior**:
- Clear validation error messages
- Helpful suggestions for fixes
- No application crashes

### Error Test 3: Authentication Errors
**Scenarios**:
- Expired refresh token
- Revoked application permissions
- Invalid OAuth state parameter

**Expected Behavior**:
- Prompt for re-authentication
- Clear error explanations
- Secure error handling

## 📱 Cross-Browser Testing

### Supported Browsers
- Chrome 100+ (Primary)
- Firefox 100+
- Safari 15+
- Edge 100+

### Mobile Testing
- iOS Safari (iPhone/iPad)
- Chrome Mobile (Android)
- Responsive design validation

## 🎥 Video Demonstration Script

### Video Content Plan (3-4 minutes)

**Intro (30 seconds)**:
- "Welcome to Canva Markdown Converter"
- Show homepage with ocean theme preview
- Explain core value proposition

**Authentication Demo (45 seconds)**:
- Click "Connect to Canva"
- Show OAuth flow with test account
- Successful authorization and redirect

**Basic Conversion (60 seconds)**:
- Upload simple markdown file
- Select ocean-pastel template
- Show conversion process
- Result opens in Canva workspace

**Advanced Features (60 seconds)**:
- Complex markdown with statistical data
- Team collaboration settings
- Multiple template options
- Professional styling applied

**Team Collaboration (45 seconds)**:
- Show shared presentation in Canva
- Multiple users editing simultaneously
- Comment and permission features
- Real-time updates

**Conclusion (30 seconds)**:
- Recap key benefits
- Show final presentation in Canva
- Call to action for API approval

## 🔍 Quality Assurance Checklist

### Pre-Submission Testing
- [ ] **Authentication**: All OAuth flows tested
- [ ] **Functionality**: Core features working
- [ ] **Security**: Security measures validated
- [ ] **Performance**: Load times acceptable
- [ ] **Collaboration**: Team features functional
- [ ] **Error Handling**: Graceful error responses
- [ ] **Cross-browser**: Compatible across browsers
- [ ] **Mobile**: Responsive design working

### Test Data Preparation
- [ ] **Test Accounts**: Credentials documented
- [ ] **Sample Files**: Test markdown files created
- [ ] **Video Demo**: Demonstration recorded
- [ ] **Screenshots**: Key features captured
- [ ] **Performance Metrics**: Benchmarks established

### Documentation Review
- [ ] **Test Scenarios**: All scenarios documented
- [ ] **Expected Results**: Clear success criteria
- [ ] **Error Cases**: Edge cases covered
- [ ] **Security Tests**: Security validation complete

---

**Testing Status**: ✅ Ready for comprehensive testing and Canva API submission

**Test Credentials Provided**: Ready for Canva review team access