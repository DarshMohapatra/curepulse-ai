function Login(){
    return(
        <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)'}}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">

                {/*Header*/}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-blue-600">CurePulse AI</h1>
                    <p className="text-gray-500 text-sm mt-1">HealthCare Intelligence Platform</p>
                </div>

                {/*Form*/}
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input 
                        type="email" 
                        placeholder="you@gmail.com"
                        className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
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
                        Sign in
                    </button>
                </div>
                {/*Footer*/}
                <p className="text-center text-sm text-gray-500 mt-6">
                   Don't have an account?{' '}
                   <a href="/signup" className="text-blue-600 font-medium hover:underline">
                     SignUp
                   </a>
                </p>
            </div>
        </div>
    )
}

export default Login