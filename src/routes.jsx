import React from 'react';
import { BrowserRouter as Router, Routes as DomRoutes, Route } from 'react-router-dom';
import ProductIntro from './pages/ProductIntro';
import Home from './pages/Home';
import Product from './pages/Product';

const Routes = () => {
    return (
        <Router>
            <DomRoutes>
                <Route path="/" element={<ProductIntro />} />
                <Route path="/experience" element={<Home />} />
                <Route path="/product" element={<Product />} />
            </DomRoutes>
        </Router>
    );
};

export default Routes;