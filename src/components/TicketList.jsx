import { useState } from "react";
import { useTicket } from "../context/TicketContext";

function TicketList() {
    const {
        tickets,
        updateTicketStatus,
        deleteTicket,
        clearTickets,
    } = useTicket();

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const categories = [
        ...new Set(
            tickets.map((ticket) => ticket.category)
        ),
    ];

    const filteredTickets = tickets.filter((ticket) => {
        const keyword = search.trim().toLowerCase();

        // Cari berdasarkan judul masalah ATAU nama pelapor
        const matchSearch =
            keyword === "" ||
            ticket.title.toLowerCase().includes(keyword) ||
            ticket.name.toLowerCase().includes(keyword);

        const matchCategory =
            categoryFilter === "" ||
            ticket.category === categoryFilter;

        const matchPriority =
            priorityFilter === "" ||
            ticket.priority === priorityFilter;

        const matchStatus =
            statusFilter === "" ||
            ticket.status === statusFilter;

        return (
            matchSearch &&
            matchCategory &&
            matchPriority &&
            matchStatus
        );
    });

    const priorityBadge = (priority) => {
        switch (priority) {
            case "Critical":
                return "bg-dark";

            case "High":
                return "bg-danger";

            case "Medium":
                return "bg-warning text-dark";

            case "Low":
                return "bg-success";

            default:
                return "bg-secondary";
        }
    };

    const statusBadge = (status) => {
        switch (status) {
            case "Open":
                return "bg-danger";

            case "In Progress":
                return "bg-warning text-dark";

            case "Resolved":
                return "bg-success";

            default:
                return "bg-secondary";
        }
    };

    // Ticket Resolved tidak boleh kembali ke Open / In Progress
    const statusOptions = (ticket) => {
        if (ticket.status === "Resolved") {
            return ["Resolved"];
        }

        return ["Open", "In Progress", "Resolved"];
    };

    return (
        <div className="card shadow-sm">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Ticket List</h5>

                {tickets.length > 0 && (
                    <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={clearTickets}
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="card-body">
                <div className="row g-2 mb-3">
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Cari judul / nama pelapor..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </div>

                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={categoryFilter}
                            onChange={(event) =>
                                setCategoryFilter(event.target.value)
                            }
                        >
                            <option value="">Semua Kategori</option>

                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={priorityFilter}
                            onChange={(event) =>
                                setPriorityFilter(event.target.value)
                            }
                        >
                            <option value="">Semua Prioritas</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>

                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                        >
                            <option value="">Semua Status</option>
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </div>
                </div>

                {tickets.length === 0 ? (
                    <div className="alert alert-info mb-0">
                        Belum terdapat service request.
                    </div>
                ) : filteredTickets.length === 0 ? (
                    <div className="alert alert-warning mb-0">
                        Ticket tidak ditemukan.
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>No. Ticket</th>
                                    <th>Masalah</th>
                                    <th>Kategori</th>
                                    <th>Prioritas</th>
                                    <th>Status</th>
                                    <th>Pelapor</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredTickets.map((ticket) => (
                                    <tr key={ticket.id}>
                                        <td>
                                            <strong>{ticket.ticketNumber}</strong>
                                        </td>

                                        <td>
                                            <strong>{ticket.title}</strong>

                                            <div className="small text-muted">
                                                {ticket.description}
                                            </div>

                                            <div className="small text-muted">
                                                Lokasi: {ticket.location}
                                            </div>
                                        </td>

                                        <td>{ticket.category}</td>

                                        <td>
                                            <span
                                                className={`badge ${priorityBadge(
                                                    ticket.priority
                                                )}`}
                                            >
                                                {ticket.priority}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={`badge ${statusBadge(
                                                    ticket.status
                                                )}`}
                                            >
                                                {ticket.status}
                                            </span>
                                        </td>

                                        <td>
                                            {ticket.name}

                                            <div className="small text-muted">
                                                {ticket.email}
                                            </div>
                                        </td>

                                        <td>
                                            <div className="d-flex gap-2">
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={ticket.status}
                                                    disabled={ticket.status === "Resolved"}
                                                    onChange={(event) =>
                                                        updateTicketStatus(
                                                            ticket.id,
                                                            event.target.value
                                                        )
                                                    }
                                                >
                                                    {statusOptions(ticket).map((status) => (
                                                        <option key={status} value={status}>
                                                            {status}
                                                        </option>
                                                    ))}
                                                </select>

                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => deleteTicket(ticket.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TicketList;