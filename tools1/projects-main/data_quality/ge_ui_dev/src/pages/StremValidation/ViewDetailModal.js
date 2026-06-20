import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalTitle } from 'react-bootstrap';
import ModalHeader from 'react-bootstrap/esm/ModalHeader';
import axios from 'axios';
import { ge_api_url } from '../../config/api';

function ViewDetailModal({ modal = {}, setModal = () => { } }) {

    const { show, data } = modal
    const [validations, setValidations] = useState(null);
    const [summary, setSummary] = useState({});

    const handleClose = () => {
        setModal({
            show: false,
            data: null
        })
    }

    const getValidationResult = (checkpoint_name) => {
        axios.get(ge_api_url + `/ge/get_stream_validations/${checkpoint_name}/`).then(res => {
            setValidations(res.data.validations)
            setSummary(res.data.summary)
            console.log(res.data)
        }).catch(err => {
            console.error(err)
        })

    }
    useEffect(() => {
        console.log(data?.checkpoint_name)
        data?.checkpoint_name && getValidationResult(data.checkpoint_name)
    }, [data?.checkpoint_name])

    return <div>
        <Modal show={show} onHide={handleClose} size='lg' >
            <ModalHeader closeButton>
                <ModalTitle> Details</ModalTitle>
            </ModalHeader>
            <ModalBody >
                {validations ?
                    <>
                        <div className='mb-3' style={{ position: 'sticky', top: 0 }}>
                            <span className='p-2 border rounded'>
                                <span className='me-4 text-primary'>Messages processed: {summary?.total_element_count || 0}</span>
                                <span className='text-danger'>Messages failed validation: {summary?.total_unexpected_count || 0}</span>
                            </span>
                        </div>
                        <div  >
                            {validations.map(({ value }, index) => (
                                <div key={index} className='border rounded bg-light mb-3'>
                                    <pre>{JSON.stringify(value, undefined, 2)}</pre>
                                </div>

                            ))}
                        </div> </> :
                    <div className='text-center'>Loading...</div>
                }
            </ModalBody>
            <ModalFooter>
                <Button onClick={handleClose}>
                    Close
                </Button>
            </ModalFooter>
        </Modal>
    </div>;
}

export default ViewDetailModal;
