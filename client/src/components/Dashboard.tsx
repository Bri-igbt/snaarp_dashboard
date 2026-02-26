import {
    DndContext,
    closestCenter,
    type DragEndEvent,
    useSensors,
    useSensor,
    PointerSensor,
    KeyboardSensor,
} from "@dnd-kit/core";
import {
    SortableContext,
    rectSortingStrategy,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import SortableItem from "../components/SortableItem";
import SortableRow from "../components/SortableRow";
import WidgetCard from "../components/WidgetCard";
import UploadDropzone, { type UploadedAsset } from "../components/UploadDropzone";
import { initialWidgets } from "../data";
import type { Widget } from "../types/widget";
import { LayoutGrid, Table as TableIcon } from "lucide-react";

const LAYOUT_STORAGE_KEY = "dashboard-layout";
const UPLOADS_STORAGE_KEY = "uploaded-assets";
const UPLOADS_LAYOUT_KEY = "uploads-layout";

type UploadsLayout = "grid" | "table";

const Dashboard = () => {
    const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const [uploads, setUploads] = useState<UploadedAsset[]>([]);
    const [previewItem, setPreviewItem] = useState<UploadedAsset | null>(null);
    const [uploadsLayout, setUploadsLayout] = useState<UploadsLayout>("table");

    useEffect(() => {
        try {
            const saved =
                typeof window !== "undefined"
                    ? localStorage.getItem(LAYOUT_STORAGE_KEY)
                    : null;

            if (saved) {
                const parsed = JSON.parse(saved);
                if (
                    Array.isArray(parsed) &&
                    parsed.every(
                        (w: any) =>
                            w &&
                            typeof w.id === "string" &&
                            typeof w.title === "string"
                    )
                ) {
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setWidgets(parsed as Widget[]);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        try {
            const saved =
                typeof window !== "undefined"
                    ? localStorage.getItem(UPLOADS_STORAGE_KEY)
                    : null;
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setUploads(parsed as UploadedAsset[]);
                }
            }
        } catch (e) {
            console.log(e);
        }

        try {
            const savedLayout =
                typeof window !== "undefined"
                    ? localStorage.getItem(UPLOADS_LAYOUT_KEY)
                    : null;
            if (savedLayout === "grid" || savedLayout === "table") {
                setUploadsLayout(savedLayout);
            }
        } catch (e) {
            console.log(e);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(UPLOADS_LAYOUT_KEY, uploadsLayout);
        } catch (e) {
            console.log(e);
        }
    }, [uploadsLayout]);

    useEffect(() => {
        try {
            localStorage.setItem(
                LAYOUT_STORAGE_KEY,
                JSON.stringify(widgets)
            );
        } catch (error) {
            console.log(error);
        }
    }, [widgets]);

    // Helpers
    const saveUploads = (next: UploadedAsset[]) => {
        setUploads(next);
        try {
            localStorage.setItem(UPLOADS_STORAGE_KEY, JSON.stringify(next));
        } catch (e) {
            console.log(e);
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setWidgets((items) => {
            const oldIndex = items.findIndex((i) => i.id === active.id);
            const newIndex = items.findIndex((i) => i.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
        });
    };

    const handleUploadsDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = uploads.findIndex((i) => i.id === active.id);
        const newIndex = uploads.findIndex((i) => i.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;
        const next = arrayMove(uploads, oldIndex, newIndex);
        saveUploads(next);
    };

    // Upload handlers
    const handleUploadComplete = (files: UploadedAsset[]) => {
        const next = [...files, ...uploads];
        saveUploads(next);
        setIsUploadOpen(false); // close modal after upload
    };

    const handleDelete = (id: string) => {
        const next = uploads.filter((u) => u.id !== id);
        saveUploads(next);
    };

    const handleRename = (id: string) => {
        const item = uploads.find((u) => u.id === id);
        if (!item) return;
        const name = window.prompt("Rename file", item.name) || item.name;
        if (name && name !== item.name) {
            const next = uploads.map((u) => (u.id === id ? { ...u, name } : u));
            saveUploads(next);
        }
    };

    const handleActionSelect = (
        action: string,
        id: string,
        item: UploadedAsset
    ) => {
        switch (action) {
            case "view":
                setPreviewItem(item);
                break;
            case "edit":
                handleRename(id);
                break;
            case "delete":
                handleDelete(id);
                break;
            default:
                break;
        }
    };

    const formatBytes = (bytes: number) => {
        if (!bytes && bytes !== 0) return "-";
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        if (bytes === 0) return "0 B";
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    };

    return (
        <>
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center rounded-lg border border-gray-200 bg-white shadow-sm">
                    <button
                        type="button"
                        onClick={() => setUploadsLayout("grid")}
                        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-l-lg ${uploadsLayout === "grid" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}
                        aria-pressed={uploadsLayout === "grid"}
                        aria-label="Grid layout"
                        title="Grid layout"
                    >
                        <LayoutGrid size={16} />
                        <span className="hidden sm:inline">Grid</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setUploadsLayout("table")}
                        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-r-lg border-l ${uploadsLayout === "table" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}
                        aria-pressed={uploadsLayout === "table"}
                        aria-label="Table layout"
                        title="Table layout"
                    >
                        <TableIcon size={16} />
                        <span className="hidden sm:inline">Table</span>
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => setIsUploadOpen(true)}
                    className="ml-auto rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Upload
                </button>
            </div>

            <div className="space-y-10">
                <section className="bg-white p-4 md:p-6 rounded-xl shadow ring-1 ring-gray-200">
                    <header className="mb-4 flex items-center justify-between">
                        <h3 className="text-base md:text-lg font-semibold text-gray-800">Uploaded Files</h3>
                        <span className="text-xs text-gray-500">{uploads.length} item{uploads.length !== 1 ? "s" : ""}</span>
                    </header>

                    {uploads.length === 0 ? (
                        <p className="text-sm text-gray-500">No files uploaded yet.</p>
                    ) : uploadsLayout === "table" ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                <tr className="text-left text-gray-500">
                                    <th className="py-2 pr-4 hidden sm:table-cell">Preview</th>
                                    <th className="py-2 pr-4">Name</th>
                                    <th className="py-2 pr-4 hidden sm:table-cell">Type</th>
                                    <th className="py-2 pr-4 hidden sm:table-cell">Size</th>
                                    <th className="py-2 pr-4 hidden md:table-cell">Uploaded</th>
                                    <th className="py-2 pr-4">Actions</th>
                                </tr>
                                </thead>
                                <DndContext
                                    collisionDetection={closestCenter}
                                    sensors={sensors}
                                    onDragEnd={handleUploadsDragEnd}
                                >
                                    <SortableContext
                                        items={uploads.map((u) => u.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <tbody>
                                        {uploads.map((u) => (
                                            <SortableRow key={u.id} id={u.id}>
                                                <td className="py-3 pr-4 hidden sm:table-cell">
                                                    {u.type?.startsWith("image/") ? (
                                                        <img src={u.dataUrl} alt={u.name} className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded" />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">FILE</div>
                                                    )}
                                                </td>

                                                <td className="py-3 pr-4">
                                                    <div className="max-w-[120px] xs:max-w-[160px] sm:max-w-[240px] truncate" title={u.name}>
                                                        {u.name}
                                                    </div>
                                                </td>

                                                <td className="py-3 pr-4 hidden sm:table-cell">{u.type || "-"}</td>
                                                <td className="py-3 pr-4 hidden sm:table-cell">{formatBytes(u.size)}</td>
                                                <td className="py-3 pr-4 hidden md:table-cell">{new Date(u.createdAt).toLocaleString()}</td>
                                                <td className="py-3 pr-4">
                                                    <div className="hidden sm:flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setPreviewItem(u)}
                                                            className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-600 hover:bg-blue-100"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRename(u.id)}
                                                            className="px-2 py-1 text-xs rounded bg-amber-50 text-amber-700 hover:bg-amber-100"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(u.id)}
                                                            className="px-2 py-1 text-xs rounded bg-rose-50 text-rose-600 hover:bg-rose-100"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                    <div className="sm:hidden">
                                                        <label className="sr-only" htmlFor={`act-${u.id}`}>Actions for {u.name}</label>
                                                        <select
                                                            id={`act-${u.id}`}
                                                            className="px-2 py-1 text-xs border rounded w-24"
                                                            defaultValue=""
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (val) {
                                                                    handleActionSelect(val, u.id, u);
                                                                    e.currentTarget.value = "";
                                                                }
                                                            }}
                                                        >
                                                            <option value="" disabled>Actions</option>
                                                            <option value="view">View</option>
                                                            <option value="edit">Edit</option>
                                                            <option value="delete">Delete</option>
                                                        </select>
                                                    </div>
                                                </td>
                                            </SortableRow>
                                        ))}
                                        </tbody>
                                    </SortableContext>
                                </DndContext>
                            </table>
                        </div>
                    ) : (
                        <DndContext
                            collisionDetection={closestCenter}
                            sensors={sensors}
                            onDragEnd={handleUploadsDragEnd}
                        >
                            <SortableContext
                                items={uploads.map((u) => u.id)}
                                strategy={rectSortingStrategy}
                            >
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {uploads.map((u) => (
                                        <SortableItem key={u.id} id={u.id}>
                                            <div className="group bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition cursor-grab active:cursor-grabbing">
                                                {/* Preview image - hidden on small screens */}
                                                <div className="aspect-square w-full rounded-md overflow-hidden bg-gray-100 flex items-center justify-center hidden sm:flex">
                                                    {u.type?.startsWith("image/") ? (
                                                        <img src={u.dataUrl} alt={u.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="text-gray-400 text-xs">FILE</div>
                                                    )}
                                                </div>
                                                <div className="mt-2">
                                                    <div className="text-xs font-medium text-gray-800 truncate max-w-[120px] xs:max-w-[140px] sm:max-w-full" title={u.name}>
                                                        {u.name}
                                                    </div>

                                                    <div className="text-[10px] text-gray-500 hidden sm:block">
                                                        {formatBytes(u.size)}
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <div className="hidden sm:flex gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => setPreviewItem(u)}
                                                            className="px-2 py-1 text-[11px] rounded bg-blue-50 text-blue-600 hover:bg-blue-100"
                                                        >View</button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRename(u.id)}
                                                            className="px-2 py-1 text-[11px] rounded bg-amber-50 text-amber-700 hover:bg-amber-100"
                                                        >Edit</button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(u.id)}
                                                            className="px-2 py-1 text-[11px] rounded bg-rose-50 text-rose-600 hover:bg-rose-100"
                                                        >Delete</button>
                                                    </div>

                                                    <div className="sm:hidden">
                                                        <label className="sr-only" htmlFor={`card-act-${u.id}`}>Actions for {u.name}</label>
                                                        <select
                                                            id={`card-act-${u.id}`}
                                                            className="mt-1 w-full px-2 py-1 text-[11px] border rounded"
                                                            defaultValue=""
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (val) {
                                                                    handleActionSelect(val, u.id, u);
                                                                    e.currentTarget.value = "";
                                                                }
                                                            }}
                                                        >
                                                            <option value="" disabled>Actions</option>
                                                            <option value="view">View</option>
                                                            <option value="edit">Edit</option>
                                                            <option value="delete">Delete</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </SortableItem>
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </section>

                <DndContext
                    collisionDetection={closestCenter}
                    sensors={sensors}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={widgets.map((w) => w.id)}
                        strategy={rectSortingStrategy}
                    >
                        <div
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                            role="list"
                            aria-label="Draggable dashboard widgets"
                        >
                            {widgets.map((widget) => (
                                <SortableItem key={widget.id} id={widget.id}>
                                    <WidgetCard title={widget.title} />
                                </SortableItem>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            {isUploadOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setIsUploadOpen(false)}
                    />

                    <div className="relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">
                                Upload Files
                            </h2>

                            <button
                                onClick={() => setIsUploadOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <UploadDropzone onComplete={handleUploadComplete} />
                    </div>
                </div>
            )}

            {previewItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setPreviewItem(null)} />
                    <div className="relative z-10 max-w-4xl w-[90vw] max-h-[90vh] bg-white rounded-xl p-4 shadow-lg flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-gray-800">{previewItem.name}</h4>
                                <p className="text-xs text-gray-500">{previewItem.type} • {formatBytes(previewItem.size)}</p>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600" onClick={() => setPreviewItem(null)}>✕</button>
                        </div>
                        {previewItem.type?.startsWith("image/") ? (
                            <img src={previewItem.dataUrl} alt={previewItem.name} className="object-contain w-full h-[70vh]" />
                        ) : (
                            <div className="flex-1 grid place-items-center text-gray-500">No preview available for this file type.</div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Dashboard;