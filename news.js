async function fetchRSSFeedJSON(url) {
    try {
        const proxyUrl = `https://corsproxy.io/?url=${url}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const xmlString = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");
        const items = xmlDoc.querySelectorAll("item");

        return Array.from(items).map(item => ({
            title: item.querySelector("title")?.textContent ?? "",
            link: item.querySelector("link")?.textContent ?? ""
        }));
    } catch (err) {
        console.error("Error fetching RSS feed:", err);
        return [];
    }
}

async function getNewsWidget(newsFeedURL) {
    const rssItems = await fetchRSSFeedJSON(newsFeedURL);
    if (!rssItems.length) {
        return "<h2 style='color:white'>No recent news</h2>";
    }
    return rssItems
        .map(
            i => `
        <a class="news-link" href='${i.link}' target="_blank">
          <h3>${i.title}</h3>
        </a>`
        )
        .join("");
}
