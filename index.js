const watchlist = [
    "COINBASE:BTCUSDT",
    "NASDAQ:TSLA",
    "NASDAQ:NVDA",
    "AMEX:GLD",
    "BATS:GDX",
    "BATS:GDXJ",
    "AMEX:SLV",
    "NASDAQ:GLXY",
    "NASDAQ:HOOD",
    "NASDAQ:COIN",
];

async function createSymbolSection(symbolName) {
    const mainContentDiv = document.getElementById("main-content");
    const singleSymbolSectionWrapper = document.createElement("div");
    const chartWidgetDiv = document.createElement("div");
    const singleWidgetSectionDiv = document.createElement("div");
    const singleWidgetDiv = document.createElement("div");
    const newsWidgetDiv = document.createElement("div");

    singleSymbolSectionWrapper.className =
        "single-symbol-section-wrapper";
    chartWidgetDiv.className = "chart-widget";
    singleWidgetSectionDiv.className = "single-widget-section";
    singleWidgetDiv.className = "single-widget";
    newsWidgetDiv.className = "news-widget";
    singleWidgetSectionDiv.appendChild(singleWidgetDiv);
    singleSymbolSectionWrapper.appendChild(chartWidgetDiv);
    singleSymbolSectionWrapper.appendChild(singleWidgetSectionDiv);
    singleSymbolSectionWrapper.appendChild(newsWidgetDiv);
    mainContentDiv.appendChild(singleSymbolSectionWrapper);

    const chartScript = document.createElement("script");
    const singleWidgetScript = document.createElement("script");

    chartScript.type = "text/javascript";
    singleWidgetScript.type = "text/javascript";

    chartScript.async = true;
    singleWidgetScript.async = true;

    chartScript.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    singleWidgetScript.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
    chartScript.innerHTML = `
        {
        "allow_symbol_change": true,
        "calendar": false,
        "details": false,
        "hide_side_toolbar": true,
        "hide_top_toolbar": false,
        "hide_legend": false,
        "hide_volume": false,
        "hotlist": false,
        "interval": "60",
        "locale": "en",
        "save_image": true,
        "style": "1",
        "symbol": "${symbolName}",
        "theme": "dark",
        "timezone": "America/New_York",
        "backgroundColor": "#0F0F0F",
        "gridColor": "rgba(242, 242, 242, 0.06)",
        "watchlist": [],
        "withdateranges": false,
        "compareSymbols": [],
        "studies": [],
        "autosize": true,
        "isTransparent": true,
        "width": "100%",
        "height": "100%"
        }
        `;

    singleWidgetScript.innerHTML = `

        {
        "symbol": "${symbolName}",
        "colorTheme": "dark",
        "isTransparent": true,
        "locale": "en",
        "width": "100%"
        }
        `;

    // we add "stock to the query in the query string here when we query for the the symbolName news"
    let googleNewsFeedURL = encodeURIComponent(
        `https://news.google.com/rss/search?hl=en-US&gl=US&ceid=US%3Aen&oc=11&q=${symbolName.split(":")[1]}+after:${getYesterdaysDate()}`,
    );

    newsWidgetDiv.innerHTML = await getNewsWidget(googleNewsFeedURL);
    chartWidgetDiv.appendChild(chartScript);
    singleWidgetDiv.appendChild(singleWidgetScript);
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

async function fetchRSSFeedJSON(url) {
    try {
        const proxyUrl = `https://api.allorigins.win/get?url=${url}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "application/xml");
        const items = xmlDoc.querySelectorAll("item");

        return Array.from(items).map(item => ({
            title: item.querySelector("title")?.textContent ?? "",
            link: item.querySelector("link")?.textContent ?? ""
        }));
    } catch (err) {
        console.error(err);
        return [];
    }
}

function getYesterdaysDate() {
    let dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - 1);
    let yesterday = dateObj.toISOString().split("T")[0];
    console.log(yesterday);
    return yesterday;
}

async function main() {
    for (let i = 0; i < watchlist.length; i++) {
        await createSymbolSection(watchlist[i])
    }
}

main();
