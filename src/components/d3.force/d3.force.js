/**
 * 力图绘制组件，使用原生js书写，可在全平台通用
 * 如果不能使用 import / export 语法，删除相应语句，将 Force 挂载于 window 即可
 *
 * 调用方式:
 *  const force = new Force(<element>, {
 *    data: chartData // { vertexes: [], edges: [] }
 *  })
 *  force.init()
 *
 * 配置参数:
 * {
 *   data: { vertexes: [...], edges: [...] } // 必传
 *   width: <width> // svg 宽度，可选，_default 中有默认值
 *   height: <height> // svg 高度
 *   r,
 *   distance
 * }
 */

import * as d3 from 'd3'
var companySvg = require('assets/svg/company.svg')
var personSvg = require('assets/svg/person.svg')

var Force = function (ele, options) {
  var _default = {
    r: 20, // 节点半径
    width: window.innerWidth, // 画布宽度
    height: window.innerHeight,
    distance: 250 // 边长度
  }

  this.options = Object.assign({}, _default, options)
  this.ele = ele

  d3.select(ele).selectAll('svg').remove()
  this.svg = d3.select(ele)
    .attr('width', this.options.width)
    .attr('height', this.options.height)
  this.chartGroup = this.svg.append('g')
    .attr('width', this.options.width)
    .attr('height', this.options.height)
    .classed('force', true)
  this.vertexes = options.data.vertexes
  this.edges = options.data.edges
  this.edgeTypes = ['invest', 'officer', 'guarantee', 'guarantee_circle']
}

Force.prototype.preprocessData = function () {
  this.edges.forEach(function (e) {
    // e.source = e._from
    // e.target = e._to
    e.source = e._to // 箭头反向，解决IE兼容性问题
    e.target = e._from
    e._type = e._type || (e._id.indexOf('/') > -1 && e._id.split('/')[0].toLowerCase())
  })
  this.vertexes.forEach(function (v) {
    v._type = v._type || (v._id.indexOf('/') > -1 && v._id.split('/')[0].toLowerCase())
  })

  this.setIndex()

  return this
}

Force.prototype.initChartLayers = function () {
  this.chartGroup.append('g')
    .attr('class', 'chart-layer')
    .append('g')
    .attr('class', 'links')
  this.chartGroup.select('.chart-layer')
    .append('g')
    .attr('class', 'nodes')

  return this
}

Force.prototype.render = function () {
  /**
   * 定义箭头
   * @param {Object} svg 要添加进的 svg
   * @param {String} id 箭头 id
   * @param {Number} refX refX 位置
   * @param {String} pathDescr path d 元素
   * @param {String} className 箭头 class
   */
  function defineArrow (svg, id, refX, pathDescr, className) {
    className = className || ''
    svg.append('defs')
      .append('marker')
      .attr('id', id)
      .attr('class', 'arrow-marker ' + className)
      .attr('refX', -refX + 10)
      .attr('refY', 5)
      .attr('markerUnits', 'userSpaceOnUse')
      .attr('markerWidth', 20)
      .attr('markerHeight', 20)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', pathDescr)
      .attr('fill', '#e3e3e3')
  }

  /** 动态调整位置 */
  function tickActions () {
    // 移动 vertex 位置
    _this.svg.selectAll('g.node')
      .attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')'
      })

    // 调整label和边的距离
    _this.svg.selectAll('g .link-name').each(function (d, i, g) {
      var r = Math.sqrt(Math.pow(d.source.x - d.target.x, 2) + Math.pow(d.source.y - d.target.y, 2))
      if (Math.abs(d.source.y - d.target.y) < r / 2) {
        d3.select(g[i]).attr('transform', 'translate(0, -5)')
      } else if ((d.source.x > d.target.x && d.source.y > d.target.y) ||
        (d.source.x < d.target.x && d.source.y < d.target.y)) {
        d3.select(g[i]).attr('transform', 'translate(5, 0)')
      } else if ((d.source.x > d.target.x && d.source.y < d.target.y) ||
        (d.source.x < d.target.x && d.source.y > d.target.y)) {
        d3.select(g[i]).attr('transform', 'translate(-5, 0)')
      }
    })

    _this.svg.selectAll('g .link-name textPath').each(function (d, i, g) {
      // 通过旋转 label, 使文字始终处于 edge 上方
      if (d.source.x > d.target.x) {
        d3.select(g[i]).attr('xlink:href', function (d) {
          return '#' + d._id.replace('/', '_') + _this.ele.id + '_reverse'
        })
      } else {
        d3.select(g[i]).attr('xlink:href', function (d) {
          return '#' + d._id + _this.ele.id
        })
      }
    })

    // IE bug, marker-start 不能动态更新, 所以每次更新位置时都去除 path 再增加上 (note: 会有性能问题)
    if (window.ActiveXObject || /Trident\/7\./.test(navigator.userAgent)) {
      linkEnter.selectAll('path').remove()
      edge = linkEnter.append('path')
        .attr('class', 'link edge-path')
        .attr('linkIndex', function (d) {
          return d.linkIndex
        })
        .attr('linkMap', function (d) {
          return d.linkNum
        })
        .attr('marker-start', function (d) {
          return _this.edgeTypes.indexOf(d._type) > -1 ? 'url(#arrow_' + d._type + ')' : 'url(#arrow)'
        })
    }

    // 计算 edge 的 path, 多条路径时计算弧度
    _this.svg.selectAll('.edge-path').each(function (d, i, g) {
      var dx = d.target.x - d.source.x
      var dy = d.target.y - d.source.y

      var dr = d.linkNum > 1 ? Math.sqrt((dx * dx) + (dy * dy)) : 0
      var middleIdx = (d.linkNum + 1) / 2

      if (d.linkNum > 1) {
        dr = d.linkIndex === middleIdx ? 0 : dr / (Math.log((Math.abs(d.linkIndex - middleIdx) * 0.6) + 1) +
            (1 / (10 * Math.pow(d.linkNum, 2)))) // 秘制调参
      }
      var sweepFlag = d.linkIndex > middleIdx ? 1 : 0
      if (d.labelDirection) sweepFlag = 1 - sweepFlag
      var path = 'M' + d.source.x + ',' + d.source.y +
        'A' + dr + ',' + dr + ' 0 0 ' + sweepFlag + ',' + d.target.x + ',' + d.target.y

      // 自己指向自己
      if (d._from === d._to) {
        path = 'M' + d.source.x + ' ' + d.source.y + ' C ' + d.source.x + ' ' + (d.source.y - 150) + ', ' +
          (d.source.x + 150) + ' ' + d.source.y + ', ' + d.source.x + ' ' + d.source.y
      }

      d3.select(g[i])
        .attr('d', path)
        .attr('id', d._id + _this.ele.id)
      // 增加一条反向的路径, 用于旋转 label
      d3.select('#' + d._id.replace('/', '_') + _this.ele.id + '_reverse')
        .attr('d', 'M' + d.target.x + ',' + d.target.y +
          'A' + dr + ',' + dr + ' 0 0 ' + (1 - sweepFlag) + ',' + d.source.x + ',' + d.source.y)
    })
  }

  /**
   * 对节点名称进行格式化
   * @param {Object} text text selection object
   */
  function textWrap (text) {
    text.each(function (d, idx, g) {
      var thisText = d3.select(g[idx])
      var len = 16
      var textStack = []
      var name = d.name || d.case_id || ''
      if (d._type === 'Family_id') {
        name = '互为亲属'
      }
      var y = parseFloat(thisText.attr('y'))
      var lineHeight = 20
      var i = 0
      while (name.slice(0, len).length === len) {
        textStack.push({
          name: name.slice(0, len),
          dx: 0,
          dy: (i++ * lineHeight) + y
        })
        name = name.slice(len)
      }
      textStack.push({
        name: name.slice(0),
        dx: 0,
        dy: (i++ * lineHeight) + y
      })
      textStack.forEach(function (v) {
        thisText.append('tspan').text(v.name).attr('y', v.dy)
          .attr('x', v.dx)
          .attr('class', v.risk ? 'risk-status' : '')
      })
    })
  }

  var _this = this
  // define arrow
  this.edgeTypes.forEach(function (e) {
    defineArrow(_this.svg, 'arrow_' + e, _this.options.r + 9, 'M10,0 L2,5 L10,10 L8,5 z', e)
  })
  defineArrow(this.chartGroup, 'arrow', this.options.r + 9, 'M10,0 L2,5 L10,10 L8,5 z')

  // setup
  var linkForce = d3.forceLink(this.edges)
    .distance(this.options.distance)
    .id(function (d) {
      return d._id
    })

  this.simulation = d3.forceSimulation()
    .alphaDecay(0.07)
    .nodes(this.vertexes)
    .force('links', linkForce)
    .force('charge_force', d3.forceManyBody().strength(-2500))
    .force('center_force', d3.forceCenter(this.options.width / 2, this.options.height / 2))
    .force('x', d3.forceX())
    .force('y', d3.forceY())
    .force('collision', d3.forceCollide(1.5 * this.options.r))
    .on('tick', tickActions)

  // add vertexes
  var nodeEnter = this.chartGroup.select('.nodes').selectAll('g')
    .data(this.vertexes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('node-type', function (d) {
      return d._type
    })

  nodeEnter.append('circle')
    .attr('r', this.options.r)
    .attr('class', 'circle')
    .attr('data-id', function (d) {
      return d._id
    })
  nodeEnter.append('image')
    .attr('xlink:href', (d) => {
      if (d._id.indexOf('Person') > -1) {
        return personSvg
      }
      return companySvg
    })
    .attr('width', this.options.r * 2)
    .attr('height', this.options.r * 2)
    .attr('x', -this.options.r)
    .attr('y', -this.options.r)

  nodeEnter.append('text')
    .attr('class', 'node-name')
    .attr('y', '35')
    .style('text-anchor', 'middle')

  nodeEnter.selectAll('.node-name')
    .call(textWrap)

  nodeEnter.append('g')
    .attr('class', 'tags')
    .each(function (d, i, g) {
      var curGroup = d3.select(g[i])
      var node = d3.select(curGroup.node().parentNode)
      var text = node.select('.node-name')
      var w = 10 // 标签宽度
      var tagCnt = 0
      var isAbnormal = ['吊销', '注销', '清算', '停业', '撤销'].some(function (tag) {
        return d.business_status && d.business_status.indexOf(tag) > -1
      })
      if (d.is_belong === true || d.is_belong === 'true') {
        tagCnt++
        appendTag('belong', '#98CB6A', tagCnt)
      }
      if (d.is_listed === true || d.is_listed === 'true') {
        tagCnt++
        appendTag('listed', '#5f8def', tagCnt)
      }
      if (isAbnormal) {
        tagCnt++
        appendTag('abnormal', '#f00', tagCnt)
      }
      if (d.is_blacklist === true || d.is_blacklist === 'true') {
        tagCnt++
        appendTag('blacklist', '#000', tagCnt)
      }
      if (d.is_greylist === true || d.is_greylist === 'true') {
        tagCnt++
        appendTag('greylist', '#bdbdbd', tagCnt)
      }

      curGroup.selectAll('rect')
        .attr('width', w)
        .attr('height', w)
      curGroup.selectAll('.blacklist').append('title').append('tspan').text(function (d) {
        if (d.blacklist_cause) {
          return d.blacklist_cause
        } else {
          return ''
        }
      })

      var nodeBBox = node.node().getBBox()
      var xShift = nodeBBox.width / 2 + curGroup.node().getBBox().width + 5
      var yShift = nodeBBox.height - _this.options.r - text.node().getBBox().height + 2
      curGroup.attr('transform', 'translate(' + (-xShift) + ',' + yShift + ')')

      function appendTag (type, color, tagCnt) {
        curGroup.append('rect').classed(type, true).attr('fill', color)
          .attr('transform', 'translate(' + (tagCnt - 1) * w + ',0)')
      }
    })

  // add edges
  var linkEnter = this.chartGroup.select('.links').selectAll('g')
    .data(this.edges)
    .enter()
    .append('g')
    .attr('class', function (d) {
      return d._type
    })

  var edge = linkEnter.append('path')
    .attr('class', function (d) {
      return 'link ' + d._type
    })
    .classed('edge-path', true)
    .attr('linkIndex', function (d) {
      return d.linkIndex
    })
    .attr('linkMap', function (d) {
      return d.linkNum
    })
    .attr('marker-start', function (d) {
      if (d.path_type === 'guarantee_circle') {
        return 'url(#arrow_guarantee_circle)'
      } else {
        return _this.edgeTypes.indexOf(d._type) > -1 ? 'url(#arrow_' + d._type + ')' : 'url(#arrow)'
      }
    })
  // 增加反向路径, 用于旋转 label
  this.chartGroup.select('defs').selectAll('.reverse-path')
    .data(this.edges)
    .enter()
    .append('path')
    .attr('id', function (d) {
      return d._id.replace('/', '_') + _this.ele.id + '_reverse'
    })

  // add edge text
  linkEnter.append('text')
    .attr('class', function (d) {
      return 'link-name ' + (d._id.split('/') && d._id.split('/')[0].toLowerCase())
    })
    .append('textPath')
    .attr('xlink:href', function (d) {
      return '#' + d._id + _this.ele.id
    })
    .attr('startOffset', '50%')
    .text(function (d) {
      return d.label
    })

  return this
}

/**
 * 计算起点和终点相同边的条数，并加到link属性里
 * 计算每个点的度，并加到 vertex 的 degree 属性中
 * @return {Object} this this
 */
Force.prototype.setIndex = function () {
  var linkNumMap = {}
  var nodeNumMap = {}
  var linkDirection = {}
  this.edges.forEach(function (edge) {
    if (linkNumMap[edge._from + edge._to] === undefined) {
      linkNumMap[edge._from + edge._to] = linkNumMap[edge._to + edge._from] = 1
      linkDirection[edge._from + edge._to] = linkDirection[edge._to + edge._from] = edge._from
    } else {
      linkNumMap[edge._from + edge._to]++
      linkNumMap[edge._to + edge._from]++
    }

    nodeNumMap[edge._from] = nodeNumMap[edge._from] ? nodeNumMap[edge._from] + 1 : 1
    nodeNumMap[edge._to] = nodeNumMap[edge._to] ? nodeNumMap[edge._to] + 1 : 1
    edge.linkIndex = linkNumMap[edge._from + edge._to]
  })
  this.edges.forEach(function (edge) {
    edge.linkNum = linkNumMap[edge._from + edge._to]
    edge.labelDirection = linkDirection[edge._from + edge._to] === edge._from ? 1 : 0
  })
  this.vertexes.forEach(function (vertex) {
    vertex.degree = nodeNumMap[vertex._id]
  })

  return this
}

Force.prototype.bind = function () {
  /**
   * dragStart 开始拖拽
   * @param  {Object} d vertex
   */
  function dragStart (d) {
    if (!d3.event.active) _this.simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  /**
   * 拖动
   * @param {Object} d vertex
   */
  function drag (d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }

  /**
   * 结束拖动
   * @param {Object} d vertex
   */
  function dragEnd (d) {
    if (!d3.event.active) _this.simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  /** 缩放 */
  function zoom () {
    d3.select('g.chart-layer').attr('transform', d3GraphUtil.transform2Str(d3.event.transform))
  }

  var _this = this

  // 注册缩放事件
  this.zoomListener = d3.zoom().scaleExtent([0.1, 5]).on('zoom', zoom)
  // 缩放配置
  this.svg.call(this.zoomListener)
  // 清空缩放事件
  var t = d3.zoomIdentity.translate(0, 0).scale(1)
  this.svg.call(this.zoomListener.transform, t)

  // 拖拽配置
  var dragHandler = d3.drag()
    .on('start', dragStart)
    .on('drag', drag)
    .on('end', dragEnd)

  dragHandler(this.chartGroup.selectAll('.node'))

  return this
}

Force.prototype.initPosition = function (config) {
  config = Object.assign({}, {
    x: 0,
    y: 0,
    scale: 1
  }, config)
  var t = d3.zoomIdentity.translate(config.x, config.y).scale(config.scale)
  this.svg.call(this.zoomListener.transform, t)

  return this
}

Force.prototype.init = function () {
  this.preprocessData()
    .initChartLayers()
    .render()
    .bind()
}

var d3GraphUtil = {
  transform2Str: function (transform) {
    return 'translate(' + transform.x + ',' + transform.y + ') ' + 'scale(' + transform.k + ')'
  }
}

export default Force
