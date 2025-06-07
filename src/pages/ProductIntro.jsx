// ProductIntro.jsx: Landing Product Page with link to immersive experience
import React from "react";
import ProductPage from "../components/productPage";
import { useNavigate } from "react-router-dom";

export default function ProductIntro() {
    const navigate = useNavigate();
    return (
        <div style={{ position: "relative", minHeight: "100vh" }}>
            <ProductPage />
            <div style={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 100,
                display: "flex",
                justifyContent: "center",
                padding: "2rem 0 1.5rem 0",
                background: "linear-gradient(0deg, rgba(17,24,39,0.95) 60%, rgba(17,24,39,0.7) 100%, transparent 100%)"
            }}>
                <button
                    style={{
                        background: "#fff",
                        color: "#111827",
                        border: "none",
                        borderRadius: "0.375rem",
                        padding: "0.9rem 2.2rem",
                        fontSize: "1.2rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        letterSpacing: "0.02em"
                    }}
                    onClick={() => navigate("/experience")}
                >
                    To the scent experience
                </button>
            </div>
        </div>
    );
}
