document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');

    // 添加调试信息
    console.log('DOM加载完成');
    console.log('chatMessages:', chatMessages);
    console.log('messageInput:', messageInput);
    console.log('sendButton:', sendButton);

    // 发送消息函数
    function sendMessage() {
        console.log('尝试发送消息');
        const message = messageInput.value.trim();
        console.log('消息内容:', message);
        
        if (message) {
            // 添加用户消息
            addMessage(message, 'user');
            // 清空输入框
            messageInput.value = '';
            // 模拟客服回复
            setTimeout(() => {
                simulateServiceResponse(message);
            }, 1000);
        }
    }

    // 添加消息到聊天界面
    function addMessage(content, type) {
        console.log('添加消息:', content, type);
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const time = new Date().toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });

        // 移除内容中的多余空格
        content = content.trim();

        // 设置头像背景图片
        if (type === 'service') {
            messageDiv.style.setProperty('--service-avatar', `url('${serviceInfo.avatar}')`);
        } else {
            messageDiv.style.setProperty('--user-avatar', `url('${serviceInfo.userAvatar}')`);
        }

        messageDiv.innerHTML = `
            <div class="message-content">${content}<div class="message-time">${time}</div></div>
        `.trim();

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 模拟客服回复
    function simulateServiceResponse(userMessage) {
        console.log('模拟客服回复');
        let response = "您好！万程乐娱，很高兴为您服务，请问有什么可以帮到您的？";
        
        if (userMessage.includes('你好') || userMessage.includes('您好')) {
            response = "您好！万程乐娱，很高兴为您服务，请问有什么可以帮到您的？";
        } else if (userMessage.includes('价格')) {
            response = "关于价格问题，建议您查看我们的产品详情页面，或者告诉我您感兴趣的具体产品。";
        } else if (userMessage.includes('退货')) {
            response = "我们支持7天无理由退货，请提供您的订单号，我来为您处理。";
        }

        addMessage(response, 'service');
    }

    // 发送按钮点击事件
    sendButton.addEventListener('click', () => {
        console.log('点击发送按钮');
        sendMessage();
    });

    // 输入框回车发送
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            console.log('按下回车键');
            e.preventDefault();
            sendMessage();
        }
    });

    // 测试消息发送是否正常
    console.log('脚本加载完成');

    // 在 DOMContentLoaded 事件处理函数中添加
    const serviceInfo = {
        id: 'KF8888',
        name: '客服小美',
        // 使用在线图片作为默认头像
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=service',  // 客服头像
        status: 'online',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'  // 用户头像
    };

    function updateServiceInfo(info) {
        // 更新头像
        const avatar = document.getElementById('serviceAvatar');
        avatar.src = info.avatar;
        
        // 更新工号
        const serviceId = document.querySelector('.service-id');
        serviceId.textContent = `工号：${info.id}`;
        
        // 更新消息中的头像
        document.documentElement.style.setProperty('--service-avatar', `url(${info.avatar})`);
        document.documentElement.style.setProperty('--user-avatar', `url(${info.userAvatar})`);
        
        // 设置聊天消息中的头像背景图
        const style = document.createElement('style');
        style.textContent = `
            .message.service::before {
                background-image: url(${info.avatar}) !important;
            }
            .message.user::after {
                background-image: url(${info.userAvatar}) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 调用更新函数
    updateServiceInfo(serviceInfo);

    // 修改更多功能按钮点击事件
    const moreButton = document.querySelector('.more-button');
    const moreMenu = document.getElementById('moreMenu');
    
    // 确保元素存在
    if (moreButton && moreMenu) {
        moreButton.addEventListener('click', (e) => {
            e.stopPropagation();  // 阻止事件冒泡
            moreMenu.classList.toggle('show');
            console.log('点击更多按钮', moreMenu.classList.contains('show')); // 添加调试日志
        });
    }

    // 添加选择订单功能
    const selectOrder = document.getElementById('selectOrder');
    if (selectOrder) {
        selectOrder.addEventListener('click', (e) => {
            e.stopPropagation();  // 阻止事件冒泡
            console.log('选择订单');
            moreMenu.classList.remove('show');
            // 这里添加选择订单的具体逻辑
        });
    }

    // 添加发送图片功能
    const sendImage = document.getElementById('sendImage');
    if (sendImage) {
        sendImage.addEventListener('click', (e) => {
            e.stopPropagation();
            // 直接触发文件选择
            imageInput.click();
            // 关闭菜单
            moreMenu.classList.remove('show');
        });
    }

    // 手机相册选项
    document.getElementById('selectFromPhone').addEventListener('click', (e) => {
        e.stopPropagation();
        // 在移动设备上触发文件选择
        imageInput.setAttribute('capture', 'camera');
        imageInput.click();
        moreMenu.classList.remove('show');
        imageSourceMenu.style.display = 'none';
    });

    // 电脑图片选项
    document.getElementById('selectFromComputer').addEventListener('click', (e) => {
        e.stopPropagation();
        // 移除 capture 属性，允许从电脑选择
        imageInput.removeAttribute('capture');
        imageInput.click();
        moreMenu.classList.remove('show');
        imageSourceMenu.style.display = 'none';
    });

    // 处理图片选择
    imageInput.addEventListener('change', function(e) {
        const files = e.target.files;
        if (files && files.length > 0) {
            Array.from(files).forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        // 创建图片消息
                        const messageContent = `<img src="${e.target.result}" alt="发送的图片">`;
                        addMessage(messageContent, 'user');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        // 清空输入，允许选择相同的文件
        imageInput.value = '';
    });

    // 点击其他区域时隐藏所有菜单
    document.addEventListener('click', () => {
        moreMenu.classList.remove('show');
        imageSourceMenu.style.display = 'none';
    });

    // 防止菜单消失
    imageSourceMenu.addEventListener('mouseleave', () => {
        imageSourceMenu.style.display = 'none';
    });
}); 