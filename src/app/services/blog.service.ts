import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BlogPost } from '../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private posts: BlogPost[] = [
    {
      id: '1',
      slug: 'complete-email-validation-guide-regex',
      title: 'Complete Email Validation Guide with Regex',
      excerpt: 'Master email validation with comprehensive regex patterns. Learn the RFC-compliant approach, common pitfalls, and best practices for production applications.',
      content: `# Complete Email Validation Guide with Regex

Email validation is one of the most common use cases for regular expressions in web development. However, it's also one of the most debated topics. Let's explore the complete guide to email validation using regex.

## The Basic Pattern

The most common email validation pattern looks like this:

\`\`\`regex
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$
\`\`\`

This pattern breaks down into three main parts:

### 1. Local Part (before @)
\`[a-zA-Z0-9._%+-]+\`
- Allows letters, numbers, and special characters: . _ % + -
- Must have at least one character

### 2. @ Symbol
The literal @ character separating local and domain parts.

### 3. Domain Part (after @)
\`[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}\`
- Allows letters, numbers, dots, and hyphens
- Must have at least one dot
- TLD must be at least 2 characters

## Common Valid Emails

These emails should match:
- user@example.com
- john.doe@company.co.uk
- test+tag@domain.com
- user_123@test-domain.org

## Common Invalid Emails

These should NOT match:
- @example.com (missing local part)
- user@.com (missing domain)
- user@@example.com (double @)
- user@domain (missing TLD)

## Advanced RFC 5322 Compliant Pattern

For production systems requiring RFC 5322 compliance:

\`\`\`regex
^(?:[a-z0-9!#$%&'*+/=?^_\`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_\`{|}~-]+)*|"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])$
\`\`\`

## Best Practices

1. **Keep It Simple**: For most applications, the basic pattern is sufficient
2. **Server-Side Validation**: Always validate on the server, not just client-side
3. **Send Verification Email**: The best validation is actually sending an email
4. **Consider Internationalization**: Modern email addresses can include unicode characters
5. **Update Regularly**: Email standards evolve; keep your patterns updated

## Testing Your Pattern

Use these test cases:

\`\`\`
Valid:
- simple@example.com ✓
- test.email@example.com ✓
- test+tag@example.co.uk ✓
- user_name@test-domain.com ✓

Invalid:
- plainaddress ✗
- @no-local.org ✗
- no-domain@ ✗
- two@@example.com ✗
- spaces in@email.com ✗
\`\`\`

## Performance Considerations

Email regex validation is fast (microseconds), but for large datasets:
- Pre-filter with basic checks (contains @, has domain)
- Use compiled regex patterns
- Consider rate limiting on API endpoints

## Security Notes

⚠️ **Important**: Regex validation alone doesn't prevent:
- Disposable email addresses
- Spam bots
- Malicious input

Always combine with:
- CAPTCHA for public forms
- Email verification workflow
- Rate limiting
- Server-side sanitization

## Conclusion

Email validation with regex is a balance between simplicity and accuracy. Start with the basic pattern, add complexity only when needed, and always verify emails through actual delivery.

**Try the pattern yourself!** Click "Try It" to load this pattern into the regex tester.`,
      category: 'Tutorials',
      date: new Date('2024-02-01'),
      readTime: 8,
      author: {
        name: 'Regex Playground Team'
      },
      thumbnail: '📧',
      tags: ['email', 'validation', 'beginner', 'forms'],
      relatedPosts: ['2', '4'],
      featured: true,
      seo: {
        metaDescription: 'Learn email validation with regex. Complete guide covering basic patterns, RFC compliance, best practices, and security considerations for production apps.',
        ogTitle: 'Complete Email Validation Guide with Regex | Regex Playground',
        ogDescription: 'Master email validation with comprehensive regex patterns and best practices.'
      },
      pattern: {
        regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        flags: 'i',
        testString: 'user@example.com\ntest.email+tag@domain.co.uk\ninvalid@\n@invalid.com\nspaces in@email.com'
      }
    },
    {
      id: '2',
      slug: 'mastering-phone-number-patterns-international-formats',
      title: 'Mastering Phone Number Patterns: International Formats',
      excerpt: 'Learn how to validate phone numbers from around the world. Covers US, UK, European, Asian formats with practical examples and edge cases.',
      content: `# Mastering Phone Number Patterns: International Formats

Phone number validation is complex due to varying international formats. This guide covers the most common patterns and best practices.

## US Phone Numbers

### Basic US Pattern
\`\`\`regex
^\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})$
\`\`\`

Matches:
- (555) 123-4567
- 555-123-4567
- 555.123.4567
- 5551234567

### With Country Code
\`\`\`regex
^\\+?1?[-.]?\\(?([0-9]{3})\\)?[-.]?([0-9]{3})[-.]?([0-9]{4})$
\`\`\`

Matches:
- +1 (555) 123-4567
- 1-555-123-4567
- +15551234567

## UK Phone Numbers

UK numbers are more complex with varying lengths:

\`\`\`regex
^(?:(?:\\(?(?:0(?:0|11)\\)?[\\s-]?\\(?|\\+)44\\)?[\\s-]?(?:\\(?0\\)?)?)|(?:\\(?0))(?:(?:\\d{5}\\)?[\\s-]?\\d{4,5})|(?:\\d{4}\\)?[\\s-]?(?:\\d{5}|\\d{3}[\\s-]?\\d{3}))|(?:\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{3,4})|(?:\\d{2}\\)?[\\s-]?\\d{4}[\\s-]?\\d{4}))(?:[\\s-]?(?:x|ext\\.?|\\#)\\d{3,4})?$
\`\`\`

Matches:
- 020 7123 4567 (London)
- +44 20 7123 4567
- (020) 7123 4567
- 07700 900123 (Mobile)

## European Formats

### France
\`\`\`regex
^(?:(?:\\+|00)33|0)\\s*[1-9](?:[\\s.-]*\\d{2}){4}$
\`\`\`

Matches:
- +33 1 23 45 67 89
- 01 23 45 67 89
- 0123456789

### Germany
\`\`\`regex
^(?:(?:\\+|00)49)?[\\s.-]?(?:\\(?0?\\d{2,5}\\)?[\\s.-]?)?[\\s.-]?\\d{3,}[\\s.-]?\\d{4,}$
\`\`\`

Matches:
- +49 30 12345678
- 030 12345678
- (030) 123 456 78

## Asian Formats

### India
\`\`\`regex
^(?:(?:\\+|0{0,2})91[\\s-]?)?[6-9]\\d{9}$
\`\`\`

Matches:
- +91 98765 43210
- 9876543210
- +91-9876543210

### China
\`\`\`regex
^(?:(?:\\+|00)86)?1[3-9]\\d{9}$
\`\`\`

Matches:
- +86 138 0013 8000
- 13800138000

## Universal International Pattern

A pattern that works for most international formats:

\`\`\`regex
^[+]?[(]?[0-9]{1,4}[)]?[-\\s.]?[(]?[0-9]{1,4}[)]?[-\\s.]?[0-9]{1,5}[-\\s.]?[0-9]{1,6}$
\`\`\`

This flexible pattern matches:
- Various country codes (1-4 digits)
- Optional parentheses
- Various separators (-, ., space)
- 7-15 digit phone numbers

## Best Practices

### 1. Normalize Before Validation
Remove all formatting characters first:

\`\`\`javascript
const normalized = phone.replace(/[^0-9+]/g, '');
\`\`\`

### 2. Use a Library
Consider using specialized libraries:
- libphonenumber-js (JavaScript)
- phonenumbers (Python)
- Google's libphonenumber

### 3. Store Raw Numbers
Store only digits in database:
- Easy searching
- Consistent format
- Format for display only

### 4. Country-Specific Validation
When possible, validate based on user's country:

\`\`\`javascript
const patterns = {
  'US': /^[2-9]\\d{2}[2-9]\\d{6}$/,
  'UK': /^(?:0[127689]|\\+44[127689])\\d{8,9}$/,
  'IN': /^[6-9]\\d{9}$/
};

function validatePhone(phone, country) {
  const pattern = patterns[country];
  return pattern ? pattern.test(phone) : false;
}
\`\`\`

## Common Pitfalls

### 1. Over-Restrictive Patterns
Don't reject valid international formats

### 2. Assuming Format
Users may enter numbers in various formats

### 3. Missing Country Codes
International apps need country code support

### 4. Extension Numbers
Some users need extension support: x123 or ext. 123

## Testing Strategy

Test with numbers from:
- ✓ Different countries
- ✓ With/without country codes
- ✓ Various separators
- ✓ With extensions
- ✓ Edge cases (all zeros, all nines)
- ✗ Invalid lengths
- ✗ Invalid country codes
- ✗ Letters and special characters

## Example Test Cases

\`\`\`
Valid:
+1 (555) 123-4567
+44 20 7123 4567
+33 1 23 45 67 89
+86 138 0013 8000
+91 98765 43210

Invalid:
123 (too short)
+999 555 1234 (invalid country code)
555-ABC-1234 (contains letters)
(555) 123 456 7890 (too long for US)
\`\`\`

## Conclusion

Phone number validation is complex and varies by region. Use libraries when possible, be flexible with input formats, and always normalize before storage.

**Try it yourself!** Click "Try It" to test these patterns in the regex tester.`,
      category: 'Tutorials',
      date: new Date('2024-02-05'),
      readTime: 10,
      author: {
        name: 'Regex Playground Team'
      },
      thumbnail: '📱',
      tags: ['phone', 'validation', 'international', 'intermediate'],
      relatedPosts: ['1', '3'],
      seo: {
        metaDescription: 'Complete guide to validating international phone numbers with regex. Covers US, UK, European, and Asian formats with practical examples.',
        ogTitle: 'Mastering Phone Number Patterns: International Formats | Regex Playground'
      },
      pattern: {
        regex: '^[+]?[(]?[0-9]{1,4}[)]?[-\\s.]?[(]?[0-9]{1,4}[)]?[-\\s.]?[0-9]{1,5}[-\\s.]?[0-9]{1,6}$',
        flags: '',
        testString: '+1 (555) 123-4567\n+44 20 7123 4567\n+33 1 23 45 67 89\n555-ABC-1234\n123'
      }
    },
    {
      id: '3',
      slug: 'extract-urls-from-text-ultimate-guide',
      title: 'Extract URLs from Text: The Ultimate Guide',
      excerpt: 'Discover how to extract URLs from any text with regex. Learn patterns for HTTP/HTTPS, email links, markdown URLs, and more with real-world examples.',
      content: `# Extract URLs from Text: The Ultimate Guide

URL extraction is essential for web scraping, content analysis, and link validation. This comprehensive guide covers all types of URL patterns.

## Basic HTTP/HTTPS URLs

### Simple Pattern
\`\`\`regex
https?://[^\\s]+
\`\`\`

Matches any URL starting with http:// or https:// until whitespace.

### Improved Pattern
\`\`\`regex
https?://(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)
\`\`\`

This pattern:
- Handles optional www.
- Validates domain structure
- Captures query strings and paths
- Supports port numbers
- Handles fragments (#)

## Examples of Matched URLs

\`\`\`
https://example.com
http://www.example.com/path/to/page
https://api.example.com:8080/v1/users?id=123
https://example.com/page#section
https://sub.domain.example.co.uk/path?query=value&other=123
\`\`\`

## Advanced Patterns

### URLs with Authentication
\`\`\`regex
https?://(?:[a-zA-Z0-9]+:[a-zA-Z0-9]+@)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)
\`\`\`

Matches: https://user:pass@example.com

### URLs in Markdown
\`\`\`regex
\\[([^\\]]+)\\]\\(((https?://[^)]+))\\)
\`\`\`

Matches: [Link Text](https://example.com)
Captures both link text and URL separately.

### URLs in HTML
\`\`\`regex
(?:href|src)=["']?(https?://[^"'\\s>]+)["']?
\`\`\`

Extracts URLs from:
- \`<a href="https://example.com">\`
- \`<img src="https://example.com/image.jpg">\`

## Domain-Only Extraction

To extract just the domain:

\`\`\`regex
https?://(?:www\\.)?([^/\\s]+)
\`\`\`

From: https://www.example.com/path
Captures: example.com

## Query Parameter Extraction

To extract specific query parameters:

\`\`\`regex
[?&]param=([^&\\s]+)
\`\`\`

From: https://example.com?param=value&other=123
Captures: value

## URL Validation vs Extraction

### For Validation (Strict)
\`\`\`regex
^https?://(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$
\`\`\`

Use ^ and $ anchors to match entire string.

### For Extraction (Flexible)
\`\`\`regex
https?://(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)
\`\`\`

No anchors - finds URLs within text.

## Edge Cases to Handle

### Trailing Punctuation
URLs often appear with punctuation:
- "Visit https://example.com."
- "See https://example.com!"
- "(from https://example.com)"

Solution:
\`\`\`regex
https?://[^\\s<>"{}|\\\\^\\[\\]]+(?=[.!?,;:)]?(?:\\s|$))
\`\`\`

Uses lookahead to exclude trailing punctuation.

### Shortened URLs
\`\`\`regex
https?://(?:bit\\.ly|t\\.co|tinyurl\\.com|goo\\.gl)/[a-zA-Z0-9]+
\`\`\`

Specific pattern for common URL shorteners.

### Protocol-Relative URLs
\`\`\`regex
//[^\\s<>"{}|\\\\^\\[\\]]+
\`\`\`

Matches: //example.com/path

## International Domain Names (IDN)

For Unicode domains:
\`\`\`regex
https?://(?:www\\.)?[\\p{L}\\p{N}.-]+\\.\\p{L}{2,}\\b(?:[\\p{L}\\p{N}@:%_+.~#?&/=\\-]*)
\`\`\`

Matches: https://例え.jp (with Unicode flag)

## Practical Applications

### 1. Link Checker
Extract all links from HTML and validate:
\`\`\`javascript
const urlPattern = /https?:\\/\\/[^\\s<>"{}|\\\\^\\[\\]]+/g;
const urls = text.match(urlPattern);
urls.forEach(async url => {
  const isValid = await checkUrl(url);
  console.log(\`\${url}: \${isValid}\`);
});
\`\`\`

### 2. Social Media Link Extraction
\`\`\`javascript
const socialPatterns = {
  twitter: /https?:\\/\\/(?:www\\.)?twitter\\.com\\/[a-zA-Z0-9_]+/g,
  linkedin: /https?:\\/\\/(?:www\\.)?linkedin\\.com\\/in\\/[a-zA-Z0-9-]+/g,
  github: /https?:\\/\\/(?:www\\.)?github\\.com\\/[a-zA-Z0-9-]+/g
};
\`\`\`

### 3. Content Aggregation
Extract and categorize URLs by domain:
\`\`\`javascript
const domainPattern = /https?:\\/\\/(?:www\\.)?([^/\\s]+)/g;
const domains = {};
let match;
while (match = domainPattern.exec(text)) {
  const domain = match[1];
  domains[domain] = (domains[domain] || 0) + 1;
}
\`\`\`

## Performance Optimization

### 1. Compile Regex
\`\`\`javascript
const urlRegex = new RegExp(
  'https?://[^\\\\s<>"{}|\\\\\\\\^\\\\[\\\\]]+',
  'g'
);
\`\`\`

### 2. Early Exit
For validation, fail fast:
\`\`\`javascript
if (!text.includes('http')) return [];
return text.match(urlRegex);
\`\`\`

### 3. Stream Processing
For large texts, process in chunks:
\`\`\`javascript
const chunkSize = 1000;
for (let i = 0; i < text.length; i += chunkSize) {
  const chunk = text.substr(i, chunkSize + 100); // overlap
  processUrls(chunk.match(urlRegex));
}
\`\`\`

## Testing Your Pattern

Essential test cases:

\`\`\`
Should Match:
✓ https://example.com
✓ http://www.example.com/path
✓ https://api.example.com:8080/v1
✓ https://example.com?query=value&id=123
✓ https://example.com/path#section
✓ https://sub.domain.example.co.uk

Should Not Match:
✗ ht://example.com (invalid protocol)
✗ https://example (no TLD)
✗ https://example. (incomplete TLD)
✗ javascript:alert(1) (wrong protocol)
\`\`\`

## Security Considerations

⚠️ **Warning**: Always validate extracted URLs before use!

1. **Sanitize before rendering**
   \`\`\`javascript
   const safeUrl = url.replace(/javascript:/gi, '');
   \`\`\`

2. **Check protocol**
   \`\`\`javascript
   if (!/^https?:/i.test(url)) return false;
   \`\`\`

3. **Validate domain**
   Use allowlist for trusted domains

4. **Rate limit external requests**
   Don't fetch all extracted URLs automatically

## Conclusion

URL extraction with regex is powerful but needs careful pattern design. Consider:
- Your specific use case (validation vs extraction)
- Edge cases (punctuation, Unicode)
- Security implications
- Performance for large texts

**Try it now!** Click "Try It" to experiment with URL extraction patterns.`,
      category: 'Tutorials',
      date: new Date('2024-02-10'),
      readTime: 12,
      author: {
        name: 'Regex Playground Team'
      },
      thumbnail: '🔗',
      tags: ['url', 'extraction', 'scraping', 'intermediate'],
      relatedPosts: ['1', '5'],
      seo: {
        metaDescription: 'Complete guide to extracting URLs from text using regex. Learn patterns for HTTP/HTTPS, markdown, HTML, and more with practical examples.',
        ogTitle: 'Extract URLs from Text: The Ultimate Guide | Regex Playground'
      },
      pattern: {
        regex: 'https?://(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)',
        flags: 'gi',
        testString: 'Visit https://example.com for more info.\nAPI at http://api.test.com:8080/v1/users\nCheck www.example.com (invalid)\nSee https://sub.domain.co.uk?query=test'
      }
    },
    {
      id: '4',
      slug: 'password-strength-validation-security-best-practices',
      title: 'Password Strength Validation: Security Best Practices',
      excerpt: 'Build secure password validation with regex. Learn about complexity requirements, common attacks, and NIST guidelines for modern password policies.',
      content: `# Password Strength Validation: Security Best Practices

Password validation is crucial for application security. This guide covers modern best practices for password validation using regex and security principles.

## Basic Strong Password Pattern

### Standard Requirements
\`\`\`regex
^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$
\`\`\`

This pattern enforces:
- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one digit
- At least one special character

### How It Works

The pattern uses **lookahead assertions**:

1. \`(?=.*[a-z])\` - Lookahead for lowercase
2. \`(?=.*[A-Z])\` - Lookahead for uppercase
3. \`(?=.*\\d)\` - Lookahead for digit
4. \`(?=.*[@$!%*?&])\` - Lookahead for special char
5. \`[A-Za-z\\d@$!%*?&]{8,}\` - Match 8+ allowed characters

## Customizable Patterns

### Very Strong Password (12+ characters)
\`\`\`regex
^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,}$
\`\`\`

### Allow More Special Characters
\`\`\`regex
^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_])[A-Za-z\\d\\W_]{8,}$
\`\`\`

### No Special Character Requirement
\`\`\`regex
^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{8,}$
\`\`\`

### Minimum 10 Characters, Any Complexity
\`\`\`regex
^.{10,}$
\`\`\`

(Modern recommendation: length > complexity)

## NIST Guidelines (2024)

The National Institute of Standards and Technology recommends:

### ✓ DO:
1. **Minimum 8 characters** (12+ recommended)
2. **Maximum length 64+** (don't restrict unnecessarily)
3. **Allow all printable characters** including spaces
4. **Check against breach databases** (Have I Been Pwned)
5. **Require 2FA** for sensitive accounts

### ✗ DON'T:
1. **No composition rules** (must have uppercase, digit, etc.)
2. **No mandatory periodic resets**
3. **No password hints**
4. **No knowledge-based authentication**
5. **No SMS 2FA** (use authenticator apps)

## Modern Approach

Instead of complex regex, validate:

\`\`\`javascript
function validatePassword(password) {
  const errors = [];

  // Length check
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters');
  }

  // Maximum length
  if (password.length > 128) {
    errors.push('Password is too long (max 128 characters)');
  }

  // Check common passwords
  if (isCommonPassword(password)) {
    errors.push('Password is too common');
  }

  // Check breach database
  if (await isBreached(password)) {
    errors.push('Password found in data breach');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
\`\`\`

## Strength Meter Pattern

Calculate password strength score:

\`\`\`javascript
function calculatePasswordStrength(password) {
  let score = 0;

  // Length
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Complexity
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  // Patterns (reduce score)
  if (/^[0-9]+$/.test(password)) score -= 2; // all numbers
  if (/^[a-zA-Z]+$/.test(password)) score -= 2; // all letters
  if (/(.)\\1{2,}/.test(password)) score -= 1; // repeated chars

  // Return strength level
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  if (score <= 6) return 'strong';
  return 'very strong';
}
\`\`\`

## Common Weak Patterns to Detect

### Sequential Characters
\`\`\`regex
(abc|bcd|cde|123|234|345|456)
\`\`\`

### Repeated Characters
\`\`\`regex
(.)\\1{2,}
\`\`\`

### Keyboard Patterns
\`\`\`regex
(qwerty|asdf|zxcv|12345)
\`\`\`

### Common Substitutions
\`\`\`javascript
const commonSubstitutions = {
  'P@ssw0rd': 'Password',
  'P@ssword123': 'Password123',
  '!QAZ2wsx': 'keyboard pattern'
};
\`\`\`

## Attack Vectors to Consider

### 1. Dictionary Attacks
**Don't allow**: password, password123, admin, letmein

### 2. Credential Stuffing
**Require**: Unique passwords per service

### 3. Brute Force
**Implement**: Rate limiting, account lockout

### 4. Social Engineering
**Educate**: Don't reuse personal info (birthday, name)

## Implementation Best Practices

### 1. Client-Side Validation (UX)
\`\`\`javascript
function validatePasswordClient(password) {
  const requirements = {
    minLength: password.length >= 12,
    hasLower: /[a-z]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /\\d/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password)
  };

  return {
    valid: Object.values(requirements).every(Boolean),
    requirements
  };
}
\`\`\`

### 2. Server-Side Validation (Security)
\`\`\`javascript
async function validatePasswordServer(password) {
  // Never trust client validation

  // Length
  if (password.length < 12 || password.length > 128) {
    return { valid: false, error: 'Invalid password length' };
  }

  // Breach check
  const breached = await checkPwnedPasswords(password);
  if (breached) {
    return { valid: false, error: 'Password found in breach' };
  }

  // Common password check
  if (commonPasswords.includes(password.toLowerCase())) {
    return { valid: false, error: 'Password too common' };
  }

  return { valid: true };
}
\`\`\`

### 3. Secure Storage
\`\`\`javascript
// Always hash passwords
const bcrypt = require('bcrypt');
const saltRounds = 12;

async function hashPassword(password) {
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
\`\`\`

## Real-World Regex Patterns

### Enterprise Grade
\`\`\`regex
^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,64}$
\`\`\`

### Banking/Finance
\`\`\`regex
^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':"\\\\|,.<>\\/?])[A-Za-z\\d!@#$%^&*()_+\\-=\\[\\]{};':"\\\\|,.<>\\/?]{14,}$
\`\`\`

### Government/Healthcare
\`\`\`regex
^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9])(?!.*(.)\\1{2,}).{16,}$
\`\`\`
(16+ chars, no 3+ repeated characters)

## Testing Your Pattern

\`\`\`
Strong Passwords:
✓ MyP@ssw0rd!2024
✓ Tr0ub4dor&3
✓ correct-horse-battery-staple
✓ !Qaz@Wsx#Edc$Rfv

Weak Passwords:
✗ password
✗ 12345678
✗ qwerty123
✗ Password (no special char or number)
✗ P@ss1 (too short)
✗ aaaaaa@1A (repeated chars)
\`\`\`

## Password Manager Integration

Encourage password managers:

\`\`\`html
<input
  type="password"
  autocomplete="new-password"
  aria-describedby="password-requirements"
/>
\`\`\`

## Accessibility Considerations

1. **Show/Hide Password Toggle**
2. **Clear error messages**
3. **Real-time feedback**
4. **Screen reader support**

\`\`\`html
<button
  type="button"
  aria-label="Show password"
  onclick="togglePassword()">
  👁️
</button>
\`\`\`

## Conclusion

Modern password security is about:
1. **Length over complexity** (12+ characters)
2. **Breach checking** (Have I Been Pwned API)
3. **2FA/MFA** (Authenticator apps)
4. **User education** (Password managers)
5. **Rate limiting** (Prevent brute force)

Regex validation is just one piece of comprehensive password security.

**Try it!** Click "Try It" to test password validation patterns.`,
      category: 'Advanced Patterns',
      date: new Date('2024-02-15'),
      readTime: 15,
      author: {
        name: 'Regex Playground Team'
      },
      thumbnail: '🔒',
      tags: ['password', 'security', 'validation', 'advanced'],
      relatedPosts: ['1', '5'],
      featured: true,
      seo: {
        metaDescription: 'Learn password validation best practices with regex. Covers NIST guidelines, security patterns, strength meters, and modern authentication methods.',
        ogTitle: 'Password Strength Validation: Security Best Practices | Regex Playground'
      },
      pattern: {
        regex: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
        flags: '',
        testString: 'Weak123\nStrong@123\nP@ssw0rd\ntest\nMySecure!Pass123\nqwerty'
      }
    },
    {
      id: '5',
      slug: 'date-format-validation-common-patterns',
      title: 'Date Format Validation: All Common Patterns',
      excerpt: 'Master date validation with regex. Complete guide covering ISO 8601, US, European, and custom formats with leap year validation.',
      content: `# Date Format Validation: All Common Patterns

Date validation is essential for forms, APIs, and data processing. This guide covers all common date formats and validation techniques.

## ISO 8601 Format (YYYY-MM-DD)

### Basic Pattern
\`\`\`regex
^\\d{4}-\\d{2}-\\d{2}$
\`\`\`

Matches: 2024-02-15

### With Month/Day Validation
\`\`\`regex
^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$
\`\`\`

This ensures:
- Month: 01-12
- Day: 01-31

### Limitations
⚠️ This pattern doesn't validate:
- February 30 (invalid)
- April 31 (invalid)
- Leap years

## US Format (MM/DD/YYYY)

### Basic Pattern
\`\`\`regex
^(0[1-9]|1[0-2])/(0[1-9]|[12]\\d|3[01])/\\d{4}$
\`\`\`

Matches:
- 02/15/2024
- 12/31/2023
- 01/01/2000

### Flexible Separator
\`\`\`regex
^(0[1-9]|1[0-2])[/-](0[1-9]|[12]\\d|3[01])[/-]\\d{4}$
\`\`\`

Matches both:
- 02/15/2024
- 02-15-2024

## European Format (DD/MM/YYYY)

### Basic Pattern
\`\`\`regex
^(0[1-9]|[12]\\d|3[01])/(0[1-9]|1[0-2])/\\d{4}$
\`\`\`

Matches:
- 15/02/2024
- 31/12/2023
- 01/01/2000

## Two-Digit Year Formats

### MM/DD/YY
\`\`\`regex
^(0[1-9]|1[0-2])/(0[1-9]|[12]\\d|3[01])/\\d{2}$
\`\`\`

Matches: 02/15/24

### Handling Century Ambiguity
\`\`\`javascript
function expandYear(yy) {
  const current = new Date().getFullYear();
  const pivot = current % 100 + 20; // 20 years in future

  const year = parseInt(yy);
  if (year <= pivot) {
    return 2000 + year;
  } else {
    return 1900 + year;
  }
}

// Examples:
// expandYear('24') => 2024
// expandYear('99') => 1999
// expandYear('50') => 1950
\`\`\`

## ISO 8601 with Time

### Date and Time
\`\`\`regex
^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$
\`\`\`

Matches: 2024-02-15T14:30:00

### With Timezone
\`\`\`regex
^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:Z|[+-]\\d{2}:\\d{2})$
\`\`\`

Matches:
- 2024-02-15T14:30:00Z
- 2024-02-15T14:30:00+05:30
- 2024-02-15T14:30:00-08:00

### With Milliseconds
\`\`\`regex
^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$
\`\`\`

Matches: 2024-02-15T14:30:00.123Z

## Month Name Formats

### Full Month Name
\`\`\`regex
^(January|February|March|April|May|June|July|August|September|October|November|December)\\s+(0?[1-9]|[12]\\d|3[01]),?\\s+\\d{4}$
\`\`\`

Matches:
- February 15, 2024
- January 1 2024
- December 31, 2023

### Abbreviated Month
\`\`\`regex
^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\s+(0?[1-9]|[12]\\d|3[01]),?\\s+\\d{4}$
\`\`\`

Matches:
- Feb 15, 2024
- Jan 1 2024
- Dec 31, 2023

## Leap Year Validation

### February Validation with Leap Year
\`\`\`javascript
function isValidDate(year, month, day) {
  // Month is 1-12, day is 1-31

  // Days in each month
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Check leap year
  if (month === 2) {
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    if (isLeapYear) {
      return day <= 29;
    }
  }

  return day <= daysInMonth[month - 1];
}

// Examples:
isValidDate(2024, 2, 29); // true (leap year)
isValidDate(2023, 2, 29); // false (not leap year)
isValidDate(2024, 4, 31); // false (April has 30 days)
\`\`\`

### Regex with Leap Year (Complex)
\`\`\`regex
^(?:(?:(?:(?:(?:[13579][26]|[2468][048])00)|(?:[0-9]{2}(?:(?:[13579][26])|(?:[2468][048]|0[48]))))-(?:(?:(?:09|04|06|11)-(?:0[1-9]|1[0-9]|2[0-9]|30))|(?:(?:01|03|05|07|08|10|12)-(?:0[1-9]|1[0-9]|2[0-9]|3[01]))|(?:02-(?:0[1-9]|1[0-9]|2[0-9]))))|(?:[0-9]{4}-(?:(?:(?:09|04|06|11)-(?:0[1-9]|1[0-9]|2[0-9]|30))|(?:(?:01|03|05|07|08|10|12)-(?:0[1-9]|1[0-9]|2[0-9]|3[01]))|(?:02-(?:0[1-9]|1[0-9]|2[0-8])))))$
\`\`\`

⚠️ **Recommendation**: Don't use this complex regex. Use JavaScript Date validation instead.

## Relative Date Patterns

### Words
\`\`\`regex
^(today|tomorrow|yesterday)$
\`\`\`

### Relative
\`\`\`regex
^(\\d+)\\s+(day|week|month|year)s?\\s+(ago|from now)$
\`\`\`

Matches:
- 2 days ago
- 3 weeks from now
- 1 year ago

## Date Range Patterns

### Dash Separated
\`\`\`regex
^(\\d{4}-\\d{2}-\\d{2})\\s+to\\s+(\\d{4}-\\d{2}-\\d{2})$
\`\`\`

Matches: 2024-01-01 to 2024-12-31

### Slash Separated
\`\`\`regex
^(\\d{2}/\\d{2}/\\d{4})\\s*-\\s*(\\d{2}/\\d{2}/\\d{4})$
\`\`\`

Matches: 01/01/2024 - 12/31/2024

## Best Practices

### 1. Use Native Date Objects
\`\`\`javascript
function validateDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}
\`\`\`

### 2. Parse Then Validate
\`\`\`javascript
function parseAndValidate(input, format) {
  // First, use regex to extract parts
  const pattern = /^(\\d{4})-(\\d{2})-(\\d{2})$/;
  const match = input.match(pattern);

  if (!match) return false;

  const [, year, month, day] = match;

  // Then validate with Date object
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === parseInt(year) &&
         date.getMonth() === parseInt(month) - 1 &&
         date.getDate() === parseInt(day);
}
\`\`\`

### 3. Normalize Before Storage
\`\`\`javascript
function normalizeDate(input) {
  // Accept various formats, store as ISO 8601
  const date = new Date(input);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}
\`\`\`

### 4. Timezone Awareness
\`\`\`javascript
function toUTC(dateString) {
  return new Date(dateString + 'T00:00:00Z');
}

function toLocal(isoString) {
  return new Date(isoString).toLocaleDateString();
}
\`\`\`

## Common Pitfalls

### 1. Month Off-by-One
\`\`\`javascript
// JavaScript months are 0-indexed!
new Date(2024, 1, 15); // February 15, not January!
\`\`\`

### 2. Timezone Issues
\`\`\`javascript
// This might be different dates in different timezones
new Date('2024-02-15'); // Might be Feb 14 or 15 depending on TZ
\`\`\`

### 3. Parsing Ambiguity
\`\`\`javascript
// Is this MM/DD or DD/MM?
'03/04/2024' // March 4 or April 3?
\`\`\`

## Library Recommendations

Instead of complex regex:

### Day.js
\`\`\`javascript
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const isValid = dayjs('2024-02-15', 'YYYY-MM-DD', true).isValid();
\`\`\`

### date-fns
\`\`\`javascript
import { parse, isValid } from 'date-fns';

const date = parse('15/02/2024', 'dd/MM/yyyy', new Date());
if (isValid(date)) {
  console.log('Valid date');
}
\`\`\`

### Luxon
\`\`\`javascript
import { DateTime } from 'luxon';

const dt = DateTime.fromFormat('02/15/2024', 'MM/dd/yyyy');
if (dt.isValid) {
  console.log('Valid date');
}
\`\`\`

## Testing Strategy

\`\`\`
Valid Dates:
✓ 2024-02-15 (ISO)
✓ 02/15/2024 (US)
✓ 15/02/2024 (EU)
✓ 2024-02-29 (Leap year)
✓ February 15, 2024 (Text)

Invalid Dates:
✗ 2024-02-30 (Feb doesn't have 30 days)
✗ 2023-02-29 (Not a leap year)
✗ 2024-04-31 (April has 30 days)
✗ 2024-13-01 (Month 13)
✗ 2024-00-01 (Month 0)
\`\`\`

## Conclusion

Date validation is complex. Best approach:
1. Use regex for **format** validation
2. Use Date objects for **logical** validation
3. Consider using date libraries for production
4. Always normalize dates before storage
5. Be explicit about timezone handling

**Try it!** Click "Try It" to test date validation patterns.`,
      category: 'Tutorials',
      date: new Date('2024-02-20'),
      readTime: 14,
      author: {
        name: 'Regex Playground Team'
      },
      thumbnail: '📅',
      tags: ['date', 'validation', 'formats', 'intermediate'],
      relatedPosts: ['1', '4'],
      seo: {
        metaDescription: 'Complete guide to date format validation with regex. Covers ISO 8601, US, European formats, leap years, and best practices.',
        ogTitle: 'Date Format Validation: All Common Patterns | Regex Playground'
      },
      pattern: {
        regex: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
        flags: '',
        testString: '2024-02-15\n2024-12-31\n2024-13-01\n2024-02-30\n2024-00-01\n24-02-15'
      }
    }
  ];

  constructor() {}

  getAllPosts(): Observable<BlogPost[]> {
    return of(this.posts);
  }

  getPostBySlug(slug: string): Observable<BlogPost | undefined> {
    const post = this.posts.find(p => p.slug === slug);
    return of(post);
  }

  getPostsByCategory(category: string): Observable<BlogPost[]> {
    if (category === 'All') {
      return of(this.posts);
    }
    const filtered = this.posts.filter(p => p.category === category);
    return of(filtered);
  }

  getFeaturedPosts(): Observable<BlogPost[]> {
    const featured = this.posts.filter(p => p.featured);
    return of(featured);
  }

  getRelatedPosts(postId: string): Observable<BlogPost[]> {
    const post = this.posts.find(p => p.id === postId);
    if (!post || !post.relatedPosts) {
      return of([]);
    }
    const related = this.posts.filter(p => post.relatedPosts.includes(p.id));
    return of(related);
  }

  searchPosts(query: string): Observable<BlogPost[]> {
    const lowerQuery = query.toLowerCase();
    const results = this.posts.filter(p =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.excerpt.toLowerCase().includes(lowerQuery) ||
      p.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      p.content.toLowerCase().includes(lowerQuery)
    );
    return of(results);
  }

  getRecentPosts(limit: number = 3): Observable<BlogPost[]> {
    const sorted = [...this.posts].sort((a, b) => b.date.getTime() - a.date.getTime());
    return of(sorted.slice(0, limit));
  }
}
