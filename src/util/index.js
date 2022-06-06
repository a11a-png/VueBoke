let padDate = (value) => {
    return value < 10 ? "0" + value : value;
};
//過濾方法  时间解析
export function formatDate(value) {
    //这里的 value 就是需要过滤的数据
    var date = new Date(value);
    var year = date.getFullYear();
    var month = padDate(date.getMonth() + 1);
    var day = padDate(date.getDate());
    var hours = padDate(date.getHours());
    var minutes = padDate(date.getMinutes());
    var seconds = padDate(date.getSeconds());
    return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
    );
}