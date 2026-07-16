/**
 * 本地存储管理
 * 使用微信小游戏 wx.setStorageSync / wx.getStorageSync
 * 同时兼容浏览器 localStorage 用于开发调试
 */
const Storage = {
  KEYS: {
    MESSAGES: 'dst_messages',
    SETTINGS: 'dst_settings',
    READ_IDS: 'dst_read_ids',
  },

  _isWx: typeof wx !== 'undefined' && wx.setStorageSync,

  get(key) {
    try {
      if (this._isWx) {
        const val = wx.getStorageSync(key);
        return val ? JSON.parse(val) : null;
      }
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch (e) {
      console.warn('Storage.get error:', key, e);
      return null;
    }
  },

  set(key, value) {
    try {
      const str = JSON.stringify(value);
      if (this._isWx) {
        wx.setStorageSync(key, str);
      } else {
        localStorage.setItem(key, str);
      }
    } catch (e) {
      console.warn('Storage.set error:', key, e);
    }
  },

  init() {
    if (!this.get(this.KEYS.MESSAGES)) {
      this.set(this.KEYS.MESSAGES, MockMessages);
    }
    if (!this.get(this.KEYS.SETTINGS)) {
      this.set(this.KEYS.SETTINGS, DefaultSettings);
    }
    if (!this.get(this.KEYS.READ_IDS)) {
      this.set(this.KEYS.READ_IDS, []);
    }
  },

  getMessages() {
    return this.get(this.KEYS.MESSAGES) || [];
  },

  saveMessages(messages) {
    this.set(this.KEYS.MESSAGES, messages);
  },

  getSettings() {
    return this.get(this.KEYS.SETTINGS) || DefaultSettings;
  },

  saveSettings(settings) {
    this.set(this.KEYS.SETTINGS, settings);
  },

  getUnreadCount() {
    const messages = this.getMessages();
    return messages.filter(m => !m.read).length;
  },

  markRead(id) {
    const messages = this.getMessages();
    const msg = messages.find(m => m.id === id);
    if (msg && !msg.read) {
      msg.read = true;
      this.saveMessages(messages);
    }
  },

  markAllRead(ids) {
    const messages = this.getMessages();
    let changed = false;
    messages.forEach(m => {
      if (ids.includes(m.id) && !m.read) {
        m.read = true;
        changed = true;
      }
    });
    if (changed) this.saveMessages(messages);
  },

  deleteMessages(ids) {
    const messages = this.getMessages();
    const filtered = messages.filter(m => !ids.includes(m.id) || m.type === 'system');
    this.saveMessages(filtered);
    return filtered;
  },

  deleteOne(id) {
    return this.deleteMessages([id]);
  },
};