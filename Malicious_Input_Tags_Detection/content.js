console.log("✅ Content script running on:", window.location.href);

// Check#1 -- This block of code houses the number of input tags and the number of label tags. So, we have inputs vs. labels
const inputs_num = Number(document.querySelectorAll("input").length);
const labels_num = Number(document.querySelectorAll("label").length);

/*I started from basing the logic solely on the difference between what is being displayed (label tag) vs what is being requested (input tag)
buuuuuuuut, this alone would rake in mostly false positives. So, I changed the logic a little bit and added a little razzle dazzle I think.
*/

//first list. Authentication & account tags
const auth_info = ["username", "user", "user_name", "login", "userId", "email", "userEmail", "password", "pass", "pwd", "current_password", "new_password", "confirm_password", "passwd", "passwordConfirm", "pass_confirm", "secret", "master_password", "masterPass"];
let has_auth_tag = false;

//Payment & card data tags
const payment_info = ["card_number", "cardNumber", "cc_number", "ccnum", "ccnum1", "pan", "card_name", "name_on_card", "cardholder", "cvv", "cvc", "cc_cvv", "card_cvv", "security_code", "expiry", "exp_date", "exp_month", "exp_year", "card_expiry", "mm_yy", "billing_address", "billing_zip", "billing_postcode", "billing_city", "billing_state", "stripeToken", "payment_token", "token", "cc_month", "cc_year"];
let has_payment_tag = false;

//Bank & financial account information
const bank_info = ["bank_account", "account_number", "acct_no", "routing_number", "sort_code", "routing", "iban", "swift", "bsb", "aba", "account_routing"];
let has_bank_tag = false;

//Personally Identifiable Information
const pii_info = ["first_name", "last_name", "firstname", "lastname", "full_name", "givenName", "familyName", "dob", "date_of_birth", "birthdate", "age", "ssn", "social_security_number", "national_id", "nin", "nid", "passport_number", "passportNo", "diver_license", "dl_number", "license_no", "mother_maiden_name", "security_question", "security_answer"];
let has_pii_tag = false;

//Contact Information
const cont_info = ["email", "email_address", "user_email", "phone", "phone_number", "mobile", "mobile_number", "tel", "telephone", "msisdn"];
let has_cont_tag = false;

//Location Information
const loc_info = ["address", "address1", "address_line1", "street", "street_address", "city", "region", "state", "province", "country", "postal", "zipcode", "zip_code", "post_code", "postalcode", "postacode", "country", "country_code", "country_iso", "lattitude", "longitude", "lat", "lng", "geo"];
let has_loc_tag = false;

//Employment Information
const emp_info = ["company", "organization", "employer", "job_title", "upload_id", "upload_file", "file_upload"];
let has_emp_tag = false;

//Health & Insurance Information
const health_info = ["health_info", "medical_record", "insurance_number", "policy_number"];
let has_health_tag = false;

//One Time Codes and MFA Tokens
const mfa_info = ["otp", "one_time_code", "2fa_code", "verification_code", "auth_code", "totp", "token", "auth_token", "access_token", "api_key", "secret_key", "secret"];
let has_mfa_tag = false;

// Misc High Risk tag names
const misc_info = ["cc_cvv", "cvv2", "dob_day", "dob_month", "dob_year", "pin", "pin_code", "security_pin", "motherName", "fatherName", "marital_status", "children_count"];
let has_misc_tag = false;

//This line takes all the tag names etc and place them into an Array.
const inputs = Array.from(document.querySelectorAll("input, select, textarea"));




//**************************Now let's match!**************************



//This block of code is used to remove duplicates.... It makes the result look much better.
function cleanAttrs(input) {
    return Array.from(
        new Set(
            `${input.id} ${input.name} ${input.placeholder}`
                .toLowerCase()
                .split(/\s+/)
                .filter(Boolean)
        )
    ).join(" ");
}



// Use Set to prevent duplicate entries
const matchesSet = new Set();

// Category configuration
const categories = [
    { list: payment_info, flag: () => has_payment_tag = true },
    { list: auth_info, flag: () => has_auth_tag = true },
    { list: bank_info, flag: () => has_bank_tag = true },
    { list: pii_info, flag: () => has_pii_tag = true },
    { list: cont_info, flag: () => has_cont_tag = true },
    { list: loc_info, flag: () => has_loc_tag = true },
    { list: emp_info, flag: () => has_emp_tag = true },
    { list: health_info, flag: () => has_health_tag = true },
    { list: mfa_info, flag: () => has_mfa_tag = true },
    { list: misc_info, flag: () => has_misc_tag = true }
];

// Main loop
inputs.forEach(input => {
    const attrs = cleanAttrs(input);

    categories.forEach(category => {
        category.list.forEach(tag => {
            if (attrs.includes(tag.toLowerCase())) {
                matchesSet.add(attrs); //  Again, no duplicates!
                category.flag();       //  Set correct flag
            }
        });
    });
});

// Final clean results
const matches = Array.from(matchesSet);

//Div setup to display info
const greeting = document.createElement("div");

let results = [];

let count = 1; //Used to list the tags found.

// Add other checks
if (has_payment_tag) {
    results.push(`${count}.Payment info requested 💳`);
    count++;
}

if (has_auth_tag) {
    results.push(`${count}. Authentication info requested🔒`);
    count++;
}

if (has_mfa_tag) {
    results.push(`${count}. MFA or Token info requested🔑`);
    count++;
}

if (has_health_tag) {
    results.push(`${count}. Health/Insurance info requested🏥`);
    count++;
}

if (has_emp_tag) {
    results.push(`${count}. Employment info requested💼`);
    count++;
}

if (has_bank_tag) {
    results.push(`${count}. Banking info requested🏦`);
    count++;
}

if (has_loc_tag) {
    results.push(`${count}. Location info requested📍`);
    count++;
}

if (has_cont_tag) {
    results.push(`${count}. Contact info requested☎️`);
    count++;
}

if (has_pii_tag) {
    results.push(`${count}. PII info requested🪪`);
    count++;
}

if (has_misc_tag) {
    results.push(`${count}. Sensitive info requested⚠️`);
    count++;
}


greeting.style.color = "black"; //Font color. Just incase a better color could work

// Display all results on separate lines
greeting.innerHTML = results.join("<br>");


//button to show exact input tag terms 
const showTagsBtn = document.createElement("button");
showTagsBtn.textContent = "Show Detected Tags";
showTagsBtn.style.width = "100%";
showTagsBtn.style.padding = "8px";
showTagsBtn.style.border = "none";
showTagsBtn.style.borderRadius = "6px";
showTagsBtn.style.cursor = "pointer";
showTagsBtn.style.background = "#0078d7";
showTagsBtn.style.color = "white";
showTagsBtn.style.fontSize = "13px";
greeting.appendChild(showTagsBtn);

//Show tags action function
showTagsBtn.addEventListener("click", () => {
    const tags = matches;
    if (tags.length === 0) {
        greeting.innerHTML = "✅ No suspicious tags found.";
    } else {
        greeting.innerHTML = tags.map(t => `• <code>${t}</code>`).join("<br>");

        //Also display the close button for the tag results shown
        const resultCloseBtn = document.createElement("button");
        resultCloseBtn.textContent = "✖";
        resultCloseBtn.title = "Hide detected tags";
        resultCloseBtn.style.position = "absolute";
        resultCloseBtn.style.top = "4px";
        resultCloseBtn.style.right = "6px";
        resultCloseBtn.style.background = "transparent";
        resultCloseBtn.style.border = "none";
        resultCloseBtn.style.fontSize = "14px";
        resultCloseBtn.style.cursor = "pointer";
        resultCloseBtn.style.color = "#555";
        greeting.appendChild(resultCloseBtn);

        // === Hide results when close is clicked ===
        resultCloseBtn.addEventListener("click", () => {
            greeting.style.display = "none";
        });
    }
    greeting.style.display = "block";
});


//Close button just incase it is blocking something
const closeBtn = document.createElement("button");
closeBtn.textContent = "✖";
closeBtn.title = "Hide this panel temporarily";
closeBtn.style.position = "absolute";
closeBtn.style.top = "6px";
closeBtn.style.right = "8px";
closeBtn.style.background = "transparent";
closeBtn.style.border = "none";
closeBtn.style.fontSize = "16px";
closeBtn.style.cursor = "pointer";
closeBtn.style.color = "#666";
closeBtn.style.padding = "0";

// Append it before other content
greeting.appendChild(closeBtn);

// === Hide overlay on click ===
closeBtn.addEventListener("click", () => {
    greeting.style.display = "none";
});


// Tags panel style (Main panel display)
greeting.style.position = "fixed";
greeting.style.top = "10px";
greeting.style.right = "10px";
greeting.style.fontWeight = "bold";
greeting.style.background = "white";
greeting.style.zIndex = "999999";
greeting.style.padding = "8px 12px";
greeting.style.border = "1px solid #ccc";
greeting.style.borderRadius = "8px";
greeting.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";

document.body.appendChild(greeting);


//======================================== Clipboard Detector ================================================


// Vars to input captured data.
const ClipboardDetector = (() => {
  let _capturedText = '';
  let _captureSource = '';
  let _revealed = false;

  // ***************Let's redact what has been caught just incase*********************

  function redactValue(str) {
    if (!str || str.length === 0) return '(empty)';

    const emailRe = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
    const phoneRe = /(\+?\d[\d\s\-().]{6,}\d)/g;
    const cardRe  = /\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/g;
    const tokenRe = /\b[A-Za-z0-9\-_]{20,}\b/g;

    let out = str
      .replace(emailRe, m => {
        const [user, domain] = m.split('@');
        return user[0] + '***@' + domain.replace(/./g, '*').slice(0, -3) + domain.slice(-3);
      })
      .replace(phoneRe, m => m.slice(0, 3) + '****' + m.slice(-2))
      .replace(cardRe,  m => '**** **** **** ' + m.replace(/\D/g, '').slice(-4))
      .replace(tokenRe, m => m.slice(0, 4) + '•'.repeat(Math.min(m.length - 6, 12)) + m.slice(-2));

    return out.length > 120 ? out.slice(0, 120) + ' …' : out;
  }

  // ********************Classification******************************

  function classifyContent(str) {
    if (!str) return { label: 'data', risk: 'medium' };
    if (/[a-zA-Z0-9._%+\-]+@/.test(str))                             return { label: 'email address', risk: 'high' };
    if (/\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/.test(str)) return { label: 'card number', risk: 'high' };
    if (/\b[A-Za-z0-9\-_]{30,}\b/.test(str))                         return { label: 'token / API key', risk: 'high' };
    if (/https?:\/\//.test(str))                                      return { label: 'URL', risk: 'low' };
    if (str.length > 60)                                              return { label: 'text block', risk: 'medium' };
    return { label: 'short text', risk: 'low' };
  }

  // *****************************Clipboard interception*****************************

  function interceptClipboard(onDetected) {
    // Method 1: Intercept document.execCommand('copy')
    const origExec = document.execCommand.bind(document);
    document.execCommand = function (cmd, ...args) {
      if (cmd === 'copy') {
        const selection = window.getSelection()?.toString() || '';
        if (selection) onDetected(selection, 'execCommand');
      }
      return origExec(cmd, ...args);
    };

    // Method 2: Intercept the async Clipboard API (navigator.clipboard.writeText)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      const origWrite = navigator.clipboard.writeText.bind(navigator.clipboard);
      navigator.clipboard.writeText = function (text) {
        onDetected(text, 'clipboard API');
        return origWrite(text);
      };
    }

    // Method 3: Intercept ClipboardEvent on 'copy'
    document.addEventListener('copy', (e) => {
      const text = e.clipboardData?.getData('text/plain') ||
                   window.getSelection()?.toString() || '';
      if (text) onDetected(text, 'copy event');
    }, true);
  }

  // *******************Toggle redacted preview*************************

  function toggleReveal(boxEl, btnEl) {
    _revealed = !_revealed;
    if (_revealed) {
      boxEl.textContent = redactValue(_capturedText);
      boxEl.style.display = 'block';
      btnEl.textContent = '🙈 Hide preview';
    } else {
      boxEl.style.display = 'none';
      btnEl.textContent = '👁 Show redacted preview';
    }
  }

  // ***************************Clipboard panel HTML***********************************

  function buildSection() {
    const section = document.createElement('div');

    section.innerHTML = `
      <div style="display:flex; align-items:center; gap:6px; margin-bottom:8px;">
        <span style="font-size:15px;">📋</span>
        <span style="color:#7dd4fc; font-size:13px; font-weight:bold; letter-spacing:0.02em;">Clipboard Access</span>
        <span id="ext-cb-badge" hidden style="
          margin-left: auto;
          background: #dc2626;
          color: #fff;
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 999px;
          font-weight: bold;
          letter-spacing: 0.05em;
        ">⚠ DETECTED</span>
      </div>

      <div id="ext-cb-detected" hidden>
        <p id="ext-cb-summary" style="
          color: #bae6fd;
          font-size: 12px;
          margin: 0 0 6px 0;
          line-height: 1.5;
          font-weight: normal;
        "></p>

        <button id="ext-cb-reveal-btn" style="
          width: 100%;
          padding: 6px 10px;
          background: transparent;
          border: 1px solid #1a6fa8;
          border-radius: 6px;
          color: #7dd4fc;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
        ">👁 Show redacted preview</button>

        <pre id="ext-cb-redacted" hidden style="
          margin-top: 8px;
          background: #081726;
          border: 1px solid #1a6fa8;
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 11px;
          color: #93c5fd;
          white-space: pre-wrap;
          word-break: break-all;
          line-height: 1.5;
        "></pre>

        <p id="ext-cb-meta" style="
          color: #475569;
          font-size: 10px;
          margin-top: 6px;
          font-weight: normal;
        "></p>
      </div>

      <div id="ext-cb-clean" hidden>
        <p style="color:#4ade80; font-size:12px; margin:0; font-weight:normal;">
          ✔ No clipboard write detected.
        </p>
      </div>
    `;

    return section;
  }

  function wireEvents(section) {
    const revealBtn  = section.querySelector('#ext-cb-reveal-btn');
    const redactedEl = section.querySelector('#ext-cb-redacted');
    revealBtn.addEventListener('click', () => toggleReveal(redactedEl, revealBtn));
  }

  function showDetected(section, text, source) {
    const { label } = classifyContent(text);
    const time = new Date().toLocaleTimeString();

    section.querySelector('#ext-cb-badge').hidden = false;
    section.querySelector('#ext-cb-summary').textContent =
      `Copied ${label} (${text.length} chars) via ${source}`;
    section.querySelector('#ext-cb-meta').textContent =
      `Detected at load · ${time}`;
    section.querySelector('#ext-cb-detected').hidden = false;
  }

  function showClean(section) {
    section.querySelector('#ext-cb-clean').hidden = false;
  }

  // ********************Public API*************************

  function renderClipboardSection(containerEl) {
    const section = buildSection();
    containerEl.appendChild(section);
    wireEvents(section);

    let detected = false;

    interceptClipboard((text, source) => {
      if (detected) return;
      detected = true;
      _capturedText  = text;
      _captureSource = source;
      showDetected(section, text, source);
    });

    // If nothing fires within 2s of load, mark as clean
    setTimeout(() => {
      if (!detected) showClean(section);
    }, 2000);
  }

  return { renderClipboardSection };
})();


// ******************************Separate clipboard panel — dark blue box, sits just below the tags panel *********************************

const clipboardPanel = document.createElement("div");

clipboardPanel.style.position = "fixed";
clipboardPanel.style.right = "10px";
clipboardPanel.style.zIndex = "999999";
clipboardPanel.style.background = "#0f1e2e";
clipboardPanel.style.border = "1px solid #1a6fa8";
clipboardPanel.style.borderRadius = "8px";
clipboardPanel.style.padding = "10px 12px";
clipboardPanel.style.boxShadow = "0 2px 8px rgba(0,0,0,0.4)";
clipboardPanel.style.maxWidth = "280px";
clipboardPanel.style.fontFamily = "sans-serif";

document.body.appendChild(clipboardPanel);

// Wait one frame so greeting has its final rendered height, then position below it
requestAnimationFrame(() => {
  const greetingBottom = greeting.getBoundingClientRect().bottom;
  clipboardPanel.style.top = (greetingBottom + 8) + "px";
});



//Close button for the clipboard portion
const closeBtnClip = document.createElement("button");
closeBtnClip.textContent = "✖";
closeBtnClip.title = "Hide this panel";
closeBtnClip.style.position = "absolute";
closeBtnClip.style.top = "6px";
closeBtnClip.style.right = "8px";
closeBtnClip.style.background = "transparent";
closeBtnClip.style.border = "none";
closeBtnClip.style.fontSize = "16px";
closeBtnClip.style.cursor = "pointer";
closeBtnClip.style.color = "#666";
closeBtnClip.style.padding = "0";

clipboardPanel.appendChild(closeBtnClip);

// === Hide overlay on click ===
closeBtnClip.addEventListener("click", () => {
    clipboardPanel.style.display = "none";
});




ClipboardDetector.renderClipboardSection(clipboardPanel);
