/**
 * @author: wangzp
 * @date: 2021-11-29 13:37
 */
function run() {
    const arr = []
    // 排序
    if (false) {
        LIST.sort(function (a, b) {
            return b.create_time - a.create_time
        })
    }
    if (false) {
        LIST.sort(function (a, b) {
            return b.external_get - a.external_get
        })
    }
    for (let i = 0; i < LIST.length; i++) {
        const item = LIST[i]
        if (
            (item.education !== '研究生' && item.education !== '本科' && item.education !== '大专')
            ||
            item.age > 31
            || item.born_data.includes('北京')
            || item.marriage === '离异'
        ) {
            continue
        }
        const str = `
                    <div class="item">
                        <div class="left-img">
                            <div class="img-avatar"><img src="${item.avatar}" alt=""></div>
                            <div class="img-middle">
                                <div class="img-item"><img src="${item.upper}" alt=""></div>
                                <div class="img-item"><img src="${item.body}" alt=""></div>
                            </div>
                            <div class="img-wx"><img src="${item.headimgurl}" alt=""></div>
                        </div>
                        <div class="right-content">
                            <div class="text-row">
                                <div class="text-item">${item.id}：${item.realname}</div>
                                <div class="text-item">${item.birthday}</div>
                                <div class="text-item">${item.height}，${item.weight}</div>
                                <div class="text-item">${item.born_data}</div>
                            </div>
                            <div class="text-row">
                                <div class="text-item">${item.education}，${item.profession}，${item.income}</div>
                                <div class="text-item">${item.house}，${item.smoke}</div>
                                <div class="text-item">${item.nation}，${item.marriage}，${item.marry_date}</div>
                            </div>
                            <div class="text-row">
                                <div class="text-item">创建时间：${new Date(item.create_time * 1000).format('yyyy-MM-dd hh:mm:ss')}</div>
                                <div class="text-item">VIP：${item.vip}</div>
                                <div class="text-item">微信被获取次数：${item.external_get}</div>
                            </div>
                            <div class="text-row">
                                <div class="text-item text-remark">${item.monologue}</div>
                            </div>
                        </div>
                    </div>
                `
        arr.push(str)
    }
    $('#wrap').html(arr.join(''))

    $(".left-img").on('click', function (e) {
        const src = e.target.currentSrc
        if (src) {
            $("#popup").show()
            $("#popup-img").attr('src', src.split('?')[0])
        }
    })
    $("#popup").on('click', function () {
        $("#popup").hide()
    })
}