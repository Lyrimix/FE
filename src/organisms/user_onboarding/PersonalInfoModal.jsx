import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap"; // Import Spinner
import { uploadImageToCloudinary } from "../../apis/ProjectApi";
import "./PersonalInfoModal.scss";

export const PersonalInfoModal = ({ show, onClose, personalInfo, onSave }) => {
  const [formData, setFormData] = useState({
    ...personalInfo,
    password: "",
  });
  const fileInputRef = useRef(null); // Ref cho input file
  const [isUploading, setIsUploading] = useState(false); // State quản lý trạng thái upload

  useEffect(() => {
    console.log("personalInfo", personalInfo);
    setFormData({
      ...personalInfo,
      password: "", 
    });
  }, [personalInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    if (dataToSave.password === "") {
      delete dataToSave.password;
    }
    onSave(dataToSave);
  };

  const onUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn một file ảnh.');
        event.target.value = null; 
        return;
      }

      setIsUploading(true); // Bắt đầu tải lên
      try {
        // Gọi API tải ảnh lên Cloudinary
        const uploadedUrl = await uploadImageToCloudinary(file); // Hàm này phải trả về URL của ảnh
        if (uploadedUrl) {
          setFormData((prevData) => ({
            ...prevData,
            avatar: uploadedUrl,
          }));
        }
      } catch (error) {
        console.error("Lỗi khi tải ảnh lên:", error);
        alert("Không thể tải ảnh đại diện. Vui lòng thử lại.");
      } finally {
        setIsUploading(false); 
        event.target.value = null; 
      }
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered className="PersonalInfoModal">
      <Modal.Header closeButton>
        <Modal.Title>Edit Personal Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* onSubmit={handleSubmit} trên thẻ Form */}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formAvatar">
            <Form.Label>Avatar</Form.Label>
            <div className="d-flex align-items-center justify-content-center avatar-upload-area">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Avatar" className="current-avatar-img" />
              ) : (
                <img
                  src="https://res.cloudinary.com/dy8p5yjsd/image/upload/v1731150727/e3e8df1e56e1c8839457b42bdcd750e5_smkmhm.jpg"
                  alt="Default Avatar"
                  className="current-avatar-img"
                />
              )}
              <button
                type="button" 
                className="btn-upload"
                onClick={onUploadButtonClick}
                disabled={isUploading} 
              >
                {isUploading ? <Spinner animation="border" size="sm" /> : "Upload"}
              </button>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={onFileChange}
              />
            </div>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formFullname">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter full name"
              name="fullname"
              value={formData.fullname || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              disabled 
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter phone number"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              name="username"
              value={formData.username || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password (leave blank to keep current)" // Gợi ý cho người dùng
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit" 
            className="w-100 mt-3 submit-btn"
            disabled={isUploading} 
          >
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};