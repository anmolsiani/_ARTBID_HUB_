'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { artAPI } from '@/lib/api';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Upload as UploadIcon, Image as ImageIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';

export default function UploadPage() {
    const router = useRouter();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'abstract',
        type: 'human',
        price: '',
        tags: '',
    });

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
        maxFiles: 5,
        onDrop: (acceptedFiles) => {
            const newImages = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );
            setImages((prev) => [...prev, ...newImages].slice(0, 5));
        },
    });

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (images.length === 0) {
            toast.error('Please add at least one image');
            return;
        }

        if (!formData.title) {
            toast.error('Please add a title');
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();
            images.forEach((image) => {
                data.append('images', image);
            });
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('type', formData.type);
            if (formData.price) data.append('price', formData.price);
            if (formData.tags) data.append('tags', formData.tags);

            const response = await artAPI.create(data);
            toast.success('Artwork uploaded successfully!');
            router.push(`/art/${response.data._id}`);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload artwork');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Upload Artwork</h1>
                <p className="text-muted-foreground">Share your creative work with the community</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium mb-3">Artwork Images *</label>
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${isDragActive
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary hover:bg-secondary/50'
                            }`}
                    >
                        <input {...getInputProps()} />
                        <UploadIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        {isDragActive ? (
                            <p className="text-lg font-medium">Drop your images here...</p>
                        ) : (
                            <>
                                <p className="text-lg font-medium mb-2">
                                    Drag & drop images here, or click to select
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Up to 5 images (JPEG, PNG, GIF, WebP)
                                </p>
                            </>
                        )}
                    </div>

                    {/* Image Previews */}
                    {images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                            {images.map((image, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={image.preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full aspect-square object-cover rounded-lg border border-border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Title */}
                <Input
                    label="Title *"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Give your artwork a title"
                    required
                />

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Tell us about your artwork..."
                        rows={4}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Category & Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Category *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="abstract">Abstract</option>
                            <option value="portrait">Portrait</option>
                            <option value="landscape">Landscape</option>
                            <option value="digital">Digital Art</option>
                            <option value="photography">Photography</option>
                            <option value="sculpture">Sculpture</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Type *</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="human">✋ Human Made</option>
                            <option value="ai">🤖 AI Generated</option>
                        </select>
                    </div>
                </div>

                {/* Price & Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Price (USD)"
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                    />

                    <Input
                        label="Tags (comma-separated)"
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="modern, colorful, abstract"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="flex-1"
                        loading={loading}
                        disabled={loading}
                    >
                        <UploadIcon className="w-5 h-5" />
                        {loading ? 'Uploading...' : 'Upload Artwork'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={() => router.back()}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
