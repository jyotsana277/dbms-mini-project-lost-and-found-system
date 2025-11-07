export default function FormInput({ label, type="text", value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input" // optional, use your CSS if you want
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
}