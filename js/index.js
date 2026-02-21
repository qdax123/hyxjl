// 2. JavaScript层面拦截复制粘贴相关事件
document.addEventListener('DOMContentLoaded', function () {
    // 禁止右键菜单
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        // alert('本页面禁止右键操作！'); // 可选：提示信息
    });

    // 禁止复制 (ctrl+c)
    document.addEventListener('copy', function (e) {
        e.preventDefault();
        // alert('本页面禁止复制内容！'); // 可选：提示信息
    });

    // 禁止剪切 (ctrl+x)
    document.addEventListener('cut', function (e) {
        e.preventDefault();
        // alert('本页面禁止剪切内容！'); // 可选：提示信息
    });

    // 禁止粘贴 (ctrl+v)
    document.addEventListener('paste', function (e) {
        e.preventDefault();
        // alert('本页面禁止粘贴内容！'); // 可选：提示信息
    });

    // 禁止选择文本 (补充CSS的防护)
    document.addEventListener('selectstart', function (e) {
        // 允许特定区域选择
        if (!e.target.closest('.allow-select')) {
            e.preventDefault();
        }
    });

    // 禁止拖拽文本
    document.addEventListener('dragstart', function (e) {
        e.preventDefault();
    });

    // 拦截常见的快捷键
    document.addEventListener('keydown', function (e) {
        // 禁止 Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A
        if ((e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a')) ||
            // 禁止 Shift+Insert (粘贴)
            (e.shiftKey && e.key === 'Insert')) {
            e.preventDefault();
            // alert('本页面禁止使用快捷键复制粘贴！');
        }
    });
});

// 方案1：拦截快捷键
document.addEventListener('keydown', function (e) {
    // 拦截F12
    if (e.key === 'F12') {
        e.preventDefault();
        // alert('禁止使用F12打开控制台！');
        return false;
    }

    // 拦截Ctrl+Shift+I
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        // alert('禁止使用快捷键打开控制台！');
        return false;
    }

    // 拦截Ctrl+Shift+J (Chrome)
    if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        // alert('禁止使用快捷键打开控制台！');
        return false;
    }

    // 拦截Ctrl+U (查看源码)
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        // alert('禁止查看网页源码！');
        return false;
    }
});

// 方案2：禁止右键菜单（防止通过右键打开检查）
// document.addEventListener('contextmenu', function (e) {
//     e.preventDefault();
//     // alert('本页面禁止右键操作！');
//     return false;
// });

// 方案3：检测控制台是否已打开（核心防护）
function detectConsole() {
    const consoleWarn = document.getElementById('consoleWarn');
    let check;

    try {
        // 创建一个占用控制台空间的元素
        const size = 10;
        const div = document.createElement('div');
        const before = new Date().getTime();

        // 控制台打印会触发元素的toString方法
        div.toString = function () {
            check = true;
        };

        // 尝试打印元素到控制台
        console.log(div);
        console.clear();

        // 检测控制台窗口尺寸
        if (window.outerHeight - window.innerHeight > size ||
            window.outerWidth - window.innerWidth > size) {
            check = true;
        }
    } catch (err) {
        check = true;
    }

    // 如果检测到控制台打开
    if (check) {
        consoleWarn.style.display = 'block';
        // 可选：刷新页面/跳转到其他页面/禁用页面功能
        // location.reload();
        // document.body.innerHTML = '<h1>检测到非法操作，页面已禁用</h1>';
    } else {
        consoleWarn.style.display = 'none';
    }
}

// 定时检测控制台状态（每500ms检测一次）
setInterval(detectConsole, 500);

// 方案4：拦截地址栏的javascript伪协议（有限防护）
// 注：这个只能拦截部分情况，无法完全阻止
window.addEventListener('beforeunload', function (e) {
    if (document.activeElement.tagName === 'INPUT' &&
        document.activeElement.type === 'url') {
        const val = document.activeElement.value;
        if (val.startsWith('javascript:')) {
            e.preventDefault();
            return false;
        }
    }
});

// 悬浮窗