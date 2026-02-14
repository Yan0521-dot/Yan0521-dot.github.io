// INTRO ANIMATION

window.onload = () => {
    setTimeout(() => {
        document.getElementById("intro").style.display = "none";
        document.getElementById("mainSite").style.display = "block";
    }, 2500);
};

function checkPassword() {
    const pwd = document.getElementById("passwordInput").value;
    const strengthResult = document.getElementById("strengthResult");

    if (!pwd) {
        strengthResult.style.color = "red";
        strengthResult.innerHTML = "Please enter a password 😭";
        return;
    }

    let score = 0;

    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    let strength = "";
    let color = "";

    switch (score) {
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

    let warnings = [];
    let urlString = input.toLowerCase();

    // -----------------------------
    // 1. Raw input checks BEFORE URL parsing
    // -----------------------------

    // ❌ Suspicious file extensions
    const badExtensions = [".exe", ".apk", ".zip", ".rar"];
    badExtensions.forEach(ext => {
        if (urlString.includes(ext)) {
            warnings.push(`⚠️ Dangerous file detected (${ext})`);
        }
    });

    // ❌ Numeric TLD (like hello.8080)
    const rawMatch = urlString.match(/\.([a-z0-9]+)$/i);
    if (rawMatch) {
        const rawTLD = rawMatch[1];
        if (/^\d+$/.test(rawTLD)) {
            warnings.push(`⚠️ Invalid TLD: .${rawTLD}`);
        }
    }

    // ❌ Suspicious keywords
    const susKeywords = ["login", "verify", "update", "secure", "freegift", "bonus", "reward"];
    susKeywords.forEach(k => {
        if (urlString.includes(k)) {
            warnings.push(`⚠️ Suspicious keyword detected: '${k}'`);
        }
    });

    // ❌ No dot at all
    if (!urlString.includes(".")) {
        warnings.push("⚠️ Missing TLD (.com, .my, .org)");
    }

    // ❌ Raw IP domain check (before browser rewrites)
    if (/^\d{1,3}(\.\d{1,3}){3}/.test(urlString)) {
        warnings.push("⚠️ IP address used instead of domain");
    }

    // -----------------------------
    // Try parsing safely
    // -----------------------------
    let parsed;
    try {
        parsed = new URL(urlString);
    } catch {
        try {
            parsed = new URL("http://" + urlString);
        } catch {
            warnings.push("❌ Invalid URL format.");
        }
    }

    if (parsed) {
        const domain = parsed.hostname.toLowerCase();
        const tld = domain.split(".").pop();

        // ❌ Punycode
        if (domain.includes("xn--")) warnings.push("⚠️ Punycode detected");

        // ❌ Excessive hyphens
        if ((domain.match(/-/g) || []).length >= 3) {
            warnings.push("⚠️ Too many hyphens in domain");
        }

        // ❌ Suspicious TLDs
        const badTLDs = ["top", "xyz", "zip", "loan", "click"];
        if (badTLDs.includes(tld)) {
            warnings.push(`⚠️ Suspicious TLD: .${tld}`);
        }
    }

    // -----------------------------
    // Output
    // -----------------------------
    if (warnings.length === 0) {
        out.style.color = "#00ff99";
        out.innerHTML = "✔️ No obvious phishing signs — but always stay alert.";
    } else {
        out.style.color = "red";
        out.innerHTML = warnings.join("<br>");
    }
}

