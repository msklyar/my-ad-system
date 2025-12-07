(function() {
    // 1. Apni sites.json ka link
    const sitesListUrl = "https://msklyar.github.io/my-ad-system/sites.json"; 
    
    // Ad Container dhoondna
    const adContainer = document.getElementById("my-github-ad");
    if (!adContainer) return;

    // 2. Google Style CSS Inject karna (Ye ad ko responsive banayega)
    const style = document.createElement('style');
    style.innerHTML = `
        #my-github-ad {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            width: 100%;
            display: block;
            margin-bottom: 20px;
        }
        .g-ad-card {
            display: flex;
            background: #fff;
            border: 1px solid #dadce0;
            border-radius: 8px;
            overflow: hidden;
            text-decoration: none;
            color: inherit;
            box-shadow: 0 1px 2px rgba(60,64,67,0.3);
            transition: box-shadow 0.2s;
        }
        .g-ad-card:hover {
            box-shadow: 0 1px 3px 1px rgba(60,64,67,0.15), 0 1px 2px rgba(60,64,67,0.3);
        }
        /* Mobile View (Default) - Image upar, Text neeche */
        .g-ad-content-wrapper {
            display: flex;
            flex-direction: column;
            width: 100%;
        }
        .g-ad-image {
            width: 100%;
            height: 180px;
            object-fit: cover;
            background: #f1f3f4;
        }
        .g-ad-text {
            padding: 12px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        /* Desktop/Tablet View - Agar jagah zyada ho to side-by-side */
        @media (min-width: 480px) {
            .g-ad-content-wrapper {
                flex-direction: row;
                height: 140px; /* Fixed height for horizontal banner look */
            }
            .g-ad-image {
                width: 35%; /* Image left side par 35% jagah legi */
                height: 100%;
                min-width: 120px;
            }
            .g-ad-text {
                width: 65%;
                padding: 10px 15px;
            }
        }

        .g-ad-title {
            margin: 0 0 5px;
            font-size: 16px;
            font-weight: 500;
            color: #202124;
            line-height: 1.3;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .g-ad-desc {
            margin: 0;
            font-size: 13px;
            color: #5f6368;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2; /* Sirf 2 lines dikhana */
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .g-ad-meta {
            margin-top: auto; /* Bottom par push karna */
            padding-top: 8px;
            font-size: 11px;
            color: #1a73e8; /* Google Blue */
            font-weight: 500;
            display: flex;
            align-items: center;
        }
        .g-badge {
            background: #f1f3f4;
            color: #5f6368;
            padding: 2px 6px;
            border-radius: 4px;
            margin-right: 8px;
            font-size: 10px;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    // --- Data Fetching Logic (Same as before but optimized) ---
    fetch(sitesListUrl)
        .then(res => res.json())
        .then(sites => {
            if (!sites || sites.length === 0) return;
            let randomSite = sites[Math.floor(Math.random() * sites.length)];
            randomSite = randomSite.replace(/\/$/, "");
            // Blogger JSON Feed URL
            const feedUrl = `${randomSite}/feeds/posts/default?alt=json&max-results=20`;
            return fetch(feedUrl);
        })
        .then(res => res.json())
        .then(data => {
            const posts = data.feed.entry;
            if (!posts || posts.length === 0) return;

            const randomPost = posts[Math.floor(Math.random() * posts.length)];

            // Data Extraction
            const title = randomPost.title.$t;
            let link = "#";
            if (randomPost.link) {
                const linkObj = randomPost.link.find(l => l.rel === 'alternate');
                if (linkObj) link = linkObj.href;
            }

            // Image Extraction
            let image = "https://via.placeholder.com/300x200?text=Visit+Site";
            if (randomPost.media$thumbnail) {
                // High quality image trick
                image = randomPost.media$thumbnail.url.replace("s72-c", "w400-h300-p");
            } else {
                // Try to find image in content content if thumbnail is missing
                const content = randomPost.content ? randomPost.content.$t : "";
                const imgMatch = content.match(/src="([^"]+)"/);
                if(imgMatch) image = imgMatch[1];
            }

            // Text Description
            let text = "";
            if (randomPost.summary) text = randomPost.summary.$t;
            else if (randomPost.content) {
                const div = document.createElement("div");
                div.innerHTML = randomPost.content.$t;
                text = div.textContent || div.innerText || "";
            }
            const cleanText = text.replace(/&nbsp;/g, ' ').substring(0, 150);
            
            // Domain Name extract karna (Display ke liye)
            const domain = new URL(link).hostname.replace('www.', '');

            // HTML Structure (Responsive Classes ke sath)
            const adHTML = `
                <a href="${link}" target="_blank" class="g-ad-card">
                    <div class="g-ad-content-wrapper">
                        <img src="${image}" class="g-ad-image" alt="${title}">
                        <div class="g-ad-text">
                            <h3 class="g-ad-title">${title}</h3>
                            <p class="g-ad-desc">${cleanText}</p>
                            <div class="g-ad-meta">
                                <span class="g-badge">Ad</span> ${domain} &bull; Open
                            </div>
                        </div>
                    </div>
                </a>
            `;

            adContainer.innerHTML = adHTML;
        })
        .catch(err => {
            console.error("Ad System Error:", err);
            adContainer.style.display = 'none';
        });
})();
