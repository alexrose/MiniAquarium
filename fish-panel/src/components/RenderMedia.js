import React, {Component} from 'react'
import {Modal, Image} from "react-bootstrap";

class RenderMedia extends Component {

    render() {
        let {show, mediaUrl, handleClose} = this.props;

        return (
            <>
                <Modal show={show} onHide={handleClose} animation={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Image src={`${mediaUrl}?t=${Date.now()}`}/>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}

export default RenderMedia;
