function checkPassword() {
    const pwd = document.getElementById("passwordInput").value;
    const strengthResult = document.getElementById("strengthResult");

    let score = 0;

    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    let strength = "";
    let color = "";

    switch (score) {
        case 0:
        case 1:
            strength = "Very Weak";
            color = "red";
            break;
        case 2:
            strength = "Weak";
            color = "orange";
            break;
        case 3:
            strength = "Medium";
            color = "yellow";
            break;
        case 4:
            strength = "Strong";
            color = "lightgreen";
            break;
        case 5:
            strength = "Very Strong";
            color = "#00ff99";
            break;
    }

    strengthResult.style.color = color;
    strengthResult.innerHTML = `Strength: <strong>${strength}</strong>`;
}



function checkPhishing() {
    const input = document.getElementById("urlInput").value.trim();
    const out = document.getElementById("phishingResult");

    if (!input) {
        out.style.color = "orange";
        out.innerHTML = "Please enter a URL.";
        return;
    }

    let url = input;

    // Add protocol if missing
    if (!/^https?:\/\//i.test(url)) {
        url = "http://" + url;
    }

    let domain;
    try {
        domain = new URL(url).hostname;
    } catch {
        out.style.color = "red";
        out.innerHTML = "❌ Invalid URL format.";
        return;
    }

    let warnings = [];

    // ❌ 1. No TLD (example: "hello" or "localhost")
    if (!domain.includes(".")) {
        warnings.push("⚠️ Missing TLD (.com, .my, .org)");
    }

    // ❌ 2. Invalid TLD (like .8080)
    const tld = domain.split(".").pop();
    if (/^\d+$/.test(tld)) {
        warnings.push(`⚠️ Invalid TLD: .${tld} (looks like a port)`);
    }

    // ❌ 3. Suspicious keywords
    const susKeywords = [
        "login", "verify", "update", "secure", 
        "bonus", "freegift", "reward", "reset"
    ];

    susKeywords.forEach(k => {
        if (url.toLowerCase().includes(k)) {
            warnings.push(`⚠️ Suspicious keyword detected: "${k}"`);
        }
    });

    // ❌ 4. Suspicious extensions
    const badExtensions = [".exe", ".apk", ".zip", ".rar"];
    badExtensions.forEach(ext => {
        if (url.toLowerCase().endsWith(ext)) {
            warnings.push(`⚠️ Dangerous file detected: ${ext}`);
        }
    });

    // ❌ 5. Too many hyphens
    if ((domain.match(/-/g) || []).length >= 3) {
        warnings.push("⚠️ Excessive hyphens used — often phishing.");
    }

    // ❌ 6. Punycode
    if (domain.includes("xn--")) {
        warnings.push("⚠️ Punycode detected (possible IDN homograph attack)");
    }

    // ❌ 7. IP address instead of domain
    if (/^\d+\.\d+\.\d+\.\d+$/.test(domain)) {
        warnings.push("⚠️ IP address used instead of domain name.");
    }

    // ❌ 8. Suspicious TLD
    const badTLDs = ["top", "xyz", "zip", "loan", "click"];
    if (badTLDs.includes(tld)) {
        warnings.push(`⚠️ Suspicious TLD: .${tld}`);
    }

    // Output
    if (warnings.length === 0) {
        out.style.color = "#00ff99";
        out.innerHTML = "✔️ No obvious phishing signs — but always stay alert.";
    } else {
        out.style.color = "red";
        out.innerHTML = warnings.join("<br>");
    }
}
