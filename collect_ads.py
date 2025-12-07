import feedparser
import json
import re
import random

# Aapki websites ki list
sites = [
    "https://tube.sufilab.pk",
    "https://style.sufilab.pk",
    "https://googler.sufilab.pk",
    "https://saaz.sufilab.pk",
    "https://muslim.sufilab.pk",
    "https://flat.sufilab.pk",
    "https://news.sufilab.pk",
    "https://poet.sufilab.pk",
    "https://adbiurdu.pk"
]

all_posts = []

def get_image(entry):
    # Koshish karein image dhundne ki (thumbnail ya content mein se)
    if 'media_content' in entry:
        return entry.media_content[0]['url']
    if 'media_thumbnail' in entry:
        return entry.media_thumbnail[0]['url']
    
    # Agar direct media nahi mila to content mein img tag dhundein
    content = entry.get('content', [{}])[0].get('value', '') or entry.get('summary', '')
    img_match = re.search(r'<img.*?src="(.*?)"', content)
    if img_match:
        return img_match.group(1)
    
    # Agar koi image na mile to ek default logo use karein
    return "https://via.placeholder.com/300x200?text=SufiLab"

print("Fetching data from websites...")

for site in sites:
    try:
        # Zyadatar sites WordPress hain to /feed/ lagayenge
        feed_url = site.rstrip('/') + "/feed/"
        feed = feedparser.parse(feed_url)
        
        # Site ka naam
        site_title = feed.feed.get('title', 'SufiLab Network')

        # Har site se latest 5 posts uthayenge
        for entry in feed.entries[:5]:
            post = {
                "site_name": site_title,
                "title": entry.title,
                "link": entry.link,
                "image": get_image(entry)
            }
            all_posts.append(post)
            
    except Exception as e:
        print(f"Error fetching {site}: {e}")

# Data ko shuffle karein taake random lage
random.shuffle(all_posts)

# JSON file save karein
with open('ads.json', 'w', encoding='utf-8') as f:
    json.dump(all_posts, f, ensure_ascii=False, indent=2)

print(f"Total {len(all_posts)} ads saved to ads.json")
