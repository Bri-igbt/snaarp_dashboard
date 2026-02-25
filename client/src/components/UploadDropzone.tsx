import { useEffect, useRef, useState } from "react";
import { Folder, X, Upload, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

type UploadedItem = {
    id: string;
    name: string;
    type: string;
    preview?: string;
};

const UploadDropzone = () => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [items, setItems] = useState<UploadedItem[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const previewUrls = useRef<Set<string>>(new Set());

    useEffect(() => {
        return () => {
            previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
            previewUrls.current.clear();
        };
    }, []);

    const addFiles = (fileList: FileList | null) => {
        if (!fileList) return;

        const newItems: UploadedItem[] = Array.from(fileList).map((file) => {
            const preview = file.type.startsWith("image/")
                ? URL.createObjectURL(file)
                : undefined;

            if (preview) previewUrls.current.add(preview);

            return {
                id: crypto.randomUUID(),
                name: file.name,
                type: file.type,
                preview,
            };
        });

        setItems((prev) => [...prev, ...newItems]);
        setUploaded(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        setIsDragging(false);
        addFiles(e.dataTransfer.files);
    };

    const handleBrowse = () => {
        inputRef.current?.click();
    };

    const removeItem = (id: string) => {
        setItems((prev) => {
            const item = prev.find((i) => i.id === id);
            if (item?.preview) {
                URL.revokeObjectURL(item.preview);
                previewUrls.current.delete(item.preview);
            }
            return prev.filter((i) => i.id !== id);
        });
    };

    const handleUpload = async () => {
        if (items.length === 0) return;

        setUploading(true);
        toast.loading("Uploading files…", { id: "upload" });

        await new Promise((res) => setTimeout(res, 1500));

        setUploading(false);
        setUploaded(true);

        items.forEach((i) => {
            if (i.preview) URL.revokeObjectURL(i.preview);
        });
        previewUrls.current.clear();
        setItems([]);

        toast.success("Files uploaded successfully", { id: "upload" });
    };

    const hasItems = items.length > 0;

    return (
        <section
            className={`bg-white border-2 border-dashed rounded-xl transition
                min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh]
                p-4 sm:p-6 lg:p-8
                flex items-center justify-center
                ${
                isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-500"
            }`}
            aria-label="Upload area"
            onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
        >
            <input
                ref={inputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
            />

            {!hasItems && (
                <div
                    className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-center"
                    onClick={handleBrowse}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleBrowse()}
                >
                    <p className="text-lg font-medium text-gray-800">
                        Drag and drop your images and charts here
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        or <span className="text-blue-600 underline">browse to upload</span>
                    </p>

                    {uploaded && (
                        <p className="mt-3 flex items-center justify-center gap-1 text-sm text-green-600">
                            <CheckCircle size={14} />
                            Upload complete
                        </p>
                    )}
                </div>
            )}

            {hasItems && (
                <div className="flex h-full w-full flex-col items-center justify-center">
                    <div className="mb-6 flex flex-wrap justify-center gap-6">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="relative group w-24 h-24 rounded-lg bg-gray-100 border flex items-center justify-center"
                            >
                                <button
                                    type="button"
                                    onClick={() => removeItem(item.id)}
                                    className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                >
                                    <X size={14} />
                                </button>

                                {item.preview ? (
                                    <img
                                        src={item.preview}
                                        alt={item.name}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <Folder className="text-gray-500" size={36} />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <button
                            type="button"
                            onClick={handleBrowse}
                            className="text-sm text-blue-600 underline"
                        >
                            Add more files
                        </button>

                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={uploading}
                            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                        >
                            <Upload size={16} />
                            {uploading ? "Uploading…" : "Upload files"}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default UploadDropzone;