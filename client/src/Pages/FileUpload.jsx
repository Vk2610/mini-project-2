import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'

function FileUpload() {
    const [file, Setfile] = useState(null);
    const [uploadUrl, setUploadUrl] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [viewDocument, Setviewdocument] = useState(false);

    const file_upload_func = async () => {
        const formdata = new FormData();
        formdata.append('file', file)
        try {

            const response = await axios.post('http://localhost:3000/upload-pdf', formdata, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            });

            console.log(response.data);
            setUploadUrl(response.data.url);
            console.log(uploadUrl);

            alert("File Uploaded successfully!!")


        } catch (e) {
            alert(e)
        }
        axios.post
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Upload PDF Document
                    </h2>

                    <div className="space-y-4">
                        {/* File Upload Section */}
                        <div className="flex flex-col items-center justify-center w-full">
                            <label
                                htmlFor="file"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg
                                        className="w-10 h-10 mb-3 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">PDF files only</p>
                                </div>
                                <input
                                    id="file"
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                        const selectedFile = e.target.files[0];
                                        Setfile(selectedFile);
                                        if (selectedFile && selectedFile.type === 'application/pdf') {
                                            const fileURL = URL.createObjectURL(selectedFile);
                                            setPreviewUrl(fileURL);
                                        } else {
                                            setPreviewUrl(null);
                                            alert("Please select a valid PDF file");
                                        }
                                    }}
                                />
                            </label>
                        </div>

                        {/* File Preview */}
                        {previewUrl && (
                            <div className="mt-6 border rounded-lg overflow-hidden">
                                <embed
                                    src={previewUrl}
                                    type="application/pdf"
                                    className="w-full h-[600px]"
                                />
                            </div>
                        )}

                        {/* Upload Button */}
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={file_upload_func}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                    />
                                </svg>
                                Upload Document
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FileUpload
