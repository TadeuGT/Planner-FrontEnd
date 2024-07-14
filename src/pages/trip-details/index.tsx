import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateActivityModal } from "./create-activity-modal";
import { ImportantLinks } from "./important-links";
import { Guests } from "./guests";
import { Activities } from "./activities";
import { DestinationAndDateHeader } from "./destination-and-date-header";

export function TripDetailsPage() {
const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] = useState(false)

function openCreateActivityModal() {
    setIsCreateActivityModalOpen(true)
}

function closeCreateActivityModal() {
    setIsCreateActivityModalOpen(false)
}


    return (
        <div className="max-w-6xl px-6 py-5 mx-auto space-y-8">
        
            <div className="rounded-lg max-w-6xl px-6 py-3 mx-auto ">
                <a href="http://localhost:5173/"><img src="/logo.svg" alt="plann.er" className="hover:opacity-50" /></a>
            </div>

            <DestinationAndDateHeader />

            <main className="flex gap-16 px-4">

                <div className="flex-1 space-y-6">

                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-semibold">Atividades</h2>
                        <button onClick={openCreateActivityModal} className='bg-lime-300 text-lime-950 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-lime-400'>
                            <Plus className='size-5'/>
                            Cadastrar atividade
                        </button>
                    </div>

                    <Activities />
                </div>

                <div className="w-80 space-y-6">
                    <ImportantLinks />
                    <div className='w-full h-px bg-zinc-800 ' />
                    <Guests />
                </div>

            </main>

            {isCreateActivityModalOpen && (
                <CreateActivityModal closeCreateActivityModal={closeCreateActivityModal} />
            )}
            
            <div className="bg-zinc-900/70 rounded-lg max-w-6xl px-6 py-2 mx-auto shadow-shape flex justify-center">
                <img src="/logo.svg" alt="plann.er" className="opacity-10 hover:opacity-100" /> 
            </div>

        </div>
    )
}