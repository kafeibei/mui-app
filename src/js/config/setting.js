define(function () {
  let setting = {}

  setting.SERVICE_STATUS = [
    {
      color: '#7261e4',
      title: '审核中',
      name: '审核中',
      key: 'checking'
    },
    {
      color: '#ffa000',
      title: '审批通过',
      name: '有效证据',
      key: 'checked'
    },
    {
      color: '#F13A30',
      title: '已否决',
      name: '无效证据',
      key: 'oppose'
    },
    {
      color: '#046FDB',
      title: '退回修改',
      name: '退出修改',
      key: 'return'
    }
  ]

  setting.PLAN_STYLE = {
    visit: '拜访',
    meeting: '会议',
    research: '市场调查'
  }

  setting.SHOW_DAY = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

  setting.PLAN_STATUS = {
    A: {
      name: 'ACTIVE',
      title: '当前',
      status: '已经审核',
      text: '审核通过',
      color: '#11B668',
      key: 'checked'
    },
    H: {
      name: 'HISTORY',
      title: '历史',
      status: '历史',
      text: '失效'
    },
    D: {
      name: 'DRAFT',
      title: '草稿',
      status: '草稿',
      text: '草稿'
    },
    R: {
      name: 'REJECT',
      title: '驳回',
      status: '驳回',
      text: '退回修改',
      color: '#046FDB',
      key: 'return'
    },
    S: {
      name: 'SUBMIT',
      title: '提交审核',
      status: '提交审核',
      text: '审批中',
      color: '#F7981C',
      key: 'checking'
    },
    V: {
      name: 'VETO',
      title: '否决',
      status: '否决',
      text: '否决',
      color: '#F13A30',
      key: 'oppose'
    }
  }

  setting.SHOW_NOON = {
    AM: '上午',
    PM: '下午'
  }

  return setting
})
