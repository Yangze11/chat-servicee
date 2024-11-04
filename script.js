document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const imageInput = document.getElementById('imageInput');

    // 添加调试信息
    console.log('DOM加载完成');

    // 定义 serviceInfo 对象（只定义一次）
    const serviceInfo = {
        id: 'KF8888',
        name: '客服小美',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=service',
        welcomeAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=welcome',  // 欢迎消息专用头像
        status: 'online',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
    };

    // 添加消息到聊天界面
    function addMessage(content, type, isWelcome = false) {
        console.log('添加消息:', content, type);
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}${isWelcome ? ' welcome' : ''}`;
        
        const time = new Date().toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });

        content = content.trim();

        // 根据消息类型和是否是欢迎消息选择不同的头像
        if (type === 'service') {
            messageDiv.style.setProperty('--service-avatar', 
                `url('${isWelcome ? serviceInfo.welcomeAvatar : serviceInfo.avatar}')`);
        } else {
            messageDiv.style.setProperty('--user-avatar', `url('${serviceInfo.userAvatar}')`);
        }

        messageDiv.innerHTML = `
            <div class="message-content">${content}<div class="message-time">${time}</div></div>
        `.trim();

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 发送欢迎消息时添加 welcome 类
    console.log('发送欢迎消息');
    addMessage("您好，万程乐娱很高兴为您服务，请问有什么可以帮到您的", 'service', true);
    
    // 延迟1秒后发送第二条消息，包含订单选择链接
    setTimeout(() => {
        const secondMessage = `请问您遇到了什么问题呢？请选择您的订单进行咨询哦~<br><span class="select-order-link">选择订单</span>`;
        addMessage(secondMessage, 'service', true);
        
        // 为新添加的订单选择链接添加点击事件
        const selectOrderLinks = document.getElementsByClassName('select-order-link');
        if (selectOrderLinks.length > 0) {
            selectOrderLinks[selectOrderLinks.length - 1].addEventListener('click', function(e) {
                e.preventDefault();
                // 触发选择订单功能
                const selectOrderBtn = document.getElementById('selectOrder');
                if (selectOrderBtn) {
                    selectOrderBtn.click();
                }
            });
        }
    }, 1000);

    // 添加用户信息和订单信息的模拟数据
    const userInfo = {
        name: "张三",
        level: "白金卡会员",
        orderInfo: {
            "001": {
                productName: "城市玩伴",
                // 其他订单信息
            }
        }
    };

    // 添加时间问候语函数
    function getTimeGreeting() {
        const hour = new Date().getHours();
        let greeting = '';
        let lateNightMsg = '';

        if (hour >= 5 && hour < 12) {
            greeting = '早上好';
        } else if (hour >= 12 && hour < 14) {
            greeting = '中午好';
        } else if (hour >= 14 && hour < 18) {
            greeting = '下午好';
        } else if (hour >= 18 && hour < 23) {
            greeting = '晚上好';
        } else {
            greeting = '夜深了';
            lateNightMsg = '您还未休息';
        }

        return { greeting, lateNightMsg };
    }

    // 修改发送消息函数
    function sendMessage() {
        console.log('尝试发送消息');
        const message = messageInput.value.trim();
        console.log('消息内容:', message);
        
        if (message) {
            // 添加用户消息
            addMessage(message, 'user');
            // 清空输入框
            messageInput.value = '';
            
            // 检查是否是订单号
            if (message === '001' || message.includes('订单')) {
                sendOrderResponse();
            } else {
                // 其他消息的回复逻辑
                setTimeout(() => {
                    simulateServiceResponse(message);
                }, 1000);
            }
        }
    }

    // 添加状态标记
    const messageState = {
        hasOrderResponse: false,    // 是否已发送订单响应
        hasTransferResponse: false  // 是否已发送转人工响应
    };

    // 修改订单响应函数
    function sendOrderResponse() {
        // 如果已经发送过订单响应，则不再发送
        if (messageState.hasOrderResponse) {
            return;
        }

        const { greeting, lateNightMsg } = getTimeGreeting();
        const orderName = userInfo.orderInfo['001'].productName;
        
        const response = `尊敬的<span style="color: red;">${userInfo.name}</span>${userInfo.level}您好，很高兴为您服务~
${greeting}${lateNightMsg ? '，' + lateNightMsg : ''}
是遇到了什么问题吗？关于<span style="color: red;">${orderName}</span>相关的问题，都可以向我提问哦，万小程会努力为您解决哟~

<div class="transfer-human">
    <span class="transfer-icon">👨‍💼</span>
    <span class="transfer-text">转人工</span>
</div>`;

        addCustomMessage(response, 'service', {
            backgroundColor: 'white',
            color: 'black'
        });

        // 标记已发送订单响应
        messageState.hasOrderResponse = true;

        // 添加转人工按钮点击事件
        setTimeout(() => {
            const transferButton = document.querySelector('.transfer-human');
            if (transferButton) {
                transferButton.addEventListener('click', function() {
                    handleTransferToAgent();
                });
            }
        }, 100);
    }

    // 添加自定义样式消息的函数
    function addCustomMessage(content, type, styles) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type} welcome`;  // 添加 welcome 类
        
        const time = new Date().toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });

        // 设置头像
        if (type === 'service') {
            messageDiv.style.setProperty('--service-avatar', `url('${serviceInfo.welcomeAvatar}')`);
        } else {
            messageDiv.style.setProperty('--user-avatar', `url('${serviceInfo.userAvatar}')`);
        }

        // 创建消息内容元素
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.style.backgroundColor = styles.backgroundColor || '';
        contentDiv.style.color = styles.color || '';
        contentDiv.innerHTML = `${content}<div class="message-time">${time}</div>`;

        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 修改选择订单事件处理
    const selectOrder = document.getElementById('selectOrder');
    if (selectOrder) {
        selectOrder.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('选择订单');
            moreMenu.classList.remove('show');
            // 触发订单响应
            sendOrderResponse();
        });
    }

    // 添加调试信息
    console.log('chatMessages:', chatMessages);
    console.log('messageInput:', messageInput);
    console.log('sendButton:', sendButton);

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

    // 更新服务信息
    function updateServiceInfo(info) {
        const avatar = document.getElementById('serviceAvatar');
        if (avatar) avatar.src = info.avatar;
        
        const serviceId = document.querySelector('.service-id');
        if (serviceId) serviceId.textContent = `工号：${info.id}`;
        
        // 更新头像样式
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
    
    if (moreButton && moreMenu) {
        moreButton.addEventListener('click', (e) => {
            e.stopPropagation();  // 阻止事件冒泡
            moreMenu.classList.toggle('show');  // 切换显示/隐藏
            console.log('菜单显示状态:', moreMenu.classList.contains('show'));
        });
    }

    // 点击其他区域时隐藏菜单
    document.addEventListener('click', (e) => {
        if (!moreMenu.contains(e.target) && e.target !== moreButton) {
            moreMenu.classList.remove('show');
        }
    });

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

    // 单
    imageSourceMenu.addEventListener('mouseleave', () => {
        imageSourceMenu.style.display = 'none';
    });

    // 修改结束服务的处理函数
    function handleEndService() {
        console.log('执行结束服务功能');
        
        // 使用 addMessage 函数添加结束服务消息
        addMessage("您已结束本次人工服务，如您后续遇到任何问题欢迎您随时咨询哦~", 'service');
        
        // 禁用输入框和按钮
        messageInput.disabled = true;
        messageInput.placeholder = "会话已结束，请重新咨询";
        sendButton.disabled = true;

        // 隐藏更多功能按钮
        const moreButton = document.querySelector('.more-button');
        if (moreButton) {
            moreButton.style.display = 'none';
        }

        // 关闭菜单
        if (moreMenu) {
            moreMenu.classList.remove('show');
        }
    }

    // 直接在 DOMContentLoaded 中绑定结束服务事件
    document.querySelector('#endService').onclick = function(e) {
        console.log('点击结束服务按钮');
        e.preventDefault();
        e.stopPropagation();
        handleEndService();
    };

    // 添加调试代码
    const endServiceBtn = document.querySelector('#endService');
    console.log('结束服务按钮元素:', endServiceBtn);

    // 修改 serviceState 对象的初始化位置，确保在最前面
    const serviceState = {
        isAI: true,           // 默认为智能客服
        queueCount: 0,        // 排队人数
        isAgentAvailable: false, // 客服坐席状态
        currentAgentId: '12001'  // 当前客服工号
    };

    // 修改工号显示函数
    function updateServiceId() {
        const serviceIdElement = document.querySelector('.service-id');
        if (serviceIdElement) {
            if (serviceState.isAI) {
                serviceIdElement.textContent = '智能助理-万小程';
            } else {
                serviceIdElement.textContent = `工号：${serviceState.currentAgentId}`;
            }
        }
    }

    // 确保在页面加载时立即更新显示
    updateServiceId();

    // 修改转人工处理函数
    function handleTransferToAgent() {
        // 如果已经发送过转人工响应，则不再发送
        if (messageState.hasTransferResponse) {
            return;
        }

        // 发送转接提示消息
        addCustomMessage("正在为您转接人工客服坐席，请您稍等", 'service', {
            backgroundColor: 'white',
            color: 'black'
        });

        // 标记已发送转人工响应
        messageState.hasTransferResponse = true;

        // 模拟检查客服坐席状态
        setTimeout(() => {
            if (serviceState.isAgentAvailable) {
                // 有空闲客服
                serviceState.isAI = false;
                updateServiceId();  // 更新显示为客服工号
                addCustomMessage("您已进入人工客服，请您简单描述下您遇到的问题吧~", 'service', {
                    backgroundColor: 'white',
                    color: 'black'
                });
            } else {
                // 客服繁忙，进入排队
                serviceState.queueCount = Math.floor(Math.random() * 5) + 1;
                addCustomMessage(`客服坐席全忙，您已进入排队等候，您前面还有${serviceState.queueCount}位，还请您保持耐心等待`, 'service', {
                    backgroundColor: 'white',
                    color: 'black'
                });

                // 模拟排队进度
                simulateQueue();
            }
        }, 1500);
    }

    // 模拟排队进度
    function simulateQueue() {
        const queueInterval = setInterval(() => {
            serviceState.queueCount--;
            if (serviceState.queueCount > 0) {
                addCustomMessage(`客服坐席全忙，您已进入排队等候，您前面还有${serviceState.queueCount}位，还请您保持耐心等待`, 'service', {
                    backgroundColor: 'white',
                    color: 'black'
                });
            } else {
                clearInterval(queueInterval);
                serviceState.isAI = false;
                serviceState.isAgentAvailable = true;
                updateServiceId();
                addCustomMessage("您已进入人工客服，请您简单描述下您遇到的问题吧~", 'service', {
                    backgroundColor: 'white',
                    color: 'black'
                });
            }
        }, 5000); // 每5秒更新一次排队状态
    }
}); 