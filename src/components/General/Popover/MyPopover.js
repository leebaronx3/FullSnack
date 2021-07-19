import React from 'react'
import SignIn from './SignIn/SignIn'
import UserMenu from './UsersMenu/UserMenu'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import { BiBell } from 'react-icons/bi'
import Notifications from './Notifications/Notifications'
import userProfileImagePlaceholder from '../../../images/img-placeholder.png'
import { useState, useEffect, useContext } from 'react'
import { getUsersNewNotifications, updateNotificationsAsRead } from '../../../DAL/events'
import userContext from '../../../utils/AuthContext'
export default function MyPopover({ type }) {
    const NOTIFICATIONS_INTERVAL_DURATION = 1000 * 60;

    const context = useContext(userContext);
    const [notifications, setNotifications] = useState([])
    const [updateNotifs, setUpdateNotifs] = useState(false)


    async function fetchNotifications() {
        if (context.loggedUser.id) {
            const data = await getUsersNewNotifications(context.loggedUser.id)
            if (data.length > 0) setNotifications([...data])
            else setNotifications([])
        }
    }

    useEffect(() => {
        if (type === 'notifications') fetchNotifications()
    }, [])

    useEffect(() => {
        const notificationsTimer = setInterval(() => {
            fetchNotifications();
        }, NOTIFICATIONS_INTERVAL_DURATION)

        return () => {
            clearInterval(notificationsTimer)
        }
    }, [updateNotifs])

    const markNotificationsAsRead = async () => {
        await updateNotificationsAsRead(context.loggedUser.id)
        fetchNotifications();
        setUpdateNotifs(!updateNotifs)
    }

    return (
        <>
            <OverlayTrigger
                trigger="click"
                key='bottom'
                placement='bottom'
                rootClose
                onExit={(e) => {
                    if (type === 'notifications') markNotificationsAsRead()
                }}
                overlay={
                    <Popover id={`popover-positioned-bottom`}>
                        {type === 'signin' ? <SignIn /> :
                            type === 'usermenu' ? <UserMenu /> :
                                <Notifications notifications={notifications} />
                        }
                    </Popover>
                }
            >
                {
                    <button className='btn-as-link' disabled={type === 'notifications' && notifications.length < 1 ? true : false} onClick={(e) => {
                    }}>
                        {
                            type === 'signin' ? 'Sign In' :
                                type === 'usermenu' ?
                                    <img src={userProfileImagePlaceholder} className='header-user-img rounded-circle' alt='user profile' />
                                    :
                                    <div className='mt-n3'>
                                        <BiBell />
                                        {notifications.length > 0 ? <div className='notif-badge rounded-circle bg-white text-dark text-center mt-n4 font-weight-bold ml-3'>{notifications.length}</div> : null}
                                    </div>
                        }
                    </button>
                }
            </OverlayTrigger>
        </>
    )
}
