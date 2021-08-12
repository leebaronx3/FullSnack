import React, { useState, useEffect } from 'react'
import Dropzone from 'react-dropzone'
import MyModal from '../Modal/MyModal'
import { BiDownload } from 'react-icons/bi'
import { AiOutlineFile } from 'react-icons/ai'
import { Button } from 'react-bootstrap'
import { baseUrl } from '../../../utils/serverRouting'
export default function MyDropzone({ name, insertedFiles, onFileUpload, onInputValidation, onChange }) {
    const initalFilesState = insertedFiles || [];
    const [files, setFiles] = useState(initalFilesState);

    const handleDrop = acceptedFiles => {
        if (name === 'assetsSrc' && files.length > 0) return
        else if (name === 'pictures' && files.length === 10) return
        setFiles([...files, ...acceptedFiles])
        onChange()
    };

    useEffect(() => {
        onFileUpload({ target: { name: name, value: typeof files !== 'string' ? [...files] : files } })
        if (name === 'pictures') {
            onInputValidation(({ target: { name: name, value: files } }))
        }
    }, [files])

    const removeFiles = newFilesArr => {
        setFiles([...newFilesArr])
        onChange()
    }
    return (
        <div className="drag-drop-files">
            <Dropzone onDrop={handleDrop}
                accept={name === 'pictures' ? 'image/*' : ".zip,.rar,.7zip"}
            >
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps({ className: "dropzone" })}>
                        <input {...getInputProps()} />
                        <div className='text-center'>
                            {!files.length > 0 && <div>
                                <div><BiDownload className='mb-3' /></div>
                                <Button>Add Files</Button>
                                <p>or drag and drop files here</p>
                            </div>}
                            {files.length > 0 && <div>
                                {name === 'pictures' ? <ul className='dnd-ul text-left'>
                                    {files.map((file, idx) => <li key={idx} className='d-flex'>
                                        <AiOutlineFile className='mr-2' />
                                        <span className='file-name-dnd mr-2'>{typeof file.pic_src === 'string' ?
                                            <a href={`${baseUrl}/projects/download/${file.pic_src.split('/')[1]}`} onClick={(e) => e.stopPropagation()}>{file.pic_src.split('/')[1].split('_')[1]}</a>
                                            : file.name
                                        }
                                        </span>
                                        <span key={`remove-${idx}`} onClick={(e) => {
                                            e.stopPropagation();
                                        }}>
                                            <MyModal type='removeFile' removeType='Picture' removeName={typeof file.pic_src === 'string' ? file.pic_src : file.name} removableId={file.pic_src ? file.id : null} removeByIdx={idx} removeableFile={file} prevFilesArr={files} getNewFilesArr={removeFiles} />
                                        </span>
                                    </li>)}
                                </ul>
                                    :
                                    <div className='mt-4'>
                                        <AiOutlineFile />
                                        <div className='file-name-dnd mr-2'>{typeof files === 'string' ? files.includes('http') ? files :
                                            <a href={`${baseUrl}/projects/download/${files.split('/')[1]}`} onClick={(e) => e.stopPropagation()}>{files.split('/')[1].split('_')[1]}</a> :
                                            files[0].name}</div>
                                        <div onClick={(e) => {
                                            e.stopPropagation();
                                        }}>
                                            <MyModal type='removeFile' removeType='File' removeName={typeof files === 'string' ? files : files[0].name} prevFilesArr={files} getNewFilesArr={removeFiles} />
                                        </div>
                                    </div>
                                }
                            </div>}
                        </div>
                    </div>
                )}
            </Dropzone>
        </div>
    );
}