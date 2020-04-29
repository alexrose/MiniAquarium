import React from 'react'
import Image from "react-bootstrap/Image";

export default function RenderMedia(url) {
    return (
        <Image src={url} rounded fluid />
    )
}
