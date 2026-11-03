import { useEffect, useState } from "react";
import { useTicket } from "../context/TicketContext";

function TicketSummary() {
    const { tickets } = useTicket();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch("/categories.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Gagal mengambil data kategori.");
                }

                return response.json();
            })
            .then((data) => {
                setCategories(data);
            })
            .catch((error) => {
                console.error("Terjadi kesalahan:", error);
            });
    }, []);

    const total = tickets.length;

    const open = tickets.filter(
        (ticket) => ticket.status === "Open"
    ).length;

    const progress = tickets.filter(
        (ticket) => ticket.status === "In Progress"
    ).length;

    const resolved = tickets.filter(
        (ticket) => ticket.status === "Resolved"
    ).length;

    return (
        <>
            {/* RINGKASAN STATUS */}
            <div className="row g-3 mb-3">
                <div className="col-md-3">
                    <div className="card shadow-sm text-center">
                        <div className="card-body">
                            <h6 className="text-muted">Total Ticket</h6>
                            <h2>{total}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm text-center">
                        <div className="card-body">
                            <h6 className="text-muted">Open</h6>
                            <h2>{open}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm text-center">
                        <div className="card-body">
                            <h6 className="text-muted">In Progress</h6>
                            <h2>{progress}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm text-center">
                        <div className="card-body">
                            <h6 className="text-muted">Resolved</h6>
                            <h2>{resolved}</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* RINGKASAN PER KATEGORI */}
            <div className="card shadow-sm mb-4">
                <div className="card-header">
                    <h6 className="mb-0">Jumlah Ticket per Kategori</h6>
                </div>

                <div className="card-body">
                    <div className="row g-3 text-center">
                        {categories.map((category) => {
                            const count = tickets.filter(
                                (ticket) => ticket.category === category.name
                            ).length;

                            return (
                                <div className="col" key={category.id}>
                                    <div className="border rounded py-2">
                                        <div className="small text-muted">{category.name}</div>
                                        <h4 className="mb-0">{count}</h4>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default TicketSummary;