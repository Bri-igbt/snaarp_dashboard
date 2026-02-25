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
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import SortableItem from "../components/SortableItem";
import WidgetCard from "../components/WidgetCard";
import UploadDropzone from "../components/UploadDropzone";
import { initialWidgets } from "../data";
import type { Widget } from "../types/widget";

const LAYOUT_STORAGE_KEY = "dashboard-layout";

const Dashboard = () => {
    const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

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
                        (w) =>
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
            localStorage.setItem(
                LAYOUT_STORAGE_KEY,
                JSON.stringify(widgets)
            );
        } catch (error) {
            console.log(error);
        }
    }, [widgets]);

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

    return (
        <>
            <div className="flex mb-6">
                <button
                    type="button"
                    onClick={() => setIsUploadOpen(true)}
                    className="ml-auto rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Upload
                </button>
            </div>

            <div className="space-y-10">
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
                        <UploadDropzone />
                    </div>
                </div>
            )}
        </>
    );
};

export default Dashboard;