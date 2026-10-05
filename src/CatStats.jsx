import React, { useContext } from 'react';
import { ExpenseContext } from "./Context";

const CatStats = () => {
    const { expenses } = useContext(ExpenseContext);

    const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    const categories = [
        { key: "Food", label: "Food", icon: "🍱" },
        { key: "Rent", label: "Rent", icon: "🏠" },
        { key: "Entertainment", label: "Entertainment", icon: "🎬" },
        { key: "Medical", label: "Medical", icon: "💊" },
        { key: "Utilities", label: "Utilities", icon: "⚡" },
        { key: "Shopping", label: "Shopping", icon: "🛍️" },
    ];

    return (
        <section className="bg-white rounded-3xl p-6 border border-[#111827]/10 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                    <h2 className="text-base font-bold text-[#111827]">
                        Category Spending Overview
                    </h2>

                    <p className="text-xs text-[#6B7280]">
                        Real-time dynamic category distribution
                    </p>
                </div>

                <div className="text-xs font-semibold text-[#80A1C1] bg-[#80A1C1]/10 px-3 py-1.5 rounded-full self-start sm:self-auto">
                    Updated with State
                </div>
            </div>

            {/* Category Mini Grid */}
            <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3"
                id="categoryOverviewGrid"
            >
                {categories.map((cat) => (
                    <div key={cat.key} className="p-3 bg-[#FFF5E6] rounded-2xl border border-[#111827]/5 flex flex-col justify-between">
                        <span className="text-xs text-[#6B7280] font-medium">
                            {cat.icon} {cat.label}
                        </span>

                        <span
                            className="text-sm font-bold font-mono text-[#111827] mt-1"
                            id={`cat-${cat.key.toLowerCase()}-total`}
                        >
                            ${(categoryTotals[cat.key] || 0).toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CatStats;