import React from 'react'
import { useState, useEffect } from 'react'
import { Row, Accordion, Spinner } from 'react-bootstrap'
import { HiChatAlt2 } from 'react-icons/hi'
// import { MdReply } from 'react-icons/md'
import MyModal from '../../../General/Modal/MyModal'
import { getProjectsThreadsComments } from '../../../../DAL/forum';

import ForumThread from './ForumThread'
export default function ProjectsForum({ projectId }) {

    const [clickedNewThread, setClickedNewThread] = useState(false)

    const [forumData, setForumData] = useState()
    const [load, setLoad] = useState(true)

    useEffect(async () => {
        const data = await getProjectsThreadsComments(projectId)
        setForumData([...data])
    }, [])

    useEffect(() => {
        if (forumData) setLoad(false)
    }, [forumData])

    return (
        <div className='projects-forum'>
            <div>
                <section>
                    <h3>Recipes notebook's Forum</h3>
                    <p>Feel free to ask questions in the forum and help others.</p>
                </section>
                {load && <div className='text-center'><Spinner animation="border" variant="dark" /></div>}
                {!load && <div>
                    <Row className='justify-content-end mr-2  mb-3'>
                        <MyModal type='newThread' />
                    </Row>

                    {forumData.length < 1 ? <div className='empty-forum text-center mb-5 p-3 forum-bg'>
                        <HiChatAlt2 />
                        <p>No Threads were created yet</p>
                    </div>
                        :
                        <div className='forum-filled bg-light p-3 forum-bg p-2'>
                            <Accordion>
                                {forumData.map((thread, idx) => {
                                    console.log(thread)
                                    return <ForumThread thread={thread} idx={idx} />
                                })}

                            </Accordion>
                        </div>
                    }
                </div>}
            </div>
        </div>
    )
}
