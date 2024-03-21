import { fetchParentData, dataFilter } from '@/utils/form'
const _ = require('lodash')

const connectionData = {
  MODBUS_RTU: [{
    type: 'input',
    name: 'slaveId',
    label: '从站地址',
    value: '1'
  }, {
    type: 'input',
    name: 'offset',
    label: '地址位',
    value: '0'
  }, {
    type: 'input',
    name: 'quantity',
    label: '读取位数',
    value: '10'
  }, {
    type: 'input',
    name: 'dataBits',
    label: '数据位',
    value: '8'
  }, {
    type: 'input',
    name: 'stopBits',
    label: '停止位',
    value: '0'
  }, {
    type: 'select',
    name: 'functionCode',
    label: '读取方法',
    value: '01',
    options: [{
      label: 'Coil',
      value: '01'
    }, {
      label: 'Input Discrete',
      value: '02'
    }, {
      label: 'Holding Register',
      value: '03'
    }, {
      label: 'Input Register',
      value: '04'
    }]
  }, {
    type: 'select',
    name: 'baudRate',
    label: '波特率',
    value: '9600',
    options: [{
      label: '4800',
      value: '4800'
    }, {
      label: '9600',
      value: '9600'
    }, {
      label: '14400',
      value: '14400'
    }, {
      label: '19200',
      value: '19200'
    }, {
      label: '38400',
      value: '38400'
    }, {
      label: '57600',
      value: '57600'
    }, {
      label: '115200',
      value: '115200'
    }]
  }, {
    type: 'select',
    name: 'parity',
    label: '校验方式',
    value: 0,
    options: [{
      label: 'NONE',
      value: 0
    }, {
      label: 'ODD',
      value: 1
    }, {
      label: 'EVEN',
      value: 2
    }, {
      label: 'MARK',
      value: 3
    }, {
      label: 'SPACE',
      value: 4
    }]
  }, {
    type: 'input',
    name: 'addParam',
    label: '补充参数',
    value: ''
  }],
  MODBUS_TCP: [{
    type: 'input',
    name: 'slaveId',
    label: '从站地址',
    value: '1'
  }, {
    type: 'input',
    name: 'offset',
    label: '地址位',
    value: '0'
  }, {
    type: 'select',
    name: 'functionCode',
    label: '读取方法',
    value: '01',
    options: [{
      label: 'Coil',
      value: '01'
    }, {
      label: 'Input Discrete',
      value: '02'
    }, {
      label: 'Holding Register',
      value: '03'
    }, {
      label: 'Input Register',
      value: '04'
    }]
  }, {
    type: 'input',
    name: 'quantity',
    label: '读取位数',
    value: '10'
  }, {
    type: 'input',
    name: 'addParam',
    label: '补充参数',
    value: ''
  }],
  OPCUA: [],
  OPCDA: [{
    type: 'input',
    name: 'username',
    label: '用户名',
    value: ''
  }, {
    type: 'input',
    name: 'password',
    label: '密码',
    value: ''
  }, {
    type: 'input',
    name: 'domain',
    label: '域',
    value: ''
  }, {
    type: 'input',
    name: 'progId',
    label: '程序ID',
    value: ''
  }, {
    type: 'input',
    name: 'addParam',
    label: '补充参数',
    value: ''
  }],
  HTTP: [{
    type: 'input',
    name: 'parameterMap',
    label: '参数集',
    value: null
  }],
  MICONNECT: [{
    type: 'input',
    name: 'parameterMap',
    label: '参数集',
    value: ''
  }],
  OMRON: [{
    type: 'select',
    name: 'model',
    label: '型号',
    value: 'FINS',
    options: [{
      label: 'FINS',
      value: 'FINS'
    },
    {
      label: 'HOST_LINK',
      value: 'HOST_LINK'
    }]
  }],
  OMRON_HOST_LINK: [{
    type: 'select',
    name: 'model',
    label: '型号',
    value: 'HOST_LINK',
    options: [{
      label: 'FINS',
      value: 'FINS'
    },
    {
      label: 'HOST_LINK',
      value: 'HOST_LINK'
    }]
  },
  {
    type: 'select',
    name: 'dataBits',
    label: '数据位',
    value: 7,
    options: [{
      label: '8',
      value: 8
    }, {
      label: '7',
      value: 7
    }]
  }, {
    type: 'select',
    name: 'stopBits',
    label: '停止位',
    value: '2',
    options: [{
      label: '1',
      value: '1'
    }, {
      label: '2',
      value: '2'
    }]
  }, {
    type: 'select',
    name: 'baudRate',
    label: '波特率',
    value: '2400',
    options: [{
      label: '2400',
      value: '2400'
    }, {
      label: '4800',
      value: '4800'
    }, {
      label: '9600',
      value: '9600'
    }, {
      label: '14400',
      value: '14400'
    }, {
      label: '19200',
      value: '19200'
    }, {
      label: '38400',
      value: '38400'
    }, {
      label: '57600',
      value: '57600'
    }, {
      label: '115200',
      value: '115200'
    }]
  }, {
    type: 'select',
    name: 'parity',
    label: '校验方式',
    value: 2,
    options: [{
      label: '偶校验',
      value: 2
    }, {
      label: '奇校验',
      value: 1
    }, {
      label: '无校验',
      value: 0
    }]
  },
  {
    type: 'textarea',
    name: 'addParam',
    label: '连接参数',
    value: ''
  }],
  BACNET: [{
    type: 'textarea',
    name: 'addParam',
    label: '连接参数',
    value: ''
  }],
  BECKHOFF_ADSNET: [{
    type: 'textarea',
    name: 'addParam',
    label: '连接参数',
    value: ''
  }],

  MITSUBISH_MC: [{
    type: 'select',
    name: 'model',
    label: '型号',
    value: '0',
    options: [{
      label: 'MC(Binary)',
      value: '0'
    }, {
      label: 'MC(ASCII)',
      value: '1'
    }, {
      label: 'A-1E(Binary)',
      value: '2'
    }]
  }],
  SIEMENS_S7: [{
    type: 'select',
    name: 'model',
    label: '型号',
    value: 'S200Smart',
    options: [{
      label: 'S7-1200',
      value: 'S1200'
    }, {
      label: 'S7-1500',
      value: 'S1500'
    }, {
      label: 'S7-200',
      value: 'S200'
    }, {
      label: 'S7-300',
      value: 'S300'
    }, {
      label: 'S7-400',
      value: 'S400'
    }, {
      label: 'S7-200Smart',
      value: 'S200Smart'
    }]
  }, {
    type: 'input',
    name: 'timeout',
    label: '超时时间',
    value: 1000
  }],
  DLT645: [{
    type: 'input',
    name: 'address',
    label: '电表地址',
    value: ''
  }, {
    type: 'input',
    name: 'dataBits',
    label: '数据位',
    value: '8'
  }, {
    type: 'input',
    name: 'stopBits',
    label: '停止位',
    value: '1'
  }, {
    type: 'select',
    name: 'baudRate',
    label: '波特率',
    value: '2400',
    options: [{
      label: '2400',
      value: '2400'
    }, {
      label: '4800',
      value: '4800'
    }, {
      label: '9600',
      value: '9600'
    }, {
      label: '14400',
      value: '14400'
    }, {
      label: '19200',
      value: '19200'
    }, {
      label: '38400',
      value: '38400'
    }, {
      label: '57600',
      value: '57600'
    }, {
      label: '115200',
      value: '115200'
    }]
  }, {
    type: 'select',
    name: 'parity',
    label: '校验方式',
    value: 2,
    options: [{
      label: 'EVEN',
      value: 2
    }]
  }],
  DLT645_1997: [{
    type: 'input',
    name: 'address',
    label: '电表地址',
    value: ''
  }, {
    type: 'input',
    name: 'dataBits',
    label: '数据位',
    value: '8'
  }, {
    type: 'input',
    name: 'stopBits',
    label: '停止位',
    value: '1'
  }, {
    type: 'select',
    name: 'baudRate',
    label: '波特率',
    value: '2400',
    options: [{
      label: '1200',
      value: '1200'
    }, {
      label: '2400',
      value: '2400'
    }, {
      label: '4800',
      value: '4800'
    }, {
      label: '9600',
      value: '9600'
    }, {
      label: '14400',
      value: '14400'
    }, {
      label: '19200',
      value: '19200'
    }, {
      label: '38400',
      value: '38400'
    }, {
      label: '57600',
      value: '57600'
    }, {
      label: '115200',
      value: '115200'
    }]
  }, {
    type: 'select',
    name: 'parity',
    label: '校验方式',
    value: 2,
    options: [{
      label: 'EVEN',
      value: 2
    }]
  }],
  DF1: [{
    type: 'input',
    name: 'slaveId',
    label: '从站地址',
    value: '1'
  }, {
    type: 'input',
    name: 'dataBits',
    label: '数据位',
    value: '8'
  }, {
    type: 'input',
    name: 'stopBits',
    label: '停止位',
    value: '0'
  }, {
    type: 'select',
    name: 'mode',
    label: '模式',
    value: 'full',
    options: [{
      label: '全双工',
      value: 'full'
    }]
  }, {
    type: 'select',
    name: 'baudRate',
    label: '波特率',
    value: '9600',
    options: [{
      label: '4800',
      value: '4800'
    }, {
      label: '9600',
      value: '9600'
    }, {
      label: '14400',
      value: '14400'
    }, {
      label: '19200',
      value: '19200'
    }, {
      label: '38400',
      value: '38400'
    }, {
      label: '57600',
      value: '57600'
    }, {
      label: '115200',
      value: '115200'
    }]
  }, {
    type: 'select',
    name: 'parity',
    label: '校验方式',
    value: 0,
    options: [{
      label: 'NONE',
      value: 0
    }, {
      label: 'ODD',
      value: 1
    }, {
      label: 'EVEN',
      value: 2
    }, {
      label: 'MARK',
      value: 3
    }, {
      label: 'SPACE',
      value: 4
    }]
  }],
  IEC101: [
    {
      type: 'input',
      name: 'dataBits',
      label: '数据位',
      value: '8'
    }, {
      type: 'select',
      name: 'stopBits',
      label: '停止位',
      value: 1,
      options: [{
        label: '1',
        value: 1
      }, {
        label: '2',
        value: 2
      }]
    }, {
      type: 'select',
      name: 'mode',
      label: '通讯模式',
      value: 'nonequi',
      options: [{
        label: 'nonequi',
        value: 'nonequi'
      }]
    }, {
      type: 'select',
      name: 'linkaddr_bytenum',
      label: '链路地址字节数',
      value: 1,
      options: [{
        label: '1',
        value: 1
      }, {
        label: '2',
        value: 2
      }]
    }, {
      type: 'input',
      name: 'linkaddr',
      label: '链路地址',
      value: 1
    }, {
      type: 'select',
      name: 'transmissioncause_bytenum',
      label: '传输原因字节数',
      value: 1,
      options: [{
        label: '1',
        value: 1
      }, {
        label: '2',
        value: 2
      }]
    }, {
      type: 'input',
      name: 'origin_addr',
      label: '源发地址',
      value: 0
    }, {
      type: 'input',
      name: 'remotenum',
      label: '遥信信息个数',
      value: 10
    }, {
      type: 'input',
      name: 'remoteaddr',
      label: '遥信首地址',
      value: 1
    }, {
      type: 'input',
      name: 'telemetryaddr',
      label: '遥测首地址',
      value: 4001
    }, {
      type: 'input',
      name: 'telemetrynum',
      label: '遥测信息个数',
      value: 10
    }, {
      type: 'input',
      name: 'relayproctionaddr',
      label: '继电器保护首地址',
      value: 1001
    }, {
      type: 'input',
      name: 'relayproctionnum',
      label: '继电器信息个数',
      value: 10
    }, {
      type: 'input',
      name: 'dataunit_commaddr_bytenum',
      label: '公共地址字节数',
      value: 1
    }, {
      type: 'input',
      name: 'dataunit_commaddr',
      label: '数据单元公共地址',
      value: 1
    }, {
      type: 'input',
      name: 'informationobjectaddr_bytenum',
      label: '信息地址字节数',
      value: 2
    }, {
      type: 'input',
      name: 'telemetryparameteraddr',
      label: '遥测参数首地址',
      value: 5001
    }, {
      type: 'input',
      name: 'telemetryparameternum',
      label: '遥测参数信息个数',
      value: 10
    }, {
      type: 'input',
      name: 'remotecontroladdr',
      label: '遥控首地址',
      value: 6001
    }, {
      type: 'input',
      name: 'remotecontrolnum',
      label: '遥控信息个数',
      value: 10
    }, {
      type: 'select',
      name: 'remotecontrolmode',
      label: '遥控操作模式',
      value: 'singlepoint',
      options: [{
        label: '单点',
        value: 'singlepoint'
      }, {
        label: '双点',
        value: 'doublepoint'
      }]
    }, {
      type: 'input',
      name: 'setupaddr',
      label: '设定首地址',
      value: 6201
    }, {
      type: 'input',
      name: 'setupnum',
      label: '设定信息个数',
      value: 10
    }, {
      type: 'input',
      name: 'cumulantaddr',
      label: '累积量首地址',
      value: 6401
    }, {
      type: 'input',
      name: 'cumulantnum',
      label: '累积量个数',
      value: 10
    }, {
      type: 'input',
      name: 'tappositonaddr',
      label: '分接头位置首地址',
      value: 6601
    }, {
      type: 'input',
      name: 'tappositionnum',
      label: '分接头位置个数',
      value: 10
    }, {
      type: 'select',
      name: 'baudRate',
      label: '波特率',
      value: '9600',
      options: [{
        label: '300',
        value: '300'
      }, {
        label: '600',
        value: '600'
      }, {
        label: '1200',
        value: '1200'
      }, {
        label: '2400',
        value: '2400'
      }, {
        label: '4800',
        value: '4800'
      }, {
        label: '9600',
        value: '9600'
      }, {
        label: '19200',
        value: '19200'
      }, {
        label: '38400',
        value: '38400'
      }, {
        label: '115200',
        value: '115200'
      }]
    }, {
      type: 'select',
      name: 'parity',
      label: '校验方式',
      value: 2,
      options: [{
        label: 'NONE',
        value: 0
      }, {
        label: 'ODD',
        value: 1
      }, {
        label: 'EVEN',
        value: 2
      }]
    }, {
      type: 'input',
      name: 'clocksynchronizationcycle',
      label: '时钟同步周期(min)',
      value: 1440
    }, {
      type: 'input',
      name: 'totalcallcycle',
      label: '总召唤周期(min)',
      value: 20
    }, {
      type: 'input',
      name: 'backgroundscancycle',
      label: '背景扫描周期(s)',
      value: 5
    }, {
      type: 'input',
      name: 'electricitycallcycle',
      label: '召电度周期(min)',
      value: 30
    }],
  IEC104: [
    {
      type: 'select',
      name: 'mode',
      label: '通讯模式',
      value: 'equi',
      options: [{
        label: 'equi',
        value: 'equi'
      }]
    }, {
      type: 'select',
      name: 'transmissioncause_bytenum',
      label: '传输原因字节数',
      value: 2,
      options: [{
        label: '1',
        value: 1
      }, {
        label: '2',
        value: 2
      }]
    }, {
      type: 'input',
      name: 'origin_addr',
      label: '源发地址',
      value: 0
    }, {
      type: 'input',
      name: 'remotenum',
      label: '遥信信息个数',
      value: 10
    }, {
      type: 'input',
      name: 'remoteaddr',
      label: '遥信首地址',
      value: 1
    }, {
      type: 'input',
      name: 'telemetryaddr',
      label: '遥测首地址',
      value: 4001
    }, {
      type: 'input',
      name: 'telemetrynum',
      label: '遥测信息个数',
      value: 10
    }, {
      type: 'input',
      name: 'relayproctionaddr',
      label: '继电器保护首地址',
      value: 1001
    }, {
      type: 'input',
      name: 'relayproctionnum',
      label: '继电器信息个数',
      value: 10
    }, {
      type: 'input',
      name: 'dataunit_commaddr_bytenum',
      label: '公共地址字节数',
      value: 2
    }, {
      type: 'input',
      name: 'dataunit_commaddr',
      label: '数据单元公共地址',
      value: 1
    }, {
      type: 'input',
      name: 'informationobjectaddr_bytenum',
      label: '信息地址字节数',
      value: 3
    }, {
      type: 'input',
      name: 'telemetryparameteraddr',
      label: '遥测参数首地址',
      value: 5001
    }, {
      type: 'input',
      name: 'telemetryparameternum',
      label: '遥测参数信息个数',
      value: 10
    }, {
      type: 'input',
      name: 'remotecontroladdr',
      label: '遥控首地址',
      value: 6001
    }, {
      type: 'input',
      name: 'remotecontrolnum',
      label: '遥控信息个数',
      value: 10
    }, {
      type: 'select',
      name: 'remotecontrolmode',
      label: '遥控操作模式',
      value: 'singlepoint',
      options: [{
        label: '单点',
        value: 'singlepoint'
      }, {
        label: '双点',
        value: 'doublepoint'
      }]
    }, {
      type: 'input',
      name: 'setupaddr',
      label: '设定首地址',
      value: 6201
    }, {
      type: 'input',
      name: 'setupnum',
      label: '设定信息个数',
      value: 10
    }, {
      type: 'input',
      name: 'cumulantaddr',
      label: '累积量首地址',
      value: 6401
    }, {
      type: 'input',
      name: 'cumulantnum',
      label: '累积量个数',
      value: 10
    }, {
      type: 'input',
      name: 'tappositonaddr',
      label: '分接头位置首地址',
      value: 6601
    }, {
      type: 'input',
      name: 'tappositionnum',
      label: '分接头位置个数',
      value: 10
    }, {
      type: 'input',
      name: 'clocksynchronizationcycle',
      label: '时钟同步周期(min)',
      value: 1440
    }, {
      type: 'input',
      name: 'totalcallcycle',
      label: '总召唤周期(min)',
      value: 20
    }, {
      type: 'input',
      name: 'electricitycallcycle',
      label: '召电度周期(min)',
      value: 30
    }, {
      type: 'input',
      name: 'beat',
      label: '心跳',
      value: 15
    }
  ],
  CIP: [{
    type: 'input',
    name: 'path',
    label: '路由路径',
    value: ''
  }, {
    type: 'select',
    name: 'cpu',
    label: 'CPU系列',
    value: 'micrologix',
    options: [{
      label: 'micrologix',
      value: 'micrologix'
    }, {
      label: 'micro800',
      value: 'micro800'
    }, {
      label: 'slc500',
      value: 'slc500'
    }, {
      label: 'plc5',
      value: 'plc5'
    }, {
      label: 'controllogix',
      value: 'controllogix'
    }, {
      label: 'compactlogix',
      value: 'compactlogix'
    }]
  }]
}

const connectionWriteData = {
  MODBUS_RTU: [{
    type: 'input',
    name: 'slaveId',
    label: '从站地址',
    value: '1'
  }, {
    type: 'input',
    name: 'dataBits',
    label: '数据位',
    value: '8'
  }, {
    type: 'input',
    name: 'stopBits',
    label: '停止位',
    value: '0'
  }, {
    type: 'select',
    name: 'baudRate',
    label: '波特率',
    value: '9600',
    options: [{
      label: '4800',
      value: '4800'
    }, {
      label: '9600',
      value: '9600'
    }, {
      label: '14400',
      value: '14400'
    }, {
      label: '19200',
      value: '19200'
    }, {
      label: '38400',
      value: '38400'
    }, {
      label: '57600',
      value: '57600'
    }, {
      label: '115200',
      value: '115200'
    }]
  }, {
    type: 'select',
    name: 'parity',
    label: '校验方式',
    value: 0,
    options: [{
      label: 'NONE',
      value: 0
    }, {
      label: 'ODD',
      value: 1
    }, {
      label: 'EVEN',
      value: 2
    }, {
      label: 'MARK',
      value: 3
    }, {
      label: 'SPACE',
      value: 4
    }]
  }, {
    type: 'input',
    name: 'addParam',
    label: '补充参数',
    value: ''
  }],
  MODBUS_TCP: [{
    type: 'input',
    name: 'slaveId',
    label: '从站地址',
    value: '1'
  }, {
    type: 'input',
    name: 'addParam',
    label: '补充参数',
    value: ''
  }]
}

const tagData = {
  MODBUS_RTU: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.readCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'input',
    name: 'valueIndex',
    label: '读取位',
    value: ''
  }, {
    type: 'select',
    label: '方法',
    name: 'method',
    value: 'ReadFloat',
    options: [{
      label: 'ReadBool',
      value: 'ReadBool'
    }, {
      label: 'ReadByte',
      value: 'ReadByte'
    }, {
      label: 'ReadShort',
      value: 'ReadShort'
    }, {
      label: 'ReadInt',
      value: 'ReadInt'
    }, {
      label: 'ReadLong',
      value: 'ReadLong'
    }, {
      label: 'ReadFloat',
      value: 'ReadFloat'
    }, {
      label: 'ReadDouble',
      value: 'ReadDouble'
    }, {
      label: 'ReadString',
      value: 'ReadString'
    }]
  }, {
    type: 'input',
    name: 'valueExpression',
    label: '读取表达式',
    value: ''
  }
  ],
  MODBUS_TCP: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.readCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'input',
    name: 'valueIndex',
    label: '读取位',
    value: ''
  }, {
    type: 'select',
    label: '方法',
    name: 'method',
    value: 'ReadFloat',
    options: [{
      label: 'ReadBool',
      value: 'ReadBool'
    }, {
      label: 'ReadByte',
      value: 'ReadByte'
    }, {
      label: 'ReadShort',
      value: 'ReadShort'
    }, {
      label: 'ReadInt',
      value: 'ReadInt'
    }, {
      label: 'ReadLong',
      value: 'ReadLong'
    }, {
      label: 'ReadFloat',
      value: 'ReadFloat'
    }, {
      label: 'ReadDouble',
      value: 'ReadDouble'
    }, {
      label: 'ReadString',
      value: 'ReadString'
    }]
  }, {
    type: 'input',
    name: 'valueExpression',
    label: '读取表达式',
    value: ''
  }],
  OPCUA: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.readCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'input',
    name: 'nodeId',
    label: '节点路径',
    value: ''
  }, {
    type: 'select',
    label: '读取方法',
    name: 'method',
    value: 'ReadFloat',
    options: [{
      label: 'ReadBool',
      value: 'ReadBool'
    }, {
      label: 'ReadByte',
      value: 'ReadByte'
    }, {
      label: 'ReadShort',
      value: 'ReadShort'
    }, {
      label: 'ReadInt',
      value: 'ReadInt'
    }, {
      label: 'ReadLong',
      value: 'ReadLong'
    }, {
      label: 'ReadFloat',
      value: 'ReadFloat'
    }, {
      label: 'ReadDouble',
      value: 'ReadDouble'
    }]
  }],
  OPCDA: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.readCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'input',
    name: 'nodeId',
    label: '节点路径',
    value: ''
  }],
  HTTP: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.readCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'input',
    name: 'valuePath',
    label: '属性值路径',
    value: ''
  }],
  MICONNECT: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.readCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'input',
    name: 'valuePath',
    label: '属性值路径',
    value: ''
  }],
  SIEMENS_S7: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.readCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'select',
    name: 'method',
    label: '方法',
    value: 'ReadString',
    options: [{
      label: 'ReadByte',
      value: 'ReadByte'
    }, {
      label: 'ReadBool',
      value: 'ReadBool'
    }, {
      label: 'ReadShort',
      value: 'ReadShort'
    }, {
      label: 'ReadInt',
      value: 'ReadInt'
    }, {
      label: 'ReadLong',
      value: 'ReadLong'
    }, {
      label: 'ReadFloat',
      value: 'ReadFloat'
    }, {
      label: 'ReadDouble',
      value: 'ReadDouble'
    }, {
      label: 'ReadString',
      value: 'ReadString'
    }]
  }, {
    type: 'input',
    name: 'address',
    label: '属性地址',
    value: ''
  }],
  OMRON: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.readCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'select',
    name: 'method',
    label: '方法',
    value: 'ReadString',
    options: [{
      label: 'ReadByte',
      value: 'ReadByte'
    }, {
      label: 'ReadBool',
      value: 'ReadBool'
    }, {
      label: 'ReadShort',
      value: 'ReadShort'
    }, {
      label: 'ReadInt',
      value: 'ReadInt'
    }, {
      label: 'ReadLong',
      value: 'ReadLong'
    }, {
      label: 'ReadFloat',
      value: 'ReadFloat'
    }, {
      label: 'ReadDouble',
      value: 'ReadDouble'
    }, {
      label: 'ReadString',
      value: 'ReadString'
    }]
  }, {
    type: 'input',
    name: 'address',
    label: '属性地址',
    value: ''
  }],
  BACNET: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.readCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'select',
    name: 'method',
    label: '方法',
    value: 'ReadInt',
    options: [{
      label: 'ReadInt',
      value: 'ReadInt'
    }, {
      label: 'ReadFloat',
      value: 'ReadFloat'
    }, {
      label: 'ReadDouble',
      value: 'ReadDouble'
    }]
  }, {
    type: 'input',
    name: 'address',
    label: '属性地址',
    value: ''
  }],
  BECKHOFF_ADSNET: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.readCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'select',
    name: 'method',
    label: '方法',
    value: 'ReadInt',
    options: [{
      label: 'ReadInt',
      value: 'ReadInt'
    }, {
      label: 'ReadFloat',
      value: 'ReadFloat'
    }, {
      label: 'ReadDouble',
      value: 'ReadDouble'
    }]
  }, {
    type: 'input',
    name: 'address',
    label: '属性地址',
    value: ''
  }],
  MITSUBISH_MC: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.readCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'select',
    name: 'method',
    label: '方法',
    value: 'ReadString',
    options: [{
      label: 'ReadByte',
      value: 'ReadByte'
    }, {
      label: 'ReadBool',
      value: 'ReadBool'
    }, {
      label: 'ReadShort',
      value: 'ReadShort'
    }, {
      label: 'ReadInt',
      value: 'ReadInt'
    }, {
      label: 'ReadLong',
      value: 'ReadLong'
    }, {
      label: 'ReadFloat',
      value: 'ReadFloat'
    }, {
      label: 'ReadDouble',
      value: 'ReadDouble'
    }, {
      label: 'ReadString',
      value: 'ReadString'
    }]
  }, {
    type: 'input',
    name: 'address',
    label: '属性地址',
    value: ''
  }],
  DLT645: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.readCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'input',
    name: 'ruleId',
    label: '数据标识',
    value: ''
  }],
  DLT645_1997: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.readCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'input',
    name: 'ruleId',
    label: '数据标识',
    value: ''
  }],
  DF1: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.readCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'select',
    label: '字段类型',
    name: 'dataType',
    value: 'int32',
    options: [{
      label: '16位整型',
      value: 'int16'
    }, {
      label: '32位整型',
      value: 'int32'
    }, {
      label: '64位整型',
      value: 'int64'
    }, {
      label: '32位浮点型',
      value: 'float32'
    }, {
      label: '64位浮点型',
      value: 'float64'
    }, {
      label: '布尔型',
      value: 'bool'
    }]
  }, {
    type: 'input',
    name: 'valueAddr',
    label: '读取位',
    value: ''
  }
  ],
  IEC101: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.readCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'select',
    label: '字段类型',
    name: 'dataType',
    value: 'chars',
    options: [{
      label: '32位浮点型',
      value: 'float32'
    }, {
      label: '整型',
      value: 'int'
    }, {
      label: '布尔型',
      value: 'bool'
    }, {
      label: '字符型',
      value: 'char'
    }, {
      label: '字符型数组',
      value: 'chars'
    }]
  }],
  IEC104: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.readCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'select',
    label: '字段类型',
    name: 'dataType',
    value: 'chars',
    options: [{
      label: '32位浮点型',
      value: 'float32'
    }, {
      label: '整型',
      value: 'int'
    }, {
      label: '布尔型',
      value: 'bool'
    }, {
      label: '字符型',
      value: 'char'
    }, {
      label: '字符型数组',
      value: 'chars'
    }]
  }],
  CIP: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.readCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'select',
    label: '字段类型',
    name: 'dataType',
    value: 'int32',
    options: [{
      label: '8位整型',
      value: 'int8'
    }, {
      label: '16位整型',
      value: 'int16'
    }, {
      label: '32位整型',
      value: 'int32'
    }, {
      label: '64位整型',
      value: 'int64'
    }, {
      label: '32位浮点型',
      value: 'float32'
    }, {
      label: '64位浮点型',
      value: 'float64'
    }, {
      label: '布尔型',
      value: 'bool'
    }]
  }, {
    type: 'input',
    name: 'dataAddr',
    label: '字段地址',
    value: ''
  }]
}

const writeTagData = {
  MODBUS_RTU: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.writeCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'input',
    name: 'offset',
    label: '地址位',
    value: ''
  }, {
    type: 'select',
    label: '方法',
    name: 'method',
    value: 'WriteFloat',
    options: [{
      label: 'WriteBool',
      value: 'WriteBool'
    }, {
      label: 'WriteByte',
      value: 'WriteByte'
    }, {
      label: 'WriteShort',
      value: 'WriteShort'
    }, {
      label: 'WriteInt',
      value: 'WriteInt'
    }, {
      label: 'WriteLong',
      value: 'WriteLong'
    }, {
      label: 'WriteFloat',
      value: 'WriteFloat'
    }, {
      label: 'WriteDouble',
      value: 'WriteDouble'
    }]
  }, {
    label: '写功能码',
    name: 'functionCode',
    type: 'select',
    value: '10',
    options: [{
      label: 'MultipleRegisters',
      value: '10'
    }, {
      label: 'MultipleCoils',
      value: '6F'
    }, {
      label: 'SingleRegister',
      value: '06'
    }, {
      label: 'SingleCoil',
      value: '05'
    }]
  }, {
    type: 'input',
    name: 'valueExpression',
    label: '写表达式',
    value: ''
  }],
  MODBUS_TCP: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.writeCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'input',
    name: 'offset',
    label: '地址位',
    value: ''
  }, {
    type: 'select',
    label: '方法',
    name: 'method',
    value: 'WriteFloat',
    options: [{
      label: 'WriteBool',
      value: 'WriteBool'
    }, {
      label: 'WriteByte',
      value: 'WriteByte'
    }, {
      label: 'WriteShort',
      value: 'WriteShort'
    }, {
      label: 'WriteInt',
      value: 'WriteInt'
    }, {
      label: 'WriteLong',
      value: 'WriteLong'
    }, {
      label: 'WriteFloat',
      value: 'WriteFloat'
    }, {
      label: 'WriteDouble',
      value: 'WriteDouble'
    }]
  }, {
    label: '写功能码',
    name: 'functionCode',
    type: 'select',
    value: '10',
    options: [{
      label: 'MultipleRegisters',
      value: '10'
    }, {
      label: 'MultipleCoils',
      value: '6F'
    }, {
      label: 'SingleRegister',
      value: '06'
    }, {
      label: 'SingleCoil',
      value: '05'
    }]
  }, {
    type: 'input',
    name: 'valueExpression',
    label: '写表达式',
    value: ''
  }],
  OPCUA: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.writeCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'input',
    name: 'nodeId',
    label: '节点路径',
    value: ''
  }, {
    type: 'select',
    label: '方法',
    name: 'method',
    value: 'WriteFloat',
    options: [{
      label: 'WriteBool',
      value: 'WriteBool'
    }, {
      label: 'WriteByte',
      value: 'WriteByte'
    }, {
      label: 'WriteShort',
      value: 'WriteShort'
    }, {
      label: 'WriteInt',
      value: 'WriteInt'
    }, {
      label: 'WriteLong',
      value: 'WriteLong'
    }, {
      label: 'WriteFloat',
      value: 'WriteFloat'
    }, {
      label: 'WriteDouble',
      value: 'WriteDouble'
    }]
  }],
  OPCDA: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.writeCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'input',
    name: 'nodeId',
    label: '节点路径',
    value: ''
  }],
  OMRON: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.writeCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'select',
    name: 'method',
    label: '方法',
    value: 'WriteString',
    options: [{
      label: 'WriteByte',
      value: 'WriteByte'
    }, {
      label: 'WriteBool',
      value: 'WriteBool'
    }, {
      label: 'WriteShort',
      value: 'WriteShort'
    }, {
      label: 'WriteInt',
      value: 'WriteInt'
    }, {
      label: 'WriteLong',
      value: 'WriteLong'
    }, {
      label: 'WriteFloat',
      value: 'WriteFloat'
    }, {
      label: 'WriteDouble',
      value: 'WriteDouble'
    }, {
      label: 'WriteString',
      value: 'WriteString'
    }]
  }, {
    type: 'input',
    name: 'address',
    label: '属性地址',
    value: ''
  }],
  BACNET: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.writeCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'select',
    name: 'method',
    label: '方法',
    value: 'WriteInt',
    options: [{
      label: 'WriteInt',
      value: 'WriteInt'
    }, {
      label: 'WriteFloat',
      value: 'WriteFloat'
    }, {
      label: 'WriteDouble',
      value: 'WriteDouble'

    }]
  }, {
    type: 'input',
    name: 'address',
    label: '属性地址',
    value: ''
  }],
  BECKHOFF_ADSNET: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.writeCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'select',
    name: 'method',
    label: '方法',
    value: 'WriteInt',
    options: [{
      label: 'WriteInt',
      value: 'WriteInt'
    }, {
      label: 'WriteFloat',
      value: 'WriteFloat'
    }, {
      label: 'WriteDouble',
      value: 'WriteDouble'
    }]
  }, {
    type: 'input',
    name: 'address',
    label: '属性地址',
    value: ''
  }],
  MITSUBISH_MC: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.writeCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'select',
    name: 'method',
    label: '方法',
    value: 'WriteString',
    options: [{
      label: 'WriteByte',
      value: 'WriteByte'
    }, {
      label: 'WriteBool',
      value: 'WriteBool'
    }, {
      label: 'WriteShort',
      value: 'WriteShort'
    }, {
      label: 'WriteInt',
      value: 'WriteInt'
    }, {
      label: 'WriteLong',
      value: 'WriteLong'
    }, {
      label: 'WriteFloat',
      value: 'WriteFloat'
    }, {
      label: 'WriteDouble',
      value: 'WriteDouble'
    }, {
      label: 'WriteString',
      value: 'WriteString'
    }]
  }, {
    type: 'input',
    name: 'address',
    label: '属性地址',
    value: ''
  }],
  SIEMENS_S7: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.writeCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'select',
    name: 'method',
    label: '方法',
    value: 'WriteFloat',
    options: [{
      label: 'WriteByte',
      value: 'WriteByte'
    }, {
      label: 'WriteBool',
      value: 'WriteBool'
    }, {
      label: 'WriteShort',
      value: 'WriteShort'
    }, {
      label: 'WriteInt',
      value: 'WriteInt'
    }, {
      label: 'WriteLong',
      value: 'WriteLong'
    }, {
      label: 'WriteFloat',
      value: 'WriteFloat'
    }, {
      label: 'WriteDouble',
      value: 'WriteDouble'
    }, {
      label: 'WriteString',
      value: 'WriteString'
    }]
  }, {
    type: 'input',
    name: 'address',
    label: '属性地址',
    value: ''
  }],
  DF1: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.writeCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'select',
    label: '字段类型',
    name: 'dataType',
    value: 'int32',
    options: [{
      label: '16位整型',
      value: 'int16'
    }, {
      label: '32位整型',
      value: 'int32'
    }, {
      label: '64位整型',
      value: 'int64'
    }, {
      label: '32位浮点型',
      value: 'float32'
    }, {
      label: '64位浮点型',
      value: 'float64'
    }, {
      label: '布尔型',
      value: 'bool'
    }]
  }, {
    type: 'input',
    name: 'valueAddr',
    label: '读取位',
    value: ''
  }
  ],
  IEC101: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.writeCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'select',
    label: '字段类型',
    name: 'dataType',
    value: 'chars',
    options: [{
      label: '32位浮点型',
      value: 'float32'
    }, {
      label: '整型',
      value: 'int'
    }, {
      label: '布尔型',
      value: 'bool'
    }, {
      label: '字符型',
      value: 'char'
    }, {
      label: '字符型数组',
      value: 'chars'
    }]
  }],
  IEC104: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.writeCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'select',
    label: '字段类型',
    name: 'dataType',
    value: 'chars',
    options: [{
      label: '32位浮点型',
      value: 'float32'
    }, {
      label: '整型',
      value: 'int'
    }, {
      label: '布尔型',
      value: 'bool'
    }, {
      label: '字符型',
      value: 'char'
    }, {
      label: '字符型数组',
      value: 'chars'
    }]
  }],
  CIP: [{
    type: 'remote',
    name: 'dataName',
    label: '属性',
    value: '',
    remoteSearch: function(queryStr, cb) {
      const tags = fetchParentData(this, 'tagCommands')
      let result = []
      _.each(tags.writeCommands, function(val) {
        result.push(Object.assign({}, { value: val }))
      })
      result = queryStr ? dataFilter(result, queryStr) : result
      cb(result)
    }
  }, {
    type: 'select',
    label: '字段类型',
    name: 'dataType',
    value: 'int32',
    options: [{
      label: '8位整型',
      value: 'int8'
    }, {
      label: '16位整型',
      value: 'int16'
    }, {
      label: '32位整型',
      value: 'int32'
    }, {
      label: '64位整型',
      value: 'int64'
    }, {
      label: '32位浮点型',
      value: 'float32'
    }, {
      label: '64位浮点型',
      value: 'float64'
    }, {
      label: '布尔型',
      value: 'bool'
    }]
  }, {
    type: 'input',
    name: 'dataAddr',
    label: '字段地址',
    value: ''
  }]
}

const tagTableColumnData = {
  MODBUS_RTU: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '读取位',
      name: 'valueIndex'
    },
    {
      label: '读取方法',
      name: 'method',
      type: 'format',
      items: [{
        value: 'ReadBool',
        key: 'ReadBool'
      }, {
        value: 'ReadByte',
        key: 'ReadByte'
      }, {
        value: 'ReadShort',
        key: 'ReadShort'
      }, {
        value: 'ReadInt',
        key: 'ReadInt'
      }, {
        value: 'ReadLong',
        key: 'ReadLong'
      }, {
        value: 'ReadFloat',
        key: 'ReadFloat'
      }, {
        value: 'ReadDouble',
        key: 'ReadDouble'
      }, {
        value: 'ReadString',
        key: 'ReadString'
      }]
    },
    {
      label: '读取表达式',
      name: 'valueExpression'
    }
  ],
  MODBUS_TCP: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '读取位',
      name: 'valueIndex'
    },
    {
      label: '方法',
      name: 'method',
      type: 'format',
      items: [{
        value: 'ReadBool',
        key: 'ReadBool'
      }, {
        value: 'ReadByte',
        key: 'ReadByte'
      }, {
        value: 'ReadShort',
        key: 'ReadShort'
      }, {
        value: 'ReadInt',
        key: 'ReadInt'
      }, {
        value: 'ReadLong',
        key: 'ReadLong'
      }, {
        value: 'ReadFloat',
        key: 'ReadFloat'
      }, {
        value: 'ReadDouble',
        key: 'ReadDouble'
      }, {
        value: 'ReadString',
        key: 'ReadString'
      }]
    },
    {
      label: '读取表达式',
      name: 'valueExpression'
    }
  ],
  OPCUA: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '节点路径',
      name: 'nodeId'
    },
    {
      label: '方法',
      name: 'method'
    }
  ],
  OPCDA: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '节点路径',
      name: 'nodeId'
    }
  ],
  HTTP: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '属性值路径',
      name: 'valuePath'
    }
  ],
  MICONNECT: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '属性值路径',
      name: 'valuePath'
    }
  ],
  SIEMENS_S7: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '方法',
      name: 'method'
    },
    {
      label: '属性值地址',
      name: 'address'
    }
  ],
  MITSUBISH_MC: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '方法',
      name: 'method'
    },
    {
      label: '属性值地址',
      name: 'address'
    }
  ],
  OMRON: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '方法',
      name: 'method'
    },
    {
      label: '属性值地址',
      name: 'address'
    }
  ],
  BACNET: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '方法',
      name: 'method'
    },
    {
      label: '属性值地址',
      name: 'address'
    }
  ],
  BECKHOFF_ADSNET: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '方法',
      name: 'method'
    },
    {
      label: '属性值地址',
      name: 'address'
    }
  ],
  DLT645: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '数据标识',
      name: 'ruleId'
    }
  ],
  DLT645_1997: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '数据标识',
      name: 'ruleId'
    }
  ],
  DF1: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '读取位',
      name: 'valueAddr'
    },
    {
      label: '字段类型',
      name: 'dataType',
      type: 'format',
      items: [{
        value: '16位整型',
        key: 'int16'
      }, {
        value: '32位整型',
        key: 'int32'
      }, {
        value: '64位整型',
        key: 'int64'
      }, {
        value: '32位浮点型',
        key: 'float32'
      }, {
        value: '64位浮点型',
        key: 'floart64'
      }, {
        value: '布尔型',
        key: 'bool'
      }]
    }
  ],
  IEC101: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '字段类型',
      name: 'dataType',
      type: 'format',
      items: [{
        value: '32位浮点型',
        key: 'float32'
      }, {
        value: '整型',
        key: 'int'
      }, {
        value: '布尔型',
        key: 'bool'
      }, {
        value: '字符型',
        key: 'char'
      }, {
        value: '字符型数组',
        key: 'chars'
      }]
    }
  ],
  IEC104: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '字段类型',
      name: 'dataType',
      type: 'format',
      items: [{
        value: '32位浮点型',
        key: 'float32'
      }, {
        value: '整型',
        key: 'int'
      }, {
        value: '布尔型',
        key: 'bool'
      }, {
        value: '字符型',
        key: 'char'
      }, {
        value: '字符型数组',
        key: 'chars'
      }]
    }
  ],
  CIP: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '字段类型',
      name: 'dataType',
      type: 'format',
      items: [{
        value: '8位整型',
        key: 'int8'
      }, {
        value: '16位整型',
        key: 'int16'
      }, {
        value: '32位整型',
        key: 'int32'
      }, {
        value: '64位整型',
        key: 'int64'
      }, {
        value: '32位浮点型',
        key: 'float32'
      }, {
        value: '64位浮点型',
        key: 'floart64'
      }, {
        value: '布尔型',
        key: 'bool'
      }]
    },
    {
      label: '字段地址',
      name: 'dataAddr'
    }]
}

const writeTagTableColumnData = {
  MODBUS_RTU: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '地址位',
      name: 'offset'
    },
    {
      label: '方法',
      name: 'method'
    },
    {
      label: '写功能码',
      name: 'functionCode',
      type: 'format',
      items: [{
        value: 'MultipleRegisters',
        key: '10'
      }, {
        value: 'MultipleCoils',
        key: '6F'
      }, {
        value: 'SingleRegister',
        key: '06'
      }, {
        value: 'SingleCoil',
        key: '05'
      }]
    },
    {
      label: '写入表达式',
      name: 'valueExpression'
    }],
  MODBUS_TCP: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '写入位',
      name: 'offset'
    },
    {
      label: '方法',
      name: 'method'
    },
    {
      label: '写功能码',
      name: 'functionCode',
      type: 'format',
      items: [{
        value: 'MultipleRegisters',
        key: '10'
      }, {
        value: 'MultipleCoils',
        key: '6F'
      }, {
        value: 'SingleRegister',
        key: '06'
      }, {
        value: 'SingleCoil',
        key: '05'
      }]
    },
    {
      label: '写入表达式',
      name: 'valueExpression'
    }
  ],
  MITSUBISH_MC: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '方法',
      name: 'method'
    },
    {
      label: '属性值地址',
      name: 'address'
    }
  ],
  OPCUA: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '节点路径',
      name: 'nodeId'
    },
    {
      label: '方法',
      name: 'method'
    }
  ],
  OPCDA: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '节点路径',
      name: 'nodeId'
    }
  ],
  OMRON: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '方法',
      name: 'method'
    },
    {
      label: '属性值地址',
      name: 'address'
    }
  ],
  BACNET: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '方法',
      name: 'method'
    },
    {
      label: '属性值地址',
      name: 'address'
    }
  ],
  BECKHOFF_ADSNET: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '方法',
      name: 'method'
    },
    {
      label: '属性值地址',
      name: 'address'
    }
  ],
  SIEMENS_S7: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '方法',
      name: 'method'
    },
    {
      label: '属性值地址',
      name: 'address'
    }
  ],
  DF1: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '读取位',
      name: 'valueAddr'
    },
    {
      label: '字段类型',
      name: 'dataType',
      type: 'format',
      items: [{
        value: '16位整型',
        key: 'int16'
      }, {
        value: '32位整型',
        key: 'int32'
      }, {
        value: '64位整型',
        key: 'int64'
      }, {
        value: '32位浮点型',
        key: 'float32'
      }, {
        value: '64位浮点型',
        key: 'floart64'
      }, {
        value: '布尔型',
        key: 'bool'
      }]
    }
  ],
  IEC101: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '字段类型',
      name: 'dataType',
      type: 'format',
      items: [{
        value: '32位浮点型',
        key: 'float32'
      }, {
        value: '整型',
        key: 'int'
      }, {
        value: '布尔型',
        key: 'bool'
      }, {
        value: '字符型',
        key: 'char'
      }, {
        value: '字符型数组',
        key: 'chars'
      }]
    }
  ],
  IEC104: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '字段类型',
      name: 'dataType',
      type: 'format',
      items: [{
        value: '32位浮点型',
        key: 'float32'
      }, {
        value: '整型',
        key: 'int'
      }, {
        value: '布尔型',
        key: 'bool'
      }, {
        value: '字符型',
        key: 'char'
      }, {
        value: '字符型数组',
        key: 'chars'
      }]
    }
  ],
  CIP: [
    {
      label: '属性',
      name: 'dataName',
      width: '200'
    },
    {
      label: '字段类型',
      name: 'dataType',
      type: 'format',
      items: [{
        value: '8位整型',
        key: 'int8'
      }, {
        value: '16位整型',
        key: 'int16'
      }, {
        value: '32位整型',
        key: 'int32'
      }, {
        value: '64位整型',
        key: 'int64'
      }, {
        value: '32位浮点型',
        key: 'float32'
      }, {
        value: '64位浮点型',
        key: 'floart64'
      }, {
        value: '布尔型',
        key: 'bool'
      }]
    },
    {
      label: '字段地址',
      name: 'dataAddr'
    }
  ]
}

export { connectionData, connectionWriteData, tagData, writeTagData, tagTableColumnData, writeTagTableColumnData }
