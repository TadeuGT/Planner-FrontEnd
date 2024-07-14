import { X, AtSign, User } from "lucide-react";
import { Button } from "../../components/button";
import { FormEvent } from "react";
import { api } from "../../lib/axios";
import { useParams } from "react-router-dom";

interface ManageGuestsModalProps {
    closeManageGuestsModal: () => void
}

export function ManageGuestsModal({
    closeManageGuestsModal,
}: ManageGuestsModalProps) {

    const { tripId } = useParams()

    async function inviteGuest(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const data = new FormData(event.currentTarget)

        const email = data.get('email')?.toString()
        const name = data.get('name')?.toString()
        
        //console.log({title, occurs_at})
        const response = await api.post(`/trips/${tripId}/invites`, {
            email,
            name,
        })

        console.log(`[Debug] linkID: ${response.data.participantId}`)
        closeManageGuestsModal()

        window.document.location.reload()
        {/* Quando adiciona-se um novo link, o componente de listar links não é recarregado automaticamente. */}
    }
    
    return (
        <div className='fixed inset-0 bg-black/60 flex items-center justify-center'>
        <div className='w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5'>
        <div className='space-y-2'>
            <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold'>Adicionar convidado</h2>
                <button onClick={closeManageGuestsModal} type="button">
                    <X className='size-5 text-zinc-400'/>
                </button>
            </div>
        <p className='text-sm text-zinc-400'>
        Os convidados irão receber e-mails para confirmar a participação na viagem.
        </p>
        </div>

        <form onSubmit={inviteGuest} className='space-y-3'>
            <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                <AtSign className='text-zinc-400 size-5'/>
                <input 
                    name="email"
                    placeholder='Digite o e-mail do convidado' 
                    className='bg-transparent text-lg placeholder-zinc-400 outline-none flex-1' 
                />
            </div>
            
            <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                <User className='text-zinc-400 size-5'/>
                <input 
                    name="name"
                    placeholder='Nome do convidado'
                    className='bg-transparent text-lg placeholder-zinc-400 outline-none flex-1' 
                />
            </div>

            
            <Button variant="primary" size="full">
                Adicionar convidado
            </Button>

        </form>


        </div>
    </div>
    )
}