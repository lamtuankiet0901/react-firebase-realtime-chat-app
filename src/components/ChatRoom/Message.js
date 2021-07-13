import { Avatar, Typography } from 'antd'
import { formatRelative } from 'date-fns';
import React from 'react'
import styled from 'styled-components'

const WrapperStyped = styled.div`
    margin-bottom: 10px;

    .auth {
        margin-left: 5px;
        font-weight: bold;
    }

    .date {
        margin-left: 10px;
        font-size: 11px;
        color: #a7a7a7;
    }

    .content {
        margin-left: 29px;
    }
`;

function formatDate(seconds) {
    let formattedDate = '';

    if (seconds) {
        formattedDate = formatRelative(new Date(seconds * 1000), new Date());

        formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
    }

    return formattedDate;
}

export default function Message({ text, displayName, createdAt, photoURL }) {
    return (
        <WrapperStyped>
            <div>
                <Avatar size="small" src={photoURL}>{photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}</Avatar>
                <Typography.Text className="auth">{displayName}</Typography.Text>
                <Typography.Text className="date">{formatDate(createdAt?.seconds)}</Typography.Text>
            </div>
            <div>
            <Typography.Text className="content">{text}</Typography.Text>
            </div>
        </WrapperStyped>
    )
}