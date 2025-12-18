import Link from 'next/link'
import { 
  Leaf, Users, Shield, ArrowRight, Star, Trophy, Gift, Recycle, 
  TreePine, Droplets, Zap, Target, Globe, Heart, Award, CheckCircle,
  TrendingUp, BarChart3, Camera, MapPin, Sparkles, Crown
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-primary-50">
      {/* Modern Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-green-400 rounded-full blur opacity-75 animate-pulse"></div>
                <Leaf className="relative h-10 w-10 text-primary-600" />
              </div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">
                  Greenify
                </span>
                <div className="text-xs text-gray-500 font-medium">Eco Platform</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="group relative px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium">
                <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative">Login</span>
              </Link>
              <Link href="/register" className="group relative px-6 py-3 bg-gradient-to-r from-primary-500 to-green-500 hover:from-primary-600 hover:to-green-600 text-white rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium">
                <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Modern Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-green-500/10 to-emerald-600/10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-primary-400/20 to-green-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-lg px-6 py-3 rounded-full mb-8 shadow-lg border border-white/20">
              <Sparkles className="h-5 w-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Join 50,000+ Eco Warriors</span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                Make Earth
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary-600 via-green-500 to-emerald-600 bg-clip-text text-transparent">
                Greener Together
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your daily habits into powerful environmental impact. Track activities, earn rewards, 
              and join a global community committed to sustainability. Every action counts! 🌱
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <Link href="/register" className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-green-500 hover:from-primary-600 hover:to-green-600 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl font-semibold text-lg">
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center">
                  Start Your Eco Journey <ArrowRight className="ml-3 h-5 w-5" />
                </span>
              </Link>
              
              <Link href="/login" className="group relative px-8 py-4 bg-white/70 hover:bg-white/90 backdrop-blur-lg text-gray-700 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl font-semibold text-lg border border-white/20">
                <span className="relative">Sign In</span>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="text-3xl font-bold text-primary-600 mb-2">2.5M+</div>
                <div className="text-gray-600 font-medium">CO₂ Tons Saved</div>
              </div>
              <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
                <div className="text-gray-600 font-medium">Active Users</div>
              </div>
              <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="text-3xl font-bold text-emerald-600 mb-2">1M+</div>
                <div className="text-gray-600 font-medium">Activities Logged</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Features Section */}
      <section className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-primary-100 px-4 py-2 rounded-full mb-6">
              <Star className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">Platform Features</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Everything You Need for
              <span className="bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent"> Sustainable Living</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover powerful tools and features designed to make your eco-friendly journey engaging, rewarding, and impactful
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Activity Tracking */}
            <div className="group relative bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Activity Tracking</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Log eco-friendly activities with photo verification and GPS location tracking. Monitor your carbon footprint reduction in real-time.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Camera className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Photo & Video Verification</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">GPS Location Tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Impact Analytics</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rewards System */}
            <div className="group relative bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Rewards & Incentives</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Earn eco-points for every sustainable action. Redeem rewards, unlock badges, and compete on global leaderboards.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Eco-Points System</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Achievement Badges</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Global Leaderboards</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Community */}
            <div className="group relative bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Global Community</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Connect with 50,000+ eco-warriors worldwide. Share experiences, get tips, and inspire others on their sustainability journey.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-gray-600">Global Network</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-gray-600">Peer Support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-gray-600">Shared Goals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Types */}
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Track Every Eco-Friendly Action</h3>
            <p className="text-lg text-gray-600 mb-12">From recycling to renewable energy, log all your sustainable activities</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div className="text-center p-6 bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Recycle className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="text-sm font-medium text-gray-700">Recycling</div>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <TreePine className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="text-sm font-medium text-gray-700">Tree Planting</div>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Droplets className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-sm font-medium text-gray-700">Water Saving</div>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
              <div className="text-sm font-medium text-gray-700">Energy Saving</div>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Leaf className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="text-sm font-medium text-gray-700">Green Transport</div>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Shield className="h-8 w-8 text-gray-600 mx-auto mb-3" />
              <div className="text-sm font-medium text-gray-700">Eco Products</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 via-green-500 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 mb-12 leading-relaxed">
            Join thousands of eco-warriors already making an impact. Start your sustainable journey today and help create a greener tomorrow.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/register" className="group relative px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl font-semibold text-lg">
              <span className="relative flex items-center">
                Start Your Journey <ArrowRight className="ml-3 h-5 w-5" />
              </span>
            </Link>
            
            <Link href="/login" className="group relative px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-lg text-white rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl font-semibold text-lg border border-white/20">
              <span className="relative">Sign In</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Admin Access */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Administrator Access</h3>
            <p className="text-gray-600 mb-8">
              Platform administrators can access the comprehensive management dashboard to oversee user activities, verify submissions, and manage the platform.
            </p>
            <Link href="/admin" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium">
              Admin Login <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-green-400 rounded-full blur opacity-75"></div>
                  <Leaf className="relative h-8 w-8 text-primary-400" />
                </div>
                <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-primary-400 to-green-400 bg-clip-text text-transparent">
                  Greenify
                </span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
                Empowering individuals to make a positive environmental impact through sustainable actions, community engagement, and meaningful rewards.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                  <Users className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                  <Heart className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Platform</h4>
              <ul className="space-y-3">
                <li><Link href="/login" className="text-gray-300 hover:text-primary-400 transition-colors">Login</Link></li>
                <li><Link href="/register" className="text-gray-300 hover:text-primary-400 transition-colors">Sign Up</Link></li>
                <li><Link href="/dashboard" className="text-gray-300 hover:text-primary-400 transition-colors">Dashboard</Link></li>
                <li><Link href="/rewards" className="text-gray-300 hover:text-primary-400 transition-colors">Rewards</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Greenify. Making the world greener, one step at a time. 🌱
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
