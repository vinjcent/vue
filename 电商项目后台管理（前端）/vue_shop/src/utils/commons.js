/**
 * @desc 函数防抖
 * @param func 函数
 * @param delay 延迟执行毫秒数 默认0.5s
 */
export function debounce(func, delayTime) {
    var delay = delayTime || 500;
    var timer;
    return function () {
        let args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = null;
            func.apply(this, args);
        }, delay);
    }
}

/**
 * @desc 函数节流
 * @param func 函数
 * @param intervalTime 函数执行间隔时间毫秒数 默认1s
 */
export function throttle(func, intervalTime) {
    var last;
    var timer;
    var interval = intervalTime || 1000;
    return function () {
        var th = this;
        var args = arguments;
        var now = +new Date();
        if (last && now - last < interval) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                last = now;
                func.apply(th, args);
            }, interval);
        } else {
            last = now;
            func.apply(th, args);
        }
    }
}

/**
 * <script>
    import { debounce, throttle } from '@/utils/index.js'
    export default {
        data() {
            return {
                num: 0
            }
        },
        methods: {
            // 防抖
            clickDebounce: debounce(function() {
                this.num += 1
                console.log('第' + this.num +'次点击' )
            }, 600),
            // 节流
            clickThrottle: throttle(function() {
                this.num += 1
                console.log('第' + this.num +'次点击' )
            }, 800)
        }
    }
</script>
 */