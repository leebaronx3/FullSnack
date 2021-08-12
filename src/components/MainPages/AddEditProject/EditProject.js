import React, { useState, useEffect, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Container, Button, Form, Row, Col } from 'react-bootstrap'
import TextInput from '../../General/FormComponents/TextInput'
import ToggleRb from '../../General/FormComponents/ToggleRb'
import ErrorMessage from '../../General/FormComponents/ErrorMsg'
import MyMultiSelect from '../../General/FormComponents/MyMultiSelect'
import MyDropzone from '../../General/FormComponents/MyDropzone'
import MySpinner from '../../General/MySpinner'
import { FiSave, FiCode } from 'react-icons/fi'
import { GrAttachment, GrGithub } from 'react-icons/gr'
import { BsBarChart, BsBook } from 'react-icons/bs'
import { CgImage } from 'react-icons/cg'
import nameTag from '../../../images/name_tag.svg'
import { inputChangeHandler } from '../../../utils/handlers'
import { validateInput, isFormValid } from '../../../utils/validations'
import { addNewProject, getProjectData, updateProjectData } from '../../../DAL/projects'
import userContext from '../../../utils/AuthContext'
import { getDifficultyLevelsList } from '../../../DAL/staticData'

export default function EditProject() {

    const context = useContext(userContext)
    const history = useHistory();
    if (!context.loggedUser.id) {
        history.push('/home');
    }

    const [difficultyLevels, setDifficultyLevels] = useState([])

    const [disableBtn, setDisableBtn] = useState(true)
    const [loader, setLoader] = useState(true)
    const [madeChanges, setMadeChanges] = useState(false)
    const { pid } = useParams();
    const [projectData, setProjectData] = useState({})


    const fetchDifficultyLevels = async () => {
        const diffLvls = await getDifficultyLevelsList();
        setDifficultyLevels([...diffLvls])
    }

    useEffect(() => {
        fetchDifficultyLevels();
    }, [])

    useEffect(() => {
        (async () => {
            setLoader(true)
            if (context.loggedUser.id) {
                let fetchedProjectData;
                if (pid !== 'new') {
                    fetchedProjectData = await getProjectData(pid)
                }
                setProjectData({
                    userId: context.loggedUser.id,
                    name: {
                        value: fetchedProjectData ? fetchedProjectData.name : '',
                        error: ''
                    },
                    difficultyLevel: {
                        value: fetchedProjectData ? fetchedProjectData.difficulty_level_id || fetchedProjectData.difficulty_level.id : '', // temp
                        error: ''
                    },
                    githubLink: {
                        value: fetchedProjectData ? fetchedProjectData.github_url : '',
                        error: ''
                    },
                    description: {
                        value: fetchedProjectData ? fetchedProjectData.description : '',
                        error: ''
                    },
                    requiredTechnologies: {
                        value: fetchedProjectData ? fetchedProjectData.project_required_tech_id.map(tech => { return { value: tech.id, label: tech.name } }) : [],
                        error: ''
                    },
                    assetsSrc: {
                        value: fetchedProjectData ? fetchedProjectData.assets_src : '',
                        error: ''
                    },
                    pictures: {
                        value: fetchedProjectData ? fetchedProjectData.projects_pictures : [],
                        error: ''
                    },
                })
                setLoader(false)
            }
        })();
    }, [])

    const setChangesTrue = () => {
        setMadeChanges(true)
    }

    useEffect(() => {
        if (madeChanges) setDisableBtn(!isFormValid(projectData))
    }, [projectData, madeChanges])

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        if (isFormValid(projectData)) {
            const projectFormData = new FormData()
            for (const input in projectData) {
                if (input === 'userId') projectFormData.append(input, projectData[input])

                else if (input === 'assetsSrc') {
                    if (typeof projectData[input].value === 'string') {
                        projectFormData.append(input, projectData[input].value)
                    } else {
                        if (projectData[input].value.length > 0) projectFormData.append(input, projectData[input].value[0])
                        else projectFormData.append(input, '')
                    }
                } else if (input === 'pictures') {
                    projectData.pictures.value.forEach(pic => {
                        if (typeof pic === 'string') projectFormData.append(input, pic.pic_src)
                        else projectFormData.append(input, pic)
                    })
                }

                else projectFormData.append(input, projectData[input].value)
            }
            let projectsId;
            if (pid === 'new') {
                const newProject = await addNewProject(projectFormData)
                projectsId = newProject.id
            }
            else {
                projectFormData.append("id", pid)
                await updateProjectData(projectFormData)
                projectsId = pid
            }
            history.push(`/projectdisplay/${projectsId}`)
        }
    }

    return (
        <Container className='mt-5 edit-project'>
            {loader && <MySpinner />}
            {!loader && <>
                <h2><span className='font-weight-normal'>My Projects /</span> {pid === 'new' ? 'New Project' : projectData.name.value}</h2>
                <Form className='mt-5'>
                    <Form.Row className='mb-5'>
                        <Col className='mr-md-5' sm={12} md={5} lg={3}>

                            <TextInput
                                controlId='projectName'
                                type='text'
                                icon={<img src={nameTag} alt='name tag icon' className='name-svg mr-2' />}
                                label='Project Name:'
                                info='Must be between 2-20 characters'
                                isRequired={true}
                                name='name'
                                value={projectData.name.value}
                                error={projectData.name.error}
                                onChange={(e) => {
                                    setProjectData(inputChangeHandler(e, projectData))
                                    setMadeChanges(true)
                                }}
                                onBlur={(e) => setProjectData(validateInput(e, projectData))}
                                placeholder='Project Name'
                                maxLength={20}
                            />


                            <Form.Group controlId="difficultyLevel" className='mb-5'>
                                <Form.Label>
                                    <BsBarChart className='mr-2 text-dark' />
                                    Difficulty Level:
                                </Form.Label>
                                <Form.Text className="text-muted">
                                    Required
                                </Form.Text>
                                < ToggleRb
                                    name='difficultyLevel'
                                    options={difficultyLevels}
                                    checkedValue={projectData.difficultyLevel.value}
                                    onRbChange={(e) => {
                                        setProjectData(inputChangeHandler(e, projectData))
                                        setMadeChanges(true)
                                    }} />
                                <ErrorMessage error={projectData.difficultyLevel.error} />
                            </Form.Group>


                            <Form.Group controlId="requiredTechSelect" className='mr-2'>
                                <Form.Label><FiCode className='mr-2 text-dark' />Required Technologies:</Form.Label>
                                <ErrorMessage error={projectData.requiredTechnologies.error} />
                                <MyMultiSelect
                                    type='requiredTechnologies'
                                    location='edit'
                                    onSelectChange={(e) => {
                                        setProjectData(inputChangeHandler(e, projectData))
                                    }}
                                    onSelectBlur={(e) => setProjectData(validateInput(e, projectData))}
                                    onChange={setChangesTrue}
                                    checkedValues={projectData.requiredTechnologies.value} />

                            </Form.Group>
                        </Col>


                        <Col className='border-right border-dark pr-3 mr-4 mt-4' sm={12} md={5} lg={4}>
                            <TextInput
                                controlId='githubLink'
                                type='text'
                                icon={<GrGithub className='mr-2 text-dark' />}
                                label='Github Link:'
                                isRequired={false}
                                name='githubLink'
                                value={projectData.githubLink.value}
                                error={projectData.githubLink.error}
                                onChange={(e) => {
                                    setProjectData(inputChangeHandler(e, projectData))
                                    setMadeChanges(true)
                                }}
                                onBlur={(e) => setProjectData(validateInput(e, projectData))}
                                placeholder='Github Link' />


                            <TextInput
                                controlId='description'
                                icon={<BsBook className='mr-2 text-dark' />}
                                label='Project Description:'
                                isRequired={false}
                                name='description'
                                value={projectData.description.value}
                                error={projectData.description.error}
                                onChange={(e) => {
                                    setProjectData(inputChangeHandler(e, projectData))
                                    setMadeChanges(true)
                                }}
                                onBlur={(e) => setProjectData(validateInput(e, projectData))}
                                placeholder='Project description... Explain to the users what they should expect'
                                as="textarea"
                                rows={4}
                                maxLength={200}
                            />
                        </Col>


                        <Col className='' sm={12} md={5} lg={4}>
                            <Form.Group>
                                <Form.Label><CgImage className='mr-2 text-dark' />Project's Images:</Form.Label>
                                <Form.Text className="text-muted">Must upload between 1-10 Images</Form.Text>
                                <ErrorMessage error={projectData.pictures.error} />
                                <MyDropzone
                                    name='pictures'
                                    insertedFiles={projectData.pictures.value}
                                    onFileUpload={(e) => {
                                        setProjectData(inputChangeHandler(e, projectData))
                                    }}
                                    onChange={setChangesTrue}
                                    onInputValidation={(e) => setProjectData(validateInput(e, projectData))}
                                />

                            </Form.Group>

                            <Form.Group>
                                <Form.Label><GrAttachment className='mr-2 text-dark' />Project's Assets:</Form.Label>
                                <Form.Text className="text-muted">Must be RAR/ZIP file</Form.Text>
                                <MyDropzone
                                    name='assetsSrc'
                                    insertedFiles={projectData.assetsSrc.value}
                                    onFileUpload={(e) => {
                                        setProjectData(inputChangeHandler(e, projectData))
                                    }}
                                    onChange={setChangesTrue}
                                />

                            </Form.Group>
                        </Col>


                    </Form.Row>
                    <Row className='justify-content-end'>
                        <Button variant="primary" type="submit" disabled={disableBtn} onClick={handleFormSubmit}>
                            <FiSave className='mr-2' />{pid === 'new' ? 'Save Project' : 'Save Changes'}
                        </Button>
                    </Row>
                </Form>
            </>}

        </Container>
    )
}