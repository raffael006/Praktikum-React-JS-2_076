import TicketForm from "./components/TicketForm";
import TicketList from "./components/TicketList";
import TicketSummary from "./components/TicketSummary";
import { TicketProvider } from "./context/TicketContext";

function App() {
  return (
    <TicketProvider>
      <div className="bg-light min-vh-100">
        <nav className="navbar navbar-dark bg-primary">
          <div className="container">
            <span className="navbar-brand mb-0 h1">
              ServiceDesk
            </span>
          </div>
        </nav>

        <div className="container py-5">
          <div className="mb-4">
            <h2>IT Helpdesk Dashboard</h2>
            <p className="text-muted">
              Submit and monitor your IT service requests.
            </p>
          </div>

          <TicketSummary />

          <div className="row g-4">
            <div className="col-lg-4">
              <TicketForm />
            </div>

            <div className="col-lg-8">
              <TicketList />
            </div>
          </div>
        </div>
      </div>
    </TicketProvider>
  );
}

export default App;