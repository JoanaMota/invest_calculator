exports.handler = async (event, context) => {
    const initial_invest = event['initial_invest'];
    const mensal_invest = event['mensal_invest'];
    const annual_percentage = event['annual_percentage'];
    const years = event['years'];

    let mensal_percentage = annual_percentage / 12;
    let profit_percentage = (100.0 + mensal_percentage) / 100.0;
    let months = years * 12;

    let saved = (initial_invest + mensal_invest) * profit_percentage;

    var months_arr = [];
    var saved_arr = [];

    for (let month = 1; month < months + 1; month++) {
        months_arr.push(month);
        saved_arr.push(saved);
        saved = (saved + mensal_invest) * profit_percentage;
    }

    let invested_money = initial_invest + mensal_invest * months;
    let difference = saved - invested_money;

    const response = {
        statusCode: 200,
        body: JSON.stringify("Investment Calculator"),
        Months: months,
        Saved: saved,
        MonthsArr: months_arr,
        SavedArr: saved_arr,
        InvestedMoney: invested_money,
        Diff: difference,
        logStreamName: context.logStreamName
    };
    return response;
};
