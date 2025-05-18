import { BiUser, BiLockAlt } from "react-icons/bi";
import { BsFacebook, BsGoogle } from "react-icons/bs";

export default function LoginForm() {
  return (
    <form className="w-full text-center text-gray-800">
      <h1 className="text-3xl mb-5">Login</h1>
      <div className="relative my-4">
        <input
          type="text"
          placeholder="Username"
          required
          className="w-full py-3 pr-12 pl-5 bg-gray-200 rounded-md outline-none font-medium"
        />
        <BiUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-500" />
      </div>
      <div className="relative my-4">
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full py-3 pr-12 pl-5 bg-gray-200 rounded-md outline-none font-medium"
        />
        <BiLockAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-500" />
      </div>
      <div className="text-sm mb-4 text-left">
        <a href="#" className="text-gray-700">
          Forgot password?
        </a>
      </div>
      <button className="w-full h-12 bg-[#84fccc] text-white font-semibold rounded-md">
        Login
      </button>
      <p className="text-sm my-4">or login with social platform</p>
      <div className="flex justify-center space-x-4 text-2xl">
        <a
          href="#"
          className="border-2 border-gray-300 p-2 rounded-md text-gray-700"
        >
          <BsGoogle />
        </a>
        <a
          href="#"
          className="border-2 border-gray-300 p-2 rounded-md text-gray-700"
        >
          <BsFacebook />
        </a>
      </div>
    </form>
  );
}
