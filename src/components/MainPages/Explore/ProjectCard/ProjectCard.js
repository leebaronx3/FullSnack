import React from 'react'
import { useHistory } from 'react-router'
import { Card, Col, ListGroup, Button } from 'react-bootstrap'
import { BiLike } from 'react-icons/bi'
import { FiCode } from 'react-icons/fi'
import { GrAttachment } from 'react-icons/gr'
import { BsBarChart } from 'react-icons/bs'
import image from '../../../../images/img-placeholder.png'
import MyModal from '../../../General/Modal/MyModal'
import { baseUrl } from '../../../../utils/serverRouting'
export default function ProjectCard({ ownsProject, data, invokeExploreRerender }) {
    const history = useHistory();
    return (
        <Col sm={12} md={6} lg={3} className='project-card'>
            <Card className='mb-4 pt-4 pl-4 pr-4 pb-3'>
                <div>
                    <div className='image-overlay'>
                        <Card.Img variant="top"
                            src={data.projects_pictures.length > 0 ?
                                data.projects_pictures[0].pic_src.includes('http') ? data.projects_pictures[0]
                                    : `${baseUrl}/public/${data.projects_pictures[0].pic_src}`
                                : image}
                            onClick={() => history.push(`/projectdisplay/${data.id}`, data)} />
                    </div>
                    <Card.Header className='text-center font-weight-bold border-none p-2'>{data.name}</Card.Header>

                    <ListGroup variant="flush">
                        <ListGroup.Item><FiCode className='mr-3' />{data.project_required_tech_id.map(tech => tech.name).join(', ')}</ListGroup.Item>
                        <ListGroup.Item><GrAttachment className='mr-3' />Assets {data.assets_src ? 'Included' : 'Not Included'}</ListGroup.Item>
                        <ListGroup.Item><BsBarChart className='mr-3' />{data.difficulty_level.name}</ListGroup.Item>
                        <ListGroup.Item><BiLike className='mr-3' />{data.liked_project_id.length} Recommended</ListGroup.Item>
                    </ListGroup>
                </div>
                {ownsProject && <Card.Body className='d-flex justify-content-between pb-0 pt-2'>
                    <Button className='button-zindex' onClick={() => history.push(`/editproject/${data.id}`, data)} >Edit</Button>
                    <MyModal type='delete' removeType='Project' removeName={data.name} removableId={data.id} invokeRerender={invokeExploreRerender} />
                </Card.Body>}
            </Card>
        </Col>
    )
}
