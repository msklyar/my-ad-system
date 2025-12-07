(function() {
    const sitesListUrl = "https://msklyar.github.io/my-ad-system/sites.json"; 
    const adContainer = document.getElementById("my-github-ad");
    
    if (!adContainer) {
        console.error("Ad Container nahi mila!");
        return;
    }

    // Loading Show Karein
    adContainer.innerHTML = `<div style="padding:20px; text-align:center; border:1px dashed #ccc; background:#f9f9f9;">⚙️ Ad System Loading...<br><small>Checking connection...</small></div>`;

    async function loadDebugAd() {
        try {
            // Step A: Sites List Lana
            adContainer.innerHTML = "Status: Fetching sites.json...";
            const response = await fetch(sitesListUrl, {cache: "no-store"}); // Cache disable kia
            
            if (!response.ok) throw new Error(`sites.json nahi mili (Error: ${response.status})`);
            
            const sites = await response.json();
            if (!sites || sites.length === 0) throw new Error("sites.json khali hai!");

            // Random Site Pick
            let site = sites[Math.floor(Math.random() * sites.length)];
            site = site.replace(/\/$/, ""); 
            
            adContainer.innerHTML = `Status: Checking ${site}...`;

            // Step B: Post Fetch Karna (Blogger Style)
            const feedUrl = `${site}/feeds/posts/default?alt=json&max-results=5`;
            
            const feedRes = await fetch(feedUrl);
            if (!feedRes.ok) throw new Error(`Website se data nahi mila (${site}). Shayad CORS block kar raha hai.`);
            
            const data = await feedRes.json();
            if(!data.feed || !data.feed.entry) throw new Error("Data format ghalat hai (Shayad ye Blogger nahi hai?)");

            const post = data.feed.entry[0];
            const title = post.title.$t;
            
            // Image Dhoondna
            let image = "https://via.placeholder.com/300x200";
            if (post.media$thumbnail) image = post.media$thumbnail.url.replace("s72-c", "w300-h200-p");

            // Link Dhoondna
            let link = "#";
            post.link.forEach(l => { if (l.rel === 'alternate') link = l.href; });

            // Step C: Ad Show Karna (Success!)
            adContainer.innerHTML = `
                <a href="${link}" target="_blank" style="text-decoration:none; color:black;">
                    <div style="border:1px solid #ddd; border-radius:8px; overflow:hidden; font-family:sans-serif; max-width:300px; background:#fff;">
                        <img src="${image}" style="width:100%; height:160px; object-fit:cover;">
                        <div style="padding:10px;">
                            <h3 style="margin:0; font-size:16px;">${title}</h3>
                            <p style="margin:5px 0 0; font-size:12px; color:green;">✅ Ad Successfully Loaded!</p>
                        </div>
                    </div>
                </a>
            `;

        } catch (error) {
            // Error Screen par dikhayen
            adContainer.innerHTML = `
                <div style="color:red; border:2px solid red; padding:15px; background:#fff0f0; font-family:sans-serif;">
                    <strong>🚫 Ad Load Failed!</strong><br>
                    <small>${error.message}</small><br><br>
                    <em>GitHub file update hone mein 2-3 minute le sakta hai.</em>
                </div>
            `;
            console.error(error);
        }
    }

    loadDebugAd();
})();
