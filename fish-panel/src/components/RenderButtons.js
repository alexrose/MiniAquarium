import React  from 'react';
import Button from 'react-bootstrap/Button';
import Lodash from 'lodash';

function RenderButtons(props) {
    let { name, value } = props.data;
    let variant = (name.includes('Off')) ? 'secondary' : 'success';
    let size = "";
    if (props.media) {
        variant = 'outline-secondary';
        size = 'sm';
    }

    return (
        <Button size={size} variant={variant} onClick={() => { props.callOnClick(value) }}>{Lodash.startCase(name)}</Button>
    )
}
export default RenderButtons;