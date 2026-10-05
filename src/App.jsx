import { useContext, useState } from 'react'
import './App.css'
import CatStats from './CatStats'
import Filter from './Filter'
import Footer from './Footer'
import MainStats from './MainStats'
import Navbar from './Navbar'
import RecordList from './Records/RecordList'
import ExpenseModal from './Components/ExpenseModal'
import { ExpenseContext } from './Context'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {

const {isExpenseModalOpen, setIsExpenseModalOpen}= useContext(ExpenseContext);


  return (
    <>
      <Navbar setIsExpenseModalOpen= {setIsExpenseModalOpen} />
       
       {isExpenseModalOpen && <ExpenseModal />}

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
         hideProgressBar={false}
         newestOnTop
         closeOnClick
         rtl={false}
         pauseOnFocusLoss
         draggable
         pauseOnHover
         theme="light"
       />
     </>
  )
}

export default App