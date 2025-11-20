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



// ----------------------
// PHISHING LINK CHECKER
// ----------------------
function checkPhishing() {
    const url = document.getElementById("urlInput").value;
    const output = document.getElementById("phishingResult");

    if (!url) {
        output.innerHTML = "Please enter a URL.";
        output.style.color = "orange";
        return;
    }

    let warnings = [];

    // 1. Check for punycode
    if (url.includes("xn--")) {
        warnings.push("⚠️ Punycode detected (possible IDN homograph attack)");
    }

    // 2. Suspicious TLDs
    const badTLDs = [".xyz", ".click", ".zip", ".top", ".loan"];
    badTLDs.forEach(tld => {
        if (url.endsWith(tld)) {
            warnings.push(`⚠️ Suspicious TLD detected: ${tld}`);
        }
    });

    // 3. IP-based URL
    if (/https?:\/\/\d+\.\d+\.\d+\.\d+/.test(url)) {
        warnings.push("⚠️ IP address instead of domain name");
    }

    // 4. Too many hyphens
    if ((url.match(/-/g) || []).length >= 3) {
        warnings.push("⚠️ Multiple hyphens often used for fake URLs");
    }

    if (warnings.length === 0) {
        output.style.color = "#00ff99";
        output.innerHTML = "✔️ This link looks **safe**, but always double-check!";
    } else {
        output.style.color = "red";
        output.innerHTML = warnings.join("<br>");
    }
}

