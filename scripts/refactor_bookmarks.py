import json

def refactor():
    # 1. Load data
    with open('data/url_links.json', 'r') as f:
        links = json.load(f)
    with open('data/url_cat.json', 'r') as f:
        cats = json.load(f)

    # 2. Define move rules
    media_tools = ["Cobalt", "Online-Convert", "123Apps", "TinyWow"]
    date_time_tools = ["Days Old", "Getting Old", "Panchang"]

    new_links = []
    for link in links:
        title = link.get('title', '')
        old_cat = link.get('category', '')

        new_cat = old_cat

        # Rule: Calculators & Converters
        if "calculator" in title.lower() or "converter" in title.lower() or title.lower() == "unitto":
            new_cat = "Calculators"

        # Rule: Date & Time
        elif any(d.lower() in title.lower() for d in date_time_tools):
            new_cat = "Date & Time"

        # Rule: Media
        elif any(m.lower() in title.lower() for m in media_tools):
            new_cat = "Media"

        # Rule: Documents
        elif title.lower() == "paperknife":
            new_cat = "Documents"

        # Rule: Merge Tools & Utilities
        if new_cat in ["Tools", "Utilities"]:
            new_cat = "Tools & Utilities"

        # Rule: Remove remaining Toolbox items
        if new_cat == "Toolbox":
            continue

        link['category'] = new_cat
        new_links.append(link)

    # 3. Update categories
    if "Toolbox" in cats:
        del cats["Toolbox"]

    cats["Calculators"] = "calculate"
    cats["Tools & Utilities"] = "construction"

    if "Tools" in cats: del cats["Tools"]
    if "Utilities" in cats: del cats["Utilities"]

    sorted_cats = {k: cats[k] for k in sorted(cats.keys())}

    # 4. Save
    with open('data/url_links.json', 'w') as f:
        json.dump(new_links, f, indent=2)
    with open('data/url_cat.json', 'w') as f:
        json.dump(sorted_cats, f, indent=2)

if __name__ == "__main__":
    refactor()
    print("Refactoring complete.")
