import { createContext, useContext, useRef, useState } from "react";

const TicketContext = createContext();

export function TicketProvider({ children }) {
    const [tickets, setTickets] = useState([]);

    // Counter nomor ticket (tidak ikut berkurang saat ticket dihapus)
    const counterRef = useRef(0);

    // Menambahkan ticket
    const addTicket = (ticket) => {
        counterRef.current += 1;
        const ticketNumber = `HD-${String(counterRef.current).padStart(3, "0")}`;

        setTickets((previousTickets) => [
            ...previousTickets,
            {
                ...ticket,
                id: Date.now(),
                ticketNumber,
                status: "Open",
                createdAt: new Date().toLocaleString("id-ID"),
            },
        ]);
    };

    // Mengubah status ticket
    // Ticket Resolved tidak boleh kembali menjadi Open
    const updateTicketStatus = (id, status) => {
        setTickets((previousTickets) =>
            previousTickets.map((ticket) => {
                if (ticket.id !== id) {
                    return ticket;
                }

                if (ticket.status === "Resolved" && status === "Open") {
                    return ticket;
                }

                return {
                    ...ticket,
                    status,
                };
            })
        );
    };

    // Menghapus satu ticket berdasarkan id
    const deleteTicket = (id) => {
        setTickets((previousTickets) =>
            previousTickets.filter((ticket) => ticket.id !== id)
        );
    };

    // Menghapus seluruh ticket
    const clearTickets = () => {
        counterRef.current = 0;
        setTickets([]);
    };

    return (
        <TicketContext.Provider
            value={{
                tickets,
                addTicket,
                updateTicketStatus,
                deleteTicket,
                clearTickets,
            }}
        >
            {children}
        </TicketContext.Provider>
    );
}

export function useTicket() {
    return useContext(TicketContext);
}