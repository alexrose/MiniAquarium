import React from 'react'
import Image from "react-bootstrap/Image";

export default function RenderMedia(props) {

    return (
        <Image alt='' src={props.url} rounded fluid />
    )
}
