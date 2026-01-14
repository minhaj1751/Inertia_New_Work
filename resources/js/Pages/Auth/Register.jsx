import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import register from "../../images/logo/register.png";
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

import { useState } from 'react';
import { FaEye, FaEyeSlash, FaFacebook, FaGithub, FaGoogle, FaTwitter } from 'react-icons/fa';



export default function Register() {

    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmationPassword, setShowConfirmationPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = e.target;
        const info = {
            name: form.name.value,
            institute_name_english: form.institute_name_english.value,
            email: form.email.value,
            unique_mobile: form.mobile.value,
            password: form.password.value,
            password_confirmation: form.password_confirmation.value,
        };

        if (!/^\d{11}$/.test(info.unique_mobile)) {
            toast.error("Mobile number must be exactly 11 digits.");
            setLoading(false);
            return;
        }

    };

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />
            <div className="flex items-center bg-base-100">
                {/* Left Illustration */}
                <div className="hidden lg:flex lg:flex-col items-center justify-center relative lg:w-8/12">
                    <img
                        src={"light" === "light" ? register : register}
                        alt="Register"
                        className="max-w-lg 2xl:max-w-xl h-auto object-cover"
                    />
                </div>

                {/* Right Card */}
                <div className="h-screen overflow-y-auto flex justify-center bg-base-200 p-10 w-full lg:w-4/12">
                    <div className="w-full space-y-6">
                        <Link to="/">
                            {/* <img className="w-fit h-10 mx-auto mb-4" src={Logo} alt="Logo" /> */}
                        </Link>

                        <div>
                            <h2 className="auth_headertext">Adventure starts here 🚀</h2>
                            <p className="text-primary-content">
                                Make your result management easy and fun!
                            </p>
                        </div>

                        {/* Step Indicator */}
                        <div className="relative flex items-center justify-between mb-6">
                            {/* Progress Line */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-accent/40 -translate-y-1/2 rounded">
                                <div
                                    className="h-1 bg-primary rounded transition-all duration-500"
                                    style={{ width: `${(step - 1) * 50}%` }}
                                />
                            </div>

                            {/* Step 1 */}
                            {/* <div className="relative z-10 flex flex-col items-center gap-1">
                                <div
                                    className={`w-9 h-9 flex items-center justify-center rounded-full font-bold transition-all
                ${step >= 1
                                            ? "bg-primary text-primary-content shadow-lg scale-105"
                                            : "bg-accent text-primary-content"
                                        }`}
                                >
                                    1
                                </div>
                                <span className={`text-xs ${step >= 1 ? "text-primary font-semibold" : "text-primary-content"}`}>
                                    Account
                                </span>
                            </div> */}

                            {/* Step 2 */}
                            {/* <div className="relative z-10 flex flex-col items-center gap-1">
                                <div
                                    className={`w-9 h-9 flex items-center justify-center rounded-full font-bold transition-all
                ${step >= 2
                                            ? "bg-primary text-primary-content shadow-lg scale-105"
                                            : "bg-accent text-primary-content"
                                        }`}
                                >
                                    2
                                </div>
                                <span className={`text-xs ${step >= 2 ? "text-primary font-semibold" : "text-primary-content"}`}>
                                    Security
                                </span>
                            </div> */}

                            {/* Step 3 */}
                            {/* <div className="relative z-10 flex flex-col items-center gap-1">
                                <div
                                    className={`w-9 h-9 flex items-center justify-center rounded-full font-bold transition-all
                ${step >= 3
                                            ? "bg-primary text-primary-content shadow-lg scale-105"
                                            : "bg-accent text-primary-content"
                                        }`}
                                >
                                    3
                                </div>
                                <span className={`text-xs ${step >= 3 ? "text-primary font-semibold" : "text-primary-content"}`}>
                                    Finish
                                </span>
                            </div> */}
                        </div>


                        <form onSubmit={submit} className="space-y-5">
                            {/* ================= STEP 1 ================= */}
                            {step === 1 && (
                                <>
                                    <div>
                                        <InputLabel htmlFor="name" value="Name" />
                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            className="inputClass"
                                            autoComplete="name"
                                            isFocused={true}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="email" value="Email" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="inputClass"
                                            autoComplete="username"
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="password" value="Password" />
                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="inputClass"
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.password} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="password_confirmation"
                                            value="Confirm Password"
                                        />
                                        <TextInput
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            className="inputClass"
                                            autoComplete="new-password"
                                            onChange={(e) =>
                                                setData('password_confirmation', e.target.value)
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.password_confirmation}
                                            className="mt-2"
                                        />
                                    </div>

                                   <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-primary py-2 text-white font-bold w-full text-center hover:info"
                                    >
                                        Register
                                    </button>
                                </>
                            )}


                        </form>

                        <p className="text-center text-sm">
                            Already have an account?{" "}
                            <Link to="../login" className="linkClass">
                                Login
                            </Link>
                        </p>

                        <div className="flex items-center">
                            <hr className="grow border-accent" />
                            <span className="mx-4 text-primary">or</span>
                            <hr className="grow border-accent" />
                        </div>

                        <div className="flex justify-center gap-4 pb-10 text-xl">
                            <FaFacebook />
                            <FaTwitter />
                            <FaGithub />
                            <FaGoogle />
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
}
