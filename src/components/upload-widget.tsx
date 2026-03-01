import { BACKEND_BASE_URL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@/constants';
import { UploadWidgetValue } from '@/types';
import { Trash2, UploadCloudIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react'

const UploadWidget = ({ value = null, onChange, disabled = false }: {
    value?: UploadWidgetValue | null;
    onChange?: (value: UploadWidgetValue | null) => void;
    disabled?: boolean;
}) => {

    const widgetRef = useRef<CloudinaryWidget | null>(null);
    const onChangeRef = useRef(onChange);
    const [preview, setPreview] = useState<UploadWidgetValue | null>(value);
    const [deleteToken, setDeleteToken] = useState<string | null>(null);
    const [isRemoving, setIsRemoving] = useState(false);

    const openWidget = () => {
        if (!disabled) widgetRef.current?.open();
    }
    const removeFromCloudinary = async () => {
        if (!deleteToken) return;
        setIsRemoving(true);
        try {
            const response = await fetch(`${BACKEND_BASE_URL}/api/cloudinary/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ publicId: deleteToken }),
            });
            if (!response.ok) {
                throw new Error('Failed to remove image');
            }
            setPreview(null);
            setDeleteToken(null);
            onChangeRef.current?.(null);
        } catch (error) {
            console.error('Error removing image:', error);
        } finally {
            setIsRemoving(false);
        }
    }

    useEffect(() => {
        setPreview(value);
        if (!value) setDeleteToken(null);
    }, [value]);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const initializeWidget = () => {
            if (!window.cloudinary || widgetRef.current) return false;

            widgetRef.current = window.cloudinary.createUploadWidget({
                cloudName: CLOUDINARY_CLOUD_NAME,
                uploadPreset: CLOUDINARY_UPLOAD_PRESET,
                multiple: false,
                resourceType: 'image',
                folder: 'uploads',
                clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
                maxFileSize: 5 * 1024 * 1024, // 5MB

            }, (error, result) => {
                if (!error && result.event === 'success') {
                    const payload = {
                        url: result.info.secure_url,
                        publicId: result.info.public_id,

                    };
                    setPreview(payload);
                    setDeleteToken(result.info.delete_token || null);
                    onChangeRef.current?.(payload);
                }
            });
            return true;
        };
        if (initializeWidget()) return;

        const intervalId = window.setInterval(() => {
            if (initializeWidget()) window.clearInterval(intervalId);
        }, 500);
        return () => window.clearInterval(intervalId);
    }, []);

    return (
        <div className='space-y-2'>
            {preview ? (
                <div className='upload-preview'>
                    <img src={preview.url} alt="Preview" />
                    <button onClick={removeFromCloudinary} disabled={isRemoving}>
                        {isRemoving ? 'Removing...' : 'Remove'} <Trash2 className="icon" />
                    </button>
                </div>
            ) : (
                <div className="upload-dropzone" role='button' tabIndex={0} onClick={openWidget} onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        openWidget();
                    }
                }} >
                    <div className='upload-prompt'>
                        <UploadCloudIcon className='icon' />
                        <div className='upload-text-wrapper'>
                            <p className='upload-text'>Click to upload</p>
                            <p className='upload-text-small'>or drag and drop</p>
                            <p className='upload-text-small'>PNG, JPG up to 5MB)</p>
                        </div>
                    </div>


                </div>
            )}
        </div>
    )
}

export default UploadWidget