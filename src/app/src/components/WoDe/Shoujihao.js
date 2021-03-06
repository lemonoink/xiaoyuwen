import React, { Component } from 'react';
import { NavBar,Icon, InputItem, Button,Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import { setPhone } from '../../redux/actions'

const data = [];
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
    moneyKeyboardWrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}

class Shoujihao extends Component {
    constructor() {
        super();
        this.state = {
            files: data,
            multiple: false,
            type: 'tel',
            verityText: '获取验证码',
            verityDiv: 'verity-div',
            veriToken: '',
            time: '',
            phone: '',
            verity: ''
        }
    }
    changePhone = (e) => {
        var reg = /^[0-9]*$/;
        if (reg.test(e.target.value) && e.target.value.length <= 11) {
            this.setState({
                phone: e.target.value
            })
        }
    }
    changeVerity = (e) => {
        this.setState({
            verity: e.target.value
        })
    }
    verity = () => {
        let oldPhone = this.$store.getState().users.phone;
        if (this.state.phone.length === 11) {
            if (this.state.phone == oldPhone) {
                Toast.info('手机号和旧手机号相同', 1, null, false);
            } else {
                this.setState({
                    verityDiv: 'verity-div1',
                    verityText: '正在获取...'
                })
                this.$api.set_phone_veri({'phone': this.state.phone}).then(res => {
                    // console.log(res);
                    if (res.data.status === 0) {
                        let verityNum = 60;
                        let time = setInterval(() => {
                            verityNum--;
                            this.setState({
                                verityText: verityNum + 's后重新获取'
                            })
                            if (verityNum <= 0) {
                                clearInterval(this.state.time);
                                this.setState({
                                    verityDiv: 'verity-div',
                                    verityText: '重新获取',
                                })
                            }
                        }, 1000);
                        this.setState({
                            veriToken: res.data.data.veriToken,
                            verityDiv: 'verity-div1',
                            time: time,
                            verityText: verityNum + 's后重新获取'
                        })
                    } else {
                        if (res.data.status === 1024 || res.data.status === 1023) {
                            Toast.fail('验证码获取次数过多，请稍后再试', 1, null, false);
                        } else {
                            Toast.fail('验证码获取失败', 1, null, false);
                        }
                        this.setState({
                            verityDiv: 'verity-div',
                            verityText: '重新获取'
                        })
                    }
                }, () => {
                    this.setState({
                        verityDiv: 'verity-div',
                        verityText: '重新获取'
                    })
                });
            }
        } else {
            Toast.info('请输入正确的手机号', 1, null, false);
        }
    }
    ok = () => {
        let oldPhone = this.$store.getState().users.phone;
        if (this.state.phone.length !== 11) {
            Toast.info('请输入正确的手机号', 1, null, false);
        } else if (this.state.phone == oldPhone) {
            Toast.info('手机号和旧手机号相同', 1, null, false);
        } else if (this.state.veriToken === '') {
            Toast.info('请先获取验证码', 1, null, false);
        } else if (this.state.verity === '') {
            Toast.info('请输入验证码', 1, null, false);
        } else {
            Toast.loading('正在修改...', 10, () => {
                Toast.offline('网络异常', 1, null, false);
            });
            let formData = {
                phone: this.state.phone,
                verification: this.state.verity,
                veriToken: this.state.veriToken
            }
            this.$api.set_phone(formData).then(res => {
                // console.log(res);
                Toast.hide();
                if (res.data.status === 0) {
                    Toast.success('修改成功', 1, null, false);
                    this.$store.dispatch(setPhone(this.state.phone));
                    this.props.history.push('/home/wode');
                } else if (res.data.status === -3) {
                    Toast.fail('该手机号已被注册', 1, null, false);
                } else if (res.data.status === -2) {
                    Toast.fail('验证码错误', 1, null, false);
                } else {
                    Toast.fail('服务器错误', 1, null, false);
                }
            })
        }
    }
    componentWillUnmount() {
        clearInterval(this.state.time);
    }

    // TODO: 功能未完善

    render() {
        return (
            <div>
                <div className="wode_back"></div>
                <NavBar mode="dark" icon={<Icon type="left" onClick={()=>{this.props.history.push('/wode/info/zhanghao')}}/>} style={{background:'#617ca6',color:'#fff'}}>修 改 手 机 号</NavBar>
                <div className="logininput">
                    <input type="text" placeholder="请输入手机号" value={this.state.phone} onChange={this.changePhone}/>
                    <div className="verity">
                        <input type="text" placeholder="请输入验证码" value={this.state.verity} onChange={this.changeVerity}/>
                        <button className={this.state.verityDiv} onClick={this.verity}>{this.state.verityText}</button>
                    </div>
                </div>
                <Button 
                    style={{width:'60%',height:'20%',background:'#617ca6',color:'#fff',margin:'0 auto',marginTop:'7%'}}
                    activeStyle={{background:'grey'}}
                    onClick={this.ok}
                >确认</Button>
            </div>
        )
    }
}

export default createForm()(Shoujihao);
