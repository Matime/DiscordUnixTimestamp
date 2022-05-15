const inputDate = document.getElementById('inputDate');
const inputTime = document.getElementById('inputTime');
const inputFormat = document.getElementById('inputFormat');
const tdPreview = document.getElementById('preview');
const output = document.getElementById('output');
const formats = {
    "t": { timeStyle: 'short' },
    "T": { timeStyle: 'medium' },
    "d": { dateStyle: 'short' },
    "D": { dateStyle: 'long' },
    "f": { timeStyle: 'short', dateStyle: 'long' },
    "F": { timeStyle: 'short', dateStyle: 'full' },
    "R": { style: 'long', numeric: 'auto' }
}
initialize();
function initialize() {
    let currentDate = new Date();
    inputDate.value = `${currentDate.getFullYear()}-${tdf(currentDate.getMonth()+1)}-${tdf(currentDate.getDate())}`;
    inputTime.value = `${tdf(currentDate.getHours())}:${tdf(currentDate.getMinutes())}`;
    inputDate.addEventListener('change', generatePreviewAndOutput);
    inputTime.addEventListener('change', generatePreviewAndOutput);
    inputFormat.addEventListener('change', generatePreviewAndOutput);
    output.addEventListener('click',()=>{navigator.clipboard.writeText(output.value); alert('Copied timestamp to clipboard!');})
    generatePreviewAndOutput();   
}
function tdf(num) {
    return num.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
}
function generatePreviewAndOutput() {
    const inputFormatVal = inputFormat.value;
    const inputDateVal = inputDate.value;
    const inputTimeVal = inputTime.value;
    const d = new Date(`${inputDateVal}T${inputTimeVal}`);
    let dateString;
    const nonRelativeFormats = "tTdDfF";
    if(nonRelativeFormats.indexOf(inputFormatVal)!=-1)
        dateString = new Intl.DateTimeFormat('en',formats[inputFormatVal]).format(d)
    else
        dateString = getRelativeDifference(d);
    tdPreview.textContent = dateString;
    output.value =`<t:${d.getTime()/1000}:${inputFormatVal}>`;

}

function getRelativeDifference(d) {
    const diff = -((Date.now() - d.getTime()) / 1000) | 0;
    const absDiff = Math.abs(diff);
    const secondsInDay = 86400;
    let value;
    let unit;
    if (absDiff > secondsInDay * 30 * 10) {
        unit='years';
        value = Math.round(diff / (secondsInDay * 365));
    }
    else if (absDiff > secondsInDay * 25) {
        unit = 'months';
        value = Math.round(diff / (secondsInDay * 30));
    }
    else if (absDiff > 3600 * 21) {
        unit = 'days';
        value = Math.round(diff / secondsInDay);
    }
    else if (absDiff > 60 * 44) {
        unit = 'hours';
        value = Math.round(diff / 3600);
    }
    else if (absDiff > 30) {
        unit = 'minutes';
        value = Math.round(diff / 60);
    }else{
        unit = 'seconds';
        value = diff;
    }
    return new Intl.RelativeTimeFormat('en',formats['R']).format(value,unit);
}
