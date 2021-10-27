var child_process = require("child_process")
var fs = require('fs')

const WAIT = 10000	// 冷却时间

var totalList = []
// 请求数据
function getData() {
	var curl = 'curl -H "Host: m.10010.com" -H "Cookie: MUT_V=wx; SHOP_PROV_CITY=; tianjin_ip=0; tianjincity=11|110; _pk_id.5.db20=38645745b47b9f30.1626433632.2.1626438112.1626436332.; _pk_ses.5.db20=1; TXQQC_CD=a9e063eb-c588-411f-9fdb-6050c2b95493; JSESSIONID=PwuvRBB3h2QRR40q6jLwFHSgCfBr_dfzj_s5N7mA4-WT_ZIYZ8KD!260020289; _pk_ref.5.db20=%5B%22%22%2C%22%22%2C1626436332%2C%22https%3A%2F%2Ftxwk.10010.com%2FKCard%2Fpage%2FvipCenter%2Findex.html%3Fopenid%3DoMwiavzYCOocTfTE3nhS0Sc_2lnQ%22%5D; acw_tc=6797952616264363321301377e9ade294db398fb1d912ae40aae814b52; UID=BXbkhC7aaWfGhxsPjc1dPA0h9fVvpXL0; gipgeo=11|110; mallcity=11|110; unicomMallUid=202171619712; KSESSIONID=M2E3MmU5NTAtYzhlYy00OGE4LTgxZWUtYzNkZjg3ZTAxYTUz" -H "accept: text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01" -H "accept-language: zh-cn" -H "x-requested-with: XMLHttpRequest" -H "user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_16) AppleWebKit/605.1.15 (KHTML, like Gecko) MicroMessenger/6.8.0(0x16080000) MacWechat/3.0.3(0x13000310) NetType/WIFI WindowsWechat" -H "referer: https://m.10010.com/queen/familycard/fill.html?product=0&userNum=2&channel=01-0379-a5j8-a7jy" --compressed "https://m.10010.com/NumApp/NumberCenter/qryNum?callback=jsonp_queryMoreNums&provinceCode=31&cityCode=310&monthFeeLimit=0&groupKey=5601016655&searchCategory=3&net=01&amounts=200&codeTypeCode=&searchValue=&qryType=02&goodsNet=4&_=1626438110622"'
	return new Promise((resolve, reject)=> {
		console.log('正在爬取数据...')
		child_process.exec(curl, function(err, stdout, stderr) {
			if (typeof stdout === 'string' && stdout.includes('jsonp_queryMoreNums')) {
				var res = stdout.replace(/^jsonp_queryMoreNums\(/, '').replace(/\)$/, '')
				resolve(res)
			}
			reject()
		});
	})
}

// 解析数据
async function formatData() {
	var res = await getData()
	var resData = JSON.parse(res)
	var numArray = resData.numArray || []
	var numList = []
	for (var i=0, len=numArray.length; i<len; i++) {
		// 第12个为真实数据，其他过滤
		if (i % 12 !== 0) {
			continue
		}
		var phoneNum = numArray[i]
		// 过滤已存在的
		if (!totalList.includes(phoneNum)) {
			numList.push(phoneNum)
		}
	}
	return numList
}

// 写入数据
function whiteFile(numList) {
	var str = numList.join('\n')
	console.log('开始写入数据...')
	return new Promise((resolve, reject)=> {
		fs.appendFile('num.txt', str + '\n', function(err) {
			if (!err) {
				console.log('写入成功！')
				resolve()
			}
			reject()
		})
	})
}

// 启动
async function run() {
	var numList = await formatData()
	totalList = totalList.concat(numList)

	var date = new Date(),
		year = date.getFullYear(),
		month = date.getMonth() + 1,
		day = date.getDate(),
		hour = date.getHours(),
		min = date.getMinutes(),
		second = date.getSeconds();
	var dateStr = `${year}-${month}-${day} ${hour}:${min}:${second}`
	console.log(`当前时间：${dateStr}，已获取数据${totalList.length}条`)


	await whiteFile(numList)

	if (numList.length > 0) {
		console.log(`为避免封IP，需等待${WAIT/1000}秒钟，请稍后...`)
		setTimeout(run, WAIT)
	} else {
		console.log('爬虫已结束！')
	}
}

run()


