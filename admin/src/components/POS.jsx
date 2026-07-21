import React, { useState } from 'react';
import { Plus, Minus, Trash2, Printer, CreditCard, Banknote, Smartphone } from 'lucide-react';

const nailTypes = [
    { id: 1, name: "1 inch Nails", size: "1\"", defaultPrice: 4000 },
    { id: 2, name: "1.5 inch Nails", size: "1.5\"", defaultPrice: 4100 },
    { id: 3, name: "2 inch Nails", size: "2\"", defaultPrice: 4200 },
    { id: 4, name: "2.5 inch Nails", size: "2.5\"", defaultPrice: 4300 },
    { id: 5, name: "3 inch Nails", size: "3\"", defaultPrice: 4500 },
    { id: 6, name: "3.5 inch Nails", size: "3.5\"", defaultPrice: 4600 },
    { id: 7, name: "4 inch Nails", size: "4\"", defaultPrice: 4800 },
];

const POS = () => {
    const [cart, setCart] = useState([]);
    const [selectedMode, setSelectedMode] = useState('full'); // 'full' or 'custom'
    const [customerName, setCustomerName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');

    // Add item to cart
    const addToCart = (product, isFullSack = true, customKg = null) => {
        const pricePerSack = product.defaultPrice;
        let quantityKg = isFullSack ? 25 : customKg;
        let totalPrice = isFullSack ? pricePerSack : (pricePerSack / 25) * customKg;

        const existingItem = cart.findIndex(item =>
            item.id === product.id && item.isFullSack === isFullSack
        );

        if (existingItem !== -1) {
            const updatedCart = [...cart];
            updatedCart[existingItem].quantity += 1;
            updatedCart[existingItem].totalPrice += totalPrice;
            setCart(updatedCart);
        } else {
            setCart([...cart, {
                ...product,
                quantity: 1,
                quantityKg: quantityKg,
                isFullSack,
                unitPrice: isFullSack ? pricePerSack : (pricePerSack / 25),
                totalPrice: totalPrice
            }]);
        }
    };

    const removeFromCart = (index) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    const updateQuantity = (index, newQty) => {
        if (newQty < 1) return;
        const updatedCart = [...cart];
        const item = updatedCart[index];

        updatedCart[index].quantity = newQty;
        updatedCart[index].totalPrice = item.isFullSack
            ? item.defaultPrice * newQty
            : (item.defaultPrice / 25) * (item.quantityKg * newQty);

        setCart(updatedCart);
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + item.totalPrice, 0);
    };

    const handleCheckout = () => {
        if (cart.length === 0) return alert("Cart is empty!");

        alert(`✅ Sale Completed!\nTotal: KSh ${calculateTotal().toLocaleString()}\nPayment: ${paymentMethod.toUpperCase()}`);

        // Here you would call your backend to deduct stock
        console.log("Sale Data:", { cart, customerName, paymentMethod, total: calculateTotal() });

        setCart([]);
        setCustomerName('');
    };

    return (
        <div className="flex h-full bg-zinc-50">
            {/* Left Side - Products */}
            <div className="w-3/5 p-6 overflow-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-zinc-900">Point of Sale</h1>
                    <p className="text-zinc-600">Sell Nails • Real-time Stock Deduction</p>
                </div>

                {/* Sale Mode Toggle */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={() => setSelectedMode('full')}
                        className={`px-6 py-3 rounded-2xl font-medium transition-all ${selectedMode === 'full' ? 'bg-black text-white' : 'bg-white border border-zinc-200'}`}
                    >
                        Full Sack (25kg)
                    </button>
                    <button
                        onClick={() => setSelectedMode('custom')}
                        className={`px-6 py-3 rounded-2xl font-medium transition-all ${selectedMode === 'custom' ? 'bg-black text-white' : 'bg-white border border-zinc-200'}`}
                    >
                        Custom KG
                    </button>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {nailTypes.map((product) => (
                        <div key={product.id} className="bg-white border border-zinc-200 rounded-3xl p-5 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg">{product.name}</h3>
                                    <p className="text-zinc-500">{product.size} • 25kg sack</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold">KSh {product.defaultPrice}</p>
                                    <p className="text-xs text-zinc-500">per sack</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {/* Full Sack Button */}
                                <button
                                    onClick={() => addToCart(product, true)}
                                    className="flex-1 bg-black text-white py-3 rounded-2xl hover:bg-zinc-800 transition-all text-sm font-medium"
                                >
                                    Add Full Sack
                                </button>

                                {/* Custom KG Button */}
                                <button
                                    onClick={() => {
                                        const kg = prompt("Enter weight in KG (e.g. 12.5):", "10");
                                        if (kg && !isNaN(kg)) {
                                            addToCart(product, false, parseFloat(kg));
                                        }
                                    }}
                                    className="flex-1 border border-zinc-300 py-3 rounded-2xl hover:bg-zinc-50 transition-all text-sm font-medium"
                                >
                                    Custom KG
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side - Cart / Checkout */}
            <div className="w-2/5 bg-white border-l border-zinc-200 flex flex-col">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-semibold">Current Sale</h2>
                    <input
                        type="text"
                        placeholder="Customer Name (Optional)"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full mt-4 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-black"
                    />
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-auto p-6 space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center text-zinc-400 py-20">
                            Cart is empty<br />Add products from the left
                        </div>
                    ) : (
                        cart.map((item, index) => (
                            <div key={index} className="bg-zinc-50 rounded-2xl p-4">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-zinc-500">
                                            {item.isFullSack ? "25kg Full Sack" : `${item.quantityKg} kg`}
                                        </p>
                                    </div>
                                    <button onClick={() => removeFromCart(index)} className="text-red-500">
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => updateQuantity(index, item.quantity - 1)} className="w-8 h-8 border rounded-xl flex items-center justify-center hover:bg-white">
                                            <Minus size={16} />
                                        </button>
                                        <span className="font-semibold w-6 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(index, item.quantity + 1)} className="w-8 h-8 border rounded-xl flex items-center justify-center hover:bg-white">
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <p className="font-bold">KSh {item.totalPrice.toLocaleString()}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Total & Checkout */}
                <div className="border-t p-6 bg-white mt-auto">
                    <div className="flex justify-between text-xl font-semibold mb-6">
                        <span>Total</span>
                        <span>KSh {calculateTotal().toLocaleString()}</span>
                    </div>

                    {/* Payment Methods */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {[
                            { label: 'Cash', icon: Banknote, value: 'cash' },
                            { label: 'M-Pesa', icon: Smartphone, value: 'mpesa' },
                            { label: 'Bank', icon: CreditCard, value: 'bank' },
                        ].map((pm) => (
                            <button
                                key={pm.value}
                                onClick={() => setPaymentMethod(pm.value)}
                                className={`flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all ${paymentMethod === pm.value ? 'border-black bg-black text-white' : 'border-zinc-200 hover:border-zinc-300'}`}
                            >
                                <pm.icon size={24} />
                                <span className="text-sm">{pm.label}</span>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="w-full bg-black hover:bg-zinc-800 disabled:bg-zinc-300 text-white py-4 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-3"
                    >
                        <Printer size={22} />
                        Complete Sale & Print Receipt
                    </button>
                </div>
            </div>
        </div>
    );
};

export default POS;