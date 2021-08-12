import React, { useContext } from 'react'
import { MdSend } from 'react-icons/md'
import { Button } from 'react-bootstrap'
import { addNewComment } from '../../../../../../DAL/forum'
import { addNewNotification } from '../../../../../../DAL/events'
import { getNotificationsTypesList } from '../../../../../../DAL/staticData';
import userContext from '../../../../../../utils/AuthContext'
export default function AddCommentBtn({ comment, threadRelevantData, returnError, invokeRerender }) {

    const context = useContext(userContext)
    const validateCommentBlocks = () => {
        let hasText = false;
        if (comment.blocks) {
            for (const block of comment.blocks) {
                if (block.text) {
                    hasText = true;
                }
            }
        }
        return hasText;
    }

    const onSendComment = async (e) => {
        if (context.loggedUser.id) {
            if (validateCommentBlocks()) {
                await addNewComment({
                    user_id: context.loggedUser.id,
                    thread_id: threadRelevantData.threadId,
                    text: JSON.stringify(comment)
                })
                const notificationsTypes = await getNotificationsTypesList()
                if (context.loggedUser.id !== threadRelevantData.threadOwnerId) {
                    await addNewNotification({ type_id: notificationsTypes.find(type => type.name === 'thread comment').id, acted_user_id: context.loggedUser.id, notified_user_id: threadRelevantData.threadOwnerId, project_id: threadRelevantData.projectId })
                }

                if (threadRelevantData.threadOwnerId !== threadRelevantData.projectOwnerId && context.loggedUser.id !== threadRelevantData.projectOwnerId) {
                    await addNewNotification({ type_id: notificationsTypes.find(type => type.name === 'project comment').id, acted_user_id: context.loggedUser.id, notified_user_id: threadRelevantData.projectOwnerId, project_id: threadRelevantData.projectId })
                }
                invokeRerender()
            } else {
                returnError('Empty comment is not allowed')
            }
        } else {
            returnError('Must login to comment')
        }

    }

    return (
        <Button className='btn-as-link comment-send-btn text-dark' onClick={onSendComment}>
            <MdSend />
        </Button>
    )
}
