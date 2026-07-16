/**
 * 消息设置页面
 * 打屎他 - 消息模块
 * 包含：推送开关、免打扰、个人信息、讨厌的人管理
 */
const SettingsPage = {
  _panel: null,
  _settings: null,

  show(fromList = false) {
    this._settings = Storage.getSettings();
    this._render(fromList);
  },

  hide() {
    if (this._panel) {
      Overlay.hide();
    }
  },

  _render(fromList = false) {
    if (this._panel) {
      Overlay.hide();
    }

    this._panel = createPanel('85%', '92%');
    this._panel.style.maxWidth = '420px';

    // 头部
    const header = createPanelHeader('消息设置', () => {
      Overlay.hide();
      if (fromList) {
        MessageListPage.show();
      } else {
        GameScene.updateBadge();
      }
    });
    this._panel.appendChild(header);

    // 内容滚动区
    const scrollArea = document.createElement('div');
    Object.assign(scrollArea.style, {
      flex: '1',
      overflowY: 'auto',
      padding: '0 12px 12px',
    });

    // === 模块一：消息推送开关 ===
    scrollArea.appendChild(this._createPushSwitchesModule());

    // === 模块二：免打扰设置 ===
    scrollArea.appendChild(this._createDNDModule());

    // === 模块三：个人信息设置 ===
    scrollArea.appendChild(this._createProfileModule());

    // === 模块四：讨厌的人管理 ===
    scrollArea.appendChild(this._createHatedPeopleModule());

    this._panel.appendChild(scrollArea);

    // 底部保存按钮
    const footer = document.createElement('div');
    Object.assign(footer.style, {
      padding: '12px',
      borderTop: '1px solid rgba(0,0,0,0.08)',
      display: 'flex',
      justifyContent: 'center',
      flexShrink: '0',
    });
    const saveBtn = createButton('保存设置', '#4ade80', '#fff', '14px');
    saveBtn.style.width = '60%';
    saveBtn.style.height = '40px';
    saveBtn.addEventListener('click', () => {
      Storage.saveSettings(this._settings);
      Toast.show('设置已保存', MessageType.SYSTEM, 2000);
      Overlay.hide();
      if (fromList) {
        MessageListPage.show();
      } else {
        GameScene.updateBadge();
      }
    });
    footer.appendChild(saveBtn);
    this._panel.appendChild(footer);

    Overlay.show(this._panel);
  },

  // ===== 模块一：消息推送开关 =====
  _createPushSwitchesModule() {
    const wrapper = document.createElement('div');
    Object.assign(wrapper.style, {
      marginBottom: '16px',
      backgroundColor: 'rgba(255,255,255,0.6)',
      borderRadius: '12px',
      padding: '12px',
    });

    const title = document.createElement('div');
    title.textContent = '消息推送开关';
    Object.assign(title.style, {
      fontSize: '15px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px',
    });
    wrapper.appendChild(title);

    // 各类型开关
    const types = [
      { key: MessageType.SYSTEM, label: '系统通知' },
      { key: MessageType.REWARD, label: '奖励到账' },
      { key: MessageType.ACHIEVEMENT, label: '成就解锁' },
      { key: MessageType.ACTIVITY, label: '活动通知' },
      { key: MessageType.INTERACTION, label: '互动提醒' },
      { key: MessageType.GAMEPLAY, label: '玩法提醒' },
    ];

    types.forEach(t => {
      const row = document.createElement('div');
      Object.assign(row.style, {
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '8px',
      });

      const label = document.createElement('span');
      label.textContent = t.label;
      Object.assign(label.style, {
        fontSize: '14px',
        color: '#333',
      });
      row.appendChild(label);

      const isChecked = this._settings.push[t.key];
      const sw = createSwitch(isChecked, (val) => {
        this._settings.push[t.key] = val;
      });
      row.appendChild(sw);

      wrapper.appendChild(row);
    });

    // 一键开启/关闭按钮
    const btnRow = document.createElement('div');
    Object.assign(btnRow.style, {
      display: 'flex',
      gap: '8px',
      marginTop: '8px',
    });

    const openBtn = createButton('一键开启', '#F5A623', '#fff', '14px');
    openBtn.style.flex = '1';
    openBtn.addEventListener('click', () => {
      types.forEach(t => { this._settings.push[t.key] = true; });
      this._render(false);
    });
    btnRow.appendChild(openBtn);

    const closeBtn = createButton('一键关闭', '#9ca3af', '#fff', '14px');
    closeBtn.style.flex = '1';
    closeBtn.addEventListener('click', () => {
      types.forEach(t => { this._settings.push[t.key] = false; });
      this._render(false);
    });
    btnRow.appendChild(closeBtn);

    wrapper.appendChild(btnRow);
    return wrapper;
  },

  // ===== 模块二：免打扰设置 =====
  _createDNDModule() {
    const wrapper = document.createElement('div');
    Object.assign(wrapper.style, {
      marginBottom: '16px',
      backgroundColor: 'rgba(255,255,255,0.6)',
      borderRadius: '12px',
      padding: '12px',
    });

    const title = document.createElement('div');
    title.textContent = '消息免打扰';
    Object.assign(title.style, {
      fontSize: '15px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px',
    });
    wrapper.appendChild(title);

    // 全局免打扰
    const row1 = document.createElement('div');
    Object.assign(row1.style, {
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '10px',
    });

    const label1 = document.createElement('span');
    label1.textContent = '开启免打扰';
    Object.assign(label1.style, { fontSize: '14px', color: '#333' });
    row1.appendChild(label1);

    const sw1 = createSwitch(this._settings.doNotDisturb, (val) => {
      this._settings.doNotDisturb = val;
    });
    row1.appendChild(sw1);
    wrapper.appendChild(row1);

    // 玩法期间免打扰
    const row2 = document.createElement('div');
    Object.assign(row2.style, {
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '6px',
    });

    const label2 = document.createElement('span');
    label2.textContent = '玩法期间免打扰';
    Object.assign(label2.style, { fontSize: '14px', color: '#333' });
    row2.appendChild(label2);

    const sw2 = createSwitch(this._settings.gameDND, (val) => {
      this._settings.gameDND = val;
    });
    row2.appendChild(sw2);
    wrapper.appendChild(row2);

    const tip = document.createElement('div');
    tip.textContent = '开启后，仅在打地鼠、虚拟人物打击模式下暂停非系统通知类消息推送';
    Object.assign(tip.style, {
      fontSize: '12px',
      color: '#999',
      paddingLeft: '4px',
    });
    wrapper.appendChild(tip);

    return wrapper;
  },

  // ===== 模块三：个人信息设置 =====
  _createProfileModule() {
    const wrapper = document.createElement('div');
    Object.assign(wrapper.style, {
      marginBottom: '16px',
      backgroundColor: 'rgba(255,255,255,0.6)',
      borderRadius: '12px',
      padding: '12px',
    });

    const title = document.createElement('div');
    title.textContent = '个人信息';
    Object.assign(title.style, {
      fontSize: '15px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '12px',
    });
    wrapper.appendChild(title);

    // --- 头像设置 ---
    const avatarSection = document.createElement('div');
    Object.assign(avatarSection.style, {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      marginBottom: '16px',
    });

    const avatarCircle = document.createElement('div');
    const avatarData = this._settings.profile.avatar;
    const avatarEmoji = this._getAvatarEmoji(avatarData);
    avatarCircle.textContent = avatarEmoji;
    Object.assign(avatarCircle.style, {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: 'rgba(245,166,35,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '40px',
      border: '3px solid #F5A623',
      marginBottom: '8px',
      cursor: 'pointer',
    });
    avatarCircle.addEventListener('click', () => {
      this._showAvatarPicker();
    });
    avatarSection.appendChild(avatarCircle);

    const changeAvatarBtn = createButton('更换头像', '#F5A623', '#fff', '14px');
    changeAvatarBtn.style.padding = '8px 24px';
    changeAvatarBtn.addEventListener('click', () => {
      this._showAvatarPicker();
    });
    avatarSection.appendChild(changeAvatarBtn);
    wrapper.appendChild(avatarSection);

    // --- 名称设置 ---
    const nameSection = document.createElement('div');
    Object.assign(nameSection.style, {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    });

    const nameLabel = document.createElement('div');
    nameLabel.textContent = '当前名称';
    Object.assign(nameLabel.style, {
      fontSize: '14px',
      color: '#333',
      fontWeight: 'bold',
    });
    nameSection.appendChild(nameLabel);

    const nameInput = document.createElement('input');
    nameInput.value = this._settings.profile.name;
    Object.assign(nameInput.style, {
      width: '100%',
      height: '36px',
      padding: '0 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      boxSizing: 'border-box',
    });
    nameInput.placeholder = '请输入名称（2-8个字符）';
    nameSection.appendChild(nameInput);

    const nameRow = document.createElement('div');
    Object.assign(nameRow.style, {
      display: 'flex',
      gap: '8px',
    });

    const saveNameBtn = createButton('保存名称', '#4ade80', '#fff', '14px');
    saveNameBtn.addEventListener('click', () => {
      const val = nameInput.value.trim();
      if (val.length < 2 || val.length > 8) {
        Toast.show('名称长度为2-8个字符', MessageType.SYSTEM, 2000);
        return;
      }
      if (!/^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(val)) {
        Toast.show('仅支持汉字、字母、数字', MessageType.SYSTEM, 2000);
        return;
      }
      this._settings.profile.name = val;
      Toast.show('名称已更新', MessageType.SYSTEM, 2000);
      // 实时更新头像圈的名称显示
      nameInput.style.borderColor = '#4ade80';
    });
    nameRow.appendChild(saveNameBtn);
    nameSection.appendChild(nameRow);

    const nameTip = document.createElement('div');
    nameTip.textContent = '支持2-8个字符，可包含汉字、字母、数字';
    Object.assign(nameTip.style, {
      fontSize: '12px',
      color: '#999',
    });
    nameSection.appendChild(nameTip);

    wrapper.appendChild(nameSection);
    return wrapper;
  },

  _getAvatarEmoji(avatarId) {
    const avatars = ['😡', '😤', '🤬', '😠', '💢', '👿', '😾', '🤯', '💀', '👹', '👺', '🤡'];
    const idx = parseInt(avatarId.replace('avatar_', ''), 10) - 1;
    return avatars[idx >= 0 && idx < avatars.length ? idx : 0];
  },

  _showAvatarPicker() {
    const picker = document.createElement('div');
    Object.assign(picker.style, {
      width: '320px',
      padding: '20px',
      borderRadius: '16px',
      backgroundColor: 'rgba(255,255,255,0.98)',
      maxHeight: '500px',
      overflowY: 'auto',
    });

    const title = document.createElement('div');
    title.textContent = '选择头像';
    Object.assign(title.style, {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '16px',
      textAlign: 'center',
    });
    picker.appendChild(title);

    const grid = document.createElement('div');
    Object.assign(grid.style, {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '12px',
    });

    BuiltInAvatars.forEach(aid => {
      const cell = document.createElement('div');
      const emoji = this._getAvatarEmoji(aid);
      cell.textContent = emoji;
      Object.assign(cell.style, {
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        borderRadius: '50%',
        backgroundColor: aid === this._settings.profile.avatar
          ? 'rgba(245,166,35,0.2)' : 'rgba(0,0,0,0.03)',
        border: aid === this._settings.profile.avatar
          ? '3px solid #F5A623' : '3px solid transparent',
        cursor: 'pointer',
        transition: 'all 0.15s',
      });
      cell.addEventListener('click', () => {
        this._settings.profile.avatar = aid;
        Toast.show('头像已更换', MessageType.SYSTEM, 2000);
        Overlay.hide();
        this._render(false);
      });
      grid.appendChild(cell);
    });

    picker.appendChild(grid);

    // 自定义上传提示（模拟）
    const uploadTip = document.createElement('div');
    uploadTip.textContent = '📷 自定义上传功能即将上线';
    uploadTip.style.cssText = 'text-align:center;color:#999;font-size:13px;margin-top:16px;';
    picker.appendChild(uploadTip);

    Overlay.show(picker);
  },

  // ===== 模块四：讨厌的人管理 =====
  _createHatedPeopleModule() {
    const wrapper = document.createElement('div');
    Object.assign(wrapper.style, {
      marginBottom: '16px',
      backgroundColor: 'rgba(255,255,255,0.6)',
      borderRadius: '12px',
      padding: '12px',
    });

    const title = document.createElement('div');
    title.textContent = '讨厌的人管理';
    Object.assign(title.style, {
      fontSize: '15px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '12px',
    });
    wrapper.appendChild(title);

    // 添加按钮
    const addBtn = createButton('+ 添加讨厌的人', '#EF4444', '#fff', '14px');
    addBtn.style.width = '100%';
    addBtn.style.marginBottom = '12px';
    addBtn.addEventListener('click', () => {
      this._showAddHatedPersonDialog();
    });
    wrapper.appendChild(addBtn);

    // 列表区域
    const listContainer = document.createElement('div');
    listContainer.id = 'hated-people-list';
    listContainer.style.maxHeight = '200px';
    listContainer.style.overflowY = 'auto';

    const people = this._settings.hatedPeople || [];
    if (people.length === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = 'text-align:center;padding:24px 0;color:#999;';
      empty.innerHTML = '<div style="font-size:36px;margin-bottom:8px;">🚫</div><div style="font-size:14px;">暂无添加的讨厌的人</div>';
      listContainer.appendChild(empty);
    } else {
      people.forEach((person, idx) => {
        const item = this._createHatedPersonItem(person, idx);
        listContainer.appendChild(item);
      });
    }

    wrapper.appendChild(listContainer);

    // 一键清空
    if (people.length > 0) {
      const clearBtn = document.createElement('button');
      clearBtn.textContent = '一键清空';
      Object.assign(clearBtn.style, {
        display: 'block',
        margin: '8px auto 0',
        fontSize: '12px',
        color: '#EF4444',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'underline',
      });
      clearBtn.addEventListener('click', () => {
        showConfirm('确认清空', '清空后无法恢复，确定吗？', () => {
          this._settings.hatedPeople = [];
          Toast.show('已清空所有讨厌的人', MessageType.SYSTEM, 2000);
          this._render(false);
        });
      });
      wrapper.appendChild(clearBtn);
    }

    return wrapper;
  },

  _createHatedPersonItem(person, idx) {
    const item = document.createElement('div');
    Object.assign(item.style, {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
    });

    // 头像
    const avatar = document.createElement('div');
    avatar.textContent = this._getAvatarEmoji(person.avatar || 'avatar_01');
    Object.assign(avatar.style, {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: 'rgba(239,68,68,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '22px',
      marginRight: '10px',
      flexShrink: '0',
      border: '2px solid #EF4444',
    });
    item.appendChild(avatar);

    // 名称
    const name = document.createElement('span');
    name.textContent = person.name;
    Object.assign(name.style, {
      fontSize: '14px',
      color: '#333',
      flex: '1',
    });
    item.appendChild(name);

    // 操作按钮
    const actions = document.createElement('div');
    Object.assign(actions.style, {
      display: 'flex',
      gap: '6px',
    });

    // 修改限制
    const limitBtn = createButton('修改限制', '#F5A623', '#fff', '12px');
    limitBtn.style.padding = '4px 10px';
    limitBtn.style.fontSize = '12px';
    limitBtn.addEventListener('click', () => {
      this._showLimitSettings(person, idx);
    });
    actions.appendChild(limitBtn);

    // 删除
    const delBtn = createButton('删除', '#EF4444', '#fff', '12px');
    delBtn.style.padding = '4px 10px';
    delBtn.style.fontSize = '12px';
    delBtn.addEventListener('click', () => {
      showConfirm('确认删除', `确认删除"${person.name}"？`, () => {
        this._settings.hatedPeople.splice(idx, 1);
        Toast.show(`${person.name}已从列表中移除`, MessageType.SYSTEM, 2000);
        this._render(false);
      });
    });
    actions.appendChild(delBtn);

    item.appendChild(actions);
    return item;
  },

  _showAddHatedPersonDialog() {
    const dialog = document.createElement('div');
    Object.assign(dialog.style, {
      width: '320px',
      padding: '24px',
      borderRadius: '16px',
      backgroundColor: 'rgba(255,255,255,0.98)',
    });

    const title = document.createElement('div');
    title.textContent = '添加讨厌的人';
    Object.assign(title.style, {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '16px',
      textAlign: 'center',
    });
    dialog.appendChild(title);

    // 名称输入
    const nameInput = document.createElement('input');
    nameInput.placeholder = '输入名称';
    Object.assign(nameInput.style, {
      width: '100%',
      height: '36px',
      padding: '0 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      boxSizing: 'border-box',
      marginBottom: '12px',
    });
    dialog.appendChild(nameInput);

    // 头像选择
    const avatarTitle = document.createElement('div');
    avatarTitle.textContent = '选择头像';
    Object.assign(avatarTitle.style, {
      fontSize: '13px',
      color: '#666',
      marginBottom: '8px',
    });
    dialog.appendChild(avatarTitle);

    const avatarGrid = document.createElement('div');
    Object.assign(avatarGrid.style, {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: '8px',
      marginBottom: '16px',
    });

    let selectedAvatar = 'avatar_01';
    BuiltInAvatars.slice(0, 6).forEach(aid => {
      const cell = document.createElement('div');
      cell.textContent = this._getAvatarEmoji(aid);
      Object.assign(cell.style, {
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        borderRadius: '50%',
        backgroundColor: 'rgba(0,0,0,0.03)',
        cursor: 'pointer',
        border: '2px solid transparent',
      });
      cell.addEventListener('click', () => {
        avatarGrid.querySelectorAll('div').forEach(d => d.style.border = '2px solid transparent');
        cell.style.border = '2px solid #F5A623';
        selectedAvatar = aid;
      });
      avatarGrid.appendChild(cell);
    });
    dialog.appendChild(avatarGrid);

    // 从好友列表选择提示
    const friendHint = document.createElement('div');
    friendHint.textContent = '👥 从好友列表选择功能即将上线';
    friendHint.style.cssText = 'text-align:center;color:#999;font-size:12px;margin-bottom:16px;';
    dialog.appendChild(friendHint);

    // 确认按钮
    const confirmBtn = createButton('确认添加', '#EF4444', '#fff', '14px');
    confirmBtn.style.width = '100%';
    confirmBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      if (!name) {
        Toast.show('请输入名称', MessageType.SYSTEM, 2000);
        return;
      }
      if (!this._settings.hatedPeople) {
        this._settings.hatedPeople = [];
      }
      this._settings.hatedPeople.push({
        name,
        avatar: selectedAvatar,
        restrictions: {
          blockMessages: false,
          hidePush: false,
          linkGameplay: false,
        },
      });
      Toast.show(`${name}已添加到讨厌的人列表`, MessageType.SYSTEM, 2000);
      Overlay.hide();
      this._render(false);
    });
    dialog.appendChild(confirmBtn);

    Overlay.show(dialog);
  },

  _showLimitSettings(person, idx) {
    const dialog = document.createElement('div');
    Object.assign(dialog.style, {
      width: '300px',
      padding: '24px',
      borderRadius: '16px',
      backgroundColor: 'rgba(255,255,255,0.98)',
    });

    const title = document.createElement('div');
    title.textContent = `限制设置 - ${person.name}`;
    Object.assign(title.style, {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '16px',
      textAlign: 'center',
    });
    dialog.appendChild(title);

    const restrictions = person.restrictions || {
      blockMessages: false,
      hidePush: false,
      linkGameplay: false,
    };

    const options = [
      { key: 'blockMessages', label: '屏蔽消息' },
      { key: 'hidePush', label: '隐藏相关推送' },
      { key: 'linkGameplay', label: '关联打击玩法' },
    ];

    options.forEach(opt => {
      const row = document.createElement('div');
      Object.assign(row.style, {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
      });

      const label = document.createElement('span');
      label.textContent = opt.label;
      Object.assign(label.style, { fontSize: '14px', color: '#333' });
      row.appendChild(label);

      const sw = createSwitch(restrictions[opt.key], (val) => {
        restrictions[opt.key] = val;
      });
      row.appendChild(sw);
      dialog.appendChild(row);
    });

    // 保存按钮
    const saveBtn = createButton('保存限制', '#F5A623', '#fff', '14px');
    saveBtn.style.width = '100%';
    saveBtn.addEventListener('click', () => {
      if (this._settings.hatedPeople[idx]) {
        this._settings.hatedPeople[idx].restrictions = restrictions;
      }
      Toast.show('限制已更新', MessageType.SYSTEM, 2000);
      Overlay.hide();
      this._render(false);
    });
    dialog.appendChild(saveBtn);

    Overlay.show(dialog);
  },
};
