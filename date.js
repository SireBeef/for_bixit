function getYesterdaysDate() {
    let dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - 1);
    let yesterday = dateObj.toISOString().split("T")[0];
    console.log(yesterday);
    return yesterday;
}
