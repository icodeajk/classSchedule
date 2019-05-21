/**
 * @file 高级筛选后端
 * @author xyz
 */

var logger = require('../logger').logger;
var formatterLogger = require('../logger').formatterLogger;
var checkFun = require('../authority').checkAuth;
var filterDataTree = require('./advanced_meta_data').filterDataTree;
var cityData = require('./city').city;
var areaData = require('./area').area;
var getCommonRenderData = require('../common').getCommonRenderData;
var config = require('../config');
var RequestHelper = require('../request_helper').RequestHelper;
var getDataAndRenderPage = function (req, res, next) {
    var pageId = 'advanced_search';
    var query = req.query;
    var type = req.query.type;

    var searchHistoriesData = {data: []};
    var msgsNumData = {};
    var auth = req._auth || {'activated': false, 'username': '', 'role_id': -1};
    var cookieObj = {};
    var cookieName = 'access_token';

    if (req.cookies && req.cookies[cookieName]) {
        var cookieStr = req.cookies[cookieName];
        cookieObj[cookieName] = cookieStr;
    }
    var ajaxHelper = new RequestHelper(cookieObj, next);

    if (auth.role_id > -1) {
        ajaxHelper.run(function () {
            res.render('advanced_search',
                getCommonRenderData(pageId, auth, req.cookies.access_token, {
                    filterData: filterDataTree,
                    moreFilterData: {}
                })
            );
        });
    } else {
        auth = {roleId: 0, username: ''};
        res.render('advanced_search',
            getCommonRenderData(pageId, auth, req.cookies.access_token, {
                filterData: filterDataTree,
                moreFilterData: {}
            })
        );
    }
};

var getCities = function (req, res, next) {
    var data = {'code': 0, 'msg': 'success', 'data': null};

    if (req.query.province) {
        var provinceName = req.query.province;
        var provinceId = filterDataTree['工商注册信息']['省份地区'].data[provinceName]
            ? filterDataTree['工商注册信息']['省份地区'].data[provinceName].id : '';
        var cities = cityData[provinceId] || [];
        var cityDataTree = {};
        cities.forEach(function (v) {
            cityDataTree[v.name] = v;
        });
        data.data = {
            subFilterData: cityDataTree,
            key: 'city_map',
            ancestor: provinceName,
            multiChoice: 'true'
        };
    } else {
        data.code = -1;
        data.msg = '';
    }
    res.send(data);
};
var getAreas = function (req, res, next) {
    var data = {'code': 0, 'msg': 'success', 'data': null};
    if (req.query.city) {
        var cityName = req.query.city;
        var provinceName = req.query.province
        var areas = filterDataTree['工商注册信息']['省份地区'].cityName_areas[cityName] || [];
        var areaDataTree = {};
        areas.forEach((item) => {
            areaDataTree[item.name] = item
        });
        data.data = {
            subFilterData: areaDataTree,
            key: 'area_map',
            ancestor: provinceName + '/' + cityName,
            multiChoice: 'true'
        };
    } else {
        data.code = -1;
        data.msg = '';
    }
    res.send(data);
};



module.exports = {
    getDataAndRenderPage,
    getCities,
    getAreas
};
