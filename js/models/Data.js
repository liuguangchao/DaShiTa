/**
 * 消息数据模型与 Mock 数据
 * 打屎他 - 消息模块
 */

// 消息类型定义
const MessageType = {
  SYSTEM: 'system',       // 系统通知 - 黑色
  REWARD: 'reward',       // 奖励到账 - 橙色
  ACHIEVEMENT: 'achievement', // 成就解锁 - 紫色
  ACTIVITY: 'activity',   // 活动通知 - 红色
  INTERACTION: 'interaction', // 互动提醒 - 蓝色
  GAMEPLAY: 'gameplay',   // 玩法提醒 - 绿色
};

// 消息类型颜色映射
const MessageTypeColor = {
  [MessageType.SYSTEM]: '#333333',
  [MessageType.REWARD]: '#FF8C00',
  [MessageType.ACHIEVEMENT]: '#8B5CF6',
  [MessageType.ACTIVITY]: '#EF4444',
  [MessageType.INTERACTION]: '#3B82F6',
  [MessageType.GAMEPLAY]: '#22C55E',
};

// 消息类型中文名
const MessageTypeName = {
  [MessageType.SYSTEM]: '系统通知',
  [MessageType.REWARD]: '奖励到账',
  [MessageType.ACHIEVEMENT]: '成就解锁',
  [MessageType.ACTIVITY]: '活动通知',
  [MessageType.INTERACTION]: '互动提醒',
  [MessageType.GAMEPLAY]: '玩法提醒',
};

// 消息分类筛选选项
const MessageCategories = [
  { key: 'all', label: '全部消息' },
  { key: MessageType.SYSTEM, label: '系统通知' },
  { key: MessageType.REWARD, label: '奖励到账' },
  { key: MessageType.ACHIEVEMENT, label: '成就解锁' },
  { key: MessageType.ACTIVITY, label: '活动通知' },
  { key: MessageType.INTERACTION, label: '互动提醒' },
  { key: MessageType.GAMEPLAY, label: '玩法提醒' },
];

// Mock 消息数据
const MockMessages = [
  {
    id: 'msg_001',
    type: MessageType.REWARD,
    title: '【奖励到账】每日登录奖励',
    summary: '恭喜你获得每日登录奖励，免费广告次数1次已发放至背包，点击查看详情~',
    content: '恭喜你获得每日登录奖励！\n\n奖励内容：免费广告次数 ×1\n发放时间：2026-07-14 08:00\n\n奖励已发放至背包，点击下方按钮查看详情。',
    time: '2026-07-14T08:00:00',
    read: false,
    hasQuickAction: true,
    quickAction: { label: '查看背包', target: 'bag' },
    deletable: true,
  },
  {
    id: 'msg_002',
    type: MessageType.ACHIEVEMENT,
    title: '【成就解锁】初入宣泄室',
    summary: '恭喜你解锁"初入宣泄室"成就，获得10打屎币和初级武器体验卡，继续加油！',
    content: '🎉 恭喜你解锁成就！\n\n成就名称：初入宣泄室\n解锁条件：累计打击次数达到100次\n\n奖励内容：\n• 打屎币 ×10\n• 初级武器体验卡 ×1\n\n继续加油，解锁更多成就！',
    time: '2026-07-14T09:30:00',
    read: false,
    hasQuickAction: true,
    quickAction: { label: '查看成就', target: 'achievement' },
    deletable: true,
  },
  {
    id: 'msg_003',
    type: MessageType.ACTIVITY,
    title: '【活动通知】特效触发几率翻倍',
    summary: '限时活动"特效触发几率翻倍"即将开启，7月15日-7月20日参与，解锁更多惊喜奖励~',
    content: '🔥 限时活动即将开启！\n\n活动名称：特效触发几率翻倍\n活动时间：7月15日 - 7月20日\n\n活动期间，所有特效触发几率翻倍！\n还有更多惊喜奖励等你解锁~\n\n点击下方按钮进入活动页面！',
    time: '2026-07-14T10:00:00',
    read: false,
    hasQuickAction: true,
    quickAction: { label: '进入活动', target: 'activity' },
    deletable: true,
    image: null,
  },
  {
    id: 'msg_004',
    type: MessageType.SYSTEM,
    title: '【系统通知】V1.1版本更新预告',
    summary: '游戏 V1.1版本将于7月16日更新，新增2款武器和1款特效，更新后可获得更新奖励~',
    content: '📢 系统通知\n\n游戏 V1.1 版本将于 7月16日 进行更新！\n\n本次更新内容：\n• 新增2款武器：火焰锤、冰霜鞭\n• 新增1款特效：彩虹爆破\n• 优化打击手感\n• 修复已知问题\n\n更新后可获得更新奖励，敬请期待！',
    time: '2026-07-14T11:00:00',
    read: false,
    hasQuickAction: false,
    deletable: false,
  },
  {
    id: 'msg_005',
    type: MessageType.INTERACTION,
    title: '【互动提醒】好友上榜通知',
    summary: '你的好友 张三 成功上榜虚拟人物打击榜，快来为 TA 点赞吧~',
    content: '👏 好友上榜通知\n\n你的好友 张三 成功上榜虚拟人物打击榜！\n\n当前排名：第 3 名\n打击次数：1280 次\n\n快来为 TA 点赞加油吧！',
    time: '2026-07-14T12:00:00',
    read: true,
    hasQuickAction: true,
    quickAction: { label: '查看好友', target: 'friend' },
    deletable: true,
  },
  {
    id: 'msg_006',
    type: MessageType.REWARD,
    title: '【奖励到账】打击奖励',
    summary: '恭喜你完成500次打击，获得打屎币50个和专属武器体验卡，奖励已发放至背包~',
    content: '恭喜你完成500次打击！\n\n奖励内容：\n• 打屎币 ×50\n• 专属武器体验卡 ×1\n\n奖励已发放至背包，点击下方按钮查看~',
    time: '2026-07-14T14:00:00',
    read: true,
    hasQuickAction: true,
    quickAction: { label: '查看背包', target: 'bag' },
    deletable: true,
  },
  {
    id: 'msg_007',
    type: MessageType.ACTIVITY,
    title: '【活动通知】商城特价活动',
    summary: '商城特价活动进行中！所有武器8折优惠，限时3天，点击进入商城抢购~',
    content: '🛒 商城特价活动\n\n所有武器 8折 优惠！\n\n活动时间：7月14日 - 7月16日\n\n参与商品：\n• 木棍 原价100 现价80\n• 铁锤 原价200 现价160\n• 电击棒 原价300 现价240\n\n点击下方按钮进入商城抢购！',
    time: '2026-07-14T15:00:00',
    read: true,
    hasQuickAction: true,
    quickAction: { label: '进入活动', target: 'activity' },
    deletable: true,
  },
  {
    id: 'msg_008',
    type: MessageType.SYSTEM,
    title: '【系统通知】服务器维护通知',
    summary: '服务器将于7月17日凌晨2:00-4:00进行维护，届时游戏将无法登录，请提前安排好游戏时间~',
    content: '⚠️ 服务器维护通知\n\n维护时间：7月17日 凌晨 2:00 - 4:00\n\n维护期间游戏将无法登录，请提前安排好游戏时间。\n\n维护完成后将发放补偿奖励，感谢您的理解与支持！',
    time: '2026-07-14T16:00:00',
    read: false,
    hasQuickAction: false,
    deletable: false,
  },
  {
    id: 'msg_009',
    type: MessageType.ACHIEVEMENT,
    title: '【成就解锁】连击大师',
    summary: '恭喜你解锁"连击大师"成就，连续打击30次！获得30打屎币和中级武器体验卡~',
    content: '🎉 恭喜你解锁成就！\n\n成就名称：连击大师\n解锁条件：连续打击30次\n\n奖励内容：\n• 打屎币 ×30\n• 中级武器体验卡 ×1\n\n你的连击技术越来越强了！',
    time: '2026-07-13T18:00:00',
    read: true,
    hasQuickAction: true,
    quickAction: { label: '查看成就', target: 'achievement' },
    deletable: true,
  },
  {
    id: 'msg_010',
    type: MessageType.INTERACTION,
    title: '【互动提醒】好友点赞通知',
    summary: '你的好友 李四 给你的打击记录点了赞，快去看看吧~',
    content: '👍 好友点赞通知\n\n你的好友 李四 给你的打击记录点了赞！\n\n被点赞记录：累计打击500次\n\n快去查看好友列表，互动一下吧~',
    time: '2026-07-13T20:00:00',
    read: true,
    hasQuickAction: true,
    quickAction: { label: '查看好友', target: 'friend' },
    deletable: true,
  },
  {
    id: 'msg_011',
    type: MessageType.GAMEPLAY,
    title: '【玩法提醒】连击奖励触发',
    summary: '恭喜你连续打击10次，触发10秒伤害翻倍效果，尽情宣泄吧！',
    content: '⚡ 连击奖励触发\n\n连续打击10次！\n触发10秒伤害翻倍效果！\n\n尽情宣泄吧！',
    time: '2026-07-14T14:30:00',
    read: false,
    hasQuickAction: false,
    deletable: true,
  },
  {
    id: 'msg_012',
    type: MessageType.GAMEPLAY,
    title: '【玩法提醒】武器熟练度提升',
    summary: '你的木棍熟练度已达50次，解锁专属木纹飞溅特效，打击伤害提升10%！',
    content: '🔨 武器熟练度提升\n\n木棍熟练度：50次\n解锁专属木纹飞溅特效！\n打击伤害提升 10%！\n\n继续使用木棍，解锁更多特效~',
    time: '2026-07-14T13:00:00',
    read: true,
    hasQuickAction: false,
    deletable: true,
  },
];

// 用户设置默认值
const DefaultSettings = {
  push: {
    [MessageType.SYSTEM]: true,  // 系统通知 - 强制开启
    [MessageType.REWARD]: true,
    [MessageType.ACHIEVEMENT]: true,
    [MessageType.ACTIVITY]: true,
    [MessageType.INTERACTION]: true,
    [MessageType.GAMEPLAY]: true,
  },
  doNotDisturb: false,
  gameDND: false,
  profile: {
    avatar: 'avatar_01',
    name: '愤怒的玩家',
    customAvatar: null,
  },
  hatedPeople: [],
};

// 内置头像列表
const BuiltInAvatars = [
  'avatar_01', 'avatar_02', 'avatar_03', 'avatar_04',
  'avatar_05', 'avatar_06', 'avatar_07', 'avatar_08',
  'avatar_09', 'avatar_10', 'avatar_11', 'avatar_12',
];

// 模拟好友列表
const MockFriends = [
  { name: '张三', avatar: 'avatar_03' },
  { name: '李四', avatar: 'avatar_05' },
  { name: '王五', avatar: 'avatar_07' },
  { name: '赵六', avatar: 'avatar_09' },
];