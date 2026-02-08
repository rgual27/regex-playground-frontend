import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-api-docs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="api-docs">
      <div class="header">
        <h1>API Documentation</h1>
        <p class="subtitle">Complete reference for the Regex Playground API</p>
      </div>

      <div class="docs-container">
        <!-- Getting Started -->
        <section class="doc-section">
          <h2>Getting Started</h2>
          <p>The Regex Playground API allows you to validate and test regular expressions programmatically. To use the API, you'll need an API key.</p>

          <div class="info-box">
            <h3>API Base URL</h3>
            <code class="url">https://api.regexplayground.com/api/v1</code>
          </div>

          <h3>Authentication</h3>
          <p>All API requests require authentication using an API key. Include your API key in the <code>X-API-Key</code> header:</p>
          <div class="code-block">
            <pre><code>X-API-Key: rp_your_api_key_here</code></pre>
          </div>
        </section>

        <!-- Rate Limits -->
        <section class="doc-section">
          <h2>Rate Limits</h2>
          <p>Rate limits are enforced based on your subscription tier:</p>

          <div class="rate-limits-table">
            <table>
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Requests/Month</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="tier-badge tier-free">FREE</span></td>
                  <td>100</td>
                  <td>$0</td>
                </tr>
                <tr>
                  <td><span class="tier-badge tier-pro">PRO</span></td>
                  <td>1,000</td>
                  <td>$9/month</td>
                </tr>
                <tr>
                  <td><span class="tier-badge tier-api">API</span></td>
                  <td>10,000</td>
                  <td>$19/month</td>
                </tr>
                <tr>
                  <td><span class="tier-badge tier-team">TEAM</span></td>
                  <td>50,000</td>
                  <td>$49/month</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>Rate limit information is included in response headers:</p>
          <ul>
            <li><code>X-RateLimit-Limit</code>: Total requests allowed per month</li>
            <li><code>X-RateLimit-Remaining</code>: Requests remaining in current period</li>
            <li><code>X-RateLimit-Reset</code>: Date when the limit resets</li>
          </ul>
        </section>

        <!-- Endpoints -->
        <section class="doc-section">
          <h2>Endpoints</h2>

          <!-- Validate Endpoint -->
          <div class="endpoint">
            <div class="endpoint-header">
              <span class="method post">POST</span>
              <span class="path">/validate</span>
            </div>
            <p>Validates a regular expression pattern against a test string.</p>

            <h4>Request Body</h4>
            <div class="code-block">
              <pre><code>{
  "pattern": "\\d{3}-\\d{4}",
  "testString": "Call me at 555-1234",
  "flags": "g"
}</code></pre>
            </div>

            <h4>Parameters</h4>
            <table class="params-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Type</th>
                  <th>Required</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>pattern</code></td>
                  <td>string</td>
                  <td>Yes</td>
                  <td>The regular expression pattern</td>
                </tr>
                <tr>
                  <td><code>testString</code></td>
                  <td>string</td>
                  <td>Yes</td>
                  <td>The text to test against</td>
                </tr>
                <tr>
                  <td><code>flags</code></td>
                  <td>string</td>
                  <td>No</td>
                  <td>Regex flags (g, i, m, s, u, y)</td>
                </tr>
              </tbody>
            </table>

            <h4>Response</h4>
            <div class="code-block">
              <pre><code>{
  "isValid": true,
  "matches": [
    {
      "match": "555-1234",
      "start": 11,
      "end": 19,
      "groups": []
    }
  ],
  "matchCount": 1
}</code></pre>
            </div>

            <h4>Example Requests</h4>
            <div class="tabs">
              <button class="tab active" (click)="selectTab('curl')">cURL</button>
              <button class="tab" (click)="selectTab('javascript')">JavaScript</button>
              <button class="tab" (click)="selectTab('python')">Python</button>
              <button class="tab" (click)="selectTab('java')">Java</button>
            </div>

            <div class="code-block" *ngIf="selectedTab === 'curl'">
              <pre><code>curl -X POST https://api.regexplayground.com/api/v1/validate \\
  -H "X-API-Key: rp_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "pattern": "\\\\d{3}-\\\\d{4}",
    "testString": "Call me at 555-1234",
    "flags": "g"
  }'</code></pre>
            </div>

            <div class="code-block" *ngIf="selectedTab === 'javascript'">
              <pre><code>const response = await fetch('https://api.regexplayground.com/api/v1/validate', {
  method: 'POST',
  headers: {
    'X-API-Key': 'rp_your_api_key_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    pattern: '\\\\d{3}-\\\\d{4}',
    testString: 'Call me at 555-1234',
    flags: 'g'
  })
});

const data = await response.json();
console.log(data);</code></pre>
            </div>

            <div class="code-block" *ngIf="selectedTab === 'python'">
              <pre><code>import requests

url = 'https://api.regexplayground.com/api/v1/validate'
headers = {
    'X-API-Key': 'rp_your_api_key_here',
    'Content-Type': 'application/json'
}
data = {
    'pattern': r'\\d{3}-\\d{4}',
    'testString': 'Call me at 555-1234',
    'flags': 'g'
}

response = requests.post(url, json=data, headers=headers)
print(response.json())</code></pre>
            </div>

            <div class="code-block" *ngIf="selectedTab === 'java'">
              <pre><code>import java.net.http.*;
import java.net.URI;

HttpClient client = HttpClient.newHttpClient();
String json = """
{
  "pattern": "\\\\d{3}-\\\\d{4}",
  "testString": "Call me at 555-1234",
  "flags": "g"
}
""";

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.regexplayground.com/api/v1/validate"))
    .header("X-API-Key", "rp_your_api_key_here")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(json))
    .build();

HttpResponse<String> response = client.send(request,
    HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());</code></pre>
            </div>
          </div>

          <!-- Rate Limit Info Endpoint -->
          <div class="endpoint">
            <div class="endpoint-header">
              <span class="method get">GET</span>
              <span class="path">/rate-limit</span>
            </div>
            <p>Get current rate limit status for your API key.</p>

            <h4>Response</h4>
            <div class="code-block">
              <pre><code>{
  "valid": true,
  "tier": "API",
  "limit": 10000,
  "used": 243,
  "remaining": 9757,
  "resetDate": "2026-03-01T00:00:00"
}</code></pre>
            </div>

            <h4>Example Request</h4>
            <div class="code-block">
              <pre><code>curl -X GET https://api.regexplayground.com/api/v1/rate-limit \\
  -H "X-API-Key: rp_your_api_key_here"</code></pre>
            </div>
          </div>
        </section>

        <!-- Error Handling -->
        <section class="doc-section">
          <h2>Error Handling</h2>
          <p>The API uses standard HTTP status codes:</p>

          <div class="error-codes">
            <div class="error-code">
              <h4>400 Bad Request</h4>
              <p>Invalid request parameters or malformed JSON</p>
              <div class="code-block">
                <pre><code>{
  "error": "Validation failed",
  "message": "Invalid regex pattern"
}</code></pre>
              </div>
            </div>

            <div class="error-code">
              <h4>401 Unauthorized</h4>
              <p>Missing or invalid API key</p>
              <div class="code-block">
                <pre><code>{
  "error": "Invalid API key",
  "message": "The provided API key is not valid"
}</code></pre>
              </div>
            </div>

            <div class="error-code">
              <h4>429 Too Many Requests</h4>
              <p>Rate limit exceeded</p>
              <div class="code-block">
                <pre><code>{
  "error": "Rate limit exceeded",
  "message": "You have exceeded your monthly rate limit",
  "limit": 10000,
  "used": 10000,
  "resetDate": "2026-03-01T00:00:00"
}</code></pre>
              </div>
            </div>
          </div>
        </section>

        <!-- Best Practices -->
        <section class="doc-section">
          <h2>Best Practices</h2>
          <ul>
            <li>Store your API key securely and never commit it to version control</li>
            <li>Use environment variables to manage API keys</li>
            <li>Implement retry logic with exponential backoff for rate limit errors</li>
            <li>Cache responses when possible to reduce API calls</li>
            <li>Monitor your rate limit headers to avoid hitting limits</li>
            <li>Upgrade your plan if you consistently hit rate limits</li>
          </ul>
        </section>

        <!-- Get Started CTA -->
        <section class="cta-section">
          <h2>Ready to Get Started?</h2>
          <p>Create an API key in your account settings to start using the Regex Playground API.</p>
          <a href="/account/api-keys" class="btn btn-primary">Manage API Keys</a>
          <a href="/pricing" class="btn btn-secondary">View Pricing</a>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .api-docs {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;

      h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .subtitle {
        font-size: 1.125rem;
        color: var(--text-secondary);
      }
    }

    .docs-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .doc-section {
      margin-bottom: 4rem;

      h2 {
        font-size: 2rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--border-color);
      }

      h3 {
        font-size: 1.5rem;
        margin: 2rem 0 1rem 0;
      }

      h4 {
        font-size: 1.25rem;
        margin: 1.5rem 0 0.75rem 0;
      }

      p {
        line-height: 1.6;
        color: var(--text-secondary);
        margin-bottom: 1rem;
      }

      ul {
        list-style: disc;
        margin-left: 1.5rem;
        line-height: 1.8;
        color: var(--text-secondary);
      }

      code {
        background: var(--bg-secondary);
        padding: 0.125rem 0.375rem;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        font-size: 0.875rem;
        color: var(--primary-color);
      }
    }

    .info-box {
      background: #3b82f610;
      border: 1px solid #3b82f630;
      border-radius: 8px;
      padding: 1.5rem;
      margin: 1.5rem 0;

      h3 {
        margin: 0 0 0.75rem 0;
        font-size: 1.125rem;
      }

      .url {
        display: block;
        background: var(--bg-primary);
        padding: 0.75rem;
        border-radius: 6px;
        font-size: 1rem;
      }
    }

    .code-block {
      background: #1e1e1e;
      border-radius: 8px;
      overflow: hidden;
      margin: 1rem 0;

      pre {
        margin: 0;
        padding: 1.5rem;
        overflow-x: auto;

        code {
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
          line-height: 1.6;
          color: #d4d4d4;
          background: transparent;
          padding: 0;
        }
      }
    }

    .rate-limits-table {
      margin: 1.5rem 0;
      overflow-x: auto;

      table {
        width: 100%;
        border-collapse: collapse;

        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }

        th {
          background: var(--bg-secondary);
          font-weight: 600;
        }

        tbody tr:hover {
          background: var(--bg-secondary);
        }
      }
    }

    .params-table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;

      th, td {
        padding: 0.75rem;
        text-align: left;
        border: 1px solid var(--border-color);
      }

      th {
        background: var(--bg-secondary);
        font-weight: 600;
      }

      code {
        background: var(--bg-tertiary);
      }
    }

    .tier-badge {
      padding: 0.375rem 0.75rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;

      &.tier-free {
        background: #6b728020;
        color: #6b7280;
      }

      &.tier-pro {
        background: #3b82f620;
        color: #3b82f6;
      }

      &.tier-api {
        background: #8b5cf620;
        color: #8b5cf6;
      }

      &.tier-team {
        background: #10b98120;
        color: #10b981;
      }
    }

    .endpoint {
      background: var(--bg-primary);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 2rem;
      margin: 2rem 0;

      .endpoint-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;

        .method {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.875rem;
          text-transform: uppercase;

          &.get {
            background: #10b98120;
            color: #10b981;
          }

          &.post {
            background: #3b82f620;
            color: #3b82f6;
          }
        }

        .path {
          font-family: 'Courier New', monospace;
          font-size: 1.125rem;
          font-weight: 600;
        }
      }
    }

    .tabs {
      display: flex;
      gap: 0.5rem;
      margin: 1rem 0 0 0;
      border-bottom: 2px solid var(--border-color);

      .tab {
        padding: 0.75rem 1.5rem;
        background: transparent;
        border: none;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        font-weight: 500;
        color: var(--text-secondary);
        transition: all 0.2s;
        margin-bottom: -2px;

        &:hover {
          color: var(--text-primary);
        }

        &.active {
          color: var(--primary-color);
          border-bottom-color: var(--primary-color);
        }
      }
    }

    .error-codes {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      .error-code {
        h4 {
          margin: 0 0 0.5rem 0;
          color: #ef4444;
        }

        p {
          margin: 0 0 0.75rem 0;
        }
      }
    }

    .cta-section {
      text-align: center;
      background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
      border: 2px solid #667eea40;
      border-radius: 12px;
      padding: 3rem 2rem;

      h2 {
        border: none;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1.125rem;
        margin-bottom: 2rem;
      }

      .btn {
        margin: 0 0.5rem;
      }
    }

    @media (max-width: 768px) {
      .api-docs {
        padding: 1rem;
      }

      .header h1 {
        font-size: 2rem;
      }

      .endpoint {
        padding: 1rem;
      }

      .tabs {
        overflow-x: auto;
      }
    }
  `]
})
export class ApiDocsComponent {
  selectedTab = 'curl';

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
