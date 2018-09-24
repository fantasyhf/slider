$.fn.extend({
    // 在每个li上添加位置信息
    setPos: function () {
        this.each(function (index, ele) {
            ele.left = -index * $(ele).width();
        });
    },
    // 获取位置
    getPos: function (index) {
        return this.children().get(index).left;                  
    },
    // 运动函数
    sliderMove: function (dir, index) {
        var curIndex = index || 0;
        var self = this;
        var liLength = self.children().length;
        var timer;
        if (self.data('lock')) {
            self.data('lock', false);
            if (dir == 'next') {
                curIndex ++;
            }else if (dir == 'pre') {
                curIndex --;
            }
            // 逆向闪现
            if (curIndex == -1) {
                self.css('left', self.getPos(liLength - 1));
                curIndex = liLength - 2;
            }
            self.animate({
                left: self.getPos(curIndex)
            }, 1000, 'swing', function () {  
                // 正向闪现
                if (curIndex == liLength - 1) {
                    self.css('left', 0);
                    curIndex = 0;
                }
                // 更新圆点样式
                $('.spot li')
                    .css('background','none')
                    .filter(function (index) {
                        if (curIndex == liLength - 1) {
                            return index == 0;
                        }
                        return index == curIndex;
                    })
                    .css('background', 'orange');
                clearTimeout(self.data('timer'));
                timer = setTimeout(function () {
                    self.sliderMove('next', curIndex);
                }, 2000);
                // 更新运动状态
                self.data({
                    curIndex: curIndex,
                    timer: timer,
                    lock: true
                });
            });
        }
    },
    bindEvent: function () {
        var slider = $('.imgWrapper');
        $('.btn div', slider.parent()).each(function (index, ele) {
            $(ele).click(function () {
                this.className == 'left' ? slider.sliderMove('pre', slider.data('curIndex'))
                :
                slider.sliderMove('next', slider.data('curIndex'));
            })
        });
        $('.spot li', slider.parent()).each(function (index, ele) {
            $(ele).click(function () {
                if (index > slider.data('curIndex')) {
                    slider.sliderMove('next', index - 1);
                }
                if (index < slider.data('curIndex')) {
                    slider.sliderMove('pre', index + 1);
                }
            })
        });
        $('.btn div', slider.parent()).on('selectstart', function () {
            return false;
        });
    },
    initSlider: function (target, data) {
        var imgUl = $('<ul class="imgWrapper"></ul>');
        var imgLiStr = '';
        var btn = $('<div class="btn"><div class="left">&lt;</div><div class="right">&gt;</div></div>');
        var spotUl = $('<ul class="spot"></ul>');
        var spotLiStr = '';
        var len = data['imgList'].length;
        //DOM
        for (var i = 0; i < len; i++) {
            imgLiStr += '<li>\
                <img src="' + data['imgList'][i] + '">\
            </li>';
            spotLiStr += '<li></li>';
        }
        imgLiStr += '<li><img src="' + data['imgList'][0] + '"></li>';
        imgUl.append($(imgLiStr));
        spotUl.append($(spotLiStr));
        target.append(imgUl);
        target.append(btn);
        target.append(spotUl);
        //CSS
        target.addClass('showArea');
        $('.spot li:first', target).css('background', 'orange'); // 初始化圆点样式
        $('.spot li', target).css('cursor', 'pointer');
        imgUl.css('width', (len + 1) * data['width']);
        spotUl.css('margin-left', - 1/2 * (spotUl.width()));
        target.add($('img', target)).css({
            width: data['width'],
            height: data['height']
        });
        //jq
        $('.imgWrapper li', target).setPos();
        $('.btn', target).bindEvent();
        $('.imgWrapper', target).data('lock', true);
        $('.imgWrapper', target).delay(2000).sliderMove('next'); //运动初始化
    },
    createSlider: function (options) {
        //this -> .showArea
        this.initSlider(this, options);
    }
});