export default function DashboardTablePage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "2rem" }}>Dashboard (Table Layout)</h1>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td colSpan={2} style={{ paddingTop: "2rem", borderTop: "1px solid #e5e7eb" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Progress</h2>
            </td>
          </tr>
          <tr>
            <td style={{ padding: "0.75rem", width: "50%" }}>
              <a href="/applications" style={{ display: "block", textDecoration: "none" }}>
                <div
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "8rem",
                    backgroundColor: "white",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginBottom: "1rem", color: "#3b82f6" }}
                  >
                    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                  <span style={{ fontSize: "1.25rem", fontWeight: "500" }}>Applications</span>
                </div>
              </a>
            </td>
            <td style={{ padding: "0.75rem", width: "50%" }}>
              <a href="/analytics" style={{ display: "block", textDecoration: "none" }}>
                <div
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "8rem",
                    backgroundColor: "white",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginBottom: "1rem", color: "#3b82f6" }}
                  >
                    <path d="M3 3v18h18"></path>
                    <path d="M18 9V3H12"></path>
                    <path d="M18 3l-6 6"></path>
                    <path d="M9 18l3-3"></path>
                    <path d="M14 18l3-3"></path>
                    <path d="M14 12l3-3"></path>
                    <path d="M9 12l3-3"></path>
                  </svg>
                  <span style={{ fontSize: "1.25rem", fontWeight: "500" }}>Analytics</span>
                </div>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

