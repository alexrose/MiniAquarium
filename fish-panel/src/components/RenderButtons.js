import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Lodash from 'lodash';
import {airType, filterType, lightType, mediaType, temperatureType} from "../constants";

class RenderButtons extends Component {
    render() {
        let {name, value, type, callOnClick} = this.props;
        let { size, variant } = '';

        switch (type) {
            case mediaType:
            case temperatureType:
                size = 'sm';
                variant = 'outline-secondary';
                break;
            case airType:
            case lightType:
            case filterType:
                size = '';
                variant = (name.includes('Off')) ? 'secondary' : 'success';
                break;
            default:
                size = 'sm';
                variant = 'success';
                break;
        }

        return (
            <Button size={size} variant={variant} onClick={() => {callOnClick(value, type)}}>
                {Lodash.startCase(name)}
            </Button>
        )
    }
}

export default RenderButtons;

