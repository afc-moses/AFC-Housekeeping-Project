import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ReservationForm from './ReservationForm';
import ReservationList from './ReservationList';
import RoomAvailability from './RoomAvailability'; // Corrected import
import SummaryDashboard from './SummaryDashboard';
import ExportData from './ExportData';
import HousekeepingMinistryChart from './HousekeepingMinistryChart';
import CleaningTasksList from './CleaningTasksList';
import UpcomingCleaningTasks from './UpcomingCleaningTasks';
import EditReservation from './EditReservation';

const pageStyle = { margin: 0, padding: 0, minHeight: '100vh', background: 'linear-gradient(120deg, #f7f7f7, #fafafa)', fontFamily: 'Arial, sans-serif' };
const containerStyle = { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' };
const headerStyle = { backgroundColor: '#fff', borderRadius: '8px', padding: '20px', marginTop: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' };
const brandStyle = { margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#333' };
const subTitleStyle = { margin: '5px 0 0', color: '#666', fontSize: '14px' };
const navContainerStyle = { display: 'flex', flexWrap: 'wrap', gap: '40px', marginTop: '20px' };
const navSectionStyle = { flex: '1 1 auto', minWidth: '250px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', padding: '20px' };
const sectionHeaderStyle = { margin: '0 0 20px', fontSize: '18px', fontWeight: 'bold', color: '#007BFF' };
const buttonContainerStyle = { display: 'flex', flexWrap: 'wrap', gap: '10px' };
const buttonLinkStyle = { display: 'inline-block', padding: '12px 20px', backgroundColor: '#007BFF', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', transition: 'background-color 0.3s' };
const buttonLinkHoverStyle = { backgroundColor: '#0056b3' };

function App({ backendUrl }) {
  return (
    <Router>
      <div style={pageStyle}>
        <div style={containerStyle}>
          <header style={headerStyle}>
            <h1 style={brandStyle}>AFC Housekeeping Ministry Dashboard</h1>
            <p style={subTitleStyle}>Welcome to the AFC Housekeeping Management System</p>
          </header>
          <nav style={navContainerStyle}>
            <div style={navSectionStyle}>
              <h3 style={sectionHeaderStyle}>Reservation Management</h3>
              <div style={buttonContainerStyle}>
                <Link to="/reservation-form" style={buttonLinkStyle} onMouseOver={e => e.currentTarget.style.backgroundColor = buttonLinkHoverStyle.backgroundColor} onMouseOut={e => e.currentTarget.style.backgroundColor = buttonLinkStyle.backgroundColor}>Add Reservation</Link>
                <Link to="/reservation-list" style={buttonLinkStyle} onMouseOver={e => e.currentTarget.style.backgroundColor = buttonLinkHoverStyle.backgroundColor} onMouseOut={e => e.currentTarget.style.backgroundColor = buttonLinkStyle.backgroundColor}>Reservation List</Link>
                <Link to="/room-availability" style={buttonLinkStyle} onMouseOver={e => e.currentTarget.style.backgroundColor = buttonLinkHoverStyle.backgroundColor} onMouseOut={e => e.currentTarget.style.backgroundColor = buttonLinkStyle.backgroundColor}>Room Availability</Link>
                <Link to="/summary-dashboard" style={buttonLinkStyle} onMouseOver={e => e.currentTarget.style.backgroundColor = buttonLinkHoverStyle.backgroundColor} onMouseOut={e => e.currentTarget.style.backgroundColor = buttonLinkStyle.backgroundColor}>Summary Dashboard</Link>
                <Link to="/export-data" style={buttonLinkStyle} onMouseOver={e => e.currentTarget.style.backgroundColor = buttonLinkHoverStyle.backgroundColor} onMouseOut={e => e.currentTarget.style.backgroundColor = buttonLinkStyle.backgroundColor}>Export Data</Link>
              </div>
            </div>
            <div style={navSectionStyle}>
              <h3 style={sectionHeaderStyle}>Cleaning Schedule and Chart</h3>
              <div style={buttonContainerStyle}>
                <Link to="/housekeeping-chart" style={buttonLinkStyle} onMouseOver={e => e.currentTarget.style.backgroundColor = buttonLinkHoverStyle.backgroundColor} onMouseOut={e => e.currentTarget.style.backgroundColor = buttonLinkStyle.backgroundColor}>Housekeeping Ministry Chart</Link>
                <Link to="/cleaning-tasks" style={buttonLinkStyle} onMouseOver={e => e.currentTarget.style.backgroundColor = buttonLinkHoverStyle.backgroundColor} onMouseOut={e => e.currentTarget.style.backgroundColor = buttonLinkStyle.backgroundColor}>Cleaning Tasks</Link>
                <Link to="/upcoming-cleaning-tasks" style={buttonLinkStyle} onMouseOver={e => e.currentTarget.style.backgroundColor = buttonLinkHoverStyle.backgroundColor} onMouseOut={e => e.currentTarget.style.backgroundColor = buttonLinkStyle.backgroundColor}>Upcoming Cleaning Tasks</Link>
              </div>
            </div>
          </nav>
          <Routes>
            <Route path="/reservation-form" element={<ReservationForm backendUrl={backendUrl} />} />
            <Route path="/reservation-list" element={<ReservationList backendUrl={backendUrl} />} />
            <Route path="/room-availability" element={<RoomAvailability backendUrl={backendUrl} />} /> {/* Updated */}
            <Route path="/summary-dashboard" element={<SummaryDashboard backendUrl={backendUrl} />} />
            <Route path="/export-data" element={<ExportData backendUrl={backendUrl} />} />
            <Route path="/housekeeping-chart" element={<HousekeepingMinistryChart backendUrl={backendUrl} />} />
            <Route path="/cleaning-tasks" element={<CleaningTasksList backendUrl={backendUrl} />} />
            <Route path="/upcoming-cleaning-tasks" element={<UpcomingCleaningTasks backendUrl={backendUrl} />} />
            <Route path="/edit-reservation/:id" element={<EditReservation backendUrl={backendUrl} />} />
            <Route path="/" element={<ReservationList backendUrl={backendUrl} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;