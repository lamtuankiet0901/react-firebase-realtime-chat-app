import { Form, Input, Modal } from 'antd'
import React, { useContext, useState } from 'react'
import { AppContext } from '../../Context/AppProvider'
import { AuthContext } from '../../Context/AuthProvider';
import { addDocument } from '../../firebase/services';

export default function AddRoomModal() {
    const { isAddRoomVisible, setIsAddRoomVisible } = useContext(AppContext);
    const { user: {uid} } = useContext(AuthContext);
    const [form] = Form.useForm()

    const handleOk = () => {
        console.log({formData: form.getFieldValue()});
        addDocument('rooms', {...form.getFieldValue(), members: [uid]})
        setIsAddRoomVisible(false)
        form.resetFields()
    }

    const handleCancel = () => {
        form.resetFields()
        setIsAddRoomVisible(false)
    }
    return (
        <Modal
            title="New Room"
            visible={isAddRoomVisible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Form form={form} layout="vertical">
                <Form.Item label="Name Room" name="name">
                    <Input placeholder="Type a name room" />
                </Form.Item>
                <Form.Item label="Description" name="description">
                    <Input.TextArea placeholder="Type a Description" />
                </Form.Item>
            </Form>
        </Modal>
    )
}
