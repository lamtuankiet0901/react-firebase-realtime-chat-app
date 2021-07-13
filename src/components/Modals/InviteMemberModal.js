import { Avatar, Form, Modal, Select, Spin } from 'antd'
import { debounce } from 'lodash';
import React, { useContext, useState } from 'react'
import { AppContext } from '../../Context/AppProvider'
import { AuthContext } from '../../Context/AuthProvider';
import { db } from '../../firebase/config';
import { addDocument } from '../../firebase/services';

function DebounceSelect({fetchOptions, debounceTimeout = 300, ...props}) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

    const debounceFetcher = React.useMemo(() => {
        const loadOptions = (value) => {
            setOptions([]);
            setFetching(true);

            fetchOptions(value, props.curMembers).then(newOptions => {
                setOptions(newOptions);
                setFetching(false);
            })
        }

        return debounce(loadOptions, debounceTimeout);
    },[debounceTimeout, fetchOptions])

    return (
        <Select 
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={ fetching ? <Spin size="small" /> : null}
            {...props}
        >
            {
                options.map((option) => (
                    <Select.Option key={option.value} value={option.value} title={option.lable}>
                        <Avatar size="small" src={option.photoURL}>
                            {option.photoURL ? '' : option.lable?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        {` ${option.lable}`}
                    </Select.Option>
                ))
            }
        </Select>
    )
}

async function fetchUserList(search, curMembers) {
    return db.collection('users').where('keywords', 'array-contains', search).orderBy('displayName').limit(20).get().then(snapshot => {
        return snapshot.docs.map(doc => ({
            lable: doc.data().displayName,
            value: doc.data().uid,
            photoURL: doc.data().photoURL
        })).filter(option => !curMembers.includes(option.value))
    })
}

export default function InviteMemberModal() {
    const { isInviteMemberVisible, setIsInviteMemberVisible, selectedRoomId, selectedRoom } = useContext(AppContext);
    const [value, setValue] = useState([]);
    const { user: {uid} } = useContext(AuthContext);
    const [form] = Form.useForm()

    const handleOk = () => {

        //update members in current room
        const roomRef = db.collection('rooms').doc(selectedRoomId);

        roomRef.update({
            members: [...selectedRoom.members, ...value.map(val => val.value)]
        })

        setIsInviteMemberVisible(false)
        form.resetFields()
    }

    const handleCancel = () => {
        form.resetFields()
        setIsInviteMemberVisible(false)
    }

    console.log({value})
    return (
        <Modal
            title="Invite new members"
            visible={isInviteMemberVisible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Form form={form} layout="vertical">
                <DebounceSelect 
                showSearch
                mode="multiple" 
                lable="Name of members" 
                value={value} 
                placeholder="Name of member" 
                fetchOptions={fetchUserList}
                onChange={(newValue) => setValue(newValue)}
                style={{width: '100%'}}
                curMembers={selectedRoom.members}
                />
            </Form>
        </Modal>
    )
}
