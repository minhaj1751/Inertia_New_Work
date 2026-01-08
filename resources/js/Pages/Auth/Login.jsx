import { useEffect, useState } from "react";
import {
    FaEye,
    FaEyeSlash,
    FaFacebook,
    FaGithub,
    FaGoogle,
    FaTwitter,
} from "react-icons/fa";
import { Head, Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import GuestLayout from "@/Layouts/GuestLayout";

/* Animations */
const pageFade = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5 } },
};

const leftImage = {
    hidden: { opacity: 0, x: -40, scale: 0.98 },
    show: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: { duration: 0.7, ease: "easeOut" },
    },
};

const cardPop = {
    hidden: { opacity: 0, y: 28, scale: 0.98 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const formSwap = {
    initial: { opacity: 0, y: 10, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.28 } },
    exit: { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.18 } },
};

const tabIndicator = {
    phone: { x: "0%" },
    mail: { x: "100%" },
};

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [loginMobile, setLoginMobile] = useState(true);

    useEffect(() => {
        setShowPassword(false);
    }, [loginMobile]);

    return (
        <>
            <Head title="Login" />

            <motion.div
                variants={pageFade}
                initial="hidden"
                animate="show"
                className="flex items-center bg-base-100"
            >
                {/* Left Image */}
                <motion.div
                    variants={leftImage}
                    initial="hidden"
                    animate="show"
                    className="hidden lg:flex items-center justify-center lg:w-8/12"
                >
                    <img
                        src={login}
                        alt="Login"
                        className="max-w-lg 2xl:max-w-xl"
                    />
                </motion.div>

                {/* Right Card */}
                <div className="h-screen bg-base-200 flex items-center justify-center p-10 w-full lg:w-4/12">
                    <motion.div
                        variants={cardPop}
                        initial="hidden"
                        animate="show"
                        className="w-full max-w-md space-y-6"
                    >
                        {/* Logo */}
                        <Link to="/">
                            <img src={Logo} className="h-10 mx-auto mb-10" />
                        </Link>

                        {/* Title */}
                        <div>
                            <h2 className="auth_headertext">
                                Welcome to <span className="capitalize">MAGIC RESULT</span> 👋
                            </h2>
                            <p className="text-primary-content">
                                Please sign in to your account
                            </p>
                        </div>

                        {/* Tabs */}
                        <div className="relative flex border border-accent rounded-md overflow-hidden">
                            <motion.div
                                className="absolute inset-y-0 w-1/2 bg-primary-light"
                                variants={tabIndicator}
                                animate={loginMobile ? "phone" : "mail"}
                            />
                            <button
                                onClick={() => setLoginMobile(true)}
                                className={`relative z-10 w-full p-2 font-bold ${loginMobile ? "text-primary" : "text-primary-content"
                                    }`}
                            >
                                Phone
                            </button>
                            <button
                                onClick={() => setLoginMobile(false)}
                                className={`relative z-10 w-full p-2 font-bold ${!loginMobile ? "text-primary" : "text-primary-content"
                                    }`}
                            >
                                Email
                            </button>
                        </div>

                        {/* Forms */}
                        <AnimatePresence mode="wait">
                            {loginMobile ? (
                                <motion.form
                                    key="phone"
                                    className="space-y-5"
                                    variants={formSwap}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                >
                                    <input
                                        type="number"
                                        placeholder="01*********"
                                        className="inputClass"
                                    />

                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="********"
                                            className="inputClass"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2"
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>

                                    <button className="btn w-full">Login</button>
                                </motion.form>
                            ) : (
                                <motion.form
                                    key="email"
                                    className="space-y-5"
                                    variants={formSwap}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                >
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="inputClass"
                                    />

                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="********"
                                            className="inputClass"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2"
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>

                                    <button className="btn w-full">Login</button>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        {/* Social */}
                        <div className="flex justify-center gap-4 text-xl pt-4">
                            <FaFacebook className="text-[#4267b2]" />
                            <FaTwitter className="text-[#1da1f2]" />
                            <FaGithub className="text-gray-800" />
                            <FaGoogle className="text-[#dd4b39]" />
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
}
