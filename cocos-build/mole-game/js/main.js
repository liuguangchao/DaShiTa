/**
 * 打地鼠游戏 - 简化版 Cocos 实现
 * 对应设计稿中的打地鼠模式
 */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 设置画布大小
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 游戏状态
const gameState = {
    score: 8650,
    combo: 0,
    time: 90,
    isPlaying: false,
    moles: [],
    lastSpawnTime: 0
};

// 地鼠类
class Mole {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 40;
        this.isVisible = false;
        this.isHit = false;
        this.showTimer = 0;
        this.animationProgress = 0;
    }
    
    show() {
        this.isVisible = true;
        this.isHit = false;
        this.showTimer = Date.now() + 1500;
        this.animationProgress = 0;
    }
    
    update() {
        if (!this.isVisible) return;
        
        // 弹出动画
        if (this.animationProgress < 1) {
            this.animationProgress += 0.1;
            if (this.animationProgress > 1) this.animationProgress = 1;
        }
        
        // 超时隐藏
        if (Date.now() > this.showTimer && !this.isHit) {
            this.isVisible = false;
        }
    }
    
    draw(ctx) {
        if (!this.isVisible) return;
        
        const scale = this.animationProgress;
        const yOffset = (1 - scale) * 20;
        
        ctx.save();
        ctx.translate(this.x, this.y - yOffset);
        ctx.scale(scale, scale);
        
        // 地鼠身体
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 眼睛
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(-10, -10, 8, 0, Math.PI * 2);
        ctx.arc(10, -10, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-10, -10, 4, 0, Math.PI * 2);
        ctx.arc(10, -10, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 鼻子
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.arc(0, 5, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // 如果被击中，显示特殊效果
        if (this.isHit) {
            ctx.fillStyle = '#FFFF00';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('✖', 0, -30);
        }
        
        ctx.restore();
    }
    
    hitTest(x, y) {
        if (!this.isVisible || this.isHit) return false;
        const dx = x - this.x;
        const dy = y - (this.y - (1 - this.animationProgress) * 20);
        return Math.sqrt(dx * dx + dy * dy) < this.radius;
    }
}

// 初始化地鼠位置
function initMoles() {
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2 + 50;
    
    // 3x3 网格，去掉中间和四个角，剩下5个位置
    const positions = [
        { x: centerX - 120, y: centerY - 80 },
        { x: centerX + 120, y: centerY - 80 },
        { x: centerX - 120, y: centerY + 40 },
        { x: centerX + 120, y: centerY + 40 },
        { x: centerX, y: centerY + 120 }
    ];
    
    gameState.moles = positions.map(pos => new Mole(pos.x, pos.y));
}

// 生成新地鼠
function spawnMole() {
    const availableMoles = gameState.moles.filter(m => !m.isVisible);
    if (availableMoles.length > 0) {
        const randomMole = availableMoles[Math.floor(Math.random() * availableMoles.length)];
        randomMole.show();
    }
}

// 处理点击
function handleClick(x, y) {
    if (!gameState.isPlaying) return;
    
    for (const mole of gameState.moles) {
        if (mole.hitTest(x, y)) {
            mole.isHit = true;
            gameState.combo++;
            gameState.score += 100 * (1 + gameState.combo * 0.1);
            
            // 显示连击提示
            showComboText(mole.x, mole.y - 50);
            
            break;
        }
    }
}

// 连击文本
let comboTexts = [];
function showComboText(x, y) {
    comboTexts.push({
        x: x,
        y: y,
        text: `+${Math.round(100 * (1 + gameState.combo * 0.1))}`,
        life: 1.0
    });
}

// 绘制UI
function drawUI() {
    const width = canvas.width;
    
    // 顶部栏
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(0, 0, width, 80);
    
    ctx.fillStyle = '#5C3300';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('打地鼠模式', width / 2, 35);
    
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`剩余时间 ${Math.floor(gameState.time / 60)}:${String(Math.floor(gameState.time % 60)).padStart(2, '0')}`, 20, 65);
    
    ctx.textAlign = 'right';
    ctx.fillText(`累计伤害: ${Math.round(gameState.score)}`, width - 20, 65);
    
    // 连击显示
    if (gameState.combo > 1) {
        ctx.fillStyle = '#FF6B35';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`连击 x${gameState.combo}`, width / 2, 120);
    }
    
    // 连击文本动画
    comboTexts = comboTexts.filter(text => {
        text.life -= 0.02;
        text.y -= 1;
        
        if (text.life > 0) {
            ctx.globalAlpha = text.life;
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(text.text, text.x, text.y);
            ctx.globalAlpha = 1;
            return true;
        }
        return false;
    });
}

// 绘制背景
function drawBackground() {
    // 草地背景
    ctx.fillStyle = '#8BC34A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 草地纹理
    ctx.fillStyle = '#7CB342';
    for (let i = 0; i < 50; i++) {
        const x = (i * 37) % canvas.width;
        const y = (i * 53) % canvas.height;
        ctx.fillRect(x, y, 3, 8);
    }
}

// 绘制地洞
function drawHoles() {
    gameState.moles.forEach(mole => {
        ctx.fillStyle = '#5D4037';
        ctx.beginPath();
        ctx.ellipse(mole.x, mole.y + mole.radius, mole.radius * 0.8, mole.radius * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
    });
}

// 游戏主循环
function gameLoop() {
    // 更新
    if (gameState.isPlaying) {
        gameState.time -= 1 / 60;
        if (gameState.time <= 0) {
            gameState.isPlaying = false;
            gameState.time = 0;
        }
        
        gameState.moles.forEach(mole => mole.update());
        
        // 定期生成地鼠
        if (Date.now() - gameState.lastSpawnTime > 1000) {
            spawnMole();
            gameState.lastSpawnTime = Date.now();
        }
    }
    
    // 绘制
    drawBackground();
    drawHoles();
    gameState.moles.forEach(mole => mole.draw(ctx));
    drawUI();
    
    requestAnimationFrame(gameLoop);
}

// 初始化
function init() {
    initMoles();
    gameState.isPlaying = true;
    gameState.lastSpawnTime = Date.now();
    
    // 点击事件
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        handleClick(x, y);
    });
    
    // 开始游戏循环
    gameLoop();
}

// 启动游戏
init();
