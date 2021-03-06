import React, { Component } from 'react'
import {NavBar,SearchBar,TextareaItem,Icon, Toast} from 'antd-mobile';
import {scAudioUrl} from '../../request/url';
import "../../css/ShiCi/xsc.css"
// import Peomcon from "./Poemcon"

export default class Learnpoem extends Component {
    constructor() {
        super();
        this.state = {
            littleClass:'',
            shoucangClass: 'icon-xingxing black',
            poemname: "",
            author: "",
            line: "",
            translation: "",
            makeground: "",
            audio:"",
            num: 1,
            max: 1
        }
    }
    componentDidMount() {
        this.getTi();
    }
    getTi = () => {
        Toast.loading('正在加载...', 10, () => {
            Toast.offline('网络异常', 1, null, false);
        });
        this.$api.get_xueshici({grade: this.$store.getState().users.grade || 1, index: this.state.num - 1}).then(res => {
            Toast.hide();
            let line = '';
            res.data.data.main.content.forEach(v => {
                line += v;
            });
            if (res.data.data.main.content[0].length === 6) {
                this.setState({
                    littleClass:"littleline"
                })
            } else {
                this.setState({
                    littleClass:""
                })
            }
            this.setState({
                poemname: res.data.data.main.name,
                author: res.data.data.main.author,
                line: line,
                translation: res.data.data.main.translation,
                makeground: res.data.data.main.background,
                max: res.data.data.num,
                audio: scAudioUrl + res.data.data.main.audio
            });
        });
    }
    shoucang = () => {
        if (this.state.shoucangClass == "icon-xingxing black") {
            this.setState({
                shoucangClass: "icon-xingxing1 yello"
            })
        } else {
            this.setState({
                shoucangClass: "icon-xingxing black"
            })
        }
    }
    minus = () => {
        if (this.state.num > 1) {
            this.setState({
                num: this.state.num - 1
            }, () => {this.getTi()})
        }
    }
    adds = () => {
        if (this.state.num < this.state.max) {
            this.setState({
                num: this.state.num + 1
            }, () => {this.getTi()})
        }
    }
    play = () => {
        if (this.au.paused) {
            this.au.play();
        } else {
            this.au.pause();
        }
    }
    render() {
        return (
            <div>
                <audio src={this.state.audio} preload="auto" ref={child => this.au = child}></audio>
                <NavBar icon={<Icon type="left" onClick={()=>{this.props.history.push('/home/shici')}}/>} style={{backgroundColor:"#617ca6"}}>学 诗 词</NavBar>
                
                <div className="learnpeombody"> 
                    
                    <div className="learnpeomcon">
                        {/* <SearchBar
                            placeholder="查找"
                            onSubmit={value => console.log(value, 'onSubmit')}
                            onClear={value => console.log(value, 'onClear')}
                            onFocus={() => console.log('onFocus')}
                            onBlur={() => console.log('onBlur')}
                            onCancel={() => console.log('onCancel')}
                            onChange={this.onChange}
                            style={{height:"2rem"}}
                        /> */}
                    <div>
                    <div className='sm-box'>
                        <div className='sm-textBox'>
                            第 <span>{this.state.num}</span><span> / </span><span>{this.state.max}</span> 个
                        </div>
                    </div>
                    <div onClick={this.shoucang} className={"iconfont " + this.state.shoucangClass}></div>
                    {/* <div><img className="learnimg" src={require("../../../images/learnbackground.jpg") }/></div> */}
                    <div className="poemcon">
                        <div className="poems">
                            <div className={this.state.littleClass}>
                                <p style={{marginBottom:10}}>《{this.state.poemname}》</p>
                                <p>
                                    {/* <span>{this.state.time}</span>
                                    <span>·</span> */}
                                    <span>{this.state.author}</span>
                                </p>
                                <p style={{marginTop:7}}>{this.state.line}</p>
                                <div className="iconfont icon-laba1 poemlaba" onClick={this.play}></div>
                            </div>
                            
                        </div>
                        <div className="poemothers">
                            {"白话翻译:"+this.state.translation+"\n"+"创作背景:"+this.state.makeground}
                        </div>
                    </div>
                </div>
                </div>
               
                   <div className="idiomsleft" onClick={this.minus}><i className="iconfont icon-ico_leftarrow"></i></div>
                   <div className="idiomsright" onClick={this.adds}><i className="iconfont icon-ico_leftarrow"></i></div>
               
            </div>
            </div>
        )
    }
}
