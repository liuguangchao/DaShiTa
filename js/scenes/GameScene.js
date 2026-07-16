/**
 * 打屎他 - 游戏主场景
 * 模拟打地鼠主界面，包含消息中心入口
 */
const GameScene = {
  _el: null,
  _unreadBadge: null,
  _dndBadge: null,
  _longPressTimer: null,
  _longPressTriggered: false,

  create() {
    this._el = document.createElement('div');
    this._el.id = 'game-scene';
    Object.assign(this._el.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(180deg, #87CEEB 0%, #98FB98 40%, #8B4513 100%)',
      overflow: 'hidden',
    });

    // ========== 顶部栏 ==========
    const topBar = document.createElement('div');
    Object.assign(topBar.style, {
      position: 'absolute',
      top: '10px',
      left: '0',
      width: '100%',
      height: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 12px',
      boxSizing: 'border-box',
      zIndex: '10',
    });

    // 左侧：分数
    const scoreEl = document.createElement('div');
    scoreEl.textContent = '🏆 1280';
    Object.assign(scoreEl.style, {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: '4px 12px',
      borderRadius: '12px',
    });
    topBar.appendChild(scoreEl);

    // 右侧：功能入口
    const rightIcons = document.createElement('div');
    Object.assign(rightIcons.style, {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
    });

    // 好友图标
    const friendIcon = this._createIcon('👥');
    rightIcons.appendChild(friendIcon);

    // 成就图标
    const achievementIcon = this._createIcon('🏅');
    rightIcons.appendChild(achievementIcon);

    // 背包图标
    const bagIcon = this._createIcon('🎒');
    rightIcons.appendChild(bagIcon);

    // 商城图标
    const shopIcon = this._createIcon('🛒');
    rightIcons.appendChild(shopIcon);

    // 消息中心入口（信封图标）
    const msgEntry = this._createMessageEntry();
    rightIcons.appendChild(msgEntry);

    // 设置图标
    const settingIcon = this._createIcon('⚙️');
    rightIcons.appendChild(settingIcon);

    topBar.appendChild(rightIcons);
    this._el.appendChild(topBar);

    // ========== 游戏标题 ==========
    const title = document.createElement('div');
    title.textContent = '💩 打 屎 他 💩';
    Object.assign(title.style, {
      position: 'absolute',
      top: '60px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#5D3A1A',
      textShadow: '2px 2px 0 rgba(255,255,255,0.5)',
      zIndex: '5',
    });
    this._el.appendChild(title);

    // ========== 地鼠洞区域 ==========
    const holes = this._createHoles(scoreEl);
    this._el.appendChild(holes);

    // ========== 底部武器栏 ==========
    const weaponBar = this._createWeaponBar();
    this._el.appendChild(weaponBar);

    return this;
  },

  _createIcon(emoji) {
    const icon = document.createElement('div');
    icon.textContent = emoji;
    Object.assign(icon.style, {
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '22px',
      cursor: 'pointer',
      backgroundColor: 'rgba(255,255,255,0.25)',
      borderRadius: '10px',
      backdropFilter: 'blur(4px)',
    });
    return icon;
  },

  _createMessageEntry() {
    const container = document.createElement('div');
    Object.assign(container.style, {
      position: 'relative',
      width: '36px',
      height: '36px',
    });

    const icon = document.createElement('div');
    icon.textContent = '✉️';
    Object.assign(icon.style, {
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '22px',
      cursor: 'pointer',
      backgroundColor: 'rgba(255,255,255,0.25)',
      borderRadius: '10px',
      backdropFilter: 'blur(4px)',
    });
    container.appendChild(icon);

    // 未读角标
    const badge = document.createElement('div');
    badge.id = 'msg-badge';
    Object.assign(badge.style, {
      display: 'none',
      position: 'absolute',
      top: '-4px',
      right: '-4px',
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      backgroundColor: '#EF4444',
      color: '#fff',
      fontSize: '10px',
      fontWeight: 'bold',
      textAlign: 'center',
      lineHeight: '16px',
      zIndex: '1',
    });
    container.appendChild(badge);
    this._unreadBadge = badge;

    // 免打扰标识
    const dndBadge = document.createElement('div');
    dndBadge.id = 'dnd-badge';
    dndBadge.textContent = '🌙';
    Object.assign(dndBadge.style, {
      display: 'none',
      position: 'absolute',
      top: '-2px',
      right: '14px',
      fontSize: '10px',
      zIndex: '1',
    });
    container.appendChild(dndBadge);
    this._dndBadge = dndBadge;

    // 点击打开消息列表
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this._longPressTriggered) {
        this._longPressTriggered = false;
        return;
      }
      MessageListPage.show();
    });

    // 长按弹出快捷菜单
    icon.addEventListener('touchstart', (e) => this._startLongPress(e));
    icon.addEventListener('touchend', (e) => this._endLongPress(e));
    icon.addEventListener('touchmove', () => this._cancelLongPress());
    icon.addEventListener('mousedown', (e) => this._startLongPress(e));
    icon.addEventListener('mouseup', (e) => this._endLongPress(e));
    icon.addEventListener('mouseleave', () => this._cancelLongPress());

    return container;
  },

  _startLongPress(e) {
    this._longPressTriggered = false;
    this._longPressTimer = setTimeout(() => {
      this._longPressTriggered = true;
      this._showQuickMenu(e);
    }, 500);
  },

  _endLongPress(e) {
    clearTimeout(this._longPressTimer);
  },

  _cancelLongPress() {
    clearTimeout(this._longPressTimer);
  },

  _showQuickMenu(e) {
    const menu = document.createElement('div');
    Object.assign(menu.style, {
      position: 'fixed',
      top: '60px',
      right: '12px',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderRadius: '12px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      overflow: 'hidden',
      zIndex: '8000',
      minWidth: '150px',
    });

    const items = [
      { label: '📬 查看未读消息', action: () => { Overlay.hide(); MessageListPage.show(); } },
      { label: '⚙️ 消息设置', action: () => { Overlay.hide(); SettingsPage.show(); } },
    ];

    items.forEach((item, i) => {
      const el = document.createElement('div');
      el.textContent = item.label;
      Object.assign(el.style, {
        padding: '12px 16px',
        fontSize: '14px',
        color: '#333',
        cursor: 'pointer',
        borderBottom: i < items.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
      });
      el.addEventListener('mouseenter', () => el.style.backgroundColor = 'rgba(0,0,0,0.04)');
      el.addEventListener('mouseleave', () => el.style.backgroundColor = 'transparent');
      el.addEventListener('click', () => item.action());
      menu.appendChild(el);
    });

    Overlay.show(menu, () => Overlay.hide());
  },

  _createHoles(scoreEl) {
    const holes = document.createElement('div');
    Object.assign(holes.style, {
      position: 'absolute',
      top: '25%',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      padding: '20px',
    });

    // 连击计数器
    let comboCount = 0;
    let comboTimer = null;

    // 获取讨厌的人列表
    const settings = Storage.getSettings();
    const hatedPeople = settings.hatedPeople || [];

    // 打击文案池
    const hitTexts = ['💥', '💢', '👊', '🔨', '⚡', '💫'];
    const scoreTexts = ['+10', '+20', '+30', '+50', '+暴击!'];

    for (let i = 0; i < 6; i++) {
      const hole = document.createElement('div');
      Object.assign(hole.style, {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#4A2800',
        border: '4px solid #2D1B00',
        boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.5)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
      });

      // 模拟地鼠偶尔冒头
      const mole = document.createElement('div');
      // 如果有讨厌的人，随机使用他们的头像表情
      if (hatedPeople.length > 0 && Math.random() > 0.5) {
        const hp = hatedPeople[Math.floor(Math.random() * hatedPeople.length)];
        mole.textContent = this._getAvatarEmoji(hp.avatar || 'avatar_01');
      } else {
        mole.textContent = '💩';
      }
      Object.assign(mole.style, {
        position: 'absolute',
        bottom: '-20px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '40px',
        transition: 'bottom 0.2s ease',
      });
      hole.appendChild(mole);

      // 随机动画
      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          mole.style.bottom = '10px';
          setTimeout(() => { mole.style.bottom = '-20px'; }, 800 + Math.random() * 1200);
        }
      }, 2000 + Math.random() * 3000);

      hole.addEventListener('click', (e) => {
        // 隐藏地鼠
        mole.style.bottom = '-20px';

        // 打击特效
        const hit = document.createElement('div');
        hit.textContent = hitTexts[Math.floor(Math.random() * hitTexts.length)];
        Object.assign(hit.style, {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '30px',
          pointerEvents: 'none',
        });
        hole.appendChild(hit);
        setTimeout(() => hit.remove(), 300);

        // 连击逻辑
        comboCount++;
        clearTimeout(comboTimer);
        comboTimer = setTimeout(() => { comboCount = 0; }, 2000);

        // 分数弹出
        const scorePopup = document.createElement('div');
        scorePopup.className = 'score-popup';
        scorePopup.textContent = scoreTexts[Math.floor(Math.random() * scoreTexts.length)];
        scorePopup.style.top = (e.clientY - document.getElementById('app').getBoundingClientRect().top - 20) + 'px';
        scorePopup.style.left = (e.clientX - document.getElementById('app').getBoundingClientRect().left) + 'px';
        document.getElementById('app').appendChild(scorePopup);
        setTimeout(() => scorePopup.remove(), 800);

        // 更新分数显示
        scoreEl.textContent = '🏆 ' + (1280 + comboCount * 10);

        // 连击里程碑 Toast
        if (comboCount === 10) {
          Toast.show('⚡ 连续打击10次！触发10秒伤害翻倍！', MessageType.GAMEPLAY, 3000);
          this._showComboDisplay('10连击！伤害翻倍！');
        } else if (comboCount === 30) {
          Toast.show('🔥 连续打击30次！触发终极宣泄模式！', MessageType.GAMEPLAY, 3000);
          this._showComboDisplay('30连击！终极宣泄！');
        } else if (comboCount === 50) {
          Toast.show('🏆 武器熟练度满级！解锁专属特效！', MessageType.GAMEPLAY, 3000, true, true);
          this._showComboDisplay('50连击！专属特效解锁！');
        }

        // 讨厌的人关联玩法
        if (hatedPeople.length > 0 && hatedPeople[i % hatedPeople.length]?.restrictions?.linkGameplay) {
          const hp = hatedPeople[i % hatedPeople.length];
          if (Math.random() > 0.7) {
            Toast.show(`💢 ${hp.name} 触发求饶，伤害提升20%！`, MessageType.GAMEPLAY, 2500);
          }
        }
      });

      holes.appendChild(hole);
    }

    return holes;
  },

  _getAvatarEmoji(avatarId) {
    const avatars = ['😡', '😤', '🤬', '😠', '💢', '👿', '😾', '🤯', '💀', '👹', '👺', '🤡'];
    const idx = parseInt(avatarId.replace('avatar_', ''), 10) - 1;
    return avatars[idx >= 0 && idx < avatars.length ? idx : 0];
  },

  _showComboDisplay(text) {
    const combo = document.createElement('div');
    combo.className = 'combo-display';
    combo.textContent = text;
    document.getElementById('app').appendChild(combo);
    setTimeout(() => combo.remove(), 2000);
  },

  _createWeaponBar() {
    const bar = document.createElement('div');
    Object.assign(bar.style, {
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '12px',
      padding: '8px 16px',
      backgroundColor: 'rgba(0,0,0,0.3)',
      borderRadius: '20px',
      backdropFilter: 'blur(4px)',
    });

    const weapons = [
      { emoji: '🪵', name: '木棍', active: true },
      { emoji: '🔨', name: '铁锤', active: false },
      { emoji: '⚡', name: '电击', active: false },
    ];

    weapons.forEach(w => {
      const btn = document.createElement('div');
      btn.textContent = w.emoji;
      Object.assign(btn.style, {
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        borderRadius: '12px',
        backgroundColor: w.active ? 'rgba(245,166,35,0.6)' : 'rgba(255,255,255,0.2)',
        cursor: 'pointer',
        border: w.active ? '2px solid #F5A623' : '2px solid transparent',
        transition: 'all 0.2s',
      });
      btn.addEventListener('click', () => {
        bar.querySelectorAll('div').forEach(b => {
          b.style.backgroundColor = 'rgba(255,255,255,0.2)';
          b.style.border = '2px solid transparent';
        });
        btn.style.backgroundColor = 'rgba(245,166,35,0.6)';
        btn.style.border = '2px solid #F5A623';
      });
      bar.appendChild(btn);
    });

    return bar;
  },

  updateBadge() {
    const count = Storage.getUnreadCount();
    const settings = Storage.getSettings();

    if (count > 0) {
      this._unreadBadge.style.display = 'block';
      this._unreadBadge.textContent = count > 99 ? '99+' : count;
    } else {
      this._unreadBadge.style.display = 'none';
    }

    if (settings.doNotDisturb) {
      this._dndBadge.style.display = 'block';
    } else {
      this._dndBadge.style.display = 'none';
    }
  },
};