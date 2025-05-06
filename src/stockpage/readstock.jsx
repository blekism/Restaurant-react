import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './readstock.css';

export default function StockPage() {
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Removed: showAddForm, formData, formMessage states

    useEffect(() => {
        fetchStock();
    }, []);

    const fetchStock = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost/week6/PHP/API/readstock.php');
            if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
                setStockData(response.data.data);
            } else if (response.data && response.data.status === 404) {
                setStockData([]);
            } else {
                setError(response.data.message || 'Failed to fetch stock data.');
                setStockData([]);
            }
        } catch (err) {
            console.error("Error fetching stock:", err);
            setError('Could not connect to the server or an error occurred.');
            setStockData([]);
        } finally {
            setLoading(false);
        }
    };

    // Removed: handleInputChange function
    // Removed: handleAddStock function

    if (loading) {
        return <div className="container mt-5"><p>Loading stock information...</p></div>;
    }

    if (error) {
        return <div className="container mt-5"><p className="text-danger">Error: {error}</p></div>;
    }

    return (
        <div className="container mt-5 stock-page-container">
            <h2 className="mb-4 text-center">Current Stock</h2>
            
            {/* Removed: "Add New Stock" button and form */}

            {stockData.length === 0 ? (
                <p className="text-center">No stock information found.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Stock ID</th>
                                <th>Product Name</th>
                                <th>Current Quantity (Qty)</th>
                                <th>Total Stock Ever</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockData.map((item) => (
                                <tr key={item.stock_id}>
                                    <td>{item.stock_id}</td>
                                    <td>{item.product_name}</td>
                                    <td>{item.qty}</td>
                                    <td>{item.total_stock}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}