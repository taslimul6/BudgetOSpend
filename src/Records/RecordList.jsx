import { useContext } from "react";
import { ExpenseContext } from "../Context";
import RecordCard from "./RecordCard";

    

   

const RecordList = () => {
    
const {expenses, setExpenses} = useContext(ExpenseContext);


    return (



        <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[#111827]">Transactions & Records</h2>
                    <span id="activeCountBadge" className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#80A1C1]/20 text-[#111827]">
                         {expenses.length} Records
                    </span>
                </div>
                <div className="text-xs text-[#6B7280]">
                    Click pencil to edit, trash to delete
                </div>
            </div>

            {/* <!-- Expense List Items Container --> */}

            {
                expenses.map((expense) => (
                    <RecordCard key={expense.id} expense={expense} />
                ))
            }
            

            {/* <!-- State 1: "List is empty!" State (Shown when array is empty) --> */}
            <div id="emptyListState" className="hidden bg-white rounded-3xl p-12 text-center border border-dashed border-[#111827]/20">
                <img src="assets/empty-state.svg" alt="Empty state" className="w-32 h-32 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#111827]">List is empty!</h3>
                <p className="text-sm text-[#6B7280] max-w-sm mx-auto mt-1 mb-6">
                    You haven't added any expense entries yet. Start tracking your budget by recording your first expense.
                </p>
                <a
                    href="modal.html"
                    className="inline-flex items-center gap-2 bg-[#FAD4C0] hover:bg-[#f5c0a7] text-[#111827] px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add First Expense</span>
                </a>
            </div>

            {/* <!-- State 2: "Not Found" State (Shown when search/filter yields 0 results) --> */}
            <div id="notFoundState" className="hidden bg-white rounded-3xl p-12 text-center border border-[#111827]/10">
                <img src="assets/not-found.svg" alt="Not found" className="w-32 h-32 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#111827]">Not Found</h3>
                <p className="text-sm text-[#6B7280] max-w-sm mx-auto mt-1 mb-6" id="notFoundReason">
                    No expense transactions matched your search query or filter criteria.
                </p>
                <button
                    id="clearSearchFilterBtn"
                    className="inline-flex items-center gap-2 bg-[#FFF5E6] hover:bg-[#FAD4C0] text-[#111827] border border-[#111827]/15 px-4 py-2 rounded-xl font-semibold text-xs transition-all cursor-pointer"
                >
                    <span>Clear Search & Filters</span>
                </button>
            </div>

        </section>


    );
};

export default RecordList;