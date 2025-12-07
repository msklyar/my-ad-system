(function() {
    // --- SETTINGS ---
    const sitesListUrl = "https://msklyar.github.io/my-ad-system/sites.json"; 
    const adContainer = document.getElementById("my-github-ad");

    if (!adContainer) return;

    // --- 1. CSS STYLES (Design) ---
    const style = document.createElement('style');
    style.innerHTML = `
        #my-github-ad { margin: 20px 0; display: block; width: 100%; font-family: sans-serif; }
        .g-ad-card { display: flex; background: #fff; border: 1px solid #dadce0; border-radius: 8px; overflow: hidden; text-decoration: none; color: inherit; box-shadow: 0 1px 2px rgba(60,64,67,0.3); }
        .g-ad-content { width: 100%; display: flex; flex-direction: column; }
        .g-ad-img { width: 100%; height: 180px; object-fit: cover; background: #eee; }
        .g-ad-info { padding: 12px; }
        .g-ad-title { margin: 0 0 5px; font-size: 16px; font-weight: 600; color: #202124; }
        .g-ad-desc { font-size: 13px; color: #5f6368; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .g-badge { background: #f1f3f4; color: #5f6368; padding: 2px 5px; border-radius: 3px; font-size: 10px; font-weight: bold; margin-right: 5px; }
        
        /* Desktop View */
        @media (min-width: 480px) {
            .g-ad-content { flex-direction: row; height: 140px; }
            .g-ad-img { width: 35%; height: 100%; min-width: 130px; }
            .g-ad-info { width: 65%; padding: 10px 15px; display: flex; flex-direction: column; justify-content: center; }
        }
    `;
    document.head.appendChild(style);

    // --- 2. GLOBAL CALLBACK FUNCTION (Ye data receive karega) ---
    window.handleBloggerAd = function(data) {
        if (!data.feed || !data.feed.entry || data.feed.entry.length === 0) {
            console.log("Website khul gayi par koi post nahi mili.");
            return;
        }

        // Random Post Select Karna
        const post = data.feed.entry[Math.floor(Math.random() * data.feed.entry.length)];

        // Title
        const title = post.title.$t;

        // Link
        let link = "#";
        if (post.link) {
            post.link.forEach(l => { if (l.rel === 'alternate') link = l.href; });
        }
        
        // Domain Name (for display)
        const domain = new URL(link).hostname.replace('www.', '');

        // Image (High Quality Logic)
        let image = "https://via.placeholder.com/400x300?text=No+Image";
        if (post.media$thumbnail) {
            image = post.media$thumbnail.url.replace("s72-c", "w400-h300-p");
        }

        // Text Summary
        let text = "";
        if (post.summary) text = post.summary.$t;
        else if (post.content) {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = post.content.$t;
            text = tempDiv.textContent || "";
        }
        text = text.substring(0, 140) + "...";

        // HTML Render Karna
        adContainer.innerHTML = `
            <a href="${link}" target="_blank" class="g-ad-card">
                <div class="g-ad-content">
                    <img src="${image}" class="g-ad-img" alt="Ad">
                    <div class="g-ad-info">
                        <h3 class="g-ad-title">${title}</h3>
                        <p class="g-ad-desc">${text}</p>
                        <div style="margin-top:auto; padding-top:8px; font-size:11px; color:#1a73e8;">
                            <span class="g-badge">Ad</span> ${domain}
                        </div>
                    </div>
                </div>
            </a>
        `;
    };

    // --- 3. MAIN LOGIC ---
    fetch(sitesListUrl)
        .then(res => res.json())
        .then(sites => {
            if (!sites || sites.length === 0) return;

            let randomSite = sites[Math.floor(Math.random() * sites.length)];
            randomSite = randomSite.replace(/\/$/, ""); 

            // JSONP URL Banana (Ye CORS bypass karega)
            // Note: 'alt=json-in-script' aur 'callback=handleBloggerAd' zaroori hain
            const scriptUrl = `${randomSite}/feeds/posts/default?alt=json-in-script&callback=handleBloggerAd&max-results=10`;

            // Script Inject karna
            const scriptTag = document.createElement('script');
            scriptTag.src = scriptUrl;
            scriptTag.onerror = function() { console.error("Script load nahi hua from: " + randomSite); };
            document.body.appendChild(scriptTag);
        })
        .catch(err => console.error("Sites List Error:", err));

})();
