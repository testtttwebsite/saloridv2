
document.addEventListener('DOMContentLoaded', () => {
    initScrollObserver();

    if (document.getElementById('dynamic-content')) {
        generateInfoSection();    }

    initAuthLogic();
});


function initScrollObserver() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.add('reveal');
            }
        });
    }, observerOptions);

    const targets = document.querySelectorAll('.fade-in-scroll, .price-card, .reveal, .info-row, .card');
    targets.forEach(el => scrollObserver.observe(el));
}

function generateInfoSection() {
    const container = document.getElementById('dynamic-content');
    const rows = [
        {
            img: 'preview1.png',
            title: 'Placeholder',
            desc: 'Placeholder Text (this is where you put the actual text)'
        },        
        {
            img: 'preview2.png',
            title: 'Placeholder',
            desc: 'Placeholder Text (this is where you put the actual text)'
        },
        {
            img: 'preview3.png',
            title: 'Placeholder',
            desc: 'Placeholder Text (this is where you put the actual text)'
        }
    ];

    let htmlContent = '<section class="info-section">';
    rows.forEach((row, index) => {
        htmlContent += `
            <div class="info-row fade-in-scroll">                <div class="info-img">
                    <img src="${row.img}" alt="${row.title}">                </div>
                <div class="info-text">
                    <h2>${row.title}</h2>
                    <p>${row.desc}</p>
                    <a href="docs.html" class="btn btn-secondary">Learn More</a>
                </div>
            </div>
        `;
    });
    htmlContent += '</section>';
    
    container.innerHTML = htmlContent;
    initScrollObserver();
}

let isLoginMode = true;

function initAuthLogic() {
    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.addEventListener('submit', handleAuthSubmit);
    }
}

function toggleAuth() {
    isLoginMode = !isLoginMode;
    
    const title = document.getElementById('authTitle');
    const subtitle = document.getElementById('authSubtitle');
    const btn = document.getElementById('authBtn');
    const toggleBtn = event.target;
    const registerFields = document.getElementById('registerFields');
    const confirmPassInput = document.getElementById('authConfirmPassword');

    if (!isLoginMode) {
        title.innerText = "Create Account";
        if(subtitle) subtitle.innerText = "Join thousands of players dominating with Salorid.";
        btn.innerText = "Sign Up";
        toggleBtn.innerText = "Already have an account? Login";
        
        registerFields.style.display = "block";
        setTimeout(() => {            registerFields.style.opacity = "1";
            registerFields.style.transform = "translateY(0)";
        }, 10);
        if(confirmPassInput) confirmPassInput.required = true;
    } else {
        if(subtitle) subtitle.innerText = "Enter your credentials to access the dashboard.";
        btn.innerText = "Sign In";
        toggleBtn.innerText = "Create an account";
        
        registerFields.style.opacity = "0";
        registerFields.style.transform = "translateY(-10px)";
        setTimeout(() => {
            registerFields.style.display = "none";
        }, 400);        if(confirmPassInput) confirmPassInput.required = false;
    }
}

function handleAuthSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('authBtn');    const password = document.getElementById('authPassword')?.value;    const confirmPassword = document.getElementById('authConfirmPassword')?.value;
    const termsCheck = document.getElementById('authTerms');

    if (!isLoginMode) {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");            return;
        }
        if (termsCheck && !termsCheck.checked) {
            alert("Please agree to the Terms of Service.");            return;
        }
    }

    const originalText = btn.innerText;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner" style="width:20px; height:20px; border-width:2px;"></span>`;

    setTimeout(() => {
        btn.innerText = isLoginMode ? "Redirecting..." : "Account Created!";
        btn.style.background = "#10b981";
        
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);
    }, 1500);
}

function processPayment(plan) {
    const overlay = document.createElement('div');
    overlay.id = "payment-overlay";
    overlay.style = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(5, 5, 5, 0.9); backdrop-filter: blur(15px);
        z-index: 10000; display: flex; align-items: center; justify-content: center;
    `;    
    overlay.innerHTML = `
        <div class="auth-box" style="text-align: center; border: 1px solid var(--accent);">
            <div class="spinner" style="width:40px; height:40px;"></div>
            <h2 style="margin-top: 2rem; color: var(--accent);">Validating Plan: ${plan}</h2>
            <p style="color: var(--text-muted);">Securely connecting to payment gateway...</p>
        </div>    `;
    
    document.body.appendChild(overlay);

    if (!document.getElementById('spinner-style')) {
        const s = document.createElement('style');
        s.id = 'spinner-style';
        s.innerHTML = `
            .spinner {
                width: 25px; height: 25px; border: 3px solid var(--glass);
                border-top: 3px solid var(--accent); border-radius: 50%;
                animation: spin 1s linear infinite; margin: 0 auto;
            }
            @keyframes spin { 100% { transform: rotate(360deg); } }
        `;
        document.head.appendChild(s);
    }

    setTimeout(() => {
        overlay.innerHTML = `
            <div class="auth-box" style="text-align: center; border: 1px solid #10b981;">
                <h2 style="color: #10b981;">Transaction Complete</h2>
                <p style="color: var(--text-muted); margin: 1.5rem 0;">Welcome to the Salorid family. Your client access is now active.</p>
                <button class="btn btn-primary" onclick="window.location.href='dashboard.html'">Enter Dashboard</button>
            </div>
        `;
    }, 2500);}

function searchDocs() {
    const query = document.getElementById('docSearch').value.toLowerCase();
    const sections = document.querySelectorAll('.content section');    const navLinks = document.querySelectorAll('.docs-nav li a');

    sections.forEach((section, index) => {
        const text = section.innerText.toLowerCase();
        const isMatch = text.includes(query);        section.style.display = isMatch ? 'block' : 'none';
        
        if (navLinks[index]) {
            navLinks[index].parentElement.style.display = isMatch ? 'block' : 'none';
        }
    });
}

function simulateDownload() {
    const btn = event.target;
    let progress = 0;
    btn.disabled = true;
    btn.style.opacity = "0.7";

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress > 100) progress = 100;
        
        btn.innerText = `Downloading Salorid... ${progress}%`;
        
        if (progress === 100) {            clearInterval(interval);
            btn.innerText = "Download Complete";
            btn.style.background = "#10b981";
        }
    }, 300);
}

function handleSettingsSave(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;

    btn.disabled = true;
    btn.innerHTML = `<span class="spinner" style="width:18px; height:18px;"></span>`;

    setTimeout(() => {
        btn.innerText = "Changes Saved!";
        btn.style.background = "var(--success)";
        
        setTimeout(() => {
            btn.disabled = false;
            btn.innerText = originalText;
            btn.style.background = "";
        }, 2000);    }, 1000);
}

function resetHWID() {
    if (confirm("Are you sure you want to reset your HWID? This action has a 24-hour cooldown.")) {        const btn = event.target;
        btn.disabled = true;
        btn.innerText = "Resetting...";

        setTimeout(() => {
            alert("HWID has been successfully reset. You can now log in from a new device.");
            btn.innerText = "Reset HWID";
            btn.disabled = false;
        }, 1500);
    }
}


function searchDocs() {
    const query = document.getElementById('docSearch').value.toLowerCase();
    const sections = document.querySelectorAll('.doc-section');
    const sidebarLinks = document.querySelectorAll('.dash-sidebar .sidebar-link');    sections.forEach(section => {
        const text = section.innerText.toLowerCase();        if (text.includes(query)) {
            section.style.display = "block";
        } else {
            section.style.display = "none";
        }
    });

    sidebarLinks.forEach(link => {
        const text = link.innerText.toLowerCase();
        if (link.getAttribute('href').startsWith('#')) {
            link.style.display = text.includes(query) ? "block" : "none";
        }
    });
}

window.addEventListener('scroll', () => {
    let current = "";
    const sections = document.querySelectorAll('.doc-section');
    const navLinks = document.querySelectorAll('.dash-sidebar .sidebar-link');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {            link.classList.add('active');
        }    });
});