import React, { useContext, useState } from 'react'
import useFireStore from '../hooks/useFireStore';
import { AuthContext } from './AuthProvider';

export const AppContext = React.createContext();

export default function AppProvider({children}) {
    const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
    const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState('');

    const { user: {uid} } = useContext(AuthContext)

    const roomsCondition = React.useMemo(() => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            compareValue: uid
        }
    },[uid])

    const rooms = useFireStore('rooms', roomsCondition);

    const selectedRoom = React.useMemo(
        () => rooms.find((room) => room.id === selectedRoomId) || {},
        [rooms, selectedRoomId]
    )

    const usersCondition = React.useMemo(() => {
        return {
            fieldName: 'uid',
            operator: 'in',
            compareValue: selectedRoom.members
        }
    },[selectedRoom.members])

    const members = useFireStore('users', usersCondition)

    console.log({members})
    return (
        <AppContext.Provider value={{
        rooms, 
        members,
        isAddRoomVisible, 
        setIsAddRoomVisible, 
        selectedRoomId, 
        setSelectedRoomId,
        selectedRoom,
        isInviteMemberVisible, 
        setIsInviteMemberVisible}}>
            {children}
        </AppContext.Provider>
    )
}
