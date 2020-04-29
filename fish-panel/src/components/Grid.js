import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getSettings, getTemperatures } from './../actions/actionCreators';
import { bindActionCreators } from 'redux';

import RenderButtons from "./RenderButtons";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Navbar from 'react-bootstrap/Navbar';
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Alert from "react-bootstrap/Alert";
import RenderChart from "./RenderChart";


class Grid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mediaUrl: ""
        }

        this.updateMediaUrl = this.updateMediaUrl.bind(this);
    }

    componentDidMount() {
        this.props.getSettings();
        this.props.getTemperatures();
    }

    updateMediaUrl(url) {
        this.setState({
            mediaUrl: url
        });
    }

    callBaby(url) {
        console.log(url);
    }

    generateButtons(allSettings, type, local) {
        let typeSettings = allSettings.filter((item) => {
            return item.type === type
        });

        return (
            <ButtonGroup aria-label={type} className="p-1">
                {typeSettings.map((item, index) => <RenderButtons
                    data={item}
                    key={item.name}
                    local={local}
                    callOnClick={this.callBaby}
                />)}
            </ButtonGroup>
        )
    }

    render() {
        let { allSettings } = this.props;
        let { temperatures } = this.props;

        return (
            <Container fluid>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#">
                        <img alt='' src="/assets/logo512.png" width="30" height="30" className="d-inline-block align-top"/>
                        {' CyboFish Panel '}
                    </Navbar.Brand>
                </Navbar>
                <Breadcrumb>
                    <Container fluid>
                        <Row>
                            <Col xs={6} className="p-0 m-0">
                                <ButtonGroup>
                                    <Button variant="outline-secondary" size="sm">Image</Button>
                                    <Button variant="outline-secondary" size="sm">Video</Button>
                                </ButtonGroup>
                            </Col>
                            <Col xs={6} className="p-0 m-0">
                                <ButtonGroup className="float-right">
                                    <Button variant="outline-secondary" size="sm"> &lt; </Button>
                                    <Button variant="outline-secondary" size="sm"> &gt; </Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </Container>
                </Breadcrumb>

                <Container fluid className="m-0 p-0">
                    <Row>
                        <Col>
                            <Alert variant="warning">
                                {allSettings.length > 0 ? this.generateButtons(allSettings, 'air', false) : "Loading"}
                                {allSettings.length > 0 ? this.generateButtons(allSettings, 'filter', false) : "Loading"}
                                {allSettings.length > 0 ? this.generateButtons(allSettings, 'light', false) : "Loading"}
                            </Alert>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={6}>
                            <Alert variant="warning">
                                {temperatures.night ? <RenderChart data={temperatures} time="night" /> : ("")}
                            </Alert>
                        </Col>

                        <Col lg={6}>
                            <Alert variant="warning">
                                {temperatures.day ? <RenderChart data={temperatures} time="day" /> : ("")}
                            </Alert>
                        </Col>
                    </Row>
                </Container>
            </Container>

        )
    }
}

// export default connect()(Grid);
const mapStateToProps = (state) => {
    return {
        allSettings: state.settingsData.allSettings,
        temperatures: state.temperaturesData.temperatures
    }
}
const mapDispatchToProps = dispatch => bindActionCreators({ getSettings, getTemperatures }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Grid);
