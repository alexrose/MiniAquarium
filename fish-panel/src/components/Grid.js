import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getSettings } from './../actions/actionCreators';
import { bindActionCreators } from 'redux';

import RenderMedia from './RenderMedia';
import RenderButtons from "./RenderButtons";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Navbar from 'react-bootstrap/Navbar';
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import ButtonGroup from "react-bootstrap/ButtonGroup";


class Grid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentMediaUrl: ""
        }

        //this.showAddress = this.showAddress.bind(this);
    }

    componentDidMount() {
        this.props.getSettings()
    }

    callBaby(url) {
        console.log(url);
    }
    // showAddress(id) {
    //     console.log('HIT[5]: click ', id);
    //     let currentUser = this.props.allSettings.filter((item) => {
    //         return item.id === id
    //     });
    //     console.log('HIT[5]: currentUser ', currentUser);
    //
    //     this.setState({
    //         currentUserAddress: currentUser,
    //         currentId: id
    //     })
    // }

    generateButtons(allSettings, type) {
        let typeSettings = allSettings.filter((item) => {
            return item.type === type
        });

        return (
            <Container className="p-1">
                <Row>
                    <Col>
                        <ButtonGroup aria-label={type}>
                            {typeSettings.map((item, index) => <RenderButtons data={item} key={item.name} callBabyOnClick={this.callBaby}/>)}
                        </ButtonGroup>
                    </Col>
                </Row>

            </Container>
        )
    }


    render() {
        let { allSettings } = this.props;

        return (
            <Container fluid>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#">
                        <img alt="" src="/assets/logo512.png" width="30" height="30"
                             className="d-inline-block align-top"/>
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

                <Container className="m-0 p-0">
                    <Row>
                        <Col md={6}>
                            {allSettings.length > 0 ? this.generateButtons(allSettings, 'air') : "Loading"}
                            {allSettings.length > 0 ? this.generateButtons(allSettings, 'filter') : "Loading"}
                            {allSettings.length > 0 ? this.generateButtons(allSettings, 'light') : "Loading"}
                        </Col>
                        <Col md={6}>
                            {this.state.currentMediaUrl ? <RenderMedia url={this.state.currentMediaUrl} /> : ("") }
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
        allSettings: state.settingsData.allSettings
    }
}
const mapDispatchToProps = dispatch => bindActionCreators({ getSettings }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Grid);
