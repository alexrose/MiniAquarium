import React, {Component} from 'react'
import {connect} from 'react-redux';
import {getSettings, getSettingOnOff, getTemperatures} from './../actions/actionCreators';
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

import {airType, filterType, lightType, mediaType, temperatureType} from "../constants";

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
        this.props.getSettings();
    }

    callSetting(url) {
        this.props.getSettingOnOff(url);
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
        switch(type) {
            case mediaType:
                this.callMedia(url);
                break;
            case airType:
            case lightType:
            case filterType:
                this.callSetting(url);
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

    generateButtons(allSettings, type, name, param) {
        let typeSettings = allSettings.filter((item) => {
            return item.type === type
        });

        return (
            <>
                {typeSettings.map((item) => <RenderButtons
                    key={item.name}
                    name={name ? name : item.name}
                    type={item.type}
                    value={item.value}
                    param={param}
                    callOnClick={this.handleButtonCallback}
                />)}
            </>
        )
    }

    render() {
        let {allSettings, temperatures} = this.props;
        let {showModal, mediaUrl} = this.state;

        return (
            <Container fluid>
                <Navbar bg='dark' variant='dark'>
                    <Navbar.Brand href='#'>
                        <img alt='' src='assets/android-chrome-192x192.png' width='48' height='48'
                             className='d-inline-block align-middle' />
                        {' CyboFish Panel '}
                    </Navbar.Brand>
                </Navbar>
                <Breadcrumb>
                    <Container fluid>
                        <Row>
                            <Col xs={6} className='p-0 m-0'>
                                <ButtonGroup className='p-1'>
                                    {allSettings.length > 0 ? this.generateButtons(allSettings, mediaType) : '...'}
                                </ButtonGroup>
                            </Col>
                            <Col xs={6} className='p-0 m-0 '>
                                <div className='float-right'>
                                    <ButtonGroup>
                                        {allSettings.length > 0 ? this.generateButtons(allSettings, temperatureType, '<', 'prev') : '...'}
                                        {allSettings.length > 0 ? this.generateButtons(allSettings, temperatureType, '>', 'next') : '...'}
                                    </ButtonGroup>
                                </div>

                            </Col>
                        </Row>
                    </Container>
                </Breadcrumb>

                <Container fluid className='m-0 p-0'>
                    <Row>
                        <Col>
                            <Alert variant='warning'>
                                <ButtonGroup className='p-1'>
                                    {allSettings.length > 0 ? this.generateButtons(allSettings, airType) : '...'}
                                </ButtonGroup>
                                <ButtonGroup className='p-1'>
                                    {allSettings.length > 0 ? this.generateButtons(allSettings, filterType) : '...'}
                                </ButtonGroup>
                                <ButtonGroup className='p-1'>
                                    {allSettings.length > 0 ? this.generateButtons(allSettings, lightType) : '...'}
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
        allSettings: state.settingsData.allSettings,
        temperatures: state.temperaturesData.temperatures,
        settingStatus: state.settingsData.settingStatus
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({getSettings, getSettingOnOff, getTemperatures}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
