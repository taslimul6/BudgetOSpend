import { AnimatePresence, LazyMotion, MotionConfig } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import CatStats from "./CatStats";
import Filter from "./Filter";
import Footer from "./Footer";
import MainStats from "./MainStats";
import Navbar from "./Navbar";
import RecordList from "./Records/RecordList";
import ExpenseModal from "./Components/ExpenseModal";
import SettingsModal from "./Components/SettingsModal";
import { useExpenses } from "./Context";

const loadMotionFeatures = () => import("./motionFeatures.js").then((mod) => mod.default);

function App() {
  const { isExpenseModalOpen, editExpense, isSettingsOpen, settings } = useExpenses();

  return (
    <LazyMotion features={loadMotionFeatures}>
    <MotionConfig reducedMotion="user">
      <Navbar />

      <AnimatePresence>
        {isExpenseModalOpen && <ExpenseModal key={editExpense?.id ?? "new"} />}
        {isSettingsOpen && <SettingsModal key="settings" />}
      </AnimatePresence>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <MainStats />
        <CatStats />
        <Filter />
        <RecordList />
      </main>

      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={settings.theme}
      />
    </MotionConfig>
    </LazyMotion>
  );
}

export default App;
