export default function DashboardIframePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard (Iframe)</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Progress Section (Iframe)</h2>
        <iframe
          src="/test-progress"
          style={{
            width: "100%",
            height: "300px",
            border: "none",
            overflow: "hidden",
          }}
          title="Progress Section"
        />
      </div>
    </div>
  )
}

