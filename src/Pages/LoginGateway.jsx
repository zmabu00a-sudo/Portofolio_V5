import React, { useState } from 'react';
import { supabase } from '../supabase'; // Đảm bảo đường dẫn đúng tới file supabase.js của bạn
import { useNavigate } from 'react-router-dom';

const LoginGateway = ({ onFinish }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Đăng ký tài khoản mới
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;

        // Sau khi đăng ký, lưu thông tin vào bảng profiles với role mặc định là 'user'
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ id: data.user.id, username: username, role: 'user' }]);
          if (profileError) throw profileError;
          alert('Đăng ký thành công! Hãy kiểm tra email để xác nhận (nếu có).');
        }
      } else {
        // Đăng nhập
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }
      onFinish(); // Chuyển vào trang chính sau khi thành công
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 text-white font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-purple-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {isSignUp ? 'Tạo tài khoản mới' : 'Chào mừng trở lại'}
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            {isSignUp 
              ? 'Tham gia mạng lưới sửa chữa thiết bị thông minh' 
              : 'Đăng nhập để quản lý yêu cầu bảo trì của bạn'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 ml-1">Tên hiển thị</label>
              <input 
                type="text" required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={username} onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 ml-1">Email</label>
            <input 
              type="email" required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 ml-1">Mật khẩu</label>
            <input 
              type="password" required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-400 text-sm py-2 text-center">{error}</p>}

          <button 
            type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-900/20 transform active:scale-95 transition-all mt-4"
          >
            {loading ? 'Đang xử lý...' : (isSignUp ? 'Đăng ký ngay' : 'Đăng nhập')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-2 text-blue-400 hover:underline font-medium"
          >
            {isSignUp ? 'Đăng nhập' : 'Đăng ký ngay'}
          </button>
        </div>

        {/* Nút Bỏ qua */}
        <button 
          onClick={onFinish}
          className="mt-8 w-full text-slate-500 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold border-t border-slate-800 pt-6"
        >
          Tiếp tục với tư cách khách (Bỏ qua)
        </button>
      </div>
    </div>
  );
};

export default LoginGateway;