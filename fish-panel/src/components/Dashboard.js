import React, {Component} from 'react'
import {connect} from 'react-redux';
import {setSettingOnOff, getTemperatures} from './../actions/actionCreators';
import {bindActionCreators} from 'redux';

import RenderChart from './RenderChart';
import RenderMedia from './RenderMedia';
import RenderButtons from './RenderButtons';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';

import {airType, filterType, lightType, mediaType, temperatureType, imageUrl, videoUrl} from "../constants";

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mediaUrl: '',
            showModal: false
        };

        this.handleCloseMedia = this.handleCloseMedia.bind(this);
        this.handleButtonCallback = this.handleButtonCallback.bind(this);
    }

    componentDidMount() {
        this.props.getTemperatures();
    }

    callSetting(param) {
        this.props.setSettingOnOff(param);
    }

    callMedia(url) {
        this.setState({
            mediaUrl: url,
            showModal: true
        });
    }

    callTemperature(url, param) {
        let date = '';

        switch (param) {
            case 'prev':
                date = `${this.props.temperatures.dates.prev}`;
                break;
            case 'next':
                date = `${this.props.temperatures.dates.next}`;
                break;
            default:
                date = `${this.props.temperatures.dates.current}`;
        }

        this.props.getTemperatures(date);
    }

    handleButtonCallback(url, type, param) {
        switch (type) {
            case mediaType:
                this.callMedia(url);
                break;
            case airType:
            case lightType:
            case filterType:
                this.callSetting(param);
                break;
            case temperatureType:
                this.callTemperature(url, param);
                break;
            default:
                break;
        }
    }

    handleCloseMedia() {
        this.setState({
            mediaUrl: '',
            showModal: false
        });
    }

    render() {
        let {temperatures} = this.props;
        let {showModal, mediaUrl} = this.state;

        return (
            <Container fluid className='p-0'>
                <Navbar bg='dark' variant='dark'>
                    <Navbar.Brand href='#'>
                        <img alt='' src='assets/android-chrome-192x192.png' width='48' height='48'
                             className='d-inline-block align-middle'/>
                        {' CyboFish Panel '}
                    </Navbar.Brand>
                </Navbar>
                <Breadcrumb>
                    <Container fluid>
                        <Row>
                            <Col xs={6} className='p-0 m-0'>
                                <ButtonGroup className='p-1'>
                                    <RenderButtons name='Image' type={mediaType} value={imageUrl} param='' callOnClick={this.handleButtonCallback} />
                                    <RenderButtons name='Video' type={mediaType} value={videoUrl} param='' callOnClick={this.handleButtonCallback} />
                                </ButtonGroup>
                            </Col>
                            <Col xs={6} className='p-0 m-0 '>
                                <div className='float-right'>
                                    <ButtonGroup>
                                        <RenderButtons name='<' type={temperatureType} value='' param='prev' callOnClick={this.handleButtonCallback} />
                                        <RenderButtons name='>' type={temperatureType} value='' param='next' callOnClick={this.handleButtonCallback} />
                                    </ButtonGroup>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Breadcrumb>

                <Container fluid>
                    <Row>
                        <Col>
                            <Alert variant='warning'>
                                <ButtonGroup className='p-1'>
                                    <RenderButtons name='Air On' type={airType} value='' param='air-on' callOnClick={this.handleButtonCallback} />
                                    <RenderButtons name='Air Off' type={airType} value='' param='air-off' callOnClick={this.handleButtonCallback} />
                                </ButtonGroup>
                                <ButtonGroup className='p-1'>
                                    <RenderButtons name='Filter On' type={airType} value='' param='filter-on' callOnClick={this.handleButtonCallback} />
                                    <RenderButtons name='Filter Off' type={airType} value='' param='filter-off' callOnClick={this.handleButtonCallback} />
                                </ButtonGroup>
                                <ButtonGroup className='p-1'>
                                    <RenderButtons name='Warm Light' type={airType} value='' param='warm-light' callOnClick={this.handleButtonCallback} />
                                    <RenderButtons name='Cold Light' type={airType} value='' param='cold-light' callOnClick={this.handleButtonCallback} />
                                    <RenderButtons name='Party Light' type={airType} value='' param='party-light' callOnClick={this.handleButtonCallback} />
                                    <RenderButtons name='Light Off' type={airType} value='' param='light-off' callOnClick={this.handleButtonCallback} />
                                </ButtonGroup>
                            </Alert>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={6}>
                            <Alert variant='warning'>
                                {temperatures.night ? <RenderChart
                                    data={temperatures.night}
                                    name='Night temperature'
                                    date={temperatures.dates.current}
                                    xKey='time'
                                    yKey='temperature'
                                /> : ('')}
                            </Alert>
                        </Col>
                        <Col lg={6}>
                            <Alert variant='warning'>
                                {temperatures.day ? <RenderChart
                                    data={temperatures.day}
                                    name='Day temperature'
                                    date={temperatures.dates.current}
                                    xKey='time'
                                    yKey='temperature'
                                /> : ('')}
                            </Alert>
                        </Col>
                    </Row>
                </Container>

                <RenderMedia show={showModal} mediaUrl={mediaUrl} handleClose={this.handleCloseMedia}/>
                <ToastContainer autoClose={2000}/>
            </Container>
        )
    }
}

// export default connect()(Dashboard);
const mapStateToProps = (state) => {
    return {
        temperatures: state.temperaturesData.temperatures
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        "setSettingOnOff": setSettingOnOff,
        "getTemperatures": getTemperatures
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
