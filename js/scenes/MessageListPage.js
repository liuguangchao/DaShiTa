/**
 * 消息列表页面
 * 打屎他 - 消息模块
 */
const MessageListPage = {
  _panel: null,
  _listEl: null,
  _currentCategory: 'all',
  _batchMode: false,
  _selectedIds: new Set(),
  _messages: [],

  show() {
    this._messages = Storage.getMessages();
    this._currentCategory = 'all';
    this._batchMode = false;
    this._selectedIds = new Set();
    this._render();
  },

  hide() {
    if (this._panel) {
      Overlay.hide();
    }
  },

  _render() {
    if (this._panel) {
      Overlay.hide();
    }

    this._panel = createPanel('70%', '80%');

    // 头部
    const header = createPanelHeader('消息中心', () => {
      Overlay.hide();
      GameScene.updateBadge();
    }, [
      this._createBatchBtn(),
      this._createSettingsBtn(),
    ]);
    this._panel.appendChild(header);

    // 分类筛选栏
    this._panel.appendChild(this._createCategoryBar());

    // 消息列表
    this._listEl = document.createElement('div');
    Object.assign(this._listEl.style, {
      flex: '1',
      overflowY: 'auto',
      padding: '8px',
    });
    this._renderList();
    this._panel.appendChild(this._listEl);

    // 底部批量操作栏
    if (this._batchMode) {
      this._panel.appendChild(this._createBatchBar());
    }

    Overlay.show(this._panel);
  },

  _createBatchBtn() {
    const btn = document.createElement('button');
    btn.textContent = this._batchMode ? '完成' : '批量操作';
    Object.assign(btn.style, {
      padding: '4px 10px',
      border: 'none',
      borderRadius: '12px',
      backgroundColor: this._batchMode ? '#4ade80' : '#e5e7eb',
      color: this._batchMode ? '#fff' : '#333',
      fontSize: '12px',
      cursor: 'pointer',
    });
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      this._batchMode = !this._batchMode;
      this._selectedIds = new Set();
      this._render();
    });
    return btn;
  },

  _createSettingsBtn() {
    const btn = document.createElement('div');
    btn.textContent = '⚙️';
    Object.assign(btn.style, {
      width: '28px',
      height: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      cursor: 'pointer',
      borderRadius: '8px',
    });
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      SettingsPage.show();
    });
    return btn;
  },

  _createCategoryBar() {
    const bar = document.createElement('div');
    Object.assign(bar.style, {
      display: 'flex',
      gap: '6px',
      padding: '8px 12px',
      overflowX: 'auto',
      flexShrink: '0',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      WebkitOverflowScrolling: 'touch',
    });
    bar.style.scrollbarWidth = 'none';

    MessageCategories.forEach(cat => {
      const chip = document.createElement('div');
      chip.textContent = cat.label;
      const isActive = cat.key === this._currentCategory;
      Object.assign(chip.style, {
        padding: '5px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: isActive ? 'bold' : 'normal',
        backgroundColor: isActive ? '#F5A623' : '#f3f4f6',
        color: isActive ? '#fff' : '#333',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: '0',
        transition: 'all 0.15s',
      });
      chip.addEventListener('click', () => {
        this._currentCategory = cat.key;
        this._selectedIds = new Set();
        this._render();
      });
      bar.appendChild(chip);
    });

    return bar;
  },

  _renderList() {
    this._listEl.innerHTML = '';

    let filtered = this._messages;
    if (this._currentCategory !== 'all') {
      filtered = this._messages.filter(m => m.type === this._currentCategory);
    }

    // 玩法提醒特殊处理
    if (this._currentCategory === MessageType.GAMEPLAY) {
      // 玩法提醒不存储，但这里显示已有的
      if (filtered.length === 0) {
        this._listEl.innerHTML = this._emptyState('暂无玩法提醒消息', '🎮');
        return;
      }
    }

    if (filtered.length === 0) {
      const catName = MessageCategories.find(c => c.key === this._currentCategory);
      this._listEl.innerHTML = this._emptyState(`暂无${catName ? catName.label : '消息'}`, '📭');
      return;
    }

    filtered.forEach(msg => {
      const item = this._createMessageItem(msg);
      this._listEl.appendChild(item);
    });
  },

  _emptyState(text, icon) {
    return `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#999;">
        <div style="font-size:48px;margin-bottom:12px;">${icon}</div>
        <div style="font-size:14px;">${text}</div>
      </div>
    `;
  },

  _createMessageItem(msg) {
    const item = document.createElement('div');
    const isSelected = this._selectedIds.has(msg.id);
    Object.assign(item.style, {
      display: 'flex',
      alignItems: 'center',
      padding: '10px 12px',
      marginBottom: '4px',
      borderRadius: '8px',
      backgroundColor: msg.read ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.9)',
      borderLeft: msg.read ? '4px solid transparent' : '4px solid #3B82F6',
      cursor: 'pointer',
      position: 'relative',
      transition: 'background-color 0.15s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    });

    // 批量选择复选框
    if (this._batchMode) {
      const checkbox = document.createElement('div');
      const isSystemMsg = msg.type === MessageType.SYSTEM;
      Object.assign(checkbox.style, {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: `2px solid ${isSelected ? '#F5A623' : '#d1d5db'}`,
        backgroundColor: isSelected ? '#F5A623' : 'transparent',
        marginRight: '10px',
        flexShrink: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isSystemMsg ? '0.3' : '1',
        cursor: isSystemMsg ? 'not-allowed' : 'pointer',
        fontSize: '12px',
        color: '#fff',
      });
      if (isSelected) checkbox.textContent = '✓';
      if (!isSystemMsg) {
        checkbox.addEventListener('click', (e) => {
          e.stopPropagation();
          if (isSelected) {
            this._selectedIds.delete(msg.id);
          } else {
            this._selectedIds.add(msg.id);
          }
          this._render();
        });
      }
      item.appendChild(checkbox);
    }

    // 消息图标
    const icon = this._getMessageIcon(msg.type);
    const iconEl = document.createElement('div');
    iconEl.textContent = icon;
    Object.assign(iconEl.style, {
      width: '48px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
      borderRadius: '12px',
      backgroundColor: 'rgba(0,0,0,0.04)',
      flexShrink: '0',
      marginRight: '10px',
    });
    item.appendChild(iconEl);

    // 内容区
    const content = document.createElement('div');
    Object.assign(content.style, {
      flex: '1',
      overflow: 'hidden',
      minWidth: '0',
    });

    const title = document.createElement('div');
    title.textContent = msg.title;
    const color = MessageTypeColor[msg.type];
    Object.assign(title.style, {
      fontSize: '14px',
      fontWeight: 'bold',
      color: color,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    });
    content.appendChild(title);

    const summary = document.createElement('div');
    summary.textContent = msg.summary;
    Object.assign(summary.style, {
      fontSize: '12px',
      color: '#888',
      marginTop: '2px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    });
    content.appendChild(summary);

    item.appendChild(content);

    // 时间
    const time = document.createElement('div');
    time.textContent = this._formatTime(msg.time);
    Object.assign(time.style, {
      fontSize: '11px',
      color: '#bbb',
      flexShrink: '0',
      marginLeft: '8px',
      alignSelf: 'flex-start',
      marginTop: '2px',
    });
    item.appendChild(time);

    // 点击事件
    item.addEventListener('click', (e) => {
      if (this._batchMode) {
        if (msg.type === MessageType.SYSTEM) return;
        if (this._selectedIds.has(msg.id)) {
          this._selectedIds.delete(msg.id);
        } else {
          this._selectedIds.add(msg.id);
        }
        this._render();
        return;
      }
      MessageDetailPage.show(msg);
    });

    // 长按菜单
    let longTimer;
    item.addEventListener('touchstart', () => {
      longTimer = setTimeout(() => {
        this._showItemMenu(msg, item);
      }, 500);
    });
    item.addEventListener('touchend', () => clearTimeout(longTimer));
    item.addEventListener('touchmove', () => clearTimeout(longTimer));
    item.addEventListener('mousedown', () => {
      longTimer = setTimeout(() => {
        this._showItemMenu(msg, item);
      }, 500);
    });
    item.addEventListener('mouseup', () => clearTimeout(longTimer));
    item.addEventListener('mouseleave', () => clearTimeout(longTimer));

    return item;
  },

  _showItemMenu(msg, anchorEl) {
    const menu = document.createElement('div');
    Object.assign(menu.style, {
      position: 'fixed',
      top: anchorEl.getBoundingClientRect().top + 'px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(255,255,255,0.98)',
      borderRadius: '12px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      overflow: 'hidden',
      zIndex: '9000',
      minWidth: '140px',
    });

    const items = [];
    if (!msg.read) {
      items.push({
        label: '✓ 标记为已读',
        action: () => {
          Storage.markRead(msg.id);
          this._messages = Storage.getMessages();
          this._render();
          GameScene.updateBadge();
        },
      });
    }
    if (msg.deletable) {
      items.push({
        label: '🗑 删除消息',
        action: () => {
          showConfirm('确认删除', '确认删除该消息？', () => {
            Storage.deleteOne(msg.id);
            this._messages = Storage.getMessages();
            this._render();
            GameScene.updateBadge();
          });
        },
      });
    }

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
      el.addEventListener('click', () => {
        Overlay.hide();
        item.action();
      });
      menu.appendChild(el);
    });

    Overlay.show(menu, () => Overlay.hide());
  },

  _createBatchBar() {
    const bar = document.createElement('div');
    Object.assign(bar.style, {
      display: 'flex',
      gap: '8px',
      padding: '10px 12px',
      borderTop: '1px solid rgba(0,0,0,0.08)',
      flexShrink: '0',
    });

    const markReadBtn = createButton('标记已读', '#F5A623', '#fff', '13px');
    markReadBtn.style.flex = '1';
    markReadBtn.addEventListener('click', () => {
      if (this._selectedIds.size === 0) return;
      Storage.markAllRead([...this._selectedIds]);
      this._messages = Storage.getMessages();
      this._selectedIds = new Set();
      this._render();
      GameScene.updateBadge();
    });
    bar.appendChild(markReadBtn);

    const deleteBtn = createButton('删除', '#EF4444', '#fff', '13px');
    deleteBtn.style.flex = '1';
    deleteBtn.addEventListener('click', () => {
      if (this._selectedIds.size === 0) return;
      const deletable = [...this._selectedIds].filter(id => {
        const m = this._messages.find(msg => msg.id === id);
        return m && m.deletable;
      });
      if (deletable.length === 0) return;
      showConfirm('批量删除', `确认删除选中的 ${deletable.length} 条消息？`, () => {
        Storage.deleteMessages(deletable);
        this._messages = Storage.getMessages();
        this._selectedIds = new Set();
        this._render();
        GameScene.updateBadge();
      });
    });
    bar.appendChild(deleteBtn);

    return bar;
  },

  _getMessageIcon(type) {
    const icons = {
      [MessageType.SYSTEM]: '🛡️',
      [MessageType.REWARD]: '🎁',
      [MessageType.ACHIEVEMENT]: '🏆',
      [MessageType.ACTIVITY]: '🎆',
      [MessageType.INTERACTION]: '👥',
      [MessageType.GAMEPLAY]: '👊',
    };
    return icons[type] || '📬';
  },

  _formatTime(timeStr) {
    const d = new Date(timeStr);
    const now = new Date();
    const diff = now - d;
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');

    if (diff < 24 * 3600 * 1000) {
      if (d.getDate() === now.getDate()) return `${hours}:${minutes}`;
      return '昨天';
    }
    if (diff < 7 * 24 * 3600 * 1000) {
      const days = ['日', '一', '二', '三', '四', '五', '六'];
      return `周${days[d.getDay()]}`;
    }
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  },
};