import React, { useState } from "react";

function App() {
  const [req, setreq] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch("https://dotnet-api-bist.onrender.com/Data/greet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ req })
      });

      if (!res.ok) throw new Error("API isteği başarısız.");

      const json = await res.json();
      const data = json.message;
      setResponse(data);
    } catch (error) {
      setResponse("❌ Hata: " + error.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>👋 Yazar mısın buraya ? </h1>

        <input
          type="text"
          placeholder="Adınızı yazın..."
          value={req}
          onChange={(e) => setreq(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleSubmit} style={styles.button}>
          Gönder
        </button>

        {response && (
          <div style={styles.result}>
            📢 <span>{response}</span>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #667eea, #764ba2)",
    fontFamily: "Segoe UI, sans-serif",
  },
  card: {
    backgroundColor: "#ffffffee",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "90%",
    maxWidth: "400px"
  },
  title: {
    marginBottom: "24px",
    color: "#333"
  },
  input: {
    padding: "12px 16px",
    width: "90%",
    border: "1px solid #ccc",
    maxWidth: "400px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "16px"
  },
  button: {
    padding: "12px 24px",
    background: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s"
  },
  result: {
    marginTop: "24px",
    padding: "12px",
    background: "#f0f0f0",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "17px"
  }
};

export default App;
