import { useEffect, useState } from "react";
import login from "../../images/logo/login.png";
import wblogo from "../../images/logo/wbsoft.png";
import { FaEye, FaEyeSlash, FaFacebook, FaGithub, FaGoogle, FaTwitter, } from "react-icons/fa";
import { Head, Link, useForm } from "@inertiajs/react";
import Checkbox from "@/Components/Checkbox";

import { motion, AnimatePresence } from "framer-motion";

import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";

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
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };
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
                <div className="bg-base-200 flex items-center justify-center p-10 w-full lg:w-4/12">
                    <motion.div
                        variants={cardPop}
                        initial="hidden"
                        animate="show"
                        className="w-full max-w-md space-y-6"
                    >
                        {/* Logo */}
                        <Link href="/">
                            <img
                                src={wblogo}
                                className="h-10 mx-auto mb-10"
                                alt="Logo"
                            />
                        </Link>

                        {/* Title */}
                        <div>
                            <h2 className="text-2xl text-center">
                                Welcome to <span className="font-bold">MAGIC RESULT</span> 👋
                            </h2>
                            <p className="primary text-center">
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
                                type="button"
                                onClick={() => setLoginMobile(true)}
                                className={`relative z-10 w-full p-2 font-bold ${loginMobile ? "text-primary" : "text-primary-content"
                                    }`}
                            >
                                Phone
                            </button>
                            <button
                                type="button"
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

                                    <button className="bg-primary py-2 text-white font-bold w-full">Login</button>
                                </motion.form>
                            ) : (
                                <motion.form key="email"
                                    onSubmit={submit}
                                    className="space-y-5"
                                    variants={formSwap}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit">

                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="inputClass"
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />

                                    <InputError message={errors.email} className="mt-2" />

                                    <div className="relative">
                                        <InputLabel htmlFor="password" value="Password" />

                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="inputClass"
                                            autoComplete="current-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                        />

                                        <InputError message={errors.password} className="mt-2" />
                                        <div className="mt-4 block">
                                            <label className="flex items-center">
                                                <Checkbox
                                                    name="remember"
                                                    checked={data.remember}
                                                    onChange={(e) =>
                                                        setData('remember', e.target.checked)
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    Remember me
                                                </span>
                                            </label>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2"
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>

                                    <button
                                        type="submit"
                                        className="bg-primary py-2 text-white font-bold w-full text-center hover:info"
                                        disabled={processing}
                                    >
                                        Login
                                    </button>

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
                </div >
            </motion.div >
        </>
    );
}
