function createTradingViewScript(widgetName, config) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://s3.tradingview.com/external-embedding/embed-widget-${widgetName}.js`;
    script.async = true;
    script.innerHTML = JSON.stringify(config);
    return script;
}

async function createNewsSection() {
    const mainContent = document.getElementById("main-content");

    // NOTE FOR BIXIT
    // Settings for the top stories widget
    const topStoriesConfig = {
        displayMode: "adaptive",
        feedMode: "all_symbols",
        colorTheme: "dark",
        isTransparent: true,
        locale: "en",
        width: "100%",
        height: "100%"
    };

    // NOTE FOR BIXIT
    // Settings for the calendar widget
    const calendarConfig = {
        colorTheme: "dark",
        isTransparent: true,
        locale: "en",
        countryFilter: "us",
        importanceFilter: "-1,0,1",
        width: "100%",
        height: "100%"
    };

    const wrapper = document.createElement("div");
    wrapper.className = "news-section";
    wrapper.innerHTML = `
        <div class="top-stories"></div>
        <div class="calendar"></div>
    `;

    mainContent.appendChild(wrapper);

    wrapper.querySelector(".top-stories").appendChild(createTradingViewScript("timeline", topStoriesConfig));
    wrapper.querySelector(".calendar").appendChild(createTradingViewScript("events", calendarConfig));
}

async function createSymbolSection(symbol) {
    const mainContent = document.getElementById("main-content");

    // NOTE FOR BIXIT
    // Settings for Individual Stock charts
    const chartConfig = {
        allow_symbol_change: true,
        calendar: false,
        details: false,
        hide_side_toolbar: true,
        hide_top_toolbar: false,
        hide_legend: false,
        hide_volume: false,
        hotlist: false,
        interval: "60",
        locale: "en",
        save_image: true,
        style: "1",
        symbol: symbol.symbolName,
        theme: "dark",
        timezone: "America/New_York",
        backgroundColor: "#0F0F0F",
        gridColor: "rgba(242, 242, 242, 0.06)",
        watchlist: [],
        withdateranges: false,
        compareSymbols: [],
        studies: [],
        autosize: true,
        isTransparent: true,
        width: "100%",
        height: "100%"
    };

    // NOTE FOR BIXIT
    // Settings for the simple price widget
    const priceWidgetConfig = {
        symbol: symbol.symbolName,
        colorTheme: "dark",
        isTransparent: true,
        locale: "en",
        width: "100%"
    };

    const googleNewsFeedURL = encodeURIComponent(
        `https://news.google.com/rss/search?hl=en-US&gl=US&ceid=US%3Aen&oc=11&q=${symbol.newsQuery}+after:${getYesterdaysDate()}`
    );
    const newsHTML = await getNewsWidget(googleNewsFeedURL);

    const wrapper = document.createElement("div");
    wrapper.className = "single-symbol-section-wrapper";
    wrapper.innerHTML = `
        <div class="chart-widget"></div>
        <div class="single-widget-section">
            <div class="single-widget"></div>
        </div>
        <div class="news-widget">${newsHTML}</div>
    `;

    mainContent.appendChild(wrapper);

    wrapper.querySelector(".chart-widget").appendChild(createTradingViewScript("advanced-chart", chartConfig));
    wrapper.querySelector(".single-widget").appendChild(createTradingViewScript("single-quote", priceWidgetConfig));
}
