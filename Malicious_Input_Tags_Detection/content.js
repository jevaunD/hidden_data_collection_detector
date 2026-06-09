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
const cont_info = ["email", "email_address", "🚨 __requestverificationtoken [type=hidden, display:none]user_email", "phone", "phone_number", "mobile", "mobile_number", "tel", "telephone", "msisdn"];
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


//********************************Hidden Elements Detection (NEW) **********************************
// Hidden element detection
function isOffScreen(el) {
    const rect = el.getBoundingClientRect();

    return (
        rect.right < 0 ||
        rect.bottom < 0 ||
        rect.left > window.innerWidth ||
        rect.top > window.innerHeight
    );
}

function getHiddenReasons(el) {
    const reasons = [];
    const style = window.getComputedStyle(el);

    if (el.type === "hidden")
        reasons.push("type=hidden");

    if (style.display === "none")
        reasons.push("display:none");

    if (style.visibility === "hidden")
        reasons.push("visibility:hidden");

    if (parseFloat(style.opacity) === 0)
        reasons.push("opacity:0");

    if (isOffScreen(el))
        reasons.push("off-screen");

    return reasons;
}


let hiddenFields = [];
let hiddenSensitiveFields = [];


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

    const hiddenReasons = getHiddenReasons(input);

    if (hiddenReasons.length > 0) {
        hiddenFields.push({
            element: input,
            reasons: hiddenReasons
        });
    }

    const attrs = cleanAttrs(input);

    categories.forEach(category => {
        category.list.forEach(tag => {

            if (attrs.includes(tag.toLowerCase())) {

                matchesSet.add(attrs);
                category.flag();

                if (hiddenReasons.length > 0) {
                    hiddenSensitiveFields.push({
                        attrs,
                        reasons: hiddenReasons
                    });
                }
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

if (hiddenSensitiveFields.length > 0) {
    results.push(
        `${count}. Hidden sensitive fields detected 🚨`
    );
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
    const hiddenDetails = hiddenSensitiveFields.map(field =>
    `${field.attrs} [${field.reasons.join(", ")}]`
);
    if (tags.length === 0) {
        greeting.innerHTML = "✅ No suspicious tags found.";
    } else {

const normalTags =
    tags.map(t => `• <code>${t}</code>`);

const hiddenTags =
    hiddenDetails.map(t =>
        `🚨 <code>${t}</code>`
    );

greeting.innerHTML =
    [...normalTags, ...hiddenTags].join("<br>");

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
