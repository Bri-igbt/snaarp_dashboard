import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./components/Dashboard";
import { Toaster } from "react-hot-toast";

function App() {
    return (
        <>
            <Toaster position="top-center" />
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Dashboard />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;