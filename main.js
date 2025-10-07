async function main() {
    for (let i = 0; i < watchlist.length; i++) {
        await createSymbolSection(watchlist[i])
    }
    await createNewsSection();
}

main();
