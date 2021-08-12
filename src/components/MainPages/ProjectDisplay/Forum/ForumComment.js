import React from 'react'
import { Card } from 'react-bootstrap'
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromRaw } from 'draft-js';
import { handleTimestamp } from '../../../../utils/handlers'
import { baseUrl } from '../../../../utils/serverRouting';

export default function ForumComment({ comment }) {
    return (
        <div>
            <Card.Body className=''>
                <div className='media text-left forum-comment pt-3 pl-5 rounded'>
                    <img src={`${baseUrl}/public/${comment.user.profile_img}`} className='mr-3 forum-user-img rounded-circle d-inline' alt='commenter' />
                    <div className='media-body '>
                        <div className='comment-mdata d-md-flex justify-content-between'>
                            <p className='m-0 mb-md-2 d-md-inline mr-md-4 blk-txt font-weight-bold'>{comment.user.username}</p>
                            <p className='m-0 d-md-inline mr-4 blk-txt font-weight-light text-muted'>{handleTimestamp(comment.timestamp)}</p>
                        </div>
                        <div className='mr-4 blk-txt font-weight-normal'>
                            <Editor
                                editorClassName="mb-3"
                                editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(comment.text)))} readOnly={true}
                                toolbarHidden
                            />

                        </div>
                    </div>
                </div>
            </Card.Body>
        </div>
    )
}
