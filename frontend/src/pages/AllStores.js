import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import axios from 'axios';
import jsPDF from 'jspdf'; // Import jsPDF for generating PDF reports
import "./viewStores.css";

function ViewStores() {
    const [values, setValues] = useState([]);
    const [StoreName, setStoreName] = useState("");
    const [StoreImage, setStoreImage] = useState("");
    const [Email, setEmail] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [Location, setLocation] = useState("");
    const [Category, setCategory] = useState("");
    const [OpeningTime, setOpeningTime] = useState("");
    const [stores, setStores] = useState([]);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        function getStores() {
            axios.get("http://localhost:8000/store/").then((res) => {
                setStores(res.data);
            }).catch((err) => {
                alert(err.message);
            });
        }
        getStores();
    }, []);

    const deleteStores = (id) => {
        axios.delete(`http://localhost:8000/store/delete/${id}`);
        alert("Store Details deleted.");
        window.location.reload();
    };

    const updateStoreDetails = (val) => {
        setValues(val);
        handleShow();
    };

    const generatePDFReport = (storeData) => {
        // Create a new jsPDF instance
        const doc = new jsPDF();

        // Set properties of the PDF document
        doc.setProperties({
            title: 'Store Report',
            author: 'Your Company',
        });

        // Set up the header of the PDF
        doc.setFontSize(18);
        doc.text('Store Report', 105, 10, { align: 'center' });

        // Generate the content of the PDF
        let content = '';
        content += `Store Name: ${storeData.StoreName}\n`;
        content += `Email: ${storeData.Email}\n`;
        content += `Contact Number: ${storeData.contactNumber}\n`;
        content += `Location: ${storeData.Location}\n`;
        content += `Category: ${storeData.Category}\n`;
        content += `Opening Time: ${storeData.OpeningTime}\n`;

        // Add the content to the PDF
        doc.setFontSize(12);
        doc.text(content, 10, 20);

        // Save the PDF
        doc.save('store_report.pdf');
    };

    function sendData(e) {
        e.preventDefault();

        const updatedValues = {
            id: values._id,
            StoreName: StoreName || values.StoreName,
            StoreImage: StoreImage || values.StoreImage,
            Email: Email || values.Email,
            contactNumber: contactNumber || values.contactNumber,
            Location: Location || values.Location,
            Category: Category || values.Category,
            OpeningTime: OpeningTime || values.OpeningTime
        };

        axios.put(`http://localhost:8000/store/update/${updatedValues.id}`, updatedValues)
            .then(() => {
                alert("Store Details Updated");
                handleClose();
                window.location.reload();
            }).catch((err) => {
                console.log(err);
                alert(err);
            });
    }

    return (
        <div className="store-container">
            <h1>All Stores</h1>
            <div className="store-cards">
                {stores.map((val, key) => (
                    <Card key={key} className="store-card">
                        <Card.Img variant="top" src={val.StoreImage} alt={val.StoreName} />
                        <Card.Body>
                            <Card.Title>{val.StoreName}</Card.Title>
                            <Card.Text>
                                <p><strong>Email:</strong> {val.Email}</p>
                                <p><strong>Contact Number:</strong> {val.contactNumber}</p>
                                <p><strong>Location:</strong> {val.Location}</p>
                                <p><strong>Category:</strong> {val.Category}</p>
                                <p><strong>Opening Time:</strong> {val.OpeningTime}</p>
                            </Card.Text>
                            <div className="card-buttons">
                                <Button variant="primary" onClick={() => updateStoreDetails(val)} className="update-button">Update</Button>
                                <Button onClick={() => deleteStores(val._id)} className="delete-button">Delete</Button>
                                <Button onClick={() => generatePDFReport(val)} className="report-button">Download Report</Button>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            <Modal show={show} onHide={handleClose} className="getfunc">
                <Modal.Header closeButton>
                    <Modal.Title>Update Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={sendData}>
                        <Form.Group controlId="name">
                            <Form.Label>Store Name</Form.Label>
                            <Form.Control type="text" defaultValue={values.StoreName} onChange={(e) => setStoreName(e.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId="image">
                            <Form.Label>Store Image</Form.Label>
                            <Form.Control type="text" defaultValue={values.StoreImage} onChange={(e) => setStoreImage(e.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" defaultValue={values.Email} onChange={(e) => setEmail(e.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId="contactNumber">
                            <Form.Label>Contact Number</Form.Label>
                            <Form.Control type="text" defaultValue={values.contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId="location">
                            <Form.Label>Location</Form.Label>
                            <Form.Control type="text" defaultValue={values.Location} onChange={(e) => setLocation(e.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control type="text" defaultValue={values.Category} onChange={(e) => setCategory(e.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId="openingtime">
                            <Form.Label>Opening Time</Form.Label>
                            <Form.Control type="text" defaultValue={values.OpeningTime} onChange={(e) => setOpeningTime(e.target.value)} required />
                        </Form.Group>
                        <Button className="finalpay" type="submit">Edit details</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ViewStores;
