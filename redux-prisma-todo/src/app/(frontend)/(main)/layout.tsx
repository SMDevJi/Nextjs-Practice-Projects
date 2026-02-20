import NavBar from "@/components/NavBar";
import TasksSync from "@/components/TasksSync";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex  text-white p-3">
            <div className="nav w-80 h-[95vh] p-3">
                <NavBar />
            </div>
            <div className=" h-[95vh] w-full p-3 ">
                <TasksSync/>
                {children}
            </div>
        </div>
    );
}
