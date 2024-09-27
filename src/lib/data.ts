export class StringLib{
    static translateCron(cronString: string): string {

        // 分解 cron 字符串
        const fields = cronString.split(' ');
        if (fields.length !== 5) {
            throw  "无效的 cron 字符串";
        }
      
        const [minute, hour, day, month, weekday] = fields;
        if (day!="*" && weekday!="*"){
            throw "无效的 cron 字符串";    
        }
        // 翻译分钟
        let minuteDesc: string;
         if (minute === '*'){
             minuteDesc = "每分钟";
         }else{
             const parts = minute.split(',')
             const descs = []
             for (const item of parts){
                 if (item.includes('-')){
                     descs.push(item.split('-').map(a=>`${a}分`).join('到'))
                 }else if (item.includes('/')){
                     const [start,every] = item.split('/')
                     if (start==='*'){
                         descs.push(`每${every}分钟`)
                     }else{
                         descs.push(`${start}分开始的每${every}分钟`)    
                     }
                 }else{
                     descs.push(`${item}分`)
                 }
             }
             minuteDesc = descs.join('、')
         }
      
        // 翻译小时
        let hourDesc: string;
        if (hour === '*'){
            hourDesc = "每小时";
        }else{
            const parts = hour.split(',')
            const descs = []
            for (const item of parts){
                if (item.includes('-')){
                    descs.push(item.split('-').map(a=>`${a}点`).join('到'))
                }else if (item.includes('/')){
                    const [start,every] = item.split('/')
                    if (start==='*'){
                        descs.push(`每${every}个小时`)
                    }else{
                        descs.push(`${start}点开始的每${every}个小时`)    
                    }
                }else{
                    descs.push(`${item}点`)
                }
            }
            hourDesc = descs.join('、')+'的'
        }
              
        // 翻译日期
        let dayDesc: string;
        if (day === '*'){
            dayDesc = "每天";
        }else{
            const parts = day.split(',')
            const descs = []
            for (const item of parts){
                if (item.includes('-')){
                    descs.push(item.split('-').map(a=>`${a}号`).join('到'))
                }else if (item.includes('/')){
                    const [start,every] = item.split('/')
                    if (start==='*'){
                        descs.push(`每${every}天`)
                    }else{
                        descs.push(`${start}号开始的每${every}天`)    
                    }
                }else{
                    descs.push(`${item}号`)
                }
            }
            dayDesc = '每天'+descs.join('、')+'的'
        }
      
        // 翻译月份
        let monthDesc: string;
        if (month === '*'){
            monthDesc = "";
        }else{
            const parts = month.split(',')
            const descs = []
            for (const item of parts){
                if (item.includes('-')){
                    descs.push(item.split('-').map(a=>`${a}月`).join('到'))
                }else if (item.includes('/')){
                    const [start,every] = item.split('/')
                    if (start==='*'){
                        descs.push(`每${every}个月`)
                    }else{
                        descs.push(`${start}月开始的每${every}个月`)    
                    }
                }else{
                    descs.push(`${item}月`)
                }
            }
            monthDesc = descs.join('、')+'的'
        }
        // 翻译星期几
        let weekdayDesc: string;
        if (weekday === '*'){
            weekdayDesc = "";
        }else{
            const parts = weekday.split(',')
            console.log("周:",parts)
            const descs = []
            for (const item of parts){
                if (item.includes('-')){
                    descs.push(item.split('-').map(a=>`周${a==='0'?'日':a}`).join('到'))
                }else if (item.includes('/')){
                    const [start,every] = item.split('/')
                    if (start==='*'){
                        descs.push(`每${every}天`)
                    }else{
                        descs.push(`周${start}开始的每${every}天`)    
                    }
                }else{
                    descs.push(`周${item==='0'?'日':item}`)
                }
            }
            weekdayDesc = descs.join('、')+'的'
        }
      
        // 组合描述
        return `任务在${monthDesc}${weekdayDesc}${dayDesc}${hourDesc}${minuteDesc}执行`;
      }
      
}