import { useEffect, useRef, useState } from "react";
import { useTicket } from "../context/TicketContext";

const LOCATIONS = [
    "Laboratorium",
    "Ruang Kelas",
    "Ruang Dosen",
    "Area Umum",
];

const EMPTY_FORM = {
    name: "",
    email: "",
    category: "",
    priority: "",
    title: "",
    description: "",
    incidentDate: "",
    location: "",
};

function TicketForm() {
    const { addTicket } = useTicket();
    const [categories, setCategories] = useState([]);

    // State untuk menyimpan seluruh data form
    const [formData, setFormData] = useState(EMPTY_FORM);

    // State untuk menyimpan pesan error
    const [errors, setErrors] = useState({});

    // State untuk pesan sukses
    const [successMessage, setSuccessMessage] = useState("");

    // Ref untuk masing-masing input
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const categoryRef = useRef(null);
    const priorityRef = useRef(null);
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const dateRef = useRef(null);
    const locationRef = useRef(null);

    // Mengambil data kategori dari categories.json
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

    // =====================================================
    // VALIDASI SATU FIELD
    // =====================================================
    const validateField = (name, value) => {
        let message = "";

        switch (name) {
            case "name":
                if (!value.trim()) {
                    message = "Nama pelapor harus diisi.";
                } else if (value.trim().length < 3) {
                    message = "Nama minimal terdiri dari 3 karakter.";
                }
                break;

            case "email":
                if (!value.trim()) {
                    message = "Email harus diisi.";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    message = "Format email tidak valid.";
                }
                break;

            case "category":
                if (!value) {
                    message = "Kategori harus dipilih.";
                }
                break;

            case "priority":
                if (!value) {
                    message = "Prioritas harus dipilih.";
                }
                break;

            case "title":
                if (!value.trim()) {
                    message = "Judul masalah harus diisi.";
                } else if (value.trim().length < 10) {
                    message = "Judul masalah minimal 10 karakter.";
                }
                break;

            case "description":
                if (!value.trim()) {
                    message = "Deskripsi masalah harus diisi.";
                } else if (value.trim().length < 20) {
                    message = "Deskripsi masalah minimal 20 karakter.";
                }
                break;

            case "incidentDate":
                if (!value) {
                    message = "Tanggal kejadian harus diisi.";
                } else {
                    const selectedDate = new Date(value);
                    const today = new Date();

                    selectedDate.setHours(0, 0, 0, 0);
                    today.setHours(0, 0, 0, 0);

                    if (selectedDate > today) {
                        message =
                            "Tanggal kejadian tidak boleh melebihi tanggal hari ini.";
                    }
                }
                break;

            case "location":
                if (!value) {
                    message = "Lokasi kejadian harus dipilih.";
                }
                break;

            default:
                break;
        }

        setErrors((previousErrors) => ({
            ...previousErrors,
            [name]: message,
        }));
    };

    // =====================================================
    // VALIDASI SELURUH FORM
    // =====================================================
    const validateForm = () => {
        const validationErrors = {};

        if (!formData.name.trim()) {
            validationErrors.name = "Nama pelapor harus diisi.";
        } else if (formData.name.trim().length < 3) {
            validationErrors.name = "Nama minimal terdiri dari 3 karakter.";
        }

        if (!formData.email.trim()) {
            validationErrors.email = "Email harus diisi.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            validationErrors.email = "Format email tidak valid.";
        }

        if (!formData.category) {
            validationErrors.category = "Kategori harus dipilih.";
        }

        if (!formData.priority) {
            validationErrors.priority = "Prioritas harus dipilih.";
        }

        if (!formData.title.trim()) {
            validationErrors.title = "Judul masalah harus diisi.";
        } else if (formData.title.trim().length < 10) {
            validationErrors.title = "Judul masalah minimal 10 karakter.";
        }

        if (!formData.description.trim()) {
            validationErrors.description = "Deskripsi masalah harus diisi.";
        } else if (formData.description.trim().length < 20) {
            validationErrors.description =
                "Deskripsi masalah minimal 20 karakter.";
        }

        if (!formData.incidentDate) {
            validationErrors.incidentDate = "Tanggal kejadian harus diisi.";
        } else {
            const selectedDate = new Date(formData.incidentDate);
            const today = new Date();

            selectedDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (selectedDate > today) {
                validationErrors.incidentDate =
                    "Tanggal kejadian tidak boleh melebihi tanggal hari ini.";
            }
        }

        if (!formData.location) {
            validationErrors.location = "Lokasi kejadian harus dipilih.";
        }

        setErrors(validationErrors);
        return validationErrors;
    };

    // =====================================================
    // MEMINDAHKAN FOKUS KE FIELD ERROR PERTAMA
    // =====================================================
    const focusFirstError = (validationErrors) => {
        if (validationErrors.name) {
            nameRef.current.focus();
        } else if (validationErrors.email) {
            emailRef.current.focus();
        } else if (validationErrors.category) {
            categoryRef.current.focus();
        } else if (validationErrors.priority) {
            priorityRef.current.focus();
        } else if (validationErrors.title) {
            titleRef.current.focus();
        } else if (validationErrors.description) {
            descriptionRef.current.focus();
        } else if (validationErrors.incidentDate) {
            dateRef.current.focus();
        } else if (validationErrors.location) {
            locationRef.current.focus();
        }
    };

    // =====================================================
    // HANDLE PERUBAHAN INPUT
    // =====================================================
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));

        // Validasi langsung ketika input berubah
        validateField(name, value);
    };

    // =====================================================
    // HANDLE SUBMIT
    // =====================================================
    const handleSubmit = (event) => {
        event.preventDefault();

        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setSuccessMessage("");
            focusFirstError(validationErrors);
            return;
        }

        addTicket(formData);

        setSuccessMessage("Ticket berhasil dibuat.");
        setFormData(EMPTY_FORM);
        setErrors({});
        nameRef.current.focus();
    };

    // =====================================================
    // HANDLE RESET
    // =====================================================
    const handleReset = () => {
        setFormData(EMPTY_FORM);
        setErrors({});
        setSuccessMessage("");
        nameRef.current.focus();
    };

    return (
        <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Create Service Request</h5>
            </div>

            <div className="card-body">
                {successMessage && (
                    <div className="alert alert-success">{successMessage}</div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* NAMA */}
                    <div className="mb-3">
                        <label className="form-label">Nama Pelapor</label>
                        <input
                            ref={nameRef}
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`form-control ${errors.name ? "is-invalid" : ""}`}
                            placeholder="Masukkan nama pelapor"
                        />
                        {errors.name && (
                            <div className="invalid-feedback">{errors.name}</div>
                        )}
                    </div>

                    {/* EMAIL */}
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            ref={emailRef}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                            placeholder="contoh@email.com"
                        />
                        {errors.email && (
                            <div className="invalid-feedback">{errors.email}</div>
                        )}
                    </div>

                    {/* CATEGORY */}
                    <div className="mb-3">
                        <label className="form-label">Kategori Permasalahan</label>
                        <select
                            ref={categoryRef}
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={`form-select ${errors.category ? "is-invalid" : ""
                                }`}
                        >
                            <option value="">-- Pilih Kategori --</option>

                            {categories.map((category) => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <div className="invalid-feedback">{errors.category}</div>
                        )}
                    </div>

                    {/* PRIORITY */}
                    <div className="mb-3">
                        <label className="form-label">Prioritas</label>
                        <select
                            ref={priorityRef}
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className={`form-select ${errors.priority ? "is-invalid" : ""
                                }`}
                        >
                            <option value="">-- Pilih Prioritas --</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                        {errors.priority && (
                            <div className="invalid-feedback">{errors.priority}</div>
                        )}
                    </div>

                    {/* TITLE */}
                    <div className="mb-3">
                        <label className="form-label">Judul Masalah</label>
                        <input
                            ref={titleRef}
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`form-control ${errors.title ? "is-invalid" : ""}`}
                            placeholder="Contoh: Tidak dapat mengakses Wi-Fi Lab"
                        />
                        {errors.title && (
                            <div className="invalid-feedback">{errors.title}</div>
                        )}
                    </div>

                    {/* DESCRIPTION */}
                    <div className="mb-3">
                        <label className="form-label">Deskripsi Masalah</label>
                        <textarea
                            ref={descriptionRef}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className={`form-control ${errors.description ? "is-invalid" : ""
                                }`}
                            placeholder="Jelaskan permasalahan secara lengkap"
                        />
                        {errors.description && (
                            <div className="invalid-feedback">{errors.description}</div>
                        )}
                    </div>

                    {/* DATE */}
                    <div className="mb-3">
                        <label className="form-label">Tanggal Kejadian</label>
                        <input
                            ref={dateRef}
                            type="date"
                            name="incidentDate"
                            value={formData.incidentDate}
                            onChange={handleChange}
                            className={`form-control ${errors.incidentDate ? "is-invalid" : ""
                                }`}
                        />
                        {errors.incidentDate && (
                            <div className="invalid-feedback">{errors.incidentDate}</div>
                        )}
                    </div>

                    {/* LOCATION */}
                    <div className="mb-3">
                        <label className="form-label">Lokasi Kejadian</label>
                        <select
                            ref={locationRef}
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className={`form-select ${errors.location ? "is-invalid" : ""
                                }`}
                        >
                            <option value="">-- Pilih Lokasi --</option>

                            {LOCATIONS.map((location) => (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>
                        {errors.location && (
                            <div className="invalid-feedback">{errors.location}</div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary me-2">
                        Submit Ticket
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleReset}
                    >
                        Reset
                    </button>
                </form>
            </div>
        </div>
    );
}

export default TicketForm;