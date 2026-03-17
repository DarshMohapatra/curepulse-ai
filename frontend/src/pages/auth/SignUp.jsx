function SignUp(){
    return(
        <div className="min-h-screen bg-gray-50 flex items-center justify-center"style={{background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)'}}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full">
                {/*Header*/}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-blue-600">CurePulse AI</h1>
                    <p className="text-gray-500 text-sm mt-1">Create your account</p>
                </div>
                {/*Form*/}
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <input
                         type="text"
                         placeholder="Your Name" 
                         className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                         />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                         <input
                         type="email"
                         placeholder="you@gmail.com" 
                         className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                         />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Role</label>
                        <select className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Your Option</option>
                            <option value="patient">Patient</option>
                            <option value="mitra">Swasthya Mitra</option>
                            <option value="doctor">Doctor</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                         <input
                         type="password"
                         placeholder="••••••••" 
                         className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                         />
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors">
                        Create Account
                    </button>
            
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{' '}
                        <a href="/login" className="text-blue-600 font-medium hover:underline">
                        Sign In 
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp