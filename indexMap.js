import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import $ from 'jquery';
import echarts from 'echarts';
import axios from 'axios';

class IndexMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mapMax: 1,
            mapMin: 0,
            measure: '',
            mapData: [],
            timer: null,
            getNewTime: 1000 * 10 // 1分钟
        }
        this.getFormatDate = this.getFormatDate.bind(this);
    }
    componentDidMount() {
        this.initMap(); // 地图
        this.mapData(); // 数据
        const that = this;
        this.state.timer = setInterval(function () {
            that.mapData(); // 数据
        }, this.state.getNewTime);// 两个小时
    }
    getFormatDate(timeDate) { // 获取时间
        var minutes = parseInt("1");

        var interTimes = minutes * 60 * 1000;

        var interTimes = parseInt(interTimes);

        timeDate = new Date(Date.parse(timeDate) - interTimes);

        var year = timeDate.getFullYear();       // 年
        var month = timeDate.getMonth() + 1;     // 月
        var day = timeDate.getDate();            // 日
        var hh = timeDate.getHours();            // 时
        var mm = timeDate.getMinutes();          // 分
        var clock = year + "-";
        if (month < 10) clock += "0";
        clock += month + "-";
        if (day < 10) clock += "0";
        clock += day + "_";
        if (hh < 10) clock += "0";
        clock += hh + ":";
        if (mm < 10) clock += '0';
        clock += mm;
        return (clock);
    }
    initMap() {
        //引入北京地图
        $.get('beijing.json', (beijingJson) => {
            echarts.registerMap('beijing', beijingJson);
        });
        window.addEventListener("resize", () => {
        });
    }
    mapData() {
        axios.get('/performance/getRegionalView2', {
            params: {
                timeId: 1,
                timeStart: String(this.getFormatDate(new Date(new Date().getTime() - 2 * 60 * 60 * 1000))),
                timeEnd: String(this.getFormatDate(new Date()))
            }
        }).then(res => {
            let data = res.data;
            this.setState({
                CityDetails: data.CityDetails,  // 区域点
                UrbanArea: data.UrbanArea,  //
                mapMax: String(data.max[0].value), // 图例最大值
                mapMin: data.min ? data.min[0].value : this.state.mapMin, // 图例最小值
                maxMeasure: String(data.max[0].measure),
                minMeasure: data.min ? String(data.min[0].measure) : '',
                mapData: res.data
            })
        })
    }
    componentWillUnmount() {
        clearInterval(this.state.timer);
    }
    render() {
        const { flag } = this.props;
        return (
            <div className={flag ? 'indexMap' : 'fullMap'}>
                <ReactEcharts
                    option={
                        {
                            title: {
                                text: "地理区域流量图",
                                left: 20,
                                top: 20,
                                textStyle: {
                                    color: '#fff',
                                    fontSize: '22',
                                    fontWeight: 'normal'
                                }
                            },
                            tooltip: {
                                padding: 0,
                                enterable: true,
                                transitionDuration: 1,
                                textStyle: {
                                    color: '#000',
                                    decoration: 'none',
                                },
                                formatter: (params) => {
                                    let nodeName = '';
                                    let nodeRatio = '';
                                    let nodeTraffic = '';
                                    let nodeMaxValue = '';
                                    let nodeStr = '';
                                    let len = '';
                                    var bgStyle = 'width: 20px;height:20px;display: inline-block;margin-right:10px;';
                                    if (params.dataIndex >= 0) {
                                        if (this.state.mapData.CityDetails[params.dataIndex]) {
                                            nodeName = this.state.mapData.CityDetails[params.dataIndex].nodeValue;
                                            nodeRatio = this.state.mapData.CityDetails[params.dataIndex].nodeValue;
                                            nodeTraffic = this.state.mapData.CityDetails[params.dataIndex].nodeValue;
                                            nodeMaxValue = this.state.mapData.CityDetails[params.dataIndex].value;
                                            nodeStr = this.state.mapData.CityDetails[params.dataIndex].str;

                                            if (this.state.mapData.CityDetails[params.dataIndex].nodeValue ? this.state.mapData.CityDetails[params.dataIndex].nodeValue.length === 1 : false) {
                                                if (nodeRatio[0].nodeRatio > 0 && nodeRatio[0].nodeRatio < this.state.mapMin) {
                                                    bgStyle += 'background: #6A85FF;'
                                                } else if (nodeRatio[0].nodeRatio > this.state.mapMin && nodeRatio[0].nodeRatio <= 50) {
                                                    bgStyle += 'background: #4D6BFF;'
                                                } else if (nodeRatio[0].nodeRatio > 50 && nodeRatio[0].nodeRatio < 100) {
                                                    bgStyle += 'background: #284EFF;'
                                                } else if (nodeRatio[0].nodeRatio === 100) {
                                                    bgStyle += 'background: #0B35FF;'
                                                }
                                                len = `
                                            <ul style="padding-left:70px;padding-top:10px">
                                                <li style="line-height: 20px">
                                                    <span style="${bgStyle}"></span><span style="padding-top: -4px">
                                                        ${nodeRatio[0].nodeRatio}% ${nodeTraffic[0].nodeTraffic} ${nodeName[0].nodeName}
                                                    </span>
                                                </li>
                                            </ul>
                                            `
                                            } else if (this.state.mapData.CityDetails[params.dataIndex].nodeValue ? this.state.mapData.CityDetails[params.dataIndex].nodeValue.length === 2 : false) {
                                                if (nodeRatio[0].nodeRatio > 0 && nodeRatio[0].nodeRatio < this.state.mapMin) {
                                                    bgStyle += 'background: #6A85FF;'
                                                } else if (nodeRatio[0].nodeRatio > this.state.mapMin && nodeRatio[0].nodeRatio <= 50) {
                                                    bgStyle += 'background: #4D6BFF;'
                                                } else if (nodeRatio[0].nodeRatio > 50 && nodeRatio[0].nodeRatio < 100) {
                                                    bgStyle += 'background: #284EFF;'
                                                } else if (nodeRatio[0].nodeRatio === 100) {
                                                    bgStyle += 'background: #0B35FF;'
                                                } else if (nodeRatio[1].nodeRatio > 0 && nodeRatio[1].nodeRatio < this.state.mapMin) {
                                                    bgStyle += 'background: #6A85FF;'
                                                } else if (nodeRatio[1].nodeRatio > this.state.mapMin && nodeRatio[1].nodeRatio <= 50) {
                                                    bgStyle += 'background: #4D6BFF;'
                                                } else if (nodeRatio[1].nodeRatio > 50 && nodeRatio[1].nodeRatio < 100) {
                                                    bgStyle += 'background: #284EFF;'
                                                } else if (nodeRatio[1].nodeRatio === 100) {
                                                    bgStyle += 'background: #0B35FF;'
                                                }
                                                len = `
                                            <ul style="padding-left:70px;padding-top:10px">
                                                <li style="line-height: 20px">
                                                    <span style="${bgStyle}"></span><span style="padding-top: -4px">
                                                        ${nodeRatio[0].nodeRatio}% ${nodeTraffic[0].nodeTraffic} ${nodeName[0].nodeName}
                                                    </span>
                                                </li>
                                                <li style="line-height: 20px">
                                                    <span style="${bgStyle}"></span><span style="padding-top: -4px">
                                                        ${nodeRatio[1].nodeRatio}% ${nodeTraffic[1].nodeTraffic} ${nodeName[1].nodeName}
                                                    </span>
                                                </li>
                                            </ul>
                                            `
                                            } else if (this.state.mapData.CityDetails[params.dataIndex].nodeValue ? this.state.mapData.CityDetails[params.dataIndex].nodeValue.length === 3 : false) {
                                                if (nodeRatio[0].nodeRatio > 0 && nodeRatio[0].nodeRatio < this.state.mapMin) {
                                                    bgStyle += 'background: #6A85FF;'
                                                } else if (nodeRatio[0].nodeRatio > this.state.mapMin && nodeRatio[0].nodeRatio <= 50) {
                                                    bgStyle += 'background: #4D6BFF;'
                                                } else if (nodeRatio[0].nodeRatio > 50 && nodeRatio[0].nodeRatio < 100) {
                                                    bgStyle += 'background: #284EFF;'
                                                } else if (nodeRatio[0].nodeRatio === 100) {
                                                    bgStyle += 'background: #0B35FF;'
                                                } else if (nodeRatio[1].nodeRatio > 0 && nodeRatio[1].nodeRatio < this.state.mapMin) {
                                                    bgStyle += 'background: #6A85FF;'
                                                } else if (nodeRatio[1].nodeRatio > this.state.mapMin && nodeRatio[1].nodeRatio <= 50) {
                                                    bgStyle += 'background: #4D6BFF;'
                                                } else if (nodeRatio[1].nodeRatio > 50 && nodeRatio[1].nodeRatio < 100) {
                                                    bgStyle += 'background: #284EFF;'
                                                } else if (nodeRatio[1].nodeRatio === 100) {
                                                    bgStyle += 'background: #0B35FF;'
                                                } else if (nodeRatio[2].nodeRatio > 0 && nodeRatio[2].nodeRatio < this.state.mapMin) {
                                                    bgStyle += 'background: #6A85FF;'
                                                } else if (nodeRatio[2].nodeRatio > this.state.mapMin && nodeRatio[2].nodeRatio <= 50) {
                                                    bgStyle += 'background: #4D6BFF;'
                                                } else if (nodeRatio[2].nodeRatio > 50 && nodeRatio[2].nodeRatio < 100) {
                                                    bgStyle += 'background: #284EFF;'
                                                } else if (nodeRatio[2].nodeRatio === 100) {
                                                    bgStyle += 'background: #0B35FF;'
                                                }
                                                len = `
                                            <ul style="padding-left:70px;padding-top:10px">
                                                <li style="line-height: 20px">
                                                    <span style="${bgStyle}"></span><span style="padding-top: -4px">
                                                        ${nodeRatio[0].nodeRatio}% ${nodeTraffic[0].nodeTraffic} ${nodeName[0].nodeName}
                                                    </span>
                                                </li>
                                                <li style="line-height: 20px">
                                                    <span style="${bgStyle}"></span><span style="padding-top: -4px">
                                                        ${nodeRatio[1].nodeRatio}% ${nodeTraffic[1].nodeTraffic} ${nodeName[1].nodeName}
                                                    </span>
                                                </li>
                                                <li style="line-height: 20px">
                                                    <span style="${bgStyle}"></span><span style="padding-top: -4px">
                                                        ${nodeRatio[2].nodeRatio}% ${nodeTraffic[2].nodeTraffic} ${nodeName[2].nodeName}
                                                    </span>
                                                </li>
                                            </ul>
                                            `
                                            } else if (this.state.mapData.CityDetails[params.dataIndex].nodeValue ? this.state.mapData.CityDetails[params.dataIndex].nodeValue.length === 4 : false) {
                                                if (nodeRatio[0].nodeRatio > 0 && nodeRatio[0].nodeRatio < this.state.mapMin) {
                                                    bgStyle += 'background: #6A85FF;'
                                                } else if (nodeRatio[0].nodeRatio > this.state.mapMin && nodeRatio[0].nodeRatio <= 50) {
                                                    bgStyle += 'background: #4D6BFF;'
                                                } else if (nodeRatio[0].nodeRatio > 50 && nodeRatio[0].nodeRatio < 100) {
                                                    bgStyle += 'background: #284EFF;'
                                                } else if (nodeRatio[0].nodeRatio === 100) {
                                                    bgStyle += 'background: #0B35FF;'
                                                } else if (nodeRatio[1].nodeRatio > 0 && nodeRatio[1].nodeRatio < this.state.mapMin) {
                                                    bgStyle += 'background: #6A85FF;'
                                                } else if (nodeRatio[1].nodeRatio > this.state.mapMin && nodeRatio[1].nodeRatio <= 50) {
                                                    bgStyle += 'background: #4D6BFF;'
                                                } else if (nodeRatio[1].nodeRatio > 50 && nodeRatio[1].nodeRatio < 100) {
                                                    bgStyle += 'background: #284EFF;'
                                                } else if (nodeRatio[1].nodeRatio === 100) {
                                                    bgStyle += 'background: #0B35FF;'
                                                } else if (nodeRatio[2].nodeRatio > 0 && nodeRatio[2].nodeRatio < this.state.mapMin) {
                                                    bgStyle += 'background: #6A85FF;'
                                                } else if (nodeRatio[2].nodeRatio > this.state.mapMin && nodeRatio[2].nodeRatio <= 50) {
                                                    bgStyle += 'background: #4D6BFF;'
                                                } else if (nodeRatio[2].nodeRatio > 50 && nodeRatio[2].nodeRatio < 100) {
                                                    bgStyle += 'background: #284EFF;'
                                                } else if (nodeRatio[2].nodeRatio === 100) {
                                                    bgStyle += 'background: #0B35FF;'
                                                } else if (nodeRatio[3].nodeRatio > 0 && nodeRatio[3].nodeRatio < this.state.mapMin) {
                                                    bgStyle += 'background: #6A85FF;'
                                                } else if (nodeRatio[3].nodeRatio > this.state.mapMin && nodeRatio[3].nodeRatio <= 50) {
                                                    bgStyle += 'background: #4D6BFF;'
                                                } else if (nodeRatio[3].nodeRatio > 50 && nodeRatio[3].nodeRatio < 100) {
                                                    bgStyle += 'background: #284EFF;'
                                                } else if (nodeRatio[3].nodeRatio === 100) {
                                                    bgStyle += 'background: #0B35FF;'
                                                }
                                                len = `
                                            <ul style="padding-left:70px;padding-top:10px">
                                                <li style="line-height: 20px">
                                                    <span style="${bgStyle}"></span><span style="padding-top: -4px">
                                                        ${nodeRatio[0].nodeRatio}% ${nodeTraffic[0].nodeTraffic} ${nodeName[0].nodeName}
                                                    </span>
                                                </li>
                                                <li style="line-height: 20px">
                                                    <span style="${bgStyle}"></span><span style="padding-top: -4px">
                                                        ${nodeRatio[1].nodeRatio}% ${nodeTraffic[1].nodeTraffic} ${nodeName[1].nodeName}
                                                    </span>
                                                </li>
                                                <li style="line-height: 20px">
                                                    <span style="${bgStyle}"></span><span style="padding-top: -4px">
                                                        ${nodeRatio[2].nodeRatio}% ${nodeTraffic[2].nodeTraffic} ${nodeName[2].nodeName}
                                                    </span>
                                                </li>
                                                <li style="line-height: 20px">
                                                    <span style="${bgStyle}"></span><span style="padding-top: -4px">
                                                        ${nodeRatio[3].nodeRatio}% ${nodeTraffic[3].nodeTraffic} ${nodeName[3].nodeName}
                                                    </span>
                                                </li>
                                            </ul>
                                            `
                                            }

                                        }
                                    }
                                    if (!params.name) {
                                        return
                                    } else if (params.data.name !== undefined) {
                                        var res =
                                            `
                                            <div style="height:190px;width:auto;border-radius:5px;background:#fff;box-shadow:0 0 10px 5px #aaa;font-size: 12px">
                                                <div style="height:110px;width:100%;border-radius:5px;background:#fff">
                                                    <div style="padding-top:10px">
                                                        <span style="line-height:30px;margin-left:20px;margin-right: 10px">${params.data.name}</span>
                                                        <span>时间段:${params.data.time}&nbsp;&nbsp;&nbsp;</span>
                                                    </div>
                                                    <div style="padding-top:10px;margin-left:20px;">
                                                        <span>总流量：${nodeMaxValue}${nodeStr}</span>
                                                    </div>
                                                    ${len}
                                                </div>
                                            </div>
                                            `
                                            ;
                                        return res;
                                    }
                                }
                            },
                            visualMap: {
                                show: true,
                                min: this.state.mapMin,
                                max: this.state.mapMax,
                                left: '80px',
                                bottom: '50px',
                                text: ['高 ' + this.state.maxMeasure, '低' + this.state.minMeasure], // 文本，默认为数值文本
                                textStyle: {
                                    color: '#fff'
                                },
                                calculable: true,
                                seriesIndex: [1],
                                inRange: {
                                    color: ['#6A85FF', '#4D6BFF', '#284EFF', '#0B35FF'] // 蓝
                                }
                            },
                            geo: {
                                show: true,
                                map: 'beijing',
                                label: {
                                    normal: {
                                        show: false
                                    },
                                    emphasis: {
                                        show: false,
                                    }
                                },
                                roam: true,
                                itemStyle: {
                                    normal: {
                                        areaColor: '#AEBCFF',
                                        borderColor: '#3B5077',
                                    },
                                    emphasis: {
                                        areaColor: '#2B91B7',
                                    }
                                }
                            },
                            series: [
                                {
                                    name: '散点',
                                    type: 'map',
                                    coordinateSystem: 'geo',
                                    data: this.state.UrbanArea,
                                    label: {
                                        normal: {
                                            formatter: '{b}',
                                            position: 'right',
                                            show: true
                                        },
                                        emphasis: {
                                            show: false
                                        }
                                    },
                                    itemStyle: {
                                        normal: {
                                            color: '#05C3F9'
                                        }
                                    }
                                },
                                {
                                    type: 'map',
                                    map: 'beijing',
                                    geoIndex: 0,
                                    aspectScale: 0.75, //长宽比
                                    showLegendSymbol: false, // 存在legend时显示
                                    label: {
                                        normal: {
                                            show: true
                                        },
                                        emphasis: {
                                            show: false,
                                            textStyle: {
                                                color: '#fff'
                                            }
                                        }
                                    },
                                    roam: true,
                                    itemStyle: {
                                        normal: {
                                            areaColor: '#031525',
                                            borderColor: '#3B5077',
                                        },
                                        emphasis: {
                                            areaColor: '#2B91B7'
                                        }
                                    },
                                    animation: false,
                                    data: this.state.CityDetails
                                }
                            ]
                        }
                    }
                />
            </div>

        );
    }
}

export default IndexMap;