/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import { UploadCloud, X } from "lucide-react";
import handlePostApi from "../../API/Handler/postApi.handler";
import Cropper from "react-easy-crop";

export default function ImageUploader({
    initialImage,
    onImageUpload,
    onDelete
}) {
    const [image, setImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [imageSrc, setImageSrc] = useState("");
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);

    // useEffect(() => {
    //     setImage(initialImage);
    // }, [initialImage]);

    useEffect(() => {
        if (initialImage) {
            setImage(initialImage);
        } else {
            setImage(null);
        }
    }, [initialImage]);

    const onCropComplete = useCallback((_, pixels) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", (error) => reject(error));
            image.setAttribute("crossOrigin", "anonymous");
            image.src = url;
        });

    const getCroppedImg = async (
        imageSrc,
        pixelCrop,
        maxWidth = 1200,
        quality = 0.8
    ) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            throw new Error("No 2d context");
        }

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const cropWidth = pixelCrop.width * scaleX;
        const cropHeight = pixelCrop.height * scaleY;

        let finalWidth = cropWidth;
        let finalHeight = cropHeight;

        if (finalWidth > maxWidth) {
            const ratio = maxWidth / finalWidth;
            finalWidth = maxWidth;
            finalHeight = finalHeight * ratio;
        }

        canvas.width = finalWidth;
        canvas.height = finalHeight;

        ctx.drawImage(
            image,
            pixelCrop.x * scaleX,
            pixelCrop.y * scaleY,
            cropWidth,
            cropHeight,
            0,
            0,
            finalWidth,
            finalHeight
        );

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        throw new Error("Canvas is empty");
                    }
                    const url = URL.createObjectURL(blob);
                    resolve({ blob, url });
                },
                "image/jpeg",
                quality
            );
        });
    };

    const compressImage = async (
        blob,
        targetSize = 1024 * 1024
    ) => {
        let quality = 0.8;
        let compressedBlob = blob;
        let attempts = 0;
        const maxAttempts = 5;

        while (compressedBlob.size > targetSize && attempts < maxAttempts && quality > 0.1) {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = await createImage(URL.createObjectURL(compressedBlob));

            if (!ctx) {
                throw new Error("No 2d context");
            }

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            compressedBlob = await new Promise((resolve) => {
                canvas.toBlob(
                    (b) => {
                        if (!b) {
                            throw new Error("Canvas is empty");
                        }
                        resolve(b);
                    },
                    "image/jpeg",
                    quality
                );
            });

            quality -= 0.1;
            attempts++;
        }

        const url = URL.createObjectURL(compressedBlob);
        return { blob: compressedBlob, url };
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.addEventListener("load", () => {
            setImageSrc(reader.result);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setCroppedAreaPixels(null);
            setShowCropModal(true); // Show modal when image is selected
        });
        reader.readAsDataURL(file);
    };

    const handleProcessAndUpload = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        setIsUploading(true);
        try {
            const { blob: croppedBlob } = await getCroppedImg(imageSrc, croppedAreaPixels);
            const { blob: finalBlob } = await compressImage(croppedBlob);

            const formData = new FormData();
            formData.append("image", finalBlob, "image.jpg");

            const { data } = await handlePostApi(`image/upload`, formData);
            if (data) {
                setImage(data);
                onImageUpload(data);
                setShowCropModal(false);
            } else {
                throw new Error("Upload failed");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleCancelCrop = () => {
        setImageSrc("");
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        setShowCropModal(false);
    };

    const handleRemoveImage = () => {
        setImage(null);
        onImageUpload(null);
        onDelete(image);
    };

    return (
        <div className="space-y-3">
            {image && image.url ? (
                <div className="relative group">
                    <img
                        src={image.url}
                        alt="Preview"
                        className="rounded-lg object-cover w-full h-48 border border-gray-200 shadow-sm"
                    />
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1.5 transition-opacity opacity-0 group-hover:opacity-100 shadow-md border border-gray-200"
                        aria-label="Remove image"
                    >
                        <X className="w-4 h-4 text-gray-700" />
                    </button>
                </div>
            ) : (
                <label className={`
                    flex flex-col items-center justify-center w-full h-48
                    border-2 border-dashed rounded-lg cursor-pointer
                    ${isUploading
                        ? 'bg-gray-100 border-blue-400'
                        : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'}
                    transition-colors duration-200 overflow-hidden relative
                `}>
                    {isUploading ? (
                        <div className="flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-3"></div>
                            <p className="text-sm text-gray-600 font-medium">Uploading...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                            <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-400">
                                PNG, JPG, WEBP
                            </p>
                        </div>
                    )}
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                </label>
            )}

            {/* Crop Modal */}
            {showCropModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-800">Edit Image</h3>
                            <button
                                onClick={handleCancelCrop}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="relative flex-grow h-[60vh]">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                                aspect={1}
                                cropShape="rect"
                                showGrid={true}
                                classes={{ containerClassName: "bg-gray-800" }}
                            />
                        </div>

                        <div className="p-4 bg-gray-50 border-t">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Zoom: {zoom.toFixed(1)}x
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="3"
                                        step="0.1"
                                        value={zoom}
                                        onChange={(e) => setZoom(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={handleCancelCrop}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                                    disabled={isUploading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleProcessAndUpload}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center transition-colors"
                                    disabled={isUploading}
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        "Apply"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}