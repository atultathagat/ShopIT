import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";
import {
    useDeleteProductImageMutation,
  useGetProductDetailsQuery,
  useUploadProductImagesMutation,
} from "../../redux/api/productApi";
import toast from "react-hot-toast";
import MetaData from "../layout/MetaData";

export default function UploadImages() {
  const fileInputRef = useRef(null);
  const params = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [uploadedImages, setUploadImages] = useState([]);
  const [deleteProductImage, {isLoading: isDeleteImageLoading, error: deleteImageError}] = useDeleteProductImageMutation();
  const { data } = useGetProductDetailsQuery(params?.id);
  const [uploadProductImages, { isLoading, isSuccess, isError, error }] =
    useUploadProductImagesMutation();
  useEffect(() => {
    if (data) {
      setUploadImages(data?.product?.images);
    }
    if (isSuccess) {
      setImagesPreview([]);
      toast.success("Images Uploaded");
      navigate("/admin/products");
    }
    if (isError) {
      toast.error(error?.data?.message);
    }
    if(deleteImageError) {
        toast.error(deleteImageError?.data?.message);
    }
  }, [data, isSuccess, isError, deleteImageError]);

  const submitButtonHandler = (e) => {
    e.preventDefault();
    uploadProductImages({ id: params?.id, body: { images } });
  };

  const onChangeHandler = (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((prevImage) => [...prevImage, reader?.result]);
          setImages((prevImage) => [...prevImage, reader?.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  const handleImagePreviewDelete = (image) => {
    setImagesPreview(imagesPreview.filter((img) => img !== image));
  };
  const handleResetHandler = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };
  const handleProductImageDelete = imgId => deleteProductImage({ id: params?.id, body: { imgId } });

  return (
    <AdminLayout>
                <MetaData  title="Upload Product Images"/>
      <div className="row wrapper">
        <div className="col-10 col-lg-8 mt-5 mt-lg-0">
          <form
            className="shadow rounded bg-body"
            enctype="multipart/form-data"
            onSubmit={submitButtonHandler}
          >
            <h2 className="mb-4">Upload Product Images</h2>

            <div className="mb-3">
              <label htmlFor="customFile" className="form-label">
                Choose Images
              </label>

              <div className="custom-file">
                <input
                  ref={fileInputRef}
                  type="file"
                  name="product_images"
                  className="form-control"
                  id="customFile"
                  multiple
                  onChange={onChangeHandler}
                  onClick={handleResetHandler}
                />
              </div>

              {!!imagesPreview.length && (
                <div className="new-images my-4">
                  <p className="text-warning">New Images:</p>
                  <div className="row mt-4">
                    {imagesPreview.map((image) => (
                      <div className="col-md-3 mt-2">
                        <div className="card">
                          <img
                            src={image}
                            alt="Card"
                            className="card-img-top p-2"
                            style={{ width: "100%", height: "80px" }}
                          />
                          <button
                            style={{
                              backgroundColor: "#dc3545",
                              borderColor: "#dc3545",
                            }}
                            type="button"
                            className="btn btn-block btn-danger cross-button mt-1 py-0"
                            onClick={() => handleImagePreviewDelete(image)}
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!!uploadedImages.length && (
                <div className="uploaded-images my-4">
                  <p className="text-success">Product Uploaded Images:</p>
                  <div className="row mt-1">
                    {uploadedImages.map((image) => (
                      <div className="col-md-3 mt-2">
                        <div className="card">
                          <img
                            src={image?.url}
                            alt="Card"
                            className="card-img-top p-2"
                            style={{ width: "100%", height: "80px" }}
                          />
                          <button
                            style={{
                              backgroundColor: "#dc3545",
                              borderColor: "#dc3545",
                            }}
                            className="btn btn-block btn-danger cross-button mt-1 py-0"
                            disabled={isDeleteImageLoading}
                            onClick={() => handleProductImageDelete(image?.public_id)}
                            type="button"
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              id="register_button"
              type="submit"
              className="btn w-100 py-2"
              disabled={isLoading || !images.length || isDeleteImageLoading}
            >
              {isLoading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
