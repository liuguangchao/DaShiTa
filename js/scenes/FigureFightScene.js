/**
 * 虚拟人物打击模式 - 100%像素级还原参考图
 */
const FigureFightScene = {
  _el: null,
  _target: null,
  _comboCount: 0,
  _score: 0,
  _totalDamage: 0,
  _currentWeapon: 2,
  _surrenderChance: 15,
  _hitPoints: [],
  _weaponTimers: [],

  WEAPONS: [
    { emoji: '👊', name: '拳头', damage: 10, duration: 0 },
    { emoji: '🏏', name: '木棍', damage: 15, duration: 0 },
    { emoji: '🔨', name: '棒球棍', damage: 25, duration: 60 },
    { emoji: '🔨', name: '锤子', damage: 30, duration: 45 },
  ],

  HIT_POINTS: [
    { id: 'head', label: '拳打', x: 42, y: 22, emoji: '💥', angle: -30 },
    { id: 'chest', label: '脚踢', x: 50, y: 42, emoji: '🦶', angle: 0 },
    { id: 'left_arm', label: '扇耳光', x: 32, y: 32, emoji: '🖐️', angle: -45 },
    { id: 'right_arm', label: '扇耳光', x: 68, y: 32, emoji: '🖐️', angle: 45 },
    { id: 'left_leg', label: '脚踢', x: 43, y: 68, emoji: '🦵', angle: -20 },
    { id: 'right_leg', label: '脚踢', x: 57, y: 68, emoji: '🦵', angle: 20 },
  ],

  FACES: ['😤', '😠', '🤬', '😡', '💢'],
  SURRENDER_FACES: ['😭', '🥺', '😰', '💦'],

  create(targetName = '讨厌的同事') {
    this._score = 0;
    this._comboCount = 0;
    this._totalDamage = 0;
    this._currentWeapon = 2;
    this._hitPoints = [];

    this._el = document.createElement('div');
    this._el.id = 'figure-fight-scene';
    Object.assign(this._el.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(180deg, #FFE082 0%, #FFB300 100%)',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
    });

    this._buildScene(targetName);
    return this;
  },

  _buildScene(targetName) {
    this._el.appendChild(this._buildTopBar(targetName));
    this._el.appendChild(this._buildSecondRow());
    this._el.appendChild(this._buildRoomBackground());
    this._el.appendChild(this._buildTargetCharacter());
    this._el.appendChild(this._buildBottomBar());
  },

  // ========== 顶部栏 ==========
  _buildTopBar(targetName) {
    const bar = document.createElement('div');
    Object.assign(bar.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      height: '56px',
      background: 'linear-gradient(180deg, #FFE082 0%, #FFB300 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      zIndex: '10',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    });

    // 返回按钮
    const backBtn = document.createElement('div');
    backBtn.textContent = '←';
    Object.assign(backBtn.style, {
      fontSize: '32px',
      color: '#5D4037',
      fontWeight: '700',
      cursor: 'pointer',
      lineHeight: '1',
    });
    backBtn.onclick = () => {
      document.getElementById('scene-container').innerHTML = '';
      showHome();
    };
    bar.appendChild(backBtn);

    // 标题
    const title = document.createElement('div');
    title.textContent = '虚拟人物打击模式';
    Object.assign(title.style, {
      fontSize: '20px',
      fontWeight: '800',
      color: '#5D4037',
      flex: '1',
      textAlign: 'center',
    });
    bar.appendChild(title);

    // 累计伤害
    const damageEl = document.createElement('div');
    damageEl.id = 'figure-total-damage';
    damageEl.textContent = '累计伤害 0';
    Object.assign(damageEl.style, {
      fontSize: '16px',
      fontWeight: '700',
      color: '#5D4037',
      textAlign: 'right',
    });
    bar.appendChild(damageEl);

    return bar;
  },

  // ========== 第二行（减号+剩余时间）==========
  _buildSecondRow() {
    const row = document.createElement('div');
    Object.assign(row.style, {
      position: 'absolute',
      top: '62px',
      left: '0',
      right: '0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '0 16px',
      zIndex: '10',
    });

    // 减号按钮
    const minusBtn = document.createElement('div');
    minusBtn.textContent = '-';
    Object.assign(minusBtn.style, {
      width: '40px',
      height: '40px',
      background: 'rgba(255,255,255,0.85)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      color: '#FF8F00',
      cursor: 'pointer',
      border: '2px solid #FFB300',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    });
    row.appendChild(minusBtn);

    // 剩余时间
    const timeInfo = document.createElement('div');
    Object.assign(timeInfo.style, {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '2px',
      fontSize: '12px',
      color: '#5D4037',
      fontWeight: '700',
    });
    timeInfo.innerHTML = `
      <div>剩余时间</div>
      <div style="font-size:24px;font-weight:900;color:#FF6F00;">无限</div>
    `;
    row.appendChild(timeInfo);

    return row;
  },

  // ========== 房间背景 ==========
  _buildRoomBackground() {
    const room = document.createElement('div');
    Object.assign(room.style, {
      position: 'absolute',
      top: '102px',
      left: '0',
      right: '0',
      bottom: '200px',
      background: 'linear-gradient(180deg, #FFF3E0 0%, #FFE0B2 100%)',
      zIndex: '1',
      overflow: 'hidden',
    });

    // 地板
    const floor = document.createElement('div');
    Object.assign(floor.style, {
      position: 'absolute',
      bottom: '0',
      left: '0',
      right: '0',
      height: '40%',
      background: 'linear-gradient(180deg, #FFCC80 0%, #FFB74D 100%)',
      borderRadius: '0 0 20px 20px',
    });
    room.appendChild(floor);

    // 左窗户
    const leftWindow = document.createElement('div');
    Object.assign(leftWindow.style, {
      position: 'absolute',
      top: '20px',
      left: '16px',
      width: '70px',
      height: '90px',
      background: 'linear-gradient(180deg, #81D4FA 0%, #4FC3F7 100%)',
      border: '4px solid #FFB300',
      borderRadius: '8px',
    });
    room.appendChild(leftWindow);

    // 右窗户
    const rightWindow = document.createElement('div');
    Object.assign(rightWindow.style, {
      position: 'absolute',
      top: '20px',
      right: '16px',
      width: '70px',
      height: '90px',
      background: 'linear-gradient(180deg, #81D4FA 0%, #4FC3F7 100%)',
      border: '4px solid #FFB300',
      borderRadius: '8px',
    });
    room.appendChild(rightWindow);

    // 桌子
    const desk = document.createElement('div');
    Object.assign(desk.style, {
      position: 'absolute',
      bottom: '10%',
      left: '10px',
      width: '90px',
      height: '50px',
      background: 'linear-gradient(180deg, #A1887F 0%, #8D6E63 100%)',
      borderRadius: '4px',
    });
    room.appendChild(desk);

    this._el.appendChild(room);
    return room;
  },

  // ========== 目标角色 ==========
  _buildTargetCharacter() {
    const wrap = document.createElement('div');
    Object.assign(wrap.style, {
      position: 'absolute',
      top: '102px',
      left: '0',
      right: '0',
      bottom: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '5',
    });

    // 目标名称标签
    const nameTag = document.createElement('div');
    nameTag.textContent = '讨厌的同事';
    Object.assign(nameTag.style, {
      position: 'absolute',
      top: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '14px',
      fontWeight: '800',
      color: '#FF6F00',
      background: 'rgba(255,255,255,0.8)',
      borderRadius: '12px',
      padding: '4px 12px',
      whiteSpace: 'nowrap',
      border: '1px solid #FFB300',
    });
    wrap.appendChild(nameTag);

    // 人物主体
    const character = document.createElement('div');
    Object.assign(character.style, {
      position: 'relative',
      width: '140px',
      height: '320px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    });

    // 阴影
    const shadow = document.createElement('div');
    Object.assign(shadow.style, {
      position: 'absolute',
      bottom: '-10px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100px',
      height: '20px',
      background: 'rgba(0,0,0,0.15)',
      borderRadius: '50%',
    });
    character.appendChild(shadow);

    // 头部
    const head = document.createElement('div');
    head.id = 'char-head';
    head.textContent = '😤';
    Object.assign(head.style, {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      background: '#FFCCBC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '40px',
      border: '3px solid #FFB300',
      cursor: 'pointer',
      transition: 'all 0.15s',
      zIndex: '2',
    });
    character.appendChild(head);

    // 身体
    const body = document.createElement('div');
    Object.assign(body.style, {
      width: '80px',
      height: '110px',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)',
      borderRadius: '12px 12px 0 0',
      border: '2px solid #E0E0E0',
      position: 'relative',
      cursor: 'pointer',
      marginTop: '-8px',
      zIndex: '1',
    });

    // 领带
    const tie = document.createElement('div');
    Object.assign(tie.style, {
      position: 'absolute',
      top: '12px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '14px',
      height: '70px',
      background: '#1565C0',
      clipPath: 'polygon(0 0, 100% 0, 75% 100%, 25% 100%)',
    });
    body.appendChild(tie);

    character.appendChild(body);

    // 左臂
    const leftArm = document.createElement('div');
    Object.assign(leftArm.style, {
      position: 'absolute',
      top: '12px',
      left: '-28px',
      width: '28px',
      height: '90px',
      background: '#FFFFFF',
      borderRadius: '14px',
      border: '2px solid #E0E0E0',
      cursor: 'pointer',
      transform: 'rotate(15deg)',
      transformOrigin: 'top center',
    });
    body.appendChild(leftArm);

    // 右臂
    const rightArm = document.createElement('div');
    Object.assign(rightArm.style, {
      position: 'absolute',
      top: '12px',
      right: '-28px',
      width: '28px',
      height: '90px',
      background: '#FFFFFF',
      borderRadius: '14px',
      border: '2px solid #E0E0E0',
      cursor: 'pointer',
      transform: 'rotate(-15deg)',
      transformOrigin: 'top center',
    });
    body.appendChild(rightArm);

    // 左腿
    const leftLeg = document.createElement('div');
    Object.assign(leftLeg.style, {
      width: '32px',
      height: '110px',
      background: 'linear-gradient(180deg, #455A64 0%, #37474F 100%)',
      borderRadius: '0 0 10px 10px',
      border: '2px solid #263238',
      cursor: 'pointer',
    });
    character.appendChild(leftLeg);

    // 右腿
    const rightLeg = document.createElement('div');
    Object.assign(rightLeg.style, {
      width: '32px',
      height: '110px',
      background: 'linear-gradient(180deg, #455A64 0%, #37474F 100%)',
      borderRadius: '0 0 10px 10px',
      border: '2px solid #263238',
      cursor: 'pointer',
      marginLeft: '10px',
    });
    character.appendChild(rightLeg);

    // 鞋子
    const leftShoe = document.createElement('div');
    Object.assign(leftShoe.style, {
      width: '36px',
      height: '18px',
      background: '#212121',
      borderRadius: '10px 10px 6px 6px',
      marginTop: '4px',
    });
    character.appendChild(leftShoe);

    const rightShoe = document.createElement('div');
    Object.assign(rightShoe.style, {
      width: '36px',
      height: '18px',
      background: '#212121',
      borderRadius: '10px 10px 6px 6px',
      marginLeft: '10px',
    });
    character.appendChild(rightShoe);

    // 打击点标记
    this.HIT_POINTS.forEach((hp, i) => {
      const hitPoint = this._buildHitPoint(hp, character);
      this._hitPoints.push(hitPoint);
    });

    wrap.appendChild(character);
    this._el.appendChild(wrap);
    return wrap;
  },

  // ========== 单个打击点 ==========
  _buildHitPoint(hpConfig, parent) {
    const wrap = document.createElement('div');
    Object.assign(wrap.style, {
      position: 'absolute',
      left: hpConfig.x + '%',
      top: hpConfig.y + '%',
      transform: 'translate(-50%, -50%)',
      cursor: 'pointer',
      zIndex: '10',
    });

    // 爆炸标记
    const marker = document.createElement('div');
    marker.textContent = hpConfig.emoji;
    Object.assign(marker.style, {
      fontSize: '28px',
      animation: 'hitPulse 1.5s ease-in-out infinite',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
    });
    wrap.appendChild(marker);

    // 标签
    const label = document.createElement('div');
    label.textContent = hpConfig.label;
    Object.assign(label.style, {
      position: 'absolute',
      top: '32px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '12px',
      fontWeight: '700',
      color: '#D32F2F',
      background: 'rgba(255,255,255,0.95)',
      borderRadius: '8px',
      padding: '3px 8px',
      whiteSpace: 'nowrap',
      border: '2px solid #FF5252',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    });
    wrap.appendChild(label);

    // 烟雾效果（部分打击点有）
    if (hpConfig.label === '扇耳光' || hpConfig.label === '拳打') {
      const smoke = document.createElement('div');
      smoke.textContent = '💨';
      Object.assign(smoke.style, {
        position: 'absolute',
        top: '-10px',
        right: '-20px',
        fontSize: '20px',
        opacity: '0.7',
        animation: 'smokeFloat 2s ease-in-out infinite',
      });
      wrap.appendChild(smoke);
    }

    wrap.onclick = (e) => {
      e.stopPropagation();
      this._hitTarget(hpConfig.id);
    };

    parent.appendChild(wrap);
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
      height: '200px',
      background: 'linear-gradient(0deg, #FFE082 0%, #FFCA28 100%)',
      borderTop: '3px solid #FFB300',
      display: 'flex',
      flexDirection: 'column',
      padding: '12px 16px',
      zIndex: '10',
    });

    // 武器选择区
    const weaponRow = document.createElement('div');
    Object.assign(weaponRow.style, {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
      marginBottom: '12px',
      background: 'rgba(255,255,255,0.6)',
      borderRadius: '16px',
      padding: '14px',
      border: '2px solid #FFB300',
    });

    this.WEAPONS.forEach((weapon, i) => {
      const btn = document.createElement('div');
      btn.id = `weapon-${i}`;
      const isSelected = i === this._currentWeapon;
      Object.assign(btn.style, {
        flex: '1',
        maxWidth: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        cursor: 'pointer',
        padding: '10px 6px',
        borderRadius: '12px',
        border: isSelected ? '3px solid #FF6F00' : '2px solid transparent',
        background: isSelected ? 'rgba(255,111,0,0.15)' : 'transparent',
        transition: 'all 0.2s',
        position: 'relative',
      });

      const emoji = document.createElement('span');
      emoji.textContent = weapon.emoji;
      emoji.style.fontSize = '36px';
      btn.appendChild(emoji);

      const name = document.createElement('span');
      name.textContent = weapon.name;
      name.style.cssText = 'font-size:12px;color:#5D4037;font-weight:700;';
      btn.appendChild(name);

      // 倒计时标记
      if (weapon.duration > 0) {
        const timer = document.createElement('div');
        timer.id = `weapon-timer-${i}`;
        timer.textContent = weapon.duration;
        Object.assign(timer.style, {
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          fontSize: '10px',
          color: '#FF6F00',
          background: '#FFF',
          borderRadius: '50%',
          width: '22px',
          height: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #FFB300',
          fontWeight: '700',
        });
        btn.appendChild(timer);
      }

      btn.onclick = () => {
        this._currentWeapon = i;
        this._updateWeaponDisplay();
      };

      weaponRow.appendChild(btn);
    });

    bar.appendChild(weaponRow);

    // 底部信息栏
    const infoRow = document.createElement('div');
    Object.assign(infoRow.style, {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flex: '1',
    });

    // 求饶概率
    const surrenderInfo = document.createElement('div');
    Object.assign(surrenderInfo.style, {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    });

    const surrenderEmoji = document.createElement('span');
    surrenderEmoji.textContent = '🥺';
    surrenderEmoji.style.fontSize = '24px';
    surrenderInfo.appendChild(surrenderEmoji);

    const surrenderText = document.createElement('span');
    surrenderText.textContent = '求饶几率';
    surrenderText.style.cssText = 'font-size:14px;color:#5D4037;font-weight:600;';
    surrenderInfo.appendChild(surrenderText);

    const surrenderValue = document.createElement('span');
    surrenderValue.textContent = this._surrenderChance + '%';
    surrenderValue.style.cssText = 'font-size:28px;font-weight:900;color:#FF6F00;';
    surrenderInfo.appendChild(surrenderValue);

    infoRow.appendChild(surrenderInfo);

    // 触发特效按钮
    const effectBtn = document.createElement('div');
    effectBtn.textContent = '触发特效';
    Object.assign(effectBtn.style, {
      padding: '14px 28px',
      background: 'linear-gradient(180deg, #FFB300 0%, #FF8F00 100%)',
      borderRadius: '28px',
      fontSize: '18px',
      fontWeight: '800',
      color: '#5D4037',
      cursor: 'pointer',
      border: '2px solid #FFA000',
      boxShadow: '0 4px 12px rgba(255,111,0,0.4)',
      transition: 'transform 0.1s',
    });
    effectBtn.onmousedown = () => { effectBtn.style.transform = 'scale(0.95)'; };
    effectBtn.onmouseup = () => {
      effectBtn.style.transform = 'scale(1)';
      this._triggerSpecialEffect();
    };
    infoRow.appendChild(effectBtn);

    bar.appendChild(infoRow);
    this._el.appendChild(bar);
    return bar;
  },

  // ==================== 游戏逻辑 ====================

  _updateWeaponDisplay() {
    this.WEAPONS.forEach((_, i) => {
      const btn = document.getElementById(`weapon-${i}`);
      if (btn) {
        const isSelected = i === this._currentWeapon;
        btn.style.border = isSelected ? '3px solid #FF6F00' : '2px solid transparent';
        btn.style.background = isSelected ? 'rgba(255,111,0,0.15)' : 'transparent';
      }
    });
  },

  _hitTarget(pointId) {
    const weapon = this.WEAPONS[this._currentWeapon];
    let damage = weapon.damage;

    this._comboCount++;
    if (this._comboCount >= 5) damage = Math.floor(damage * 1.5);
    if (this._comboCount >= 10) damage = Math.floor(damage * 2);

    this._score += damage;
    this._totalDamage += damage;
    document.getElementById('figure-total-damage').textContent = `累计伤害 ${this._totalDamage}`;

    // 角色表情变化
    const head = document.getElementById('char-head');
    if (head) {
      head.textContent = '😣';
      head.style.transform = 'scale(1.2)';
      setTimeout(() => {
        head.textContent = '😤';
        head.style.transform = 'scale(1)';
      }, 300);
    }

    // 打击特效
    this._showHitEffect(pointId);

    // 伤害数字
    this._showDamageNumber(damage);

    // 求饶检查
    if (Math.random() * 100 < this._surrenderChance) {
      this._triggerSurrender();
    }
  },

  _showHitEffect(pointId) {
    const hitPoint = this._hitPoints.find(hp => hp.config && hp.config.id === pointId);
    if (!hitPoint) return;

    const effect = document.createElement('div');
    effect.textContent = '💥';
    Object.assign(effect.style, {
      position: 'absolute',
      left: hitPoint.style.left,
      top: hitPoint.style.top,
      fontSize: '40px',
      zIndex: '100',
      animation: 'hitEffect 0.5s ease-out forwards',
      pointerEvents: 'none',
    });
    hitPoint.parentElement.appendChild(effect);
    setTimeout(() => effect.remove(), 500);
  },

  _showDamageNumber(damage) {
    const num = document.createElement('div');
    num.textContent = '-' + damage;
    num.style.cssText = `
      position: absolute;
      left: 50%;
      top: 35%;
      transform: translateX(-50%);
      font-size: 30px;
      font-weight: 900;
      color: ${damage > 20 ? '#FF1744' : '#FF6F00'};
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      z-index: 100;
      pointer-events: none;
      animation: damageFloat 0.8s ease-out forwards;
    `;
    this._el.appendChild(num);
    setTimeout(() => num.remove(), 800);
  },

  _triggerSurrender() {
    const head = document.getElementById('char-head');
    if (!head) return;

    const face = this.SURRENDER_FACES[Math.floor(Math.random() * this.SURRENDER_FACES.length)];
    head.textContent = face;
    head.style.border = '3px solid #E91E63';

    Toast.show('🥺 目标触发了求饶动作！', MessageType.GAMEPLAY, 2000);

    setTimeout(() => {
      head.textContent = '😤';
      head.style.border = '3px solid #FFB300';
    }, 2000);
  },

  _triggerSpecialEffect() {
    Toast.show('✨ 特效触发！全屏打击！', MessageType.GAMEPLAY, 2000);
    this.HIT_POINTS.forEach((hp, i) => {
      setTimeout(() => {
        this._hitTarget(hp.id);
      }, i * 100);
    });
  },
};

// 注入动画
(function injectAnimations() {
  if (document.getElementById('figure-fight-animations')) return;
  const style = document.createElement('style');
  style.id = 'figure-fight-animations';
  style.textContent = `
    @keyframes hitPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }
    @keyframes hitEffect {
      0% { transform: scale(0.5); opacity: 1; }
      100% { transform: scale(1.8); opacity: 0; }
    }
    @keyframes damageFloat {
      0% { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
      100% { transform: translateX(-50%) translateY(-70px) scale(1.6); opacity: 0; }
    }
    @keyframes smokeFloat {
      0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
      50% { transform: translateY(-10px) rotate(10deg); opacity: 0.4; }
    }
  `;
  document.head.appendChild(style);
})();
