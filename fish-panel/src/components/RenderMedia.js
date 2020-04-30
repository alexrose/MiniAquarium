import React, {Component} from 'react'
import {Modal, Image} from "react-bootstrap";

class RenderMedia extends Component {

    render() {
        let {show, mediaUrl, handleClose} = this.props;

        return (
            <>
                <Modal show={show} onHide={handleClose} animation={false} aria-labelledby="contained-modal-title-vcenter"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Image src={`${mediaUrl}?t=${Date.now()}`} fluid />
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}

export default RenderMedia;
