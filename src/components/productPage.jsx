import React, { useState } from 'react';

// Placeholder für Icons (können weiterhin als SVG-Komponenten verwendet werden)
const ChevronDown = () => <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const ChevronUp = () => <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>;
const InfoIcon = () => <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
const TruckIcon = () => <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const ArchiveIcon = () => <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>;
const PhoneIcon = () => <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;


const AccordionItem = ({ title, children, icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="accordion-item">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="accordion-button"
                aria-expanded={isOpen}
            >
                <span className="accordion-title">
                    {icon && <span className="accordion-icon">{icon}</span>}
                    {title}
                </span>
                {isOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
            {isOpen && <div className="accordion-content">{children}</div>}
        </div>
    );
};

function App() {
    const [quantity, setQuantity] = useState(1);

    return (
        <>
            <style>{`
        :root {
          /* Define dark mode colors as the default */
          --text-primary: #f9fafb;
          --text-secondary: #d1d5db;
          --text-muted: #9ca3af;
          --text-light: #6b7280;
          --bg-main: #111827;
          --bg-card: #1f2937;
          --bg-image-container: #374151;
          --border-color: #374151;
          --border-darker: #4b5563;
          --button-hover: #4b5563;

          /* Global colors that don't change with theme */
          --brand-color: #4f46e5;
          --brand-ring: #a5b4fc;
          --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        }

        /* Basic Reset */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: var(--font-sans);
          background-color: var(--bg-main);
          color: var(--text-primary);
          line-height: 1.6;
          min-height: 100vh;
          transition: background-color 0.3s, color 0.3s;
        }

        a {
          color: inherit;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }

        img {
          max-width: 100%;
          height: auto;
          display: block;
        }
        
        button, input {
          font-family: inherit;
        }

        /* App Structure */
        .site-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          font-size: 0.875rem; /* text-sm */
          color: var(--text-secondary);
        }
        @media (min-width: 768px) {
          .site-header {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        .main-content-area {
          max-width: 1280px;
          margin-left: auto;
          margin-right: auto;
          padding: 1rem;
        }
        @media (min-width: 768px) {
          .main-content-area {
            padding: 2rem;
          }
        }
        
        .product-grid {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .product-grid {
             gap: 3rem;
          }
        }
        @media (min-width: 1024px) {
          .product-grid {
            flex-direction: row;
          }
        }

        .left-column, .right-column {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        @media (min-width: 1024px) {
          .left-column, .right-column {
            width: 50%;
            align-items: initial;
          }
          .left-column {
             align-items: center;
          }
        }

        /* Left Column: Image and Replica Details */
        .image-container {
          width: 100%;
          background-color: var(--bg-image-container);
          border-radius: 0.5rem;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          padding: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 2rem;
          transition: background-color 0.3s;
        }
        @media (min-width: 768px) {
          .image-container {
            padding: 1.5rem;
          }
        }
        .product-image-display {
          width: 100%;
          height: auto;
          object-fit: cover;
          border-radius: 0.375rem;
          max-height: 600px;
        }
        @media (min-width: 768px) {
          .product-image-display {
             max-height: 700px;
          }
        }

        .replica-info-card {
          width: 100%;
          max-width: 28rem;
          background-color: var(--bg-card);
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          font-size: 0.875rem;
          color: var(--text-secondary);
          transition: background-color 0.3s, color 0.3s;
        }
        .replica-info-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          text-align: center;
          margin-bottom: 0.25rem;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }
        .replica-info-card .subtitle {
          font-size: 0.75rem;
          text-align: center;
          color: var(--text-muted);
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .replica-info-card .details-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
         .replica-info-card .details-list p strong {
          font-weight: 500;
          color: var(--text-secondary);
        }
        .replica-info-card .brand {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 1.125rem;
          font-weight: 500;
          color: var(--text-light);
        }
        .replica-info-card .location {
          text-align: center;
          font-size: 0.75rem;
          color: var(--text-light);
        }

        /* Right Column: Product Information */
        .product-main-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        @media (min-width: 768px) {
          .product-main-title {
            font-size: 1.875rem;
          }
        }
        .product-price {
          font-size: 1.875rem;
          font-weight: 600;
          color: var(--brand-color);
          margin-bottom: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }
        .variant-buttons {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .variant-buttons button {
          width: 2rem;
          height: 2rem;
          border-radius: 9999px;
          background-color: var(--bg-image-container);
          border: 1px solid var(--border-darker);
          cursor: pointer;
        }
        .variant-buttons button.active {
          border-width: 2px;
          border-color: var(--brand-color);
          box-shadow: 0 0 0 2px var(--brand-ring);
        }
        .variant-buttons button:focus {
          outline: none;
        }
        .variant-buttons button:not(.active):hover {
           border-color: var(--text-light);
        }

        .quantity-input-group {
          display: flex;
          align-items: center;
          border: 1px solid var(--border-darker);
          border-radius: 0.375rem;
          width: max-content;
          background-color: var(--bg-card);
        }
        .quantity-input-group button {
          padding: 0.5rem 0.75rem;
          color: var(--text-secondary);
          background-color: transparent;
          border: none;
          cursor: pointer;
        }
        .quantity-input-group button:hover {
          background-color: var(--bg-image-container);
        }
        .quantity-input-group button:first-child {
          border-top-left-radius: 0.375rem;
          border-bottom-left-radius: 0.375rem;
        }
        .quantity-input-group button:last-child {
          border-top-right-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
        }
        .quantity-input-group input {
          width: 3rem;
          text-align: center;
          border: none;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          background-color: transparent;
          color: var(--text-primary);
        }
        .quantity-input-group input:focus {
          outline: none;
        }

        .button {
          display: block;
          width: 100%;
          padding: 0.75rem 1.5rem;
          border-radius: 0.375rem;
          font-size: 1rem;
          font-weight: 600;
          text-align: center;
          cursor: pointer;
          transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
          border: 1px solid transparent;
        }
        .button-primary {
          background-color: #f9fafb; /* Light text color for dark mode */
          color: #111827; /* Dark background color for dark mode */
          margin-bottom: 0.75rem;
        }
        .button-primary:hover {
          opacity: 0.9;
        }
        .button-primary:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          box-shadow: 0 0 0 2px var(--bg-card), 0 0 0 4px var(--text-muted);
        }

        .button-secondary {
          background-color: transparent;
          color: var(--text-primary);
          border: 1px solid var(--text-primary);
          margin-bottom: 2rem;
        }
        .button-secondary:hover {
          background-color: var(--bg-image-container);
        }
         .button-secondary:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          box-shadow: 0 0 0 2px var(--bg-card), 0 0 0 4px var(--border-darker);
        }

        .product-short-description {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        /* Accordion */
        .accordion-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .accordion-item {
          border-bottom: 1px solid var(--border-color);
          padding-top: 1rem;
          padding-bottom: 1rem;
        }
        .accordion-button {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          text-align: left;
          color: var(--text-secondary);
          background: none;
          border: none;
          cursor: pointer;
          padding:0;
        }
        .accordion-button:hover {
          color: var(--text-primary);
        }
        .accordion-button:focus {
          outline: none;
        }
        .accordion-title {
          display: flex;
          align-items: center;
          font-weight: 500;
        }
        .accordion-icon {
          margin-right: 0.5rem;
          display: inline-flex;
        }
        .icon {
          width: 1em;
          height: 1em;
          vertical-align: middle;
        }
        .accordion-icon .icon {
             width: 20px;
             height: 20px;
        }
        .accordion-button .icon {
            width: 24px;
            height: 24px;
        }
        .accordion-content {
          margin-top: 0.75rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
          padding-right: 1.5rem;
        }

        /* Footer */
        .site-footer {
          text-align: center;
          padding-top: 2rem;
          padding-bottom: 2rem;
          margin-top: 3rem;
          border-top: 1px solid var(--border-color);
        }
        .site-footer a {
          color: var(--text-secondary);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .site-footer a:hover {
          color: var(--brand-color);
        }
        .site-footer .icon {
          margin-right: 0.5rem;
          width: 20px;
          height: 20px;
        }
        .site-footer p {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
        }

      `}</style>
            <div className="app-wrapper">
                <header className="site-header">
                    <a href="#">ALLE DÜFTE</a>
                </header>

                <main className="main-content-area">
                    <div className="product-grid">

                        <div className="left-column">
                            <div className="image-container">
                                <img
                                    src="/images/bottle.jpg"
                                    alt="Replica Sailing Day"
                                    className="product-image-display"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x750/CCCCCC/999999?text=Image+Not+Found'; }}
                                />
                            </div>
                            <div className="replica-info-card">
                                <h3>REPLICA</h3>
                                <p className="subtitle">
                                    Reproduction of familiar scents and moments of varying locations and periods
                                </p>
                                <div className="details-list">
                                    <p><strong>Originally:</strong> Sailing Day</p>
                                    <p><strong>Provenance and Period:</strong> Paros, 2001</p>
                                    <p><strong>Fragrance Description:</strong> Aquatic & Fresh - A memory of a sailing day, the sea breeze on your skin.</p>
                                    <p><strong>Style Description:</strong> For Men and Women</p>
                                </div>
                                <p className="brand">Aurealis Parfums</p>
                                <p className="location">LUMINARA</p>
                            </div>
                        </div>

                        <div className="right-column">
                            <h1 className="product-main-title">
                                Replica Sailing Day Eau de Toilette
                            </h1>
                            <p className="product-price">€ 145</p>

                            <div className="form-group">
                                <label htmlFor="variant">Silbar (Variant Placeholder)</label>
                                <div className="variant-buttons">
                                    <button className="active" title="Silbar"></button>
                                    <button title="Other Variant"></button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="quantity">Menge (Quantity)</label>
                                <div className="quantity-input-group">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        aria-label="Decrease quantity"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        value={quantity}
                                        readOnly
                                    />
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button className="button button-primary">
                                In den Warenkorb
                            </button>
                            <button className="button button-secondary">
                                Abholung in der Boutique
                            </button>

                            <p className="product-short-description">
                                Das Replica Sailing Day Eau de Toilette bringt die frisch-salzige Luft eines Tages auf einem Segelboot zurück. Ein erfrischender und belebender Duft.
                            </p>

                            <div className="accordion-wrapper">
                                <AccordionItem title="Produktinformation" icon={<InfoIcon />}>
                                    <p>Detailed product information goes here. Ingredients, composition, usage instructions, etc.</p>
                                    <p><strong>Duftbeschreibung:</strong></p>
                                    <ul>
                                        <li>The sweet and succulent aroma of ripe peaches, bursting with juicy sunshine.</li>
                                        <li>The invigorating, fresh scent of ocean algae, evoking a cool sea breeze.</li>
                                        <li>A captivating bouquet of freshly bloomed garden roses, its velvety petals unfurling a timeless fragrance.</li>
                                        <li>A lively mix of wildflowers, bringing the vibrant and uplifting spirit of spring meadows.</li>
                                    </ul>
                                </AccordionItem>
                                <AccordionItem title="Versand und Rückgabe" icon={<TruckIcon />}>
                                    <p>Information about shipping options, costs, delivery times, and return policies.</p>
                                </AccordionItem>
                                <AccordionItem title="Unsere Verpackung" icon={<ArchiveIcon />}>
                                    <p>Die Verpackungen von Aurealis Parfums werden in Anlehnung an die Kernphilosophie des Hauses gestaltet...</p>
                                </AccordionItem>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="site-footer">
                    <a href="#">
                        <PhoneIcon /> <span>Kontakt</span>
                    </a>
                    <p>© {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}

export default App;
