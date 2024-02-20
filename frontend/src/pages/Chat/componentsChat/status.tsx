import React from 'react'
import { TbPointFilled } from "react-icons/tb";

export default function Status(props: any) {
    if (props.status == "online") {
        return (

            <TbPointFilled size="30" style={{ position: 'absolute', bottom: '0px', top: '20px', left: '20px', color: "#48bb78" }} />
        )
    }
    if (props.status == "offline") {
       return( <TbPointFilled size="30" style={{ position: 'absolute', bottom: '0px', top: '20px', left: '20px', color: "#f56565" }} />)
    }
    if (props.status == "in game") {
       return( <TbPointFilled size="30" style={{ position: 'absolute', bottom: '0px', top: '20px', left: '20px', color: "#ed8936" }} />)
    }

}