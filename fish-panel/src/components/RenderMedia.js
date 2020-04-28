import React from 'react'
import Image from "react-bootstrap/Image";

export default function UserAddress({ url }) {
    return (
        <Image src={url} rounded fluid />
    )
}
