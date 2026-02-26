import { useEffect, useRef, useState } from "react";
import { Upload, X, CheckCircle, Folder } from "lucide-react";
import toast from "react-hot-toast";

type UploadedItem = {
    id: string;
    name: string;
    type: string;
    size: number;
    file?: File;
    preview?: string;
};

export type UploadedAsset = {
    id: string;
    name: string;
    type: string;
    size: number;
    dataUrl: string;
    createdAt: number;
};

type UploadDropzoneProps = {
    onComplete?: (files: UploadedAsset[]) => void;
};

const UploadDropzone = ({ onComplete }: UploadDropzoneProps) => {
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

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    const addFiles = (fileList: FileList | null) => {
        if (!fileList) return;

        const files = Array.from(fileList);
        const tooLarge = files.filter((f) => f.size > MAX_FILE_SIZE);
        const allowed = files.filter((f) => f.size <= MAX_FILE_SIZE);

        if (tooLarge.length > 0) {
            const names = tooLarge.slice(0, 3).map((f) => f.name).join(", ");
            const more = tooLarge.length > 3 ? ` and ${tooLarge.length - 3} more` : "";
            toast.error(`Some files exceed the 5MB limit: ${names}${more}`);
        }

        if (allowed.length === 0) return;

        const newItems: UploadedItem[] = allowed.map((file) => {
            const preview = file.type.startsWith("image/")
                ? URL.createObjectURL(file)
                : undefined;

            if (preview) previewUrls.current.add(preview);

            return {
                id: crypto.randomUUID(),
                name: file.name,
                type: file.type,
                size: file.size,
                file,
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

    const fileToDataUrl = (file: File) =>
        new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const handleUpload = async () => {
        if (items.length === 0) return;

        setUploading(true);
        toast.loading("Uploading files…", { id: "upload" });

        // Simulate network delay
        await new Promise((res) => setTimeout(res, 800));

        // Convert selected files to data URLs for persistence/display
        const assetsPromises = items
            .filter((i) => !!i.file)
            .map(async (i) => {
                const dataUrl = await fileToDataUrl(i.file as File);
                const asset = {
                    id: crypto.randomUUID(),
                    name: i.name,
                    type: i.type,
                    size: i.size,
                    dataUrl,
                    createdAt: Date.now(),
                } as UploadedAsset;
                return asset;
            });
        const assets = await Promise.all(assetsPromises);

        setUploading(false);
        setUploaded(true);

        // Cleanup previews
        items.forEach((i) => {
            if (i.preview) URL.revokeObjectURL(i.preview);
        });
        previewUrls.current.clear();
        setItems([]);

        // Notify parent
        onComplete?.(assets);

        toast.success("Files uploaded successfully", { id: "upload" });
    };

    const hasItems = items.length > 0;

    return (
        <section
            className={`
                relative
                min-h-[50vh] sm:min-h-[70vh]
                w-full
                rounded-xl
                border-2 border-dashed
                transition-all duration-300
                flex items-center justify-center
                bg-white/75
                ${
                isDragging
                    ? "border-blue-500 bg-[#0f1b33]"
                    : "border-slate-500/40"
            }
            `}
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
                    onClick={handleBrowse}
                    className="flex flex-col items-center justify-center text-center cursor-pointer select-none"
                >
                    {/* Cloud Upload Icon */}
                    <div className="mb-6 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-slate-600/40 flex items-center justify-center">
                            <Upload
                                size={40}
                                className="text-slate-300"
                                strokeWidth={1.5}
                            />
                        </div>
                    </div>

                    {/* Main Text */}
                    <h2 className="text-2xl sm:text-3xl font-semibold">
                        Drag and Drop assets here
                    </h2>

                    <p className="mt-4 text-lg text-slate-800">Or</p>

                    {/* Browse Button */}
                    <button
                        type="button"
                        className="mt-6 px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium transition"
                    >
                        Browse
                    </button>

                    {uploaded && (
                        <p className="mt-5 flex items-center gap-2 text-green-400 text-sm">
                            <CheckCircle size={16} />
                            Upload complete
                        </p>
                    )}
                </div>
            )}

            {hasItems && (
                <div className="flex flex-col items-center justify-center w-full px-6">
                    <div className="mb-8 flex flex-wrap justify-center gap-6">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="relative group w-28 h-28 rounded-lg bg-slate-700 border border-slate-600 flex items-center justify-center"
                            >
                                <button
                                    type="button"
                                    onClick={() => removeItem(item.id)}
                                    className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
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
                                    <Folder
                                        className="text-slate-300"
                                        size={36}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <button
                            type="button"
                            onClick={handleBrowse}
                            className="text-sm text-blue-400 underline"
                        >
                            Add more files
                        </button>

                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={uploading}
                            className="flex items-center gap-2 px-8 py-3 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                        >
                            <Upload size={18} />
                            {uploading ? "Uploading…" : "Upload files"}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default UploadDropzone;