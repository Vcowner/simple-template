// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
    const demoBtn = document.getElementById('demo-btn');
    const demoText = document.getElementById('demo-text');
    let clickCount = 0;

    // 按钮点击事件
    demoBtn.addEventListener('click', function() {
        clickCount++;
        demoText.textContent = `你已经点击了 ${clickCount} 次！`;
        
        // 添加动画效果
        demoText.style.animation = 'none';
        setTimeout(() => {
            demoText.style.animation = 'fadeIn 0.5s ease';
        }, 10);
    });

    // 添加淡入动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // 控制台欢迎信息
    console.log('%c欢迎使用 Simple Template!', 'color: #667eea; font-size: 20px; font-weight: bold;');
    console.log('%c这是一个简单的前端模板项目', 'color: #764ba2; font-size: 14px;');
});

