var os = function () {
  var ua = navigator.userAgent,
    isWindowsPhone = /(?:Windows Phone)/.test(ua),
    isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
    isAndroid = /(?:Android)/.test(ua),
    isFireFox = /(?:Firefox)/.test(ua),
    isChrome = /(?:Chrome|CriOS)/.test(ua),
    isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
    isPhone = /(?:iPhone)/.test(ua) && !isTablet,
    isPc = !isPhone && !isAndroid && !isSymbian;
  return {
    isTablet: isTablet,
    isPhone: isPhone,
    isAndroid: isAndroid,
    isPc: isPc
  }
}()

function getCookie(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2)
		return parts.pop().split(";").shift();
}

function getToken() {
	let value = getCookie('UM_distinctid');
	if (!value) {
		return defaultToken;
	}
	return value.substring(value.length - 6).toUpperCase();
}



// 文章所在容器的选择器
var articleSelector = 'article.post.container.need';

// DOM 完全就绪时执行
$(function() {
	// 找到文章所在的容器
	var $article = $(articleSelector);
	if ($article.length > 0) {
		// 文章的实际高度
		var article = $article[0], height = article.clientHeight;
		// 文章隐藏后的高度
		var halfHeight = height * 0.8;
		
		// 篇幅短一点的文章就不需要解锁了
		if (os.isPc && halfHeight > 800) {
			
			// 获取口令
			var token = getToken();
			$('.asb-post-01').find('.token').text(token);
			
var _lock = function() {
	$article.css('height', halfHeight + 'px');
	$article.addClass('lock');
	$('.asb-post-01').css('display', 'block');
}

var _unlock = function() {
	$article.css('height', 'initial');
	$article.removeClass('lock');
	$('.asb-post-01').css('display', 'none');
}

// 查询后端的结果
var _detect = function() {
	console.log('Detecting Token', token);
	$.ajax({
		url : 'http://ityouknow.com/jfinal/wx/',
		method : 'GET',
		data : {
			token : token
		},
		success : function(data) {
			console.log('locked', data.locked);

			if (data.locked === true) {
				_lock();
			} else {
				_unlock();
			}
		},
		error : function(data) {
			_unlock();
		}
	})
}

_detect();
setInterval(function() {
	_detect();
}, 5000);
		}
	}
});