async function createNewsSection() {
    const mainContentDiv = document.getElementById("main-content");
    const newsSectionWrapper = document.createElement("div");
    const topStoriesDiv = document.createElement("div");
    const calendarDiv = document.createElement("div");

    newsSectionWrapper.className = "news-section";
    topStoriesDiv.className = "top-stories";
    calendarDiv.className = "calendar";

    const topStoriesScript = document.createElement("script");
    const calendarScript = document.createElement("script");

    topStoriesScript.type = "text/javascript";
    calendarScript.type = "text/javascript";

    topStoriesScript.async = true;
    calendarScript.async = true;

    topStoriesScript.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    calendarScript.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    // NOTE FOR BIXIT
    // Settings for the top stories widget
    topStoriesScript.innerHTML = `
            {
                "displayMode": "adaptive",
                "feedMode": "all_symbols",
                "colorTheme": "dark",
                "isTransparent": true,
                "locale": "en",
                "width": "100%",
                "height": "100%"
            }
    `

    // NOTE FOR BIXIT
    // Settings for the calendar widget
    calendarScript.innerHTML = `
            {
            "colorTheme": "dark",
            "isTransparent": true,
            "locale": "en",
            "countryFilter": "us",
            "importanceFilter": "-1,0,1",
            "width": "100%",
            "height": "100%"
            }
    `
    mainContentDiv.appendChild(newsSectionWrapper);
    newsSectionWrapper.appendChild(topStoriesDiv);
    newsSectionWrapper.appendChild(calendarDiv);
    topStoriesDiv.appendChild(topStoriesScript);
    calendarDiv.appendChild(calendarScript);

}

async function createSymbolSection(symbol) {
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

    // NOTE FOR BIXIT
    // Settings for Individual Stock charts
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
        "symbol": "${symbol.symbolName}",
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

    // NOTE FOR BIXIT
    // Settings for the simple price widget
    singleWidgetScript.innerHTML = `

        {
        "symbol": "${symbol.symbolName}",
        "colorTheme": "dark",
        "isTransparent": true,
        "locale": "en",
        "width": "100%"
        }
        `;

    // we add "stock to the query in the query string here when we query for the the symbolName news"
    let googleNewsFeedURL = encodeURIComponent(
        `https://news.google.com/rss/search?hl=en-US&gl=US&ceid=US%3Aen&oc=11&q=${symbol.newsQuery}+after:${getYesterdaysDate()}`,
    );

    newsWidgetDiv.innerHTML = await getNewsWidget(googleNewsFeedURL);
    chartWidgetDiv.appendChild(chartScript);
    singleWidgetDiv.appendChild(singleWidgetScript);
}
