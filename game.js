
/*document.onkeydown = function (e) {    //对整个页面监听  
    var keyNum = window.event ? e.keyCode : e.which;       //获取被按下的键值   
    if (keyNum == 38) {

        newgame.shot()

    }
}*/
//换弹加子弹gif，子弹加gif
// function display(id) {
//     document.getElementById(id + '1').style = "display:block;"
// }
// function hide(id) {
//     document.getElementById(id + '1').style.display = "none"
// }
window.onload = window.onresize = function () {
    document.body.style.zoom = 0.8
};
document.onkeydown = function (e) {    //对整个页面监听  
    var keyNum = window.event ? e.keyCode : e.which;       //获取被按下的键值   
    if (keyNum == 38 && mode == 2) {//p2
        newgame.p2shotcheck()
    } else if (keyNum == 32) {//p1
        newgame.p1shotcheck()
    }
}
//获取参数方法
function GetUrlParam(level) {
    var reg = new RegExp("(^|&)" + level + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
//使用获取参数方法
var mode = GetUrlParam("gamep");
var level = GetUrlParam("level");

// document.onmousedown = testmouse;
// function testmouse(e) {
//     var e = window.event || e;
//     var value = e.button;
//     if (value == 2 || value == 3) {
//         alert("右键");
//     }
//     else if (value == 0) {
//         alert("左键");
//     }
// }
// document.getElementById('shotbutton').onmousedown = function (e) {
//     var e = window.event || e;
//     var value = e.button;
//     if (value == 2) {
//         alert('')
//     }
// }
document.oncontextmenu = function () {
    return false;
}
class onegame {//一轮游戏
    constructor() {
        if (level == 1) {
            this.difficult = 350
        } else if (level == 2) {
            this.difficult = 310
        } else if (level == 3) {
            this.difficult = 260
        }
        this.p1hit = this.p2hit = 0
        this.randtime1 = new Date().getTime() + Math.random() * 5000 + 5000
        this.randtime2 = this.randtime1 + this.difficult//时间2反应时间
        this.leftTime1 = this.leftTime2 = 0//剩余时间1，2，
        this.gamecount = 0//局数
        this.onegameover = this.isgameover = false
        this.p1bulletcount = this.p2bulletcount = 6//子弹数
        this.shotbutton = document.getElementById('shotbutton')
        this.probox = document.getElementById('probox')//提示框
        this.probox2 = document.getElementById('probox2')//提示框2
        this.shotalert = document.getElementById('shotalert')
        if (mode == 1) {
            this.probox.innerHTML = "<tr class='pro'><td><div>提示：</div></td></tr>" +
                "<tr class='pro'><td><div>1.等待射击键亮起后按下空格或点击按钮进行射击</div></td></tr>" +
                "<tr class='pro'><td><div>2.其中一方子弹射击完后游戏结束</div></td></tr>";
        } else if (mode == 2) {
            this.probox.innerHTML = "<tr class='pro'><td><div>提示：</div></td></tr>" +
                "<tr class='pro'><td><div>1.等待射击键亮起后按下空格进行射击</div></td></tr>" +
                "<tr class='pro'><td><div>2.其中一方子弹射击完后游戏结束</div></td></tr>";
        }
        this.probox2.innerHTML = "<tr class='pro'><td><div>提示：</div></td></tr>" +
            "<tr class='pro'><td><div>1.等待射击键亮起后按下↑键进行射击</div></td></tr>" +
            "<tr class='pro'><td><div>2.其中一方子弹射击完后游戏结束</div></td></tr>";
        this.p1bulletcountimg = document.getElementById("p" + String(mode) + "p1bulletcount")//p1bullet图片
        this.p2bulletcountimg = document.getElementById("p" + String(mode) + "p2bulletcount")//p2bullet图片
        this.p1 = document.getElementById("p" + String(mode) + "p1")//p1图片
        this.p2 = document.getElementById("p" + String(mode) + "p2")//p2图片

        setTimeout(() => {
            this.canclick = true//触发射击或继续或重来设为false防止点击过快
        }, 1000);

    }
    nextgame() {
        this.randtime1 = new Date().getTime() + Math.random() * 5000 + 5000
        this.randtime2 = this.randtime1 + newgame.difficult//时间2反应时间,难度
        this.leftTime1 = this.leftTime2 = 0//剩余时间1，2，
        this.onegameover = false
        countTime()
    }
    check() {
        //this.bulletcount.innerHTML = '<img src="./generalimgs/bullet' + String(this.p1bulletcount) + '.gif" alt="" id="bulletcount">'
        this.buttonnojixu()
        if (this.p1bulletcount == 0 || this.p2bulletcount == 0) {
            this.isgameover = true//子弹0结束
            this.buttonnoreset()
            setTimeout(() => {
                this.buttonreset();
            }, 1000);
            if (this.p1hit > this.p2hit) {
                this.probox.innerHTML = "<tr class='pro'><td><div>游戏结束，您击中" + String(this.p1hit) + "次,获胜！</div></td></tr>" + this.probox.innerHTML;
                this.probox2.innerHTML = "<tr class='pro'><td><div>游戏结束，您击中" + String(this.p1hit) + "次,失败！</div></td></tr>" + this.probox.innerHTML;
            } else if (this.p1hit < this.p2hit) {
                this.probox.innerHTML = "<tr class='pro'><td><div>游戏结束，您击中" + String(this.p1hit) + "次,失败！</div></td></tr>" + this.probox.innerHTML;
                this.probox2.innerHTML = "<tr class='pro'><td><div>游戏结束，您击中" + String(this.p1hit) + "次,获胜！</div></td></tr>" + this.probox.innerHTML;
            } else {
                this.probox.innerHTML = "<tr class='pro'><td><div>游戏结束，您击中" + String(this.p1hit) + "次,平局！</div></td></tr>" + this.probox.innerHTML;
                this.probox2.innerHTML = "<tr class='pro'><td><div>游戏结束，您击中" + String(this.p1hit) + "次,平局！</div></td></tr>" + this.probox.innerHTML;
            }
            this.p1.src = "./p" + String(mode) + "imgs/p1stand.gif"
            if (mode == 1) {
                this.p1bulletcountimg.src = "./generalimgs/reload.gif"
            }
            else {
                this.p1bulletcountimg.src = "./generalimgs/bullet6.gif"
                this.p2bulletcountimg.src = "./generalimgs/bullet6.gif"
            }

            //加游戏结果
        }
    }
    checkmousekey() {
        var e = window.event || e;
        var value = e.button;
        var value2 = e.keyCode;
        if (value == 0) {
            return true
        }
        else if (value2 == 32) {
            return true
        } else {
            return false
        }
    }
    p1preshot() {//p1提前

        this.gamecount += 1
        this.onegameover = true
        this.p1bulletcount -= 1
        this.p1bulletcountimg.src = "./generalimgs/bullet" + String(this.p1bulletcount) + ".gif"
        this.p1.src = "./p" + String(mode) + "imgs/p1shot.gif"
        this.probox.innerHTML = "<tr class='pro'><td><div>第" + String(this.gamecount) + "轮：提前射击！本次射击无效。</div></td></tr>" + this.probox.innerHTML;
        this.probox2.innerHTML = "<tr class='pro'><td><div>第" + String(this.gamecount) + "轮：对方提前射击！对方本次射击无效。</div></td></tr>" + this.probox2.innerHTML;

        this.check()
    }
    p1shot() {//p1成功
        this.p1hit += 1
        this.gamecount += 1
        this.onegameover = true
        this.p1bulletcount -= 1
        this.p1bulletcountimg.src = "./generalimgs/bullet" + String(this.p1bulletcount) + ".gif"
        this.p1.src = "./p" + String(mode) + "imgs/p1shot.gif"
        this.probox.innerHTML = "<tr class='pro'><td><div>第" + String(this.gamecount) + "轮：成功击中,反应时间：" + String(Math.floor(new Date().getTime() - this.randtime1)) + "ms。" + "</div></td></tr>" + this.probox.innerHTML;
        this.probox2.innerHTML = "<tr class='pro'><td><div>第" + String(this.gamecount) + "轮：太慢啦！你被击中</div></td></tr>" + this.probox2.innerHTML;
        this.check()
    }
    //p2游戏p1p2shot做gif
    p2preshot() {//p2提前
        this.gamecount += 1
        this.onegameover = true
        this.p2bulletcount -= 1
        this.p2bulletcountimg.src = "./generalimgs/bullet" + String(this.p2bulletcount) + ".gif"
        this.p2.src = "./p" + String(mode) + "imgs/p2shot.gif"
        this.probox.innerHTML = "<tr class='pro'><td><div>第" + String(this.gamecount) + "轮：对方提前射击！对方本次射击无效。</div></td></tr>" + this.probox.innerHTML;
        this.probox2.innerHTML = "<tr class='pro'><td><div>第" + String(this.gamecount) + "轮：提前射击！本次射击无效。</div></td></tr>" + this.probox2.innerHTML;

        this.check()
    }
    p2shot() {//p2成功
        this.p2hit += 1
        this.gamecount += 1
        this.probox.innerHTML = "<tr class='pro'><td><div>第" + String(this.gamecount) + "轮：太慢啦！你被击中。</div></td></tr>" + this.probox.innerHTML;
        this.probox2.innerHTML = "<tr class='pro'><td><div>第" + String(this.gamecount) + "轮：成功击中,反应时间：" + String(Math.floor(new Date().getTime() - this.randtime1)) + "ms。" + "</div></td></tr>" + this.probox2.innerHTML;
        this.p2bulletcount -= 1
        this.p2bulletcountimg.src = "./generalimgs/bullet" + String(this.p2bulletcount) + ".gif"
        this.p2.src = "./p" + String(mode) + "imgs/p2shot.gif"

        this.onegameover = true
        this.check()
    }
    buttonlight() {
        this.shotbutton.src = './generalimgs/canshot.png'
        this.shotalert.style.display = "none"
    }
    buttondark() {
        this.shotbutton.src = './generalimgs/noshot.png'
        this.shotalert.style.display = "block"
    }
    buttonjixu() {
        this.shotbutton.src = './generalimgs/jixu.png'
        // this.shotbutton.style = "pointer-events:all;"
        this.shotalert.style.display = "none"
    }
    buttonnojixu() {
        this.shotbutton.src = './generalimgs/nojixu.png'
        // this.shotbutton.style = "pointer-events:none;"
        this.shotalert.style.display = "none"
    }
    buttonnoreset() {
        this.shotbutton.src = './generalimgs/noreset.png'
        this.shotalert.style.display = "none"
    }
    buttonreset() {
        this.shotbutton.style = "pointer-events:all;"
        this.shotbutton.src = './generalimgs/reset.png'
        this.shotalert.style.display = "none"
    }
    p1shotcheck() {
        if (!this.onegameover) {
            if (this.leftTime1 > 0) {//提前
                if (this.checkmousekey()) {
                    if (this.canclick) {
                        this.canclick = false
                        this.p1preshot()
                        setTimeout(() => {
                            this.canclick = true
                            if (!this.isgameover) {
                                this.buttonjixu()
                            }
                        }, 1000);
                    }
                }
            } else if (this.leftTime1 <= 0 && this.leftTime2 >= 0) {//成功
                if (this.checkmousekey()) {
                    if (this.canclick) {
                        this.canclick = false
                        this.p1shot()
                        setTimeout(() => {
                            this.canclick = true
                            if (!this.isgameover) {
                                this.buttonjixu()
                            }
                        }, 1000);
                    }
                }
            } else {//双人超时
                if (this.canclick) {
                    this.canclick = false
                    this.p1shot()
                    setTimeout(() => {
                        this.canclick = true
                        this.buttonjixu()
                    }, 1000);
                }
            }
        } else if (!this.isgameover) {//点击继续
            if (this.checkmousekey()) {
                if (this.canclick) {
                    this.canclick = false
                    this.buttondark()
                    this.nextgame()
                    setTimeout(() => {
                        this.canclick = true
                    }, 1500);
                }
            }
        } else {//重来
            if (this.checkmousekey()) {
                if (this.canclick) {
                    this.canclick = false
                    test2()
                    setTimeout(() => {
                        this.canclick = true
                    }, 1500);
                }
            }
        }
    }
    p2shotcheck() {
        if (!this.onegameover) {
            if (this.leftTime1 > 0) {//提前
                if (this.canclick) {
                    this.canclick = false
                    this.p2preshot()
                    setTimeout(() => {
                        this.canclick = true
                        this.buttonjixu()
                    }, 1000);
                }

            } else if (this.leftTime1 <= 0 && this.leftTime2 >= 0) {//成功
                if (this.canclick) {
                    this.canclick = false
                    this.p2shot()
                    setTimeout(() => {
                        this.canclick = true
                        this.buttonjixu()
                    }, 1000);
                }
            } else {//双人超时
                if (this.canclick) {
                    this.canclick = false
                    this.p2shot()
                    setTimeout(() => {
                        this.canclick = true
                        this.buttonjixu()
                    }, 1000);
                }
            }
        } else if (!this.isgameover) {//点击继续
            if (this.canclick) {
                if (this.canclick) {
                    this.canclick = false
                    this.buttondark()
                    this.nextgame()
                    setTimeout(() => {
                        this.canclick = true
                    }, 1500);
                }
            }

        } else {//重来
            if (this.canclick) {
                this.canclick = false
                test2()
                setTimeout(() => {
                    this.canclick = true
                }, 1500);
            }
        }
    }

}
var newgame;
var ttcou = 0;

function test() {
    var probox = document.getElementById('probox')
    ttcou += 1
    probox.innerHTML = "<tr class='pro'><td><div>" + ".    太慢啦！0</div></td></tr>" + probox.innerHTML;
    document.getElementById('p2p2').src = "./p2imgs/p2shot.gif"
}
function test1() {
    probox.innerHTML = '';
}
function countTime() {//计时器
    if (!newgame.onegameover) {
        var leftTime1 = newgame.randtime1 - new Date().getTime()
        var leftTime2 = newgame.randtime2 - new Date().getTime()
        newgame.leftTime1 = leftTime1
        newgame.leftTime2 = leftTime2

        //alert(this.leftTime1)

        if (leftTime1 < 0) {
            //button亮clickon
            if (leftTime2 > 0) {
                newgame.buttonlight()
                setTimeout(countTime, 10);
            }
            if (leftTime2 <= 0) {
                //超时
                if (mode == 1) {
                    newgame.p2shot()
                    setTimeout(() => {
                        newgame.buttonjixu()
                    }, 1000);
                } else { setTimeout(countTime, 10); }//双人


            }
        }
        if (leftTime1 > 0) {
            setTimeout(countTime, 10);
        }
    }
    return

}
function test2() {

    btn = document.getElementById('btn')

    if (mode == 1) {
        btn.innerHTML = '<img src="./generalimgs/noshot.png" alt="" id="shotbutton" onmousedown="newgame.p1shotcheck()" style="pointer-events:all;">'
        document.getElementById('shotalert').style.display = "block"
    } else {
        btn.innerHTML = '<img src="./generalimgs/noshot.png" alt="" id="shotbutton" onmousedown="newgame.p1shotcheck()" style="pointer-events:none;">'
        document.getElementById('shotalert').style.display = "block"
    }
    newgame = new onegame()

    countTime()


}
function test3() {
    document.getElementById('probox').innerHTML += "<tr class='pro'><td><div>" + "kongge</div></td></tr>"
}
function test4() {
    document.getElementById('probox2').innerHTML += "<tr class='pro'><td><div>" + "up</div></td></tr>"
}
