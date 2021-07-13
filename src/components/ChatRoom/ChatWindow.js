import { UserAddOutlined } from '@ant-design/icons';
import { Avatar, Button, Tooltip, Form, Input, Alert } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { AppContext } from '../../Context/AppProvider';
import { AuthContext } from '../../Context/AuthProvider';
import { addDocument } from '../../firebase/services';
import useFireStore from '../../hooks/useFireStore';
import Message from './Message';

const HeaderStyled = styled.div`
    display: flex;
    justify-content: space-between;
    height: 56px;
    padding: 0 20px;
    align-items: center;
    border-bottom: 1px solid rgb(230, 230, 230);

    .header {
        &__info {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        &__title {
            margin: 0;
            font-weight: bold;
        }

        &__description {
            font-size: 12px;
        }
    }
`;

const ButtonGroupStyled = styled.div`
    display: flex;
    align-items: center;
`;

const WrapperStyled = styled.div`
    height: 100vh;
`;

const ContentStyled = styled.div`
    height: calc(100% - 56px);
    display: flex;
    flex-direction: column;
    padding: 11px;
    justify-content: flex-end;
`;

const MessageListStyle = styled.div`
    max-height: 100%;
    overflow-y: auto;
`;

const FormStyle = styled(Form)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 2px 2px 0px;
    border: 1px solid rgb(230, 230, 230);
    border-radius: 2px;

    .ant-form-item {
        flex: 1;
        margin-bottom: 0;
    }
`;

export default function ChatWindow() {
    const { selectedRoom, members, setIsInviteMemberVisible } = useContext(AppContext)
    const { user: {uid, displayName, photoURL} } = useContext(AuthContext)

    const [inputValue, setInputValue] = useState('');
    const [form] = useForm();

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    }

    const handleOnSumit = () => {
        addDocument('messages', {
            text: inputValue,
            uid,
            photoURL,
            roomId: selectedRoom.id,
            displayName,
        });

        form.resetFields(["message"]);
    };

    const conditionMessages = React.useMemo(() => ({
        fieldName: 'roomId',
        operator: '==',
        compareValue: selectedRoom.id
    }),[selectedRoom.id])

    const messages = useFireStore('messages', conditionMessages);

    console.log({messages})

    return (
        <WrapperStyled>
            {
                selectedRoom.id ? 
            <>
            <HeaderStyled>
                <div className="header__info">
                    <p className="header__title">{selectedRoom?.name}</p>
                    <span className="header__description">{selectedRoom?.description}</span>
                </div>
                <ButtonGroupStyled>
                    <Button icon={<UserAddOutlined />} onClick={() => setIsInviteMemberVisible(true) } type="text">Invite</Button>
                    <Avatar.Group size="small" maxCount={2}>
                        {
                            members.map((member) => (
                                <Tooltip title={member?.displayName} key={member.uid}>
                                    <Avatar src={member?.photoURL}>{member?.photoURL ? '' : member.displayName?.charAt(0)?.toUpperCase()}</Avatar>
                                </Tooltip>
                            ))
                        }
                    </Avatar.Group>
                </ButtonGroupStyled>
            </HeaderStyled>
            <ContentStyled>
                <MessageListStyle>
                    {
                        messages.map((message) => (
                            <Message key={message.id} text={message.text} photoURL={message.photoURL} displayName={message.displayName} createdAt={message.createdAt} />
                        ))
                    }
                </MessageListStyle>
                <FormStyle form={form}>
                    <Form.Item name="message">
                        <Input onChange={handleInputChange} onPressEnter={handleOnSumit} placeholder="typing..." bordered={false} autoComplete="off" />
                    </Form.Item>
                    <Button type="primary" onClick={handleOnSumit} >Send</Button>
                </FormStyle>
            </ContentStyled>
            </>
            : (
                <Alert message="Select room to chating" type="info" showIcon style={{ margin: 5}} closable />
            )
            }
        </WrapperStyled>
    )
}
