/**
 * 打地鼠模式 - 100%像素级还原参考图
 */
const WhackAMoleScene = {
  _el: null,
  _moles: [],
  _comboCount: 0,
  _score: 0,
  _totalDamage: 0,
  _timer: null,
  _timerSeconds: 90,
  _currentWeapon: 0,
  _spawnInterval: null,

  WEAPONS: [
    { emoji: '🩴', name: '拖鞋', damage: 10 },
    { emoji: '🔨', name: '重锤', damage: 25 },
    { emoji: '🏏', name: '球棒', damage: 18 },
  ],

  MOLE_FACES: ['🐹', '😵', '🐭', '😰', '🐿️'],

  SPECIAL_MARKERS: ['🌀', '❗', '⭐', '✨', '💫'],

  AVATARS: ['😊', '😎', '🤩', '😜', '🥳'],

  create() {
    this._score = 0;
    this._comboCount = 0;
    this._totalDamage = 0;
    this._timerSeconds = 90;
    this._currentWeapon = 0;
    this._moles = [];

    this._el = document.createElement('div');
    this._el.id = 'whack-mole-scene';
    Object.assign(this._el.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(180deg, #87CEEB 0%, #90EE90 20%, #32CD32 100%)',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
    });

    this._buildScene();
    this._startGameLoop();
    return this;
  },

  _buildScene() {
    this._el.appendChild(this._buildTopBar());
    this._el.appendChild(this._buildSecondRow());
    this._el.appendChild(this._buildGrassField());
    this._el.appendChild(this._buildBottomBar());
  },

  // ========== 顶部栏 ==========
  _buildTopBar() {
    const bar = document.createElement('div');
    Object.assign(bar.style, {
      position: 'absolute',
      top: '10px',
      left: '10px',
      right: '10px',
      height: '56px',
      background: 'linear-gradient(180deg, #FFE082 0%, #FFB300 100%)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      zIndex: '10',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      border: '3px solid #FF8F00',
    });

    // 返回按钮
    const backBtn = document.createElement('div');
    backBtn.textContent = '←';
    Object.assign(backBtn.style, {
      width: '40px',
      height: '40px',
      background: 'rgba(255,255,255,0.9)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      color: '#5D4037',
      fontWeight: '700',
      cursor: 'pointer',
      border: '2px solid #FF8F00',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    });
    backBtn.onclick = () => {
      this._stopGameLoop();
      document.getElementById('scene-container').innerHTML = '';
      showHome();
    };
    bar.appendChild(backBtn);

    // 标题
    const title = document.createElement('div');
    title.textContent = '打地鼠模式';
    Object.assign(title.style, {
      fontSize: '26px',
      fontWeight: '900',
      color: '#FFF7CC',
      textShadow: '2px 2px 0 #FF6F00, -1px -1px 0 #FF6F00, 1px -1px 0 #FF6F00, -1px 1px 0 #FF6F00, 0 3px 6px rgba(0,0,0,0.3)',
      letterSpacing: '3px',
    });
    bar.appendChild(title);

    // 右侧信息
    const info = document.createElement('div');
    Object.assign(info.style, {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '2px',
      fontSize: '12px',
      color: '#5D4037',
      fontWeight: '700',
    });
    info.innerHTML = `
      <div>剩余时间 <span id="mole-timer-value">${this._formatTime(90)}</span></div>
      <div>累计伤害 <span id="mole-total-damage" style="background:rgba(255,255,255,0.5);padding:2px 8px;border-radius:8px;">0</span></div>
    `;
    bar.appendChild(info);

    return bar;
  },

  // ========== 第二行（向下箭头+分数）==========
  _buildSecondRow() {
    const row = document.createElement('div');
    Object.assign(row.style, {
      position: 'absolute',
      top: '74px',
      left: '10px',
      right: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: '10',
    });

    // 向下箭头按钮
    const downBtn = document.createElement('div');
    downBtn.textContent = '↓';
    Object.assign(downBtn.style, {
      width: '44px',
      height: '44px',
      background: 'rgba(255,255,255,0.85)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '26px',
      color: '#FF8F00',
      cursor: 'pointer',
      border: '2px solid #FFB300',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    });
    row.appendChild(downBtn);

    // 分数面板
    const scorePanel = document.createElement('div');
    Object.assign(scorePanel.style, {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '6px',
    });

    const scoreBox = document.createElement('div');
    scoreBox.id = 'mole-score-box';
    Object.assign(scoreBox.style, {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      background: 'rgba(255,255,255,0.9)',
      borderRadius: '20px',
      padding: '6px 14px',
      border: '2px solid #FFB300',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    });
    scoreBox.innerHTML = `
      <span style="font-size:20px;">⭐</span>
      <span id="mole-score-value" style="font-size:18px;font-weight:900;color:#FF6F00;">0</span>
    `;
    scorePanel.appendChild(scoreBox);

    const hint = document.createElement('div');
    hint.textContent = '连续打击可触发伤害翻倍';
    Object.assign(hint.style, {
      fontSize: '11px',
      color: '#5D4037',
      background: 'rgba(255,255,255,0.75)',
      borderRadius: '12px',
      padding: '3px 10px',
    });
    scorePanel.appendChild(hint);

    row.appendChild(scorePanel);
    return row;
  },

  // ========== 草地场地 ==========
  _buildGrassField() {
    const field = document.createElement('div');
    Object.assign(field.style, {
      position: 'absolute',
      top: '125px',
      left: '0',
      right: '0',
      bottom: '165px',
      overflow: 'hidden',
      zIndex: '5',
    });

    // 草地纹理
    const grassBg = document.createElement('div');
    Object.assign(grassBg.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: `
        radial-gradient(circle at 15% 25%, #4CAF50 2px, transparent 2px),
        radial-gradient(circle at 85% 15%, #66BB6A 2px, transparent 2px),
        radial-gradient(circle at 35% 65%, #43A047 2px, transparent 2px),
        radial-gradient(circle at 75% 75%, #4CAF50 2px, transparent 2px),
        radial-gradient(circle at 50% 40%, #81C784 2px, transparent 2px),
        linear-gradient(180deg, #81C784 0%, #4CAF50 40%, #388E3C 100%)
      `,
    });
    field.appendChild(grassBg);

    // 花朵装饰
    const flowers = ['🌸', '🌼', '🌺', '🌻'];
    for (let i = 0; i < 10; i++) {
      const flower = document.createElement('div');
      flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
      Object.assign(flower.style, {
        position: 'absolute',
        fontSize: '18px',
        left: Math.random() * 85 + 5 + '%',
        top: Math.random() * 85 + 5 + '%',
        opacity: '0.7',
        pointerEvents: 'none',
        zIndex: '1',
      });
      field.appendChild(flower);
    }

    // 石头
    const rock = document.createElement('div');
    rock.textContent = '🪨';
    Object.assign(rock.style, {
      position: 'absolute',
      fontSize: '24px',
      left: '5%',
      top: '8%',
      opacity: '0.6',
      pointerEvents: 'none',
      zIndex: '1',
    });
    field.appendChild(rock);

    // 灌木丛
    const bush = document.createElement('div');
    bush.textContent = '🌿';
    Object.assign(bush.style, {
      position: 'absolute',
      fontSize: '28px',
      right: '5%',
      top: '5%',
      opacity: '0.5',
      pointerEvents: 'none',
      zIndex: '1',
    });
    field.appendChild(bush);

    // 6个地鼠洞 - 不规则分布
    const positions = [
      { x: '25%', y: '20%' },
      { x: '65%', y: '18%' },
      { x: '20%', y: '48%' },
      { x: '50%', y: '45%' },
      { x: '75%', y: '50%' },
      { x: '35%', y: '78%' },
    ];

    positions.forEach((pos, i) => {
      const hole = this._buildMoleHole(i, pos.x, pos.y);
      field.appendChild(hole);
    });

    return field;
  },

  // ========== 单个地鼠洞 ==========
  _buildMoleHole(index, left, top) {
    const wrap = document.createElement('div');
    wrap.id = `mole-hole-${index}`;
    Object.assign(wrap.style, {
      position: 'absolute',
      left: left,
      top: top,
      transform: 'translate(-50%, -50%)',
      width: '100px',
      height: '100px',
      zIndex: '5',
    });

    // 洞
    const hole = document.createElement('div');
    Object.assign(hole.style, {
      width: '80px',
      height: '45px',
      background: 'radial-gradient(ellipse, #5D4037 0%, #3E2723 60%, #4E342E 100%)',
      borderRadius: '50%',
      position: 'absolute',
      bottom: '5px',
      left: '50%',
      transform: 'translateX(-50%)',
      boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.3)',
    });
    wrap.appendChild(hole);

    // 地鼠
    const mole = document.createElement('div');
    mole.id = `mole-${index}`;
    mole.style.cssText = `
      position: absolute;
      bottom: 15px;
      left: 50%;
      transform: translateX(-50%) translateY(60px);
      font-size: 52px;
      z-index: 2;
      transition: transform 0.3s ease-out, opacity 0.3s;
      opacity: 0;
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
      cursor: pointer;
    `;
    mole.textContent = '🐹';
    mole.onclick = (e) => {
      e.stopPropagation();
      this._whackMole(index);
    };
    wrap.appendChild(mole);

    // 特殊标记
    const marker = document.createElement('div');
    marker.id = `mole-marker-${index}`;
    marker.style.cssText = `
      position: absolute;
      top: -5px;
      right: -5px;
      font-size: 28px;
      z-index: 3;
      display: none;
      animation: markerPulse 0.6s ease-in-out infinite;
    `;
    wrap.appendChild(marker);

    // 头像框
    const avatarFrame = document.createElement('div');
    avatarFrame.id = `mole-avatar-${index}`;
    avatarFrame.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(60px);
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 3px solid #FFB300;
      background: linear-gradient(135deg, #FFE082, #FFB300);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 3;
      font-size: 36px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    wrap.appendChild(avatarFrame);

    this._moles.push({ wrap, mole, hole, marker, avatarFrame, index, alive: false });
    return wrap;
  },

  // ========== 底部武器栏 ==========
  _buildBottomBar() {
    const bar = document.createElement('div');
    Object.assign(bar.style, {
      position: 'absolute',
      bottom: '0',
      left: '0',
      right: '0',
      height: '165px',
      background: 'linear-gradient(0deg, #FFE082 0%, #FFCA28 100%)',
      borderTop: '3px solid #FFB300',
      display: 'flex',
      flexDirection: 'column',
      padding: '12px 16px',
      zIndex: '10',
    });

    // 连击标签
    const comboLabel = document.createElement('div');
    comboLabel.id = 'mole-combo-label';
    comboLabel.style.cssText = `
      text-align: center;
      font-size: 16px;
      font-weight: 800;
      color: #FFF7CC;
      text-shadow: 1px 1px 0 #FF6F00;
      margin-bottom: 10px;
      opacity: 0;
      transition: opacity 0.3s;
    `;
    comboLabel.innerHTML = '<span style="background:#FFB300;width:24px;height:24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-right:6px;font-size:14px;">+</span> 连击 x0';
    bar.appendChild(comboLabel);

    // 武器选择行
    const weaponRow = document.createElement('div');
    Object.assign(weaponRow.style, {
      display: 'flex',
      gap: '12px',
      alignItems: 'stretch',
      flex: '1',
    });

    // 当前武器显示
    const currentWeaponBox = document.createElement('div');
    currentWeaponBox.id = 'current-weapon-box';
    Object.assign(currentWeaponBox.style, {
      width: '90px',
      background: 'rgba(255,255,255,0.85)',
      borderRadius: '14px',
      border: '2px solid #FFB300',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
      cursor: 'pointer',
      position: 'relative',
      transition: 'all 0.2s',
    });
    currentWeaponBox.innerHTML = `
      <span style="font-size:36px;">🩴</span>
      <span style="font-size:12px;color:#5D4037;font-weight:700;">拖鞋</span>
      <span style="position:absolute;top:4px;right:4px;font-size:14px;color:#4CAF50;">✓</span>
    `;
    weaponRow.appendChild(currentWeaponBox);

    // 重锤按钮
    const heavyBtn = document.createElement('div');
    heavyBtn.textContent = '重锤';
    Object.assign(heavyBtn.style, {
      flex: '1',
      height: '56px',
      background: 'linear-gradient(180deg, #FF6F00 0%, #E65100 100%)',
      borderRadius: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      fontWeight: '800',
      color: '#FFF7CC',
      textShadow: '1px 1px 0 rgba(0,0,0,0.3)',
      cursor: 'pointer',
      border: '2px solid #FF8F00',
      boxShadow: '0 4px 12px rgba(255,111,0,0.4)',
      transition: 'transform 0.1s',
    });
    heavyBtn.onmousedown = () => { heavyBtn.style.transform = 'scale(0.95)'; };
    heavyBtn.onmouseup = () => { heavyBtn.style.transform = 'scale(1)'; this._activateHeavyHammer(); };
    weaponRow.appendChild(heavyBtn);

    // 切换武器按钮
    const switchBtn = document.createElement('div');
    switchBtn.textContent = '切换武器';
    Object.assign(switchBtn.style, {
      flex: '1',
      height: '56px',
      background: 'linear-gradient(180deg, #FFB300 0%, #FF8F00 100%)',
      borderRadius: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      fontWeight: '700',
      color: '#5D4037',
      cursor: 'pointer',
      border: '2px solid #FFA000',
      transition: 'transform 0.1s',
    });
    switchBtn.onmousedown = () => { switchBtn.style.transform = 'scale(0.95)'; };
    switchBtn.onmouseup = () => { switchBtn.style.transform = 'scale(1)'; this._switchWeapon(); };
    weaponRow.appendChild(switchBtn);

    bar.appendChild(weaponRow);
    return bar;
  },

  // ==================== 游戏逻辑 ====================

  _startGameLoop() {
    this._timer = setInterval(() => {
      this._timerSeconds--;
      const timerEl = document.getElementById('mole-timer-value');
      if (timerEl) {
        timerEl.textContent = this._formatTime(this._timerSeconds);
      }
      if (this._timerSeconds <= 0) {
        this._endGame();
      }
    }, 1000);

    this._spawnInterval = setInterval(() => {
      this._spawnMole();
    }, 1000);

    // 初始生成
    setTimeout(() => this._spawnMole(), 200);
    setTimeout(() => this._spawnMole(), 500);
  },

  _stopGameLoop() {
    if (this._timer) clearInterval(this._timer);
    if (this._spawnInterval) clearInterval(this._spawnInterval);
  },

  _spawnMole() {
    const available = this._moles.filter(m => !m.alive);
    if (available.length === 0) return;

    const mole = available[Math.floor(Math.random() * available.length)];
    mole.alive = true;

    // 随机表情
    const face = this.MOLE_FACES[Math.floor(Math.random() * this.MOLE_FACES.length)];
    mole.mole.textContent = face;
    mole.mole.style.transform = 'translateX(-50%) translateY(0)';
    mole.mole.style.opacity = '1';

    // 随机头像框（30%概率）
    if (Math.random() > 0.7) {
      const avatar = this.AVATARS[Math.floor(Math.random() * this.AVATARS.length)];
      mole.avatarFrame.textContent = avatar;
      mole.avatarFrame.style.display = 'flex';
      mole.avatarFrame.style.transform = 'translateX(-50%) translateY(0)';
      mole.avatarFrame.style.opacity = '1';
    }

    // 随机特殊标记
    if (Math.random() > 0.6) {
      const marker = this.SPECIAL_MARKERS[Math.floor(Math.random() * this.SPECIAL_MARKERS.length)];
      mole.marker.textContent = marker;
      mole.marker.style.display = 'block';
    }

    // 4秒后消失
    setTimeout(() => {
      if (mole.alive) {
        mole.mole.style.transform = 'translateX(-50%) translateY(60px)';
        mole.mole.style.opacity = '0';
        mole.marker.style.display = 'none';
        mole.avatarFrame.style.display = 'none';
        mole.avatarFrame.style.transform = 'translateX(-50%) translateY(60px)';
        mole.alive = false;
        if (this._comboCount > 0) {
          this._comboCount = 0;
          this._updateComboBar();
        }
      }
    }, 4000);
  },

  _whackMole(index) {
    const mole = this._moles[index];
    if (!mole || !mole.alive) return;

    const weapon = this.WEAPONS[this._currentWeapon];
    let damage = weapon.damage;

    this._comboCount++;
    if (this._comboCount >= 5) damage = Math.floor(damage * 1.5);
    if (this._comboCount >= 10) damage = Math.floor(damage * 2);

    this._score += damage;
    this._totalDamage += damage;

    // 更新分数
    document.getElementById('mole-score-value').textContent = this._score;
    const damageSpan = document.getElementById('mole-total-damage');
    if (damageSpan) damageSpan.textContent = this._totalDamage;

    // 打击动画
    mole.mole.textContent = '😵';
    mole.marker.textContent = '💥';
    mole.marker.style.display = 'block';

    setTimeout(() => {
      mole.mole.style.transform = 'translateX(-50%) translateY(60px)';
      mole.mole.style.opacity = '0';
      mole.marker.style.display = 'none';
      mole.avatarFrame.style.display = 'none';
      mole.avatarFrame.style.transform = 'translateX(-50%) translateY(60px)';
      mole.alive = false;
    }, 300);

    this._updateComboBar();
    this._showDamageNumber(index, damage);
  },

  _updateComboBar() {
    const bar = document.getElementById('mole-combo-label');
    if (!bar) return;
    bar.innerHTML = `<span style="background:#FFB300;width:24px;height:24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-right:6px;font-size:14px;">+</span> 连击 x${this._comboCount}`;
    bar.style.opacity = this._comboCount > 0 ? '1' : '0';
    if (this._comboCount >= 5) {
      bar.style.color = '#FF4500';
    }
  },

  _showDamageNumber(index, damage) {
    const mole = this._moles[index];
    if (!mole) return;

    const num = document.createElement('div');
    num.textContent = '-' + damage;
    num.style.cssText = `
      position: absolute;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
      font-size: 24px;
      font-weight: 900;
      color: ${damage > 20 ? '#FF1744' : '#FF6F00'};
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      z-index: 100;
      pointer-events: none;
      animation: damageFloat 0.8s ease-out forwards;
    `;
    mole.wrap.appendChild(num);
    setTimeout(() => num.remove(), 800);
  },

  _switchWeapon() {
    this._currentWeapon = (this._currentWeapon + 1) % this.WEAPONS.length;
    this._updateWeaponDisplay();
  },

  _updateWeaponDisplay() {
    const weapon = this.WEAPONS[this._currentWeapon];
    const box = document.getElementById('current-weapon-box');
    if (!box) return;
    box.innerHTML = `
      <span style="font-size:36px;">${weapon.emoji}</span>
      <span style="font-size:12px;color:#5D4037;font-weight:700;">${weapon.name}</span>
      <span style="position:absolute;top:4px;right:4px;font-size:14px;color:#4CAF50;">✓</span>
    `;
  },

  _activateHeavyHammer() {
    Toast.show('🔨 重锤攻击！伤害翻倍！', MessageType.GAMEPLAY, 2000);
    this._moles.forEach(mole => {
      if (mole.alive) {
        this._whackMole(mole.index);
      }
    });
  },

  _endGame() {
    this._stopGameLoop();
    Toast.show(`🏆 游戏结束！总分: ${this._score}`, MessageType.ACHIEVEMENT, 3000);
    setTimeout(() => {
      document.getElementById('scene-container').innerHTML = '';
      showHome();
    }, 2000);
  },

  _formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  },
};

// 注入动画
(function injectAnimations() {
  if (document.getElementById('whack-mole-animations')) return;
  const style = document.createElement('style');
  style.id = 'whack-mole-animations';
  style.textContent = `
    @keyframes damageFloat {
      0% { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
      100% { transform: translateX(-50%) translateY(-60px) scale(1.5); opacity: 0; }
    }
    @keyframes markerPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.3); }
    }
  `;
  document.head.appendChild(style);
})();
