import { Outlet } from "react-router-dom"

const LayoutOuter = () => {
    return (
        <main className="App">
            <Outlet />
        </main>
    )
}

export default LayoutOuter