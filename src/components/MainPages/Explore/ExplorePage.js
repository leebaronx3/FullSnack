import React, { useState, useEffect, useContext } from 'react'
import { Row, Container, Button } from 'react-bootstrap'
import { BsSearch } from 'react-icons/bs'
import ProjectCard from './ProjectCard/ProjectCard'
import FilterSection from '../../General/FilterSection/FilterSection'
import { useHistory, useParams } from 'react-router'
import MySpinner from '../../General/MySpinner'
import userContext from '../../../utils/AuthContext'
export default function Explore({ type }) {

    const context = useContext(userContext)
    const { uid } = useParams();
    const history = useHistory();
    const [load, setLoad] = useState(true)
    const [cardsData, setCardsData] = useState([])
    const [isUsersDashboard, setIsUsersDashboard] = useState(false)
    const [rerender, setRerender] = useState(true)

    useEffect(() => {
        if (uid && context.loggedUser.id && uid == context.loggedUser.id) {
            setIsUsersDashboard(true)
        } else {
            setIsUsersDashboard(false);
            history.push('/explore')
        }
    }, [type])


    function onProjectRemove() {
        setRerender(!rerender)
    }

    return (
        <Container fluid className='mt-5 mb-5 px-5'>
            <h2 className='mb-2 pl-5'>{!isUsersDashboard ? 'Full Stack Projects' : 'My Projects'}</h2>
            {isUsersDashboard &&
                <Button onClick={() => history.push('/editproject/new')} className='ml-5 mb-3'>+ Add New Project</Button>
            }
            <FilterSection setCardsData={setCardsData} usersDashboard={isUsersDashboard} setLoader={setLoad} rerender={rerender} />
            {load && <MySpinner />}
            {!load && <div className='projectsExplore'>
                {cardsData.length > 0 ?
                    < Row className='px-5' >
                        {cardsData.map((cardData, idx) => <ProjectCard key={idx} data={cardData} ownsProject={isUsersDashboard} invokeExploreRerender={onProjectRemove} />)}
                    </Row > :
                    !isUsersDashboard ? <div className='text-center projs-not-found'>
                        <BsSearch className='mt-5 mb-5' />
                        <p>No Projects Found</p>
                    </div> : <div className='empty-users-projects mt-2 text-center'>
                        <img src='/images/development.svg' className='m-5' alt='no projects decoration' />
                        <p>No projects created yet.<br />
                            Go ahead and create your first project!
                        </p>
                        <Button onClick={() => history.push('/editproject/new')}>+ Add your first project</Button>
                    </div>
                }
            </div >}

        </Container >
    )
}
