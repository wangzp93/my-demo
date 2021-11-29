const fs = require('fs')
const child_process = require('child_process')

const TOTAL_LIST = []
let PAGE = 1
const COOKIE = 'g3vi35nkbuq7tidi5prkavkc6l'

// 执行curl，返回数据
function doCurl(curl) {
    return new Promise(function(resolve, reject) {
        child_process.exec(curl, function(err, stdout, stderr) {
            if (err === null) {
                resolve(stdout)
            }
            reject(err)
        })
    })
}

// 根据页码传参
function getCurl(page) {
    return `curl -H "Host: bjcc.yijiehunlian.com" -H "Accept: */*" -H "Origin: http://bjcc.yijiehunlian.com" -H "X-Requested-With: XMLHttpRequest" -H "User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x63030532)" -H "Content-Type: application/x-www-form-urlencoded; charset=UTF-8" -H "Cookie: PHPSESSID=${COOKIE}" -H "Referer: http://bjcc.yijiehunlian.com/index/index2" -H "Accept-Language: zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7" --data-binary "page=${page}&queryFlag=" --compressed "http://bjcc.yijiehunlian.com/index/lists2.html"`
}


function run() {
    const curl = getCurl(PAGE)
    console.log('爬取数据中，请稍后...')
    doCurl(curl).then(r=> {
        const res = JSON.parse(r)
        if (res.code === 0) {
            const resData = res.data
            PAGE++
            const list = resData.data
            TOTAL_LIST.push(...list)

            if (resData.current_page >= resData.last_page) {
                fs.writeFile('./data.json', JSON.stringify(TOTAL_LIST), function (err) {
                    if (!err) {
                        console.log('写入成功！')
                    } else {
                        console.log(err)
                    }
                })
                clearInterval(timer)
            } else {
                console.log('等待5s，开始下一次爬取...')
            }
        }
    })
}

const timer = setInterval(run, 5000)