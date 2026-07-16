/**
 * UI 基础组件
 * 打屎他 - 消息模块
 */

// ========== Toast 悬浮提示 ==========
const Toast = {
  _el: null,
  _timer: null,
  _visible: false,

  init() {
    if (this._el) return;
    this._el = document.createElement('div');
    this._el.id = 'toast';
    Object.assign(this._el.style, {
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: '60%',
      padding: '10px 20px',
      borderRadius: '12px',
      color: '#fff',
      fontSize: '14px',
      textAlign: 'center',
      zIndex: '10000',
      opacity: '0',
      transition: 'opacity 0.3s ease',
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    });
    document.body.appendChild(this._el);
  },

  /**
   * 显示 Toast
   * @param {string} text - 文字内容
   * @param {string} type - 消息类型，决定颜色
   * @param {number} duration - 停留时长(ms)，默认3000
   * @param {boolean} showIcon - 是否显示图标（玩法提醒不显示）
   * @param {boolean} showTip - 是否显示"技巧"标识
   */
  show(text, type, duration = 3000, showIcon = true, showTip = false) {
    this.init();
    if (this._timer) clearTimeout(this._timer);

    const color = MessageTypeColor[type] || '#333';
    this._el.style.backgroundColor = color + 'E6'; // 90% opacity
    this._el.style.opacity = '0';

    let content = text;
    if (showTip) {
      content = `<span style="display:inline-block;background:rgba(255,255,255,0.3);border-radius:4px;padding:1px 6px;font-size:11px;margin-right:6px;vertical-align:middle;">技巧</span>${text}`;
    }

    this._el.innerHTML = content;
    this._visible = true;

    // 触发重排后显示
    void this._el.offsetWidth;
    this._el.style.opacity = '1';

    this._timer = setTimeout(() => {
      this.hide();
    }, duration);
  },

  hide() {
    if (!this._el) return;
    this._el.style.opacity = '0';
    this._visible = false;
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  },
};

// ========== Overlay 半透明弹层 ==========
const Overlay = {
  _el: null,
  _contentEl: null,

  init() {
    if (this._el) return;
    this._el = document.createElement('div');
    this._el.id = 'overlay';
    Object.assign(this._el.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: '5000',
      display: 'none',
      justifyContent: 'center',
      alignItems: 'center',
    });
    this._el.addEventListener('click', (e) => {
      if (e.target === this._el && this._onBackdrop) {
        this._onBackdrop();
      }
    });
    document.body.appendChild(this._el);
  },

  _onBackdrop: null,

  show(contentEl, onBackdrop = null) {
    this.init();
    this._onBackdrop = onBackdrop;
    if (this._contentEl) {
      this._el.removeChild(this._contentEl);
    }
    this._contentEl = contentEl;
    this._el.appendChild(contentEl);
    this._el.style.display = 'flex';
    // 入场动画
    contentEl.style.opacity = '0';
    contentEl.style.transform = 'scale(0.9)';
    void contentEl.offsetWidth;
    contentEl.style.transition = 'all 0.25s ease-out';
    contentEl.style.opacity = '1';
    contentEl.style.transform = 'scale(1)';
  },

  hide() {
    if (!this._el) return;
    if (this._contentEl) {
      this._contentEl.style.opacity = '0';
      this._contentEl.style.transform = 'scale(0.9)';
    }
    setTimeout(() => {
      this._el.style.display = 'none';
      if (this._contentEl && this._el.contains(this._contentEl)) {
        this._el.removeChild(this._contentEl);
      }
      this._contentEl = null;
      this._onBackdrop = null;
    }, 200);
  },

  isVisible() {
    return this._el && this._el.style.display === 'flex';
  },
};

// ========== Switch 开关 ==========
function createSwitch(checked, onChange) {
  const track = document.createElement('div');
  Object.assign(track.style, {
    width: '32px',
    height: '18px',
    borderRadius: '9px',
    backgroundColor: checked ? '#4ade80' : '#d1d5db',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    flexShrink: '0',
  });

  const thumb = document.createElement('div');
  Object.assign(thumb.style, {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    position: 'absolute',
    top: '2px',
    left: checked ? '16px' : '2px',
    transition: 'left 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  });
  track.appendChild(thumb);

  let _checked = checked;
  track.addEventListener('click', (e) => {
    e.stopPropagation();
    _checked = !_checked;
    track.style.backgroundColor = _checked ? '#4ade80' : '#d1d5db';
    thumb.style.left = _checked ? '16px' : '2px';
    if (onChange) onChange(_checked);
  });

  return track;
}

// ========== 确认对话框 ==========
function showConfirm(title, text, onConfirm, onCancel) {
  const el = document.createElement('div');
  Object.assign(el.style, {
    width: '280px',
    padding: '24px',
    borderRadius: '16px',
    backgroundColor: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  });

  el.innerHTML = `
    <div style="font-size:16px;font-weight:bold;color:#333;margin-bottom:12px;">${title}</div>
    <div style="font-size:14px;color:#666;margin-bottom:20px;">${text}</div>
    <div style="display:flex;gap:12px;justify-content:center;">
      <button id="confirm-cancel" style="flex:1;padding:10px;border:none;border-radius:20px;background:#e5e7eb;color:#333;font-size:14px;cursor:pointer;">取消</button>
      <button id="confirm-ok" style="flex:1;padding:10px;border:none;border-radius:20px;background:#EF4444;color:#fff;font-size:14px;cursor:pointer;">确认</button>
    </div>
  `;

  el.querySelector('#confirm-cancel').onclick = () => {
    Overlay.hide();
    if (onCancel) onCancel();
  };
  el.querySelector('#confirm-ok').onclick = () => {
    Overlay.hide();
    if (onConfirm) onConfirm();
  };

  Overlay.show(el);
}

// ========== 创建半透明浮层面板 ==========
function createPanel(width = '70%', height = '80%', borderRadius = '16px') {
  const panel = document.createElement('div');
  Object.assign(panel.style, {
    width: width,
    height: height,
    maxWidth: '400px',
    maxHeight: '700px',
    borderRadius: borderRadius,
    backgroundColor: 'rgba(255,255,255,0.85)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  });
  return panel;
}

// ========== 创建面板头部 ==========
function createPanelHeader(title, onBack, extraButtons = []) {
  const header = document.createElement('div');
  Object.assign(header.style, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    flexShrink: '0',
  });

  // 返回按钮
  const backBtn = document.createElement('div');
  backBtn.innerHTML = '←';
  Object.assign(backBtn.style, {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: '#333',
    cursor: 'pointer',
    borderRadius: '8px',
  });
  backBtn.addEventListener('click', onBack);
  header.appendChild(backBtn);

  // 标题
  const titleEl = document.createElement('div');
  titleEl.textContent = title;
  Object.assign(titleEl.style, {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#F5A623',
    flex: '1',
    textAlign: 'center',
  });
  header.appendChild(titleEl);

  // 额外按钮区域
  const actions = document.createElement('div');
  Object.assign(actions.style, {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  });
  extraButtons.forEach(btn => actions.appendChild(btn));
  header.appendChild(actions);

  return header;
}

// ========== 创建按钮 ==========
function createButton(text, bgColor = '#F5A623', textColor = '#fff', fontSize = '14px') {
  const btn = document.createElement('button');
  btn.textContent = text;
  Object.assign(btn.style, {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '20px',
    backgroundColor: bgColor,
    color: textColor,
    fontSize: fontSize,
    cursor: 'pointer',
    fontWeight: '500',
  });
  return btn;
}