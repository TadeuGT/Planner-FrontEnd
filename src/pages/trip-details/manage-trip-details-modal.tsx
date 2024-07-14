import { format } from "date-fns";
import { toZonedTime } from 'date-fns-tz';
import { Calendar, MapPin, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import { useParams } from "react-router-dom";
import { Button } from "../../components/button";
import { api } from "../../lib/axios";


interface Trip {
    id: string
    destination: string
    starts_at: string
    ends_at: string
}

interface ManageTripDetailsModalProps {
    onClose: () => void;
}

export function ManageTripDetaisModal({onClose}: ManageTripDetailsModalProps) {
    
    const {tripId} = useParams()

    const [newStartAndEndDates, setNewStartAndEndDates] = useState<DateRange>()
    const [trip, setTrip] = useState<Trip | undefined>()
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

    useEffect(() => {
        api.get(`/trips/${tripId}`).then(response => setTrip(response.data.trip))
    }, [tripId])

    
    const originalDisplayedDate = trip?.starts_at && trip?.ends_at
    ? format(trip?.starts_at, "d' de 'LLL").concat(' até ').concat(format(trip?.ends_at, "d' de 'LLL"))
    : null
    
    const newDisplayedDate = newStartAndEndDates && newStartAndEndDates.from && newStartAndEndDates.to
    ? format(newStartAndEndDates.from, "d' de 'LLL").concat(' até ').concat(format(newStartAndEndDates.to, "d' de 'LLL"))
    : null

    function openDatePicker() {
        return setIsDatePickerOpen(true)
    }
    
    function closeDatePicker() {
        return setIsDatePickerOpen(false)
    }    

    async function manageTripDetails(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const data = new FormData(event.currentTarget)

        const newDestination = data.get('local')

        const newStartDateFormatted = newStartAndEndDates?.from
        ? format(toZonedTime(newStartAndEndDates?.from, 'UTC'), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
        : '';

        const newEndDateFormatted = newStartAndEndDates?.to
        ? format(toZonedTime(newStartAndEndDates?.to, 'UTC'), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
        : '';
    
        console.log(newDestination)
        console.log(trip?.destination)
        console.log(trip?.starts_at)
        console.log(newStartDateFormatted)

        if (!newDestination && newDisplayedDate) {
            await api.put(`/trips/${tripId}`, {
                "destination": trip?.destination,
                "starts_at": newStartDateFormatted,
                "ends_at": newEndDateFormatted
            })
        }
        if (!newDisplayedDate && newDestination) {
            await api.put(`/trips/${tripId}`, {
                "destination": newDestination,
                "starts_at": trip?.starts_at,
                "ends_at": trip?.ends_at
            }) 
        }
        if (newDestination && newDisplayedDate) {
            await api.put(`/trips/${tripId}`, {
                "destination": newDestination,
                "starts_at": newStartDateFormatted,
                "ends_at": newEndDateFormatted
            })
        }

        onClose()
        window.document.location.reload()
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-zinc-900 rounded-lg w-[640px] py-5 px-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Alterar local ou data</h2>
                    <span className="close" onClick={onClose}>
                        <X className="size-5 text-zinc-400" />
                    </span>
                </div>
                <p className="py-2 text-zinc-400">Altere o local e a data da viagem. Campos deixados vazios não serão alterados.</p>

                <form onSubmit={manageTripDetails}>
                    
                    <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                        <MapPin className='text-zinc-400 size-5'/>
                        <input 
                            name="local"
                            placeholder={trip?.destination}
                            className='bg-transparent text-lg placeholder-zinc-400 outline-none flex-1' 
                        />
                    </div>

                    <div className="py-2"></div>

                    <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>

                        <span onClick={openDatePicker} className='flex items-center gap-2 text-left w-[240px]'>
                            <Calendar className='size-5 text-zinc-400' />
                            <span className="text-lg text-zinc-400 w-40 flex-1" > 
                                {newDisplayedDate ?? originalDisplayedDate}
                            </span>
                        </span>
                    </div>

                    <div className="py-2"></div>

                    <Button variant="primary" size="full">
                        Salvar dados
                    </Button>

                    
                    {isDatePickerOpen &&
                    <div className='fixed inset-0 bg-black/60 flex items-center justify-center'>
                        <div className='rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5'>
                            <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                            <h2 className='text-lg font-semibold'>Selecione a data</h2>
                            <button onClick={closeDatePicker} type="button">
                                <X className='size-5 text-zinc-400'/>
                            </button>
                            </div>
                            </div>

                            <DayPicker mode="range" selected={newStartAndEndDates} onSelect={setNewStartAndEndDates} />
                        </div>
                    </div>   
                    } 
                    
                </form>

            </div>
        </div>
    )

}
