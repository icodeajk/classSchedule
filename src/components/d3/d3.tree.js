/**
 * 树形图绘制组件，使用原生js书写，可在全平台通用
 * 如果不能使用 import / export 语法，删除相应语句，将 TreeGraph 挂载于 window 即可
 *
 * 调用方式:
 *  const tree = new TreeGraph(<element>, {
 *    data: chartData
 *  })
 *  tree.init()
 *
 * 配置参数:
 * {
 *   data: {
 *     properties: { name: 'xxx' },
 *     children: [{
 *       properties: { name: '高管' },  // 虚拟节点
 *       children: [{
 *         properties: { name: 'xxx' },
 *         relations: [{
 *           label: '董事长'
 *         }]
 *       }]
 *     }]
 *   }, // 必传
 *   width: <width>, // svg 宽度，可选，_default 中有默认值
 *   height: <height>, // svg 高度
 *   ...
 * }
 */

import * as d3 from 'd3'

var _default = {
  width: window.innerWidth,
  height: window.innerHeight,
  diameter: 600, // 整体布局直径
  margin: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  },
  duration: 250, // 动画切换速度
  r: 10, // 节点半径
  collapseAll: true, // 默认全部收起
  dontCollapseList: [], // 不要默认收起的虚拟节点名称列表
  rotateLabelThreshold: 10
}

function TreeGraph (el, options) {
  this.el = el
  this.options = Object.assign({}, _default, options)
  this.width = this.options.width
  this.height = this.options.height
  this.tree = d3.tree()
    .size([2 * Math.PI, this.options.diameter / 2 - 30])
    .separation(function (a, b) {
      return (a.parent === b.parent ? 1 : 2) / a.depth
    })
  this.svg0 = d3.select(el)
  this.svg = this.svg0.attr('width', this.width)
    .attr('height', this.height)
    .attr('class', 'whale-tree')
    .append('g')
    .attr('class', 'chart-layer')

  var data = this.options.data
  data.x0 = this.height / 2
  data.y0 = 0
  this.leavesCnt = 0
  var _this = this
  preprocessData(data)
  this.hierarchy = d3.hierarchy(data).each(function (d) {
    var name = d.data.name.split('').filter(function (item) { return item !== ' ' }).join('')
    d.id = (d.parent && d.parent.id || 'head') + '_' +
      name.slice(0, 5) +
      (d.data._key && d.data._key.slice(0, 5) || '')
    d.name = name
    _this.leavesCnt++
  })
  this.root = this.tree(this.hierarchy)

  if (this.options.collapseAll) {
    this.root.children.forEach(collapse.bind(this)) // 默认都收起
  }
}

TreeGraph.prototype.initLayer = function () {
  this.svg.append('g')
    .attr('class', 'links')
    .attr('fill', 'none')
    .attr('stroke', '#e3e3e3')
    .attr('strokeWidth', '1.5px')
  this.svg.append('g')
    .attr('cursor', 'pointer')
    .attr('class', 'nodes')
  this.svg.append('defs')
  return this
}

TreeGraph.prototype.startDraw = function () {
  this.addNodes().addLinks()

  return this
}

TreeGraph.prototype.addLinks = function () {
  var _this = this
  var linkDef = this.svg.select('defs').selectAll('path')
    .data(this.root.links(), function (d) {
      return d.target.id
    })
  linkDef.enter()
    .append('path')
    .classed('forward', 'true')
    .attr('d', d3.linkRadial().angle(function (d) {
      return d.x
    }).radius(function (d) {
      return d.y
    }))
    .attr('id', function (d) {
      return d.target.id
    })

  linkDef.transition()
    .duration(this.options.duration)
    .attr('d', d3.linkRadial().angle(function (d) {
      return d.x
    }).radius(function (d) {
      return d.y
    }))

  var link = this.svg.select('.links').selectAll('.link')
    .data(this.root.links(), function (d) {
      return d.target.id
    })

  var linkEnter = link.enter().append('g')
    .attr('class', 'link')
  linkEnter.append('use')
    .attr('xlink:href', function (d) {
      return '#' + d.target.id
    })

  link.exit().remove()

  return this
}

TreeGraph.prototype.addNodes = function () {
  this.root = this.tree(this.hierarchy)
  var _this = this
  var node = this.svg.select('.nodes').selectAll('.node')
    .data(this.root.descendants(), function (d) {
      return d.id
    })

  var pathLength = 120
  this.root.descendants().forEach(function (d) {
    if (d.depth >= 2) {
      d.y = d.depth * (d.depth / 2) * pathLength
    } else {
      d.y = d.depth * pathLength
    }
  })

  var nodeUpdate = node.transition()
    .duration(this.options.duration)
    .attr("transform", function (d) { return 'translate(' + radialPoint(d.x, d.y) + ')' })

  var nodeEnter = node.enter().append('g')
    .attr('class', function (d) {
      return 'node' + (d.children ? ' node--internal' : ' node--leaf')
    })
    .attr('transform', function (d) {
      return 'translate(' + radialPoint(d.x, d.y) + ')'
    })

  nodeEnter.append('circle')
    .attr('r', this.options.r)
    .attr("fill", getCircleColor)
    .attr("stroke", getCircleColor)
    .attr('stroke-opacity', '0.3')
    .attr('stroke-width', function (d) {
      return d.depth === 0 || d.depth === 1 ? '5px' : 0
    })
    .attr('data-id', function (d) {
      return d.data._id
    })

  // + -
  nodeEnter.append('rect')
    .attr('width', function (d) {
      return (d.children || d._children) && d.depth != 0 ? _this.options.r : 0
    })
    .attr('height', Math.floor(_this.options.r / 4))
    .attr('fill', '#fff')
    .attr('x', -_this.options.r / 2)
    .attr('y', -Math.floor(_this.options.r / 4) / 2)

  nodeEnter.append('rect')
    .attr('height', function (d) {
      return d._children && d.depth != 0 ? _this.options.r : 0
    })
    .attr('width', Math.floor(_this.options.r / 4))
    .attr('fill', '#fff')
    .attr('y', -_this.options.r / 2)
    .attr('x', -Math.floor(_this.options.r / 4) / 2)

  d3.selectAll('text.node-name').remove()
  d3.selectAll('.node').append('text')
    .attr('class', 'node-name')
    .call(this.formatNodeName.bind(this), 0, 20)

  var titleEnter = nodeEnter.append('title')
  titleEnter.each(function (d, i, g) {
    var g = d3.select(g[i])
    g.append('tspan')
      .text(function (d) {
        var config = {
          '直接控股': '当前企业直接投资，且出资占比在50%以上的企业',
          '间接控制': '当前企业没有直接投资，而是通过其它企业间接投资，且累计占比在50%以上的企业',
          '主要投资': '当前企业直接投资，且出资占比在20%~50%的企业',
          '其它投资': '当前企业直接投资，且出资占比在20%以下的企业',
        }
        return config[d.name] || ''
      })
  })

  d3.selectAll('.tags').remove()
  d3.selectAll('.node').append('g')
    .attr('class', 'tags')
    .call(this.addNodeTags.bind(this))
  node.exit().remove()
  return this

  function radialPoint (x, y) {
    return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)]
  }

  function getCircleColor (d) {
    var color
    if (d.depth === 0) {
      color = d3GraphUtil.graphColorConfig['center']
    } else if (d.depth === 1) {
      color = d3GraphUtil.graphColorConfig[d.data.name]
    } else if (d.children || d._children) {
      var children = d.children || d._children
      color = d3GraphUtil.graphColorConfig[children[0].data.prev && children[0].data.prev.name]
    } else if (!d.children && !d._children) {
      color = d3GraphUtil.graphColorConfig[d.data.prev && d.data.prev.name]
    }
    color = color || '#69D5B9'
    return color
  }
}

TreeGraph.prototype.addNodeTags = function (tags) {
  var _this = this

  tags.each(function (d, i, g) {
    if (_this.leavesCnt < _this.options.rotateLabelThreshold) {
      setTagPosition(d, i, g)
    } else {
      if (d.depth < 2) {
        setTagPosition(d, i, g)
      } else {
        setTagPosition(d, i, g, true)
      }
    }
  })

  function setTagPosition (d, i, g, isRadial) {
    var prop = d.data.properties
    if (!prop || !prop._id) return

    var g = d3.select(g[i])
    var node = d3.select(g.node().parentNode)
    var text = node.select('.node-name')
    var W = 10 // 标签宽度
    var tagCnt = 0
    var is_abnormal = ['吊销', '注销', '清算', '停业', '撤销'].some(function (tag) {
      var business_status = prop.business_status || ''
      return business_status.indexOf(tag) > -1
    })
    if (prop.is_belong === true || prop.is_belong === 'true') {
      tagCnt++
      appendTag('belong', '#98CB6A', tagCnt)
    }
    if (prop.is_listed === true || prop.is_listed === 'true') {
      tagCnt++
      appendTag('listed', '#5f8def', tagCnt)
    }
    if (is_abnormal) {
      tagCnt++
      appendTag('abnormal', '#f00', tagCnt)
    }
    if (prop.is_blacklist === true || prop.is_blacklist === 'true') {
      tagCnt++
      appendTag('blacklist', '#000', tagCnt)
    }
    if (prop.is_greylist === true || prop.is_greylist === 'true') {
      tagCnt++
      appendTag('greylist', '#bdbdbd', tagCnt)
    }

    g.selectAll('rect')
      .attr('width', W)
      .attr('height', W)
      .attr('y', function () {
        if (isRadial && d.depth === 2) {
          return -5
        } else {
          return 0
        }
      })

    g.selectAll('.blacklist').append('title').append('tspan').text(function (d) {
      if (d.data.properties.blacklist_cause) {
        return d.data.properties.blacklist_cause
      } else {
        return ''
      }
    })

    var nodeBBox = node.node().getBBox()
    var textBbox = text.node().getBBox()
    var xShift = -(nodeBBox.width / 2 + g.node().getBBox().width + 5)
    var yShift = nodeBBox.height - _this.options.r - textBbox.height + 4
    var rotate = ''
    if (isRadial) {
      var l = 30 + textBbox.width
      xShift = Math.cos(d.x - Math.PI / 2) * l
      yShift = Math.sin(d.x - Math.PI / 2) * l
      rotate = text.node().getAttribute('transform')
    }
    g.attr('transform', 'translate(' + xShift + ',' + yShift + ') ' + rotate)

    function appendTag (type, color, tagCnt) {
      var transX = isRadial && d.depth === 2 && d.x > Math.PI ? -(tagCnt - 1) * W : (tagCnt - 1) * W
      g.append('rect').classed(type, true).attr('fill', color)
        .attr('transform', 'translate(' + transX + ',0)')
    }
  }
}

TreeGraph.prototype.bindEvents = function () {
  var _this = this

  /** 点击事件 */
  this.svg.selectAll('.node').on('click', click)

  /** 缩放事件 */
  this.zoomListener = d3.zoom().scaleExtent([0.1, 5]).on('zoom', zoom)
  this.svg0.call(this.zoomListener)

  return this

  // Toggle children on click.
  function click (d) {
    d3.event.preventDefault()
    if (d.depth == 0) {
      return
    }
    d3.select(this).remove()
    if (d.children) {
      d._children = d.children
      d.children = null
    } else {
      d.children = d._children
      d._children = null
    }
    _this.startDraw()
      .bindEvents()
  }

  function zoom () {
    _this.svg.attr('transform', d3GraphUtil.transform2Str(d3.event.transform))

  }
}

TreeGraph.prototype.initStatus = function (config) {
  var xShift = this.svg0.attr('width') / 2
  var yShift = this.svg0.attr('height') / 2 - 10  // 位置向上微调

  config = Object.assign({}, {
    x: xShift,
    y: yShift,
    scale: 1
  }, config)
  var t = d3.zoomIdentity
    .translate(config.x, config.y)
    .scale(config.scale)
  this.svg0.call(this.zoomListener.transform, t)
}

TreeGraph.prototype.formatNodeName = function (text, width, h) {
  var fontSize = 12
  var fontColor = '#333333'
  var graphObj = this.options.obj

  if (this.leavesCnt < this.options.rotateLabelThreshold) {
    text.each(putInBottom)
  } else {
    text.each(function (d, idx, g) { // 超过10个叶子节点，节点名称发散展示
      if (d.depth < 2) {
        putInBottom(d, idx, g)
      } else {
        putInRadial(d, idx, g, graphObj)
      }
    })
  }

  function putInBottom (d, idx, g) {
    var thisText = d3.select(g[idx])
    var len = 8
    var textStack = []
    var name = d.data.name || ''
    var shouldWrap = true
    if (d.depth !== 0 && name && (d.children || d._children)) { // 虚拟节点
      var children = d.children || d._children
      name = name + '(' + (d.data.children_num || children.length) + ')'
      shouldWrap = false
    }
    var y = 25
    var lineHeight = fontSize + 2
    var i = 0
    if (shouldWrap) {
      while (name.slice(0, len).length === len) {
        textStack.push({
          name: name.slice(0, len),
          dx: -width / 2,
          dy: ((i++ * lineHeight) + y)
        })
        name = name.slice(len)
      }
      textStack.push({
        name: name.slice(0),
        dx: -width / 2,
        dy: ((i * lineHeight) + y)
      })
    } else {
      textStack = [{
        name: name,
        dx: -width / 2,
        dy: ((i * lineHeight) + y)
      }]
    }
    textStack.forEach(function (v) {
      thisText.append('tspan').text(v.name)
        .attr('x', v.dx)
        .attr('y', v.dy)
        .attr('fill', fontColor)
        .attr('style', 'font-size: ' + fontSize + 'px')
        .attr('text-anchor', 'middle')
    })
  }

  function putInRadial (d, idx, g, obj) {
    var name = d.data.name
    if (obj == 'RelationSummary') {
      if (d.depth !== 0 && name && d.data.relations) {
        if (d.data.prev.name == '股东') {
          name = name + (d.data.value ? '(' + d.data.value + ')' : '')
        } else if (d.data.prev.name == '担保') {
          if (d.data.properties.money2 > 0 && d.data.properties.money > 0) {
            name = name + '(被担保' + d.data.properties.money2 + '万元，担保' + d.data.properties.money + '万元)'
          } else if (d.data.properties.money2 > 0 && d.data.properties.money == 0) {
            name = name + '(被担保' + d.data.properties.money + '万元)'
          } else if (d.data.properties.money > 0 && d.data.properties.money2 == 0) {
            name = name + '(担保' + d.data.properties.money + '万元)'
          }
        } else if (d.data.prev.name == '高管') {
          name = name + '(' + d.data.relations[0].label + ')'
        } else if (d.data.prev.name == '对外投资') {
          name = name + (d.data.properties.percentSize > 0 ?
            '(' + d.data.properties.percentSize + '%)' : '')
        } else {
          name = name + '(' + d.data.properties.relationName + ')'
        }
      }
    }
    var thisText = d3.select(g[idx])
    var PI = Math.PI
    var x = 15
    var y = 5
    var rotateDeg = (d.x - PI / 2) / (2 * PI) * 360
    if (rotateDeg > 90) {
      rotateDeg -= 180
      var txtObj = measureText(name, fontSize)
      x = -x - txtObj.width
    }
    thisText.attr('transform', 'rotate(' + rotateDeg + ')')
      .attr('x', x)
      .attr('y', y)
      .append('tspan')
      .text(name)
      .attr('fill', fontColor)
      .attr('style', 'font-size: ' + fontSize + 'px')
  }

  function measureText (text, fontSize) {
    if (!text || text.length === 0) return { height: 0, width: 0 }
    var container = d3.select('body').append('svg').attr('class', 'dummy')
    container.append('text')
      .attr('x', -1000)
      .attr('y', -1000)
      .attr('font-size', fontSize)
      .text(text)
    var bbox = container.node().getBBox()
    var height = bbox.height
    var width = bbox.width
    container.remove()
    return { height: height, width: width }
  }
}

TreeGraph.prototype.render = function () {
  this.initLayer()
    .startDraw()
    .bindEvents()
    .initStatus()

  return this
}

TreeGraph.prototype.init = function () {
  this.render()
}

// Collapse nodes
function collapse (d) {
  if (this.options.dontCollapseList.indexOf(d.name) > -1) return

  if (d.children) {
    d._children = d.children
    d._children.forEach(collapse.bind(this))
    d.children = null
  }
}

function preprocessData (data) {
  d3GraphUtil.traversalTree(data, function (data) {
    if (data.relations) {
      data.label = data.relations[0] && data.relations[0].position || ''
    }
    if (data.label) {
      data.name = data.properties.name + '（' + data.label + '）'
    } else {
      data.name = data.properties.name
    }
  })
}

var d3GraphUtil = {
  graphColorConfig: {
    'center': '#27B3F4',
    // 关系概要
    '股东': '#8785EB',
    '高管': '#FF9647',
    '资金往来': '#4F959E',
    '对外投资': '#69D5B9',
    '担保': '#A66EB2',
    '涉诉': '#98CB6A',
    '招投标': '#63D9F3',
    // 投资族谱
    '直接控股': '#63D9F3',
    '间接控制': '#4F959E',
    '主要投资': '#69D5B9',
    '其它投资': '#A66EB2',
    '分支机构': '#FF9647',
    // 高管信息
    '监事': '#98CB6A',
    '核心高管': '#FF9647',
    '董事': '#8785EB',
    // 资金往来
    '企业转入': '#63D9F3',
    '转出至个人': '#4F959E',
    '个人转入': '#69D5B9',
    '转出至企业': '#A66EB2',
    // 事件关联
    '甲方': '#63D9F3',
    '乙方': '#4F959E',
    '起诉': '#69D5B9',
    '被起诉': '#A66EB2',
    '同为原告': '#FF9647',
    '共同提及': '#8785EB',
    '同为被告': '#98CB6A',
    // 网络图
    // 担保环高亮
    'guarantee_circle': '#FF9647',
  },
  transform2Str: function (transform) {
    return 'translate(' + transform.x + ',' + transform.y + ') ' + 'scale(' + transform.k + ')'
  },
  traversalTree: function (data, func) {
    if (!data || !data.properties) return

    var _this = this
    func = func || function () { }
    data.children_num = data.children && data.children.length || 0;
    data._key = data.properties && data.properties._key || '';
    func(data)
    data.children && data.children.forEach(function (item) {
      item.prev = data.properties
      _this.traversalTree(item, func)
    })

    return data
  }
}

export default TreeGraph
