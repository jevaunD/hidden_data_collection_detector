console.log("✅ Content script running on:", window.location.href);

// Check#1 -- This block of code houses the number of input tags and the number of label tags. So, we have inputs vs. labels
const inputs_num = Number(document.querySelectorAll("input").length);
const labels_num = Number(document.querySelectorAll("label").length);

//Check#2 -- There's a big difference in the input and label tags, now what is being requested by these input tags?
//these will then be put into a list to be looped and matched at a later date.

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


//This is where all the matches between the current input tag names on the webpage and the predetermined tags will be stored.
const matches = [];


//Now let's match!**************************

//Checking for payment info in the input tags list.
inputs.forEach(input => {
    const attrs = `${input.id} ${input.name} ${input.placeholder}`.toLowerCase();
    payment_info.forEach(tag => {
        if(attrs.includes(tag.toLowerCase())){
            matches.push(attrs);
            has_payment_tag = true;
        }
    })
});

//Checking for user/auth info in input tags list.
inputs.forEach(input => {
    const attrs = `${input.id} ${input.name} ${input.placeholder}`.toLowerCase();
    auth_info.forEach(tag => {
        if(attrs.includes(tag.toLowerCase())){
            matches.push(attrs);
            has_auth_tag = true;
        }
    })
});

//checking for bank info tags in input tags list.
inputs.forEach(input => {
    const attrs = `${input.id} ${input.name} ${input.placeholder}`.toLowerCase();
    bank_info.forEach(tag => {
        if(attrs.includes(tag.toLowerCase())){
            matches.push(attrs);
            has_bank_tag = true;
        }
    })
});

//Checking for Personally Identifiable Information (PII) in input tags list.
inputs.forEach(input => {
    const attrs = `${input.id} ${input.name} ${input.placeholder}`.toLowerCase();
    pii_info.forEach(tag => {
        if(attrs.includes(tag.toLowerCase())){
            matches.push(attrs);
            has_pii_tag = true;
        }
    })
});

//Checking for contact info in input tags list.
inputs.forEach(input => {
    const attrs = `${input.id} ${input.name} ${input.placeholder}`.toLowerCase();
    cont_info.forEach(tag => {
        if(attrs.includes(tag.toLowerCase())){
            matches.push(attrs);
            has_cont_tag = true;
        }
    })
});

//Checking for Location info in input tags list.
inputs.forEach(input => {
    const attrs = `${input.id} ${input.name} ${input.placeholder}`.toLowerCase();
    loc_info.forEach(tag => {
        if(attrs.includes(tag.toLowerCase())){
            matches.push(attrs);
            has_loc_tag = true;
        }
    })
});

//Checking for employment ifo in input tags list.
inputs.forEach(input => {
    const attrs = `${input.id} ${input.name} ${input.placeholder}`.toLowerCase();
    emp_info.forEach(tag => {
        if(attrs.includes(tag.toLowerCase())){
            matches.push(attrs);
            has_emp_tag = true;
        }
    })
});

//Checking for health and insurance info in input tags list.
inputs.forEach(input => {
    const attrs = `${input.id} ${input.name} ${input.placeholder}`.toLowerCase();
    health_info.forEach(tag => {
        if(attrs.includes(tag.toLowerCase())){
            matches.push(attrs);
            has_health_tag = true;
        }
    })
});

//Checking for mfa one time tokens etc in input tags list.
inputs.forEach(input => {
    const attrs = `${input.id} ${input.name} ${input.placeholder}`.toLowerCase();
    mfa_info.forEach(tag => {
        if(attrs.includes(tag.toLowerCase())){
            matches.push(attrs);
            has_mfa_tag = true;
        }
    })
});

//Checking for general high risk misc tags in input list.
inputs.forEach(input => {
    const attrs = `${input.id} ${input.name} ${input.placeholder}`.toLowerCase();
    misc_info.forEach(tag => {
        if(attrs.includes(tag.toLowerCase())){
            matches.push(attrs);
            has_misc_tag = true;
        }
    })
});

//Div setup to display info
const greeting = document.createElement("div");

let results = [];

// if (inputs > labels_num && has_payment_tag ){
//     results.push(`More input fields than labels!`);
// } else if (inputs_num / labels_num >= 2) {
//     results.push(`Score: ${inputs_num / labels_num}`);
// } else {
//     results.push("Nothing to see here!");
// }

let count = 1;

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


greeting.style.color = "black";
// Display all results on separate lines
greeting.innerHTML = results.join("<br>");


//button to show tags
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
    }
    greeting.style.display = "block";
});


// Popup style
greeting.style.position = "fixed";   // makes it float on the screen
greeting.style.top = "10px";         // distance from the top
greeting.style.right = "10px";       // distance from the right
greeting.style.fontWeight = "bold";
greeting.style.background = "white";
greeting.style.zIndex = "999999";    // makes sure it’s on top
greeting.style.padding = "8px 12px";
greeting.style.border = "1px solid #ccc";
greeting.style.borderRadius = "8px";
greeting.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";

document.body.appendChild(greeting);
