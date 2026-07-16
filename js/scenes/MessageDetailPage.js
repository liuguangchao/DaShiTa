/**
 * 消息详情页面
 * 打屎他 - 消息模块
 */
const MessageDetailPage = {
  show(msg) {
    // 标记为已读
    Storage.markRead(msg.id);
    GameScene.updateBadge();

    const panel = createPanel('70%', '60%');

    // 头部
    const deleteBtn = document.createElement('div');
    deleteBtn.textContent = '🗑';
    Object.assign(deleteBtn.style, {
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      cursor: 'pointer',
      borderRadius: '8px',
      visibility: msg.deletable ? 'visible' : 'hidden',
    });
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showConfirm('确认删除', '确认删除该消息？', () => {
        Storage.deleteOne(msg.id);
        Overlay.hide();
        MessageListPage.show();
        GameScene.updateBadge();
      });
    });

    const header = createPanelHeader(msg.title.replace(/【.*?】/, '').trim(), () => {
      MessageListPage.show();
      GameScene.updateBadge();
    }, [deleteBtn]);
    panel.appendChild(header);

    // 消息类型标签
    const typeBar = document.createElement('div');
    const color = MessageTypeColor[msg.type];
    const typeName = MessageTypeName[msg.type];
    Object.assign(typeBar.style, {
      padding: '6px 16px',
      fontSize: '13px',
      fontWeight: 'bold',
      color: color,
      borderBottom: '1px solid rgba(0,0,0,0.06)',
    });
    typeBar.textContent = `【${typeName}】${msg.title.replace(/【.*?】/, '').trim()}`;
    panel.appendChild(typeBar);

    // 消息内容
    const content = document.createElement('div');
    Object.assign(content.style, {
      flex: '1',
      padding: '16px',
      overflowY: 'auto',
      fontSize: '14px',
      color: '#333',
      lineHeight: '1.8',
      whiteSpace: 'pre-wrap',
    });

    // 如果有图片，显示图片
    if (msg.image) {
      const img = document.createElement('img');
      img.src = msg.image;
      Object.assign(img.style, {
        width: '100%',
        maxHeight: '120px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginBottom: '12px',
        cursor: 'pointer',
      });
      img.addEventListener('click', () => {
        // 放大查看
        const zoom = document.createElement('div');
        Object.assign(zoom.style, {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '11000',
          cursor: 'pointer',
        });
        const zoomImg = document.createElement('img');
        zoomImg.src = msg.image;
        Object.assign(zoomImg.style, {
          maxWidth: '90%',
          maxHeight: '90%',
          objectFit: 'contain',
        });
        zoom.appendChild(zoomImg);
        zoom.addEventListener('click', () => zoom.remove());
        document.body.appendChild(zoom);
      });
      content.appendChild(img);
    }

    // 内容文本
    const textEl = document.createElement('div');
    textEl.textContent = msg.content;
    content.appendChild(textEl);

    // 时间
    const timeEl = document.createElement('div');
    timeEl.textContent = new Date(msg.time).toLocaleString('zh-CN');
    Object.assign(timeEl.style, {
      fontSize: '12px',
      color: '#bbb',
      marginTop: '12px',
    });
    content.appendChild(timeEl);

    panel.appendChild(content);

    // 底部快捷操作
    if (msg.hasQuickAction) {
      const footer = document.createElement('div');
      Object.assign(footer.style, {
        padding: '12px 16px',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        display: 'flex',
        justifyContent: 'center',
        flexShrink: '0',
      });

      const actionBtn = createButton(msg.quickAction.label, '#F5A623');
      actionBtn.style.width = '60%';
      actionBtn.addEventListener('click', () => {
        Overlay.hide();
        // 模拟跳转动画
        Toast.show(`正在跳转至${msg.quickAction.label.replace('查看', '').replace('进入', '')}...`, msg.type, 2000);
      });
      footer.appendChild(actionBtn);
      panel.appendChild(footer);
    }

    Overlay.show(panel);
  },
};