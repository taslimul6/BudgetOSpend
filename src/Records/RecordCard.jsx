import React, { useContext } from "react";
import { ExpenseContext } from "../Context";
import { toast } from "react-toastify";

const RecordCard = ({ expense }) => {

  const {
    setIsExpenseModalOpen,
    setEditExpense,
    setExpenses
  } = useContext(ExpenseContext);


  const handleEditClick = () => {
    setEditExpense(expense);
  };


  const handleDeleteClick = () => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    setExpenses((prevExpenses) =>
      prevExpenses.filter((item) => item.id !== expense.id)
    );
    toast.success("Expense deleted successfully!");
  };


  const categoryStyles = {
    Food: {
      iconBg: "bg-[#FAD4C0]/40 border border-[#FAD4C0]",
      badge: "bg-[#FAD4C0]/40 text-[#111827] border border-[#FAD4C0]"
    },
    Rent: {
      iconBg: "bg-[#80A1C1]/20 border border-[#80A1C1]/40",
      badge: "bg-[#80A1C1]/20 text-[#111827] border border-[#80A1C1]/40"
    },
    Entertainment: {
      iconBg: "bg-purple-100 border border-purple-200",
      badge: "bg-purple-100 text-purple-900 border border-purple-200"
    },
    Medical: {
      iconBg: "bg-red-50 border border-red-200",
      badge: "bg-red-50 text-[#DC2626] border border-red-200"
    },
    Utilities: {
      iconBg: "bg-amber-50 border border-amber-200",
      badge: "bg-amber-50 text-[#D97706] border border-amber-200"
    },
    Shopping: {
      iconBg: "bg-emerald-50 border border-emerald-200",
      badge: "bg-emerald-50 text-[#16A34A] border border-emerald-200"
    },
    Education: {
      iconBg: "bg-indigo-50 border border-indigo-200",
      badge: "bg-indigo-50 text-indigo-900 border border-indigo-200"
    },
    Other: {
      iconBg: "bg-gray-100 border border-gray-200",
      badge: "bg-gray-100 text-gray-700 border border-gray-200"
    }
  };

  const styles = categoryStyles[expense.category] || categoryStyles.Other;


  return (

    <div id="expenseListContainer" className="space-y-3">

      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#111827]/10 shadow-xs hover:shadow-md hover:border-[#80A1C1]/50 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">

        {/* Left Item Info */}

        <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">

          <div className={`w-12 h-12 rounded-2xl ${styles.iconBg} flex items-center justify-center text-xl shrink-0`}>

            {expense.icon}

          </div>


          <div className="min-w-0 flex-1">

            <div className="flex flex-wrap items-center gap-2 mb-1">

              <h4 className="text-sm sm:text-base font-bold text-[#111827] truncate">

                {expense.title}

              </h4>


              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles.badge}`}>

                {expense.category}

              </span>

            </div>


            <div className="flex items-center gap-3 text-xs text-[#6B7280]">

              <span className="flex items-center gap-1">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />

                </svg>

                {expense.date}

              </span>


              <span className="hidden sm:inline-block truncate max-w-xs">

                • {expense.description}

              </span>

            </div>

          </div>

        </div>


        {/* Right Side */}

        <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#111827]/5">

          <div className="text-left sm:text-right">

            <span className="text-base sm:text-lg font-bold font-mono text-[#111827] tracking-tight">

              ${expense.amount.toFixed(2)}

            </span>

          </div>


          <div className="flex items-center gap-1.5">

            {/* Edit */}

            <button

              onClick={handleEditClick}

              title="Edit Expense"

              className="p-2 rounded-xl bg-[#FFF5E6] hover:bg-[#FAD4C0] text-[#111827] border border-[#111827]/10 transition-colors cursor-pointer"
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />

              </svg>

            </button>


            {/* Delete */}

            <button

              onClick={handleDeleteClick}

              title="Delete Expense"

              className="p-2 rounded-xl bg-[#FFF5E6] hover:bg-[#DC2626]/15 hover:text-[#DC2626] text-[#111827] border border-[#111827]/10 transition-colors cursor-pointer"
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />

              </svg>

            </button>

          </div>

        </div>

      </div>

    </div>

  );
};

export default RecordCard;