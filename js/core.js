var messagePanel = $("#message");
var map, geolocation, driving, auto;
// ------------------------参数配置信息 begin
var autoOptions = {
    input: "tipinput"
};
/**
 * [drivingOption AMap.Driving 驾车路线规划服务，提供起、终点坐标的驾车导航路线查询功能]
 * @type {Object}
 */
var drivingOption = {
    showTraffic: true, //实时显示路况
    // province: '渝', //车牌省份的汉字缩写，用于判断是否限行
    // number: 'D759Q3'
    // policy: AMap.DrivingPolicy.LEAST_TIME
};
/**
 * [geolocationOption AMap.Geolocation 定位插件，整合了浏览器定位、精确IP定位、sdk辅助定位多种手段]
 * @type {Object}
 */
var geolocationOption = {
    enableHighAccuracy: true, //是否使用高精度定位，默认:true
    timeout: 10000, //超过10秒后停止定位，默认：无穷大
    buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
    zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    buttonPosition: 'RB'
}
map = new AMap.Map("container", {
    resizeEnable: true
});
// ------------------------参数配置信息 begin
//----------------------------------默认变量初始化  begin
//
//----------------------------------默认变量初始化  end
// $("input").focus(function(){
//   $("input").css("background-color","#FFFFCC");
// });
// var autoOptions = {
//     input: "tipinput"
// };
// var auto = new AMap.Autocomplete(autoOptions);
// var placeSearch = new AMap.PlaceSearch({
//     map: map
// });  //构造地点查询类
// AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
// function select(e) {
//     placeSearch.setCity(e.poi.adcode);
//     placeSearch.search(e.poi.name);  //关键字查询查询
// }
var contextMenu = new AMap.ContextMenu(); //创建右键菜单
//右键放大
contextMenu.addItem("标记", function() {
    map.zoomIn();
}, 0);
//右键缩小
contextMenu.addItem("设为起点", function() {
    map.zoomOut();
}, 1);
//右键显示全国范围
contextMenu.addItem("生成轨迹", function(e) {
    map.setZoomAndCenter(4, [108.946609, 34.262324]);
}, 2);
//右键添加Marker标记
contextMenu.addItem("添加标记", function(e) {
    var marker = new AMap.Marker({
        map: map,
        position: contextMenuPositon //基点位置
    });
}, 3);
//地图绑定鼠标右击事件——弹出右键菜单
map.on('rightclick', function(e) {
    contextMenu.open(map, e.lnglat);
    contextMenuPositon = e.lnglat;
});
// ------------------------------自定义方法
AMap.event.addDomListener(document.getElementById('query'), 'click', function() {
    var cityName = document.getElementById('cityName').value;
    if (!cityName) {
        cityName = '北京市';
    }
    map.setCity(cityName);
});
/**
 * 搜索
 * @param  {[type]} ){} [description]
 * @return {[type]}       [description]
 */
$("#searchDestination").click(function() {
    console.info("++markDestination++")
    var destination = $("input[id='destination']").val();
    if (StringUtils.isEmpty(destination)) {
        showWarningAlert("目的地,目的城市不能空!");
        return;
    }
    AMap.service(["AMap.PlaceSearch"], function() {
        var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
            pageSize: 20,
            pageIndex: 1,
            // city: "010", //城市
            map: map,
            panel: "message"
        });
        //关键字查询
        placeSearch.search(destination);
    });
});
/**
 * [定位]
 * @param  {AMap}   ) {               map.plugin('AMap.Geolocation', function() {        geolocation [description]
 * @return {[type]}   [description]
 */
$("#autoGeolocation").click(function() {
    map.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation(geolocationOption);
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
        AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
    });
    //解析定位结果
    function onComplete(data) {
        console.info("定位结果:")
        console.debug(data);
        var str = ['定位成功<br/>'];
        str.push('位置: ' + data.formattedAddress + "<br/>");
        $("#startAddress").val(data.formattedAddress);
        str.push('经度：' + data.position.getLng() + "<br/>");
        str.push('纬度：' + data.position.getLat() + "<br/>");
        if (data.accuracy) {
            str.push('精度：' + data.accuracy + ' 米' + "<br/>");
        } //如为IP精确定位结果则没有精度信息
        str.push('是否经过偏移：' + (data.isConverted ? '是' : '否') + "<br/>");
        showSuccessAlert(str);
    }
    //解析定位错误信息
    function onError(data) {
        showErrorAlert("定位失败!");
    }
});
$("#generateRoute").click(function(event) {
    var marker = new AMap.Marker({
        map: map,
        position: [116.397428, 39.90923],
        icon: "http://webapi.amap.com/images/car.png",
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true
    });
    console.info("开始获取当前位置");
    map.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation(geolocationOption);
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', function(data) {
            console.info("定位结果:")
            console.debug(data);
            var str = ['定位成功<br/>'];
            str.push('位置: ' + data.formattedAddress + "<br/>");
            $("#startAddress").val(data.formattedAddress);
            str.push('经度：' + data.position.getLng() + "<br/>");
            str.push('纬度：' + data.position.getLat() + "<br/>");
            if (data.accuracy) {
                str.push('精度：' + data.accuracy + ' 米' + "<br/>");
            } //如为IP精确定位结果则没有精度信息
            str.push('是否经过偏移：' + (data.isConverted ? '是' : '否') + "<br/>");
            showSuccessAlert(str);
            var lngX = data.position.getLng(),
                latY = data.position.getLat();
            var lineArr = [];
            lineArr.push([lngX, latY]);
            for (var i = 1; i < 4; i++) {
                lngX = lngX + Math.random() * 0.05;
                if (i % 2) {
                    latY = latY + Math.random() * 0.0001;
                } else {
                    latY = latY + Math.random() * 0.06;
                }
                lineArr.push([lngX, latY]);
            }
            // 绘制轨迹
            var polyline = new AMap.Polyline({
                map: map,
                path: lineArr,
                strokeColor: "#00A", //线颜色
                // strokeOpacity: 1,     //线透明度
                strokeWeight: 3, //线宽
                // strokeStyle: "solid"  //线样式
            });
            var passedPolyline = new AMap.Polyline({
                map: map,
                // path: lineArr,
                strokeColor: "#F00", //线颜色
                // strokeOpacity: 1,     //线透明度
                strokeWeight: 3, //线宽
                // strokeStyle: "solid"  //线样式
            });
            marker.on('moving', function(e) {
                passedPolyline.setPath(e.passedPath);
            })
            map.setFitView();
            //千米/小时
            // var i=0;
            marker.moveAlong(lineArr, 2500, function(data) {
                // console.info(i++);
            }, true);
            // marker.pauseMove();
            // marker.resumeMove();
            // marker.stopMove();
        }); //返回定位信息
        AMap.event.addListener(geolocation, 'error', function(data) {
            showErrorAlert("定位失败!");
        });
    });
});
/**
 * 转到高德地图官方页面搜索
 * @param  {[type]} ) {               var startAddress [description]
 * @return {[type]}   [description]
 */
$("#openApp").click(function() {
    var startAddress = $("input[id='startAddress']").val();
    if (StringUtils.isEmpty(startAddress)) {
        showWarningAlert("路径规划,出发地不能空!");
        return;
    }
    var endAddress = $("input[id='endAddress']").val();
    if (StringUtils.isEmpty(endAddress)) {
        showWarningAlert("路径规划,目的地不能空!");
        return;
    }
    var drivingOption = {
        policy: AMap.DrivingPolicy.LEAST_TIME,
        map: map
    };
    if (driving == null) {
        driving = new AMap.Driving(drivingOption); //构造驾车导航类
    }
    driving.searchOnAMAP({
        origin: startAddress,
        destination: endAddress
    });
});
/**
 * 搜索路径
 * @param  {[type]} ) {               var startAddress [description]
 * @return {[type]}   [description]
 */
$("#searchRoute").click(function() {
    var startAddress = $("input[id='startAddress']").val();
    if (StringUtils.isEmpty(startAddress)) {
        showWarningAlert("路径规划,出发地不能空!");
        return;
    }
    var endAddress = $("input[id='endAddress']").val();
    if (StringUtils.isEmpty(endAddress)) {
        showWarningAlert("路径规划,目的地不能空!");
        return;
    }
    if (driving == null) {
        driving = new AMap.Driving(drivingOption); //构造驾车导航类
    }
    console.info(startAddress + "---------------------" + endAddress);
    //根据起终点坐标规划驾车路线
    driving.search(
        [
            { keyword: startAddress },
            { keyword: endAddress }
        ],
        function(status, result) {
            console.debug(result);
            if (status === 'complete' && result.info === 'OK') {
                messagePanel.append("<h4>" + result.originName + '--->' + result.destinationName + "</h4>");
                //出发地
                var originAddress = $("#address_template").html();
                messagePanel.append(originAddress.replace("${name}", result.originName).replace("${lng}", result.origin.lng).replace("${lat}", result.origin.lat));
                var marker = new AMap.Marker({
                    map: map,
                    position: [result.origin.lng, result.origin.lat],
                    icon: "http://webapi.amap.com/images/car.png",
                    offset: new AMap.Pixel(-26, -13),
                    autoRotation: true
                });
                // 绘制轨迹
                var polyline = new AMap.Polyline({
                    map: map,
                    path: lineArr,
                    strokeColor: "#00A", //线颜色
                    // strokeOpacity: 1,     //线透明度
                    strokeWeight: 3, //线宽
                    // strokeStyle: "solid"  //线样式
                });
                var passedPolyline = new AMap.Polyline({
                    map: map,
                    // path: lineArr,
                    strokeColor: "#F00", //线颜色
                    // strokeOpacity: 1,     //线透明度
                    strokeWeight: 3, //线宽
                    // strokeStyle: "solid"  //线样式
                });
                marker.on('moving', function(e) {
                    passedPolyline.setPath(e.passedPath);
                });
                map.setFitView();
                var lineArr = [];
                lineArr.push([result.origin.lng, result.origin.lat]); //加入起始位置经纬度
                //目的地
                var destinationAddress = $("#address_template").html();
                messagePanel.append(destinationAddress.replace("${name}", result.destinationName).replace("${lng}", result.destination.lng).replace("${lat}", result.destination.lat));
                //出行路线规划,可能有多条
                var routesArrayLength = result.routes.length;
                for (var i = 0; i < routesArrayLength; i++) {
                    var temp = result.routes[i];
                    messagePanel.append("<strong>距离</strong>" + ":<u>" + meter2Kilo(temp.distance) + "</u><br/>");
                    messagePanel.append("<strong>耗时</strong>" + ":<u>" + (temp.time / 3600).toFixed(2) + "时</u><br/>");
                    messagePanel.append("<strong>驾车规划策略</strong>" + ":" + temp.policy + "<br/>");
                    // messagePanel.append("<blockquote>");
                    // messagePanel.append('详细信息--->' + result.routes[i].steps);
                    messagePanel.append("<strong>收费路段距离</strong>" + ":" + meter2Kilo(temp.tolls_distance) + "<br/>");
                    messagePanel.append("<strong>收费金额</strong>" + ":" + temp.tolls + "元<br/>");
                    messagePanel.append("<strong>限行结果</strong>" + ':' + ((temp.restriction == 0) ? "已规避或未限行" : "限行无法规避") + "<br/>");
                    messagePanel.append("----------<br/>");
                    var stepsLength = temp.steps.length;
                    for (var i = 0; i < stepsLength; i++) {
                        var stepsTemp = temp.steps[i];
                        lineArr.push([stepsTemp.start_location.lng, stepsTemp.start_location.lat])
                        lineArr.push([stepsTemp.end_location.lng, stepsTemp.end_location.lat])
                    }
                    console.info('=======================');
                    console.debug(lineArr);
                    // //千米/小时
                }
                AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function(PathSimplifier, $) {
                    if (!PathSimplifier.supportCanvas) {
                        alert('当前环境不支持 Canvas！');
                        return;
                    }

                    var colors = [
                        "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
                        "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
                        "#651067", "#329262", "#5574a6", "#3b3eac"
                    ];
                    // var pointSimplifierIns = new PointSimplifier({
                    var pathSimplifierIns = new PathSimplifier({
                        zIndex: 100,
                        map: map, //所属的地图实例
                        getPath: function(pathData, pathIndex) {
                            return pathData.path;
                        },
                        getHoverTitle: function(pathData, pathIndex, pointIndex) {
                            if (pointIndex >= 0) {
                                //point 
                                return pathData.name + '，点：' + pointIndex + '/' + pathData.path.length;
                            }
                            return pathData.name + '，点数量' + pathData.path.length;
                        },
                        renderOptions: {
                            pathLineStyle: {
                                dirArrowStyle: true
                            },
                            getPathStyle: function(pathItem, zoom) {
                                var color = colors[pathItem.pathIndex % colors.length],
                                    lineWidth = Math.round(4 * Math.pow(1.1, zoom - 3));
                                return {
                                    pathLineStyle: {
                                        strokeStyle: color,
                                        lineWidth: lineWidth
                                    },
                                    pathLineSelectedStyle: {
                                        lineWidth: lineWidth + 2
                                    },
                                    pathNavigatorStyle: {
                                        fillStyle: color
                                    }
                                };
                            }
                        }
                    });
                    window.pathSimplifierIns = pathSimplifierIns;
                    $('<div id="loadingTip">加载数据，请稍候...</div>').appendTo(document.body);
                    pathSimplifierIns.setData(
                        [{
                            name: '轨迹0',
                            path: lineArr
                        }, {
                            name: '大地线',
                            //创建一条包括500个插值点的大地线
                            path: PathSimplifier.getGeodesicPath([116.405289, 39.904987], [87.61792, 43.793308], 500)
                        }]);
                    $('#loadingTip').remove();

                    //创建一个巡航器
                    //
                    // 0 表示关联第一条轨迹
                    var navg0 = pathSimplifierIns.createPathNavigator(0, {
                        loop: true,
                        speed: 5000,
                        pathNavigatorStyle: {
                            width: 16,
                            height: 32,
                            content: PathSimplifier.Render.Canvas.getImageContent('http://webapi.amap.com/ui/1.0/ui/misc/PathSimplifier/examples/imgs/car.png', function() {
                                pathSimplifierIns.renderLater();
                            }, function(e) {
                                alert('图片加载失败！');
                            }),
                            strokeStyle: null,
                            fillStyle: null
                        }
                    });
                    navg0.start();
                    var navg2 = pathSimplifierIns.createPathNavigator(7, {
                        loop: true,
                        speed: 500000,
                        pathNavigatorStyle: {
                            width: 16,
                            height: 32,
                            content: PathSimplifier.Render.Canvas.getImageContent('http://webapi.amap.com/ui/1.0/ui/misc/PathSimplifier/examples/imgs/plane.png', onload, onerror),
                            strokeStyle: null,
                            fillStyle: null
                        }
                    });
                    navg2.start();


                });
                // marker.moveAlong(lineArr, 2500, function(data) {
                //     // console.info(i++);
                // }, true);
                //渲染路径
                // (new Lib.AMap.DrivingRender()).autoRender({
                //     data: result,
                //     map: map,
                //     // panel: "message"   不指定则不会有渲染出结果
                // });
            } else {
                showErrorAlert(result.info);
            }
        });
});