import { Button, Collapse, Typography } from 'antd'
import React, { useContext } from 'react'
import styled from 'styled-components'
import { PlusSquareOutlined } from '@ant-design/icons'
import { AppContext } from '../../Context/AppProvider'

const { Panel } = Collapse

const PanelStyled = styled(Panel)`
    &&& {
        .ant-collapse-header, p {
            color: white;
        }

        .ant-collapse-content-box {
            padding: 0 40px;
        }

        .add-room {
            color: white;
            padding: 0;
        }
    }
`;

const LinkStyled = styled(Typography.Link)`
    display: block;
    margin-bottom: 5px;
    color: white;
`;

export default function RoomList() {

    const { rooms, setIsAddRoomVisible, setSelectedRoomId } = useContext(AppContext)

    const handleAddRoom = () => {
        setIsAddRoomVisible(true);
    }

    return (
        <Collapse defaultActiveKey={["1"]} ghost>
            <PanelStyled header="List of rooms" key="1">
                {
                    rooms.map(room => <LinkStyled key={room.id} onClick={() => setSelectedRoomId(room.id)}>{room.name}</LinkStyled> )
                }
                <Button type="text" icon={<PlusSquareOutlined />} onClick={handleAddRoom} className="add-room">Add new room</Button>
            </PanelStyled>
        </Collapse>
    )
}
