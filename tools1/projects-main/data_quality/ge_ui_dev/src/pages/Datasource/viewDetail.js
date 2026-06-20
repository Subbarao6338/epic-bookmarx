import React from "react";
import { Button, Modal } from "react-bootstrap";

function ViewDetail({ openViewDetail, setOpenViewDetail }) {
  const handleCloseModal = () => setOpenViewDetail({ show: false });
  return (
    <Modal show={openViewDetail.show} size="lg" onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Datasource Config</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <pre>{openViewDetail.data}</pre>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCloseModal}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ViewDetail;
