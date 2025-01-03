# NgxScriptOptimizer

**A lightweight Angular library designed to supercharge your third-party script handling.**

---

### **Note**:
Supports **Angular 15** onwards. Not compatible with versions older than Angular 15.

---

## Features 🎯

### **Optimize Your Third-Party Scripts:**
Effortlessly improve the performance and management of third-party JavaScript, whether inline or external, while minimizing Total Blocking Time (TBT) and First Contentful Paint (FCP) improving page speed and performance.

### **Seamless Integration with SSR and CSR:**
Designed for both Server-Side Rendering (SSR) and Client-Side Rendering (CSR), ensuring compatibility and flexibility for modern web applications.

### **Asynchronous and Efficient Loading:**
Supports multiple loading strategies:
- **Eager:** Runs scripts as soon as they are available.
- **Lazy:** Defer execution until the page is fully loaded.
- **Idle:** Leverages `requestIdleCallback` to execute when the main thread is free.
- **Worker:** Runs scripts in a Web Worker for non-blocking execution.

### **Customizable Script Placement:**
Choose where scripts are appended (head or body), giving you full control over your HTML structure.

### **Lightning Fast & Lightweight:**
Minimal impact on your bundle size with a developer-friendly API that focuses on speed and simplicity.

---

## **Who Benefits from NgxScriptOptimizer?**

### Industries That Rely Heavily on Third-Party Scripts:
1. **E-Commerce:** Enhance loading speed for analytics, payment gateways, and dynamic content.
2. **Media & Publishing:** Optimize ads, comments plugins, and embedded videos.
3. **SaaS Platforms:** Load tracking tools and third-party SDKs efficiently.
4. **Finance:** Ensure secure and performant integrations of banking APIs and fraud detection tools.
5. **Education:** Optimize learning platforms with third-party integrations like video conferencing or quiz tools.

---

## **Installation**

```bash
npm install ngx-script-optimizer
```

---

## **Usage**

### **Basic Example**

Import the package and include it in your standalone Angular component:

```typescript
import { ScriptOptimizerComponent } from 'ngx-script-optimizer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ScriptOptimizerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
```

In your HTML:

```html
<ngx-script-optimizer
  src="https://example.com/api.js"
  (onLoad)="runAfterLoad()"
  renderStrategy="client"
  loadStrategy="lazy"
  appendTo="head"
  contentType="text/javascript"
></ngx-script-optimizer>
```

---

## **Detailed Examples**

### **1. Server-Side Rendering (SSR)**
##### **Note**: Please note that for SSR, only the `lazy` and `eager` loading strategies are available. For CSR all options are available.
For SSR, scripts are rendered and run on the server, becoming part of the initial HTML sent to the browser.

```html
<ngx-script-optimizer
  [scriptContent]="'console.log(\'SSR Script Executed\');'"
  renderStrategy="server"
  loadStrategy="eager"
  appendTo="body"
  contentType="text/javascript"
></ngx-script-optimizer>
```

### **2. Client-Side Rendering (CSR)**

#### **Lazy Loading Example**

Load the script after the page content has finished loading. The `lazy` load strategy will attach the `defer` flag to the script tag:

```html
<ngx-script-optimizer
  src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"
  renderStrategy="client"
  loadStrategy="lazy"
  appendTo="head"
  contentType="text/javascript"
  (onLoad)="console.log('Moment.js loaded')"
></ngx-script-optimizer>
```

#### **Idle Loading Example**
Execute the script when the browser's main thread is idle:

```html
<ngx-script-optimizer
  [scriptContent]="'console.log(\'Idle Script Executed\');'"
  renderStrategy="client"
  loadStrategy="idle"
  appendTo="head"
  contentType="text/javascript"
></ngx-script-optimizer>
```

#### **Web Worker Execution Example**

Run a script in a Web Worker:
##### **Note**: Please note that only the `scriptContent` attribute is currently compatible with the web worker option.
```html
<ngx-script-optimizer
  [scriptContent]="`onmessage = function(e) {
    const result = e.data.num1 * e.data.num2;
    postMessage(result);
  };`"
  renderStrategy="client"
  loadStrategy="worker"
  appendTo="body"
  contentType="text/javascript"
></ngx-script-optimizer>
```

---

## **Options**

| Input            | Value            | Description                                                                 |
|------------------|------------------|-----------------------------------------------------------------------------|
| `scriptContent`  | `string`         | Inline JavaScript code to execute. Cannot be run simultaneoulsy with the `src` attribute.                                          |
| `src`            | `string`         | External script URL (not supported in Web Worker mode). Cannot be run simultaneoulsy with the `scriptContent` attribute.                    |
| `renderStrategy` | `server` / `client` | Determines where the script runs (SSR or CSR). Default value is `server`.                           |
| `loadStrategy`   | `eager` / `lazy` / `idle` / `worker` | Controls when and how the script loads. Default value is `lazy`.                                     |
| `appendTo`       | `head` / `body`  | Specifies where to attach the script in the DOM. Default value is `head`                         |
| `contentType`    | `text/javascript` | Specifies the MIME type of the script. Default value is `text/javascript`                                     |
| `(onLoad)`       | `function`       | Event triggered immediately after the script is executed.                            |

---

## **Default Values**
- **Render Strategy:** `server`
- **Load Strategy:** `lazy`
- **Append To:** `head`
- **Content Type:** `text/javascript`

---

## **Contributing**

Feel free to contribute to this library! Raise issues, suggest features, or submit pull requests.

---

## **License**

This project is licensed under the MIT License.

