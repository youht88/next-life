export class StringLib{
    static translateCron(cronString: string): string {
        // 分解 cron 字符串
        const fields = cronString.split(' ');
        if (fields.length !== 5) {
            return "无效的 cron 字符串";
        }
      
        const [minute, hour, day, month, weekday] = fields;
      
        // 翻译分钟
        let minuteDesc: string;
        if (minute === '*') {
            minuteDesc = "的每分钟执行";
        } else if (minute.includes(',')) {
            minuteDesc = "" + minute.replace(/,/g, ' 和 ') + "分执行";
        } else if (minute.includes('-')) {
            minuteDesc = "" + minute + "分执行";
        } else if (minute.includes('/')){
            minuteDesc = "每"+minute.replace(/\*\//g,'')+ "分钟执行";
        } else {
            minuteDesc = `${minute}分执行`;
        }
      
        // 翻译小时
        let hourDesc: string;
        if (hour === '*') {
            hourDesc = "每小时";
        } else if (hour.includes(',')) {
            hourDesc = "" + hour.replace(/,/g, ' 和 ') + "点";
        } else if (hour.includes('-')) {
            hourDesc = "" + hour + "点";
        } else if (hour.includes('/')){
            hourDesc = "每"+hour.replace(/\*\//g,'')+ "个小时";
         } else {
            hourDesc = `${hour}点`;
        }
      
        // 翻译日期
        let dayDesc: string;
        if (day === '*') {
            dayDesc = "每天";
        } else if (day.includes(',')) {
            dayDesc = "" + day.replace(/,/g, ' 和 ') + "号的";
        } else if (day.includes('-')) {
            dayDesc = "" + day + "号的";
        } else if (day.includes('/')){
            dayDesc = "每"+day.replace(/\*\//g,'')+ "天执行";
        } else {
            dayDesc = `${day}号的`;
        }
      
        // 翻译月份
        let monthDesc: string;
        if (month === '*') {
            monthDesc = "在每月的";
        } else if (month.includes(',')) {
            monthDesc = "在" + month.replace(/,/g, ' 和 ') + "月的";
        } else if (month.includes('-')) {
            monthDesc = "在" + month + "月的";
        } else if (month.includes('/')){
            monthDesc = "每"+month.replace(/\*\//g,'')+ "个月的";
        } else {
            monthDesc = `在${month}月的`;
        }
      
        // 翻译星期几
        let weekdayDesc: string;
        if (weekday === '*') {
            weekdayDesc = "";
        } else if (weekday.includes(',')) {
            weekdayDesc = "星期 " + weekday.replace(/,/g, ' 和 ') + "的";
        } else if (weekday.includes('-')) {
            weekdayDesc = "星期" + weekday + "的";
        } else {
            weekdayDesc = `星期${weekday}的`;
        }
      
        // 组合描述
        return `${monthDesc}${weekdayDesc}${dayDesc}${hourDesc}${minuteDesc}`;
      }
      
}